'use server'
import { ID, Query } from 'node-appwrite'
import { createAdminClient, createSessionClient } from "../appwrite"
import { cookies } from 'next/headers';
import { encryptId, extractCustomerIdFromUrl, parseStringify } from '../utils';
import { CountryCode, ProcessorTokenCreateRequestProcessorEnum, Products, ProcessorTokenCreateRequest } from 'plaid';
import { plaidClient } from '@/lib/plaid';
import { revalidatePath } from 'next/cache';
import { addFundingSource, createDwollaCustomer } from './dwolla.actions';
import { error } from 'console';

const {
    APPWRITE_USER_COLLECTION_ID: USER_COLLECTION_ID,
    APPWRITE_DATABASE_ID: DATABASE_ID,
    APPWRITE_BANK_COLLECTION_ID: BANK_COLLECTION_ID,
} = process.env

export const signUp = async ( {password, ...userData }: SignUpParams) => {
    const{email, firstName, lastName} = userData;

    let newUserAcc;

    try {
        const { account,  database} = await createAdminClient();

        newUserAcc = await account.create(
            ID.unique(),
            email,
            password,
            `${firstName} ${lastName}`
        );

        if (!newUserAcc) throw new Error('Error creating user')

        const dwollaCustomerUrl = await createDwollaCustomer({
            ...userData,
            type: 'personal'
        })
  
        if (!dwollaCustomerUrl) throw new Error('Error creating customer url')

        //get dwolla customer id from the url request 
        const dwollaCustomerId = extractCustomerIdFromUrl(dwollaCustomerUrl)

        const newuser = await database.createDocument(
            DATABASE_ID!,
            USER_COLLECTION_ID!,
            ID.unique(),
            {
                ...userData,
                userId: newUserAcc.$id,
                dwollaCustomerId,
                dwollaCustomerUrl
            }
        )

        if (!newuser) throw new Error('Error creating user document')

        const session = await account.createEmailPasswordSession(email, password);

        cookies().set("appwrite-session", session.secret, {
            path: "/",
            httpOnly: true,
            sameSite: "strict",
            secure: true,
        });
        return parseStringify(newuser);

    } catch (error) {
        console.error('Error:', error)
    }
}

export const getUserInfo = async ({userId} : getUserInfoProps) => {
    try {
        const { database } = await createAdminClient();

        const user = await database.listDocuments(
            DATABASE_ID!,
            USER_COLLECTION_ID!,
            [Query.equal('userId', [userId])]
        );

        return parseStringify(user.documents[0])
    } catch (error) {
        console.error('Error:', error)
    }
}


export const signIn = async ({email, password} : signInProps) => {
    try {
        const { account } = await createAdminClient();

        const session = await account.createEmailPasswordSession(email, password);

        cookies().set("appwrite-session", session.secret, {
            path: "/",
            httpOnly: true,
            sameSite: "strict",
            secure: true,
        });

        const user = await getUserInfo({userId: session.userId})



        return parseStringify(user)
    } catch (error) {
        console.error('Error:', error)
    }
}

// ... your initilization functions

export async function getLoggedInUser() {
    try {

      const { account } = await createSessionClient();

      const result =  await account.get();

      const user = await getUserInfo({userId: result.$id})

      return parseStringify(user);
    } catch (error) {
      return null;
    }
  }


export const logoutAccount = async () => {
    try {
        const {account} = await createSessionClient();

        cookies().delete('appwrite-session');

        await account.deleteSession('current')

        return true
    } catch (error) {
        console.error('Error:', error)
        return null
    }
}


//function to create a link token for plaid
export const createLinkToken = async (user: User) => {
    try {
        const tokenParams = {
            user: {
                client_user_id: user.$id,
            },
            client_name:`${user.firstName} ${user.lastName}`,
            products: ['auth', 'transactions'] as Products[],
            language: 'en',
            //this part determines what contrys' banks plaid will support
            country_codes: ['US'] as CountryCode[],
        }
        
        const response = await plaidClient.linkTokenCreate(tokenParams)

        return parseStringify({linkToken: response.data.link_token})
    } catch (error) {
        console.error('Error:', error)
    }
}

//function to create a bank account document image for appwrite
export const createBankAccount = async ({      
userId,
bankId,
accountId,
accessToken,
fundingSourceUrl,
sharableId
} : createBankAccountProps) => {

    if (!userId || !bankId || !accessToken || !fundingSourceUrl || !sharableId) {
        console.error('Missing required fields')
        throw new Error('Missing required fields')
    }
    try {
        const { database } = await createAdminClient();

        const bankAccount = await database.createDocument(
            DATABASE_ID!,
            BANK_COLLECTION_ID!,
            ID.unique(),
            {
                userId,
                bankId,
                accountId,
                accessToken,
                fundingSourceUrl,
                sharableId
            })

        return parseStringify(bankAccount)
        } catch (error) {
            console.error('Error:', error)
    }
}

//function to exchange public token for access token
export const exchangePublicToken = async ({publicToken,user} : exchangePublicTokenProps) => {
    try {
        //exchange public token for access token and item id with plaid client
        const response = await plaidClient.itemPublicTokenExchange({
            public_token: publicToken
        });
//then
        //update user with access token
        const accessToken = response.data.access_token;
        const itemId = response.data.item_id;
//then
        //update user with access token
        const accountsResponse = await plaidClient.accountsGet({
            access_token: accessToken
        });
        const accountData = accountsResponse.data.accounts[0];
//then        
        //create a processor token for Dwolla using the access token and account Id
        const request: ProcessorTokenCreateRequest = {
            access_token: accessToken,
            account_id: accountData.account_id,
            processor: "dwolla" as ProcessorTokenCreateRequestProcessorEnum
        }
//then
        //create a processor token for Dwolla using the access token and account Id
        const processorTokenResponse = await plaidClient.processorTokenCreate(request);
        const processorToken = processorTokenResponse.data.processor_token;
//then
        //create a funding source for the user using the plaid processor token,
        //account data such as bank name and dwolla customer id
        const fundingSourceName = await addFundingSource({
            dwollaCustomerId: user.dwollaCustomerId,
            processorToken,
            bankName: accountData.name,
        })

        //if funding source is created successfully, create a transaction
        if(!fundingSourceName) throw new Error('Funding source not created')

        //create a bank account for the user using the user id, access token,
        //funding source name and sharaable id so the users can transfer money to each other
        await createBankAccount({
            userId: user.$id,
            bankId: itemId,
            accountId: accountData.account_id,
            accessToken,
            fundingSourceUrl: fundingSourceName,
            sharableId: encryptId(accountData.account_id)
        });

        revalidatePath('/')

        return parseStringify({
            publicTokenExchange: 'completed',
        });
    } catch (error) {
        console.error('Error:', error)
    }
}

export const getBanks = async ({userId} : getBanksProps) => {
    try {
        const { database } = await createAdminClient();

        const banks = await database.listDocuments(
            DATABASE_ID!,
            BANK_COLLECTION_ID!,
            [Query.equal('userId', [userId])]
        );

        return parseStringify(banks.documents)
    } catch (error) {
        console.error('Error:', error)
    }
}

export const getBank = async ({documentId} : getBankProps) => {
    try {
        const { database } = await createAdminClient();

        const bank = await database.listDocuments(
            DATABASE_ID!,
            BANK_COLLECTION_ID!,
            [Query.equal('$id', [documentId])]
        );

        return parseStringify(bank.documents[0])
    } catch (error) {
        console.error('Error:', error)
    }
}

export const getBankByAccountId = async ({accountId} : getBankByAccountIdProps) => {
    try {
        const { database } = await createAdminClient();

        const bank = await database.listDocuments(
            DATABASE_ID!,
            BANK_COLLECTION_ID!,
            [Query.equal('accountId', [accountId])]
        );

        if (bank.total !== 1) {
            return null;
        }
        return parseStringify(bank.documents[0])
    } catch (error) {
        console.error('Error:', error)
    }
}