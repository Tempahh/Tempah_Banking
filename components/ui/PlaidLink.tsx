import React, { useCallback, useEffect, useState } from 'react'
import { Button } from './button'
import { useRouter } from 'next/navigation';
import {PlaidLinkOnSuccess, PlaidLinkOptions, usePlaidLink} from 'react-plaid-link';
import { createLinkToken, exchangePublicToken } from '@/lib/ServerActions/user.action';
import Image from 'next/image';

const PlaidLink = ({user, situation_variant}: PlaidLinkProps) => {

  const router = useRouter();

  const [token, setToken] = useState('');


  //useEffect to get link token for user on mount and update of user
  useEffect(() => {
    //create link token for user(temporary)
    const getLinkToken = async () => {
      const data = await createLinkToken(user);

      setToken(data?.linkToken);
    }

  //get link token for user
  getLinkToken();
  }, [user])
  
  //onSuccess function to handle the public token from plaid link 
  //and exchange it for an access token
  const onSuccess = useCallback<PlaidLinkOnSuccess>( async (public_token: string) => {
    await exchangePublicToken( {publicToken: public_token, user});

    router.push('/');
  }, [user])
  
  const config: PlaidLinkOptions = {
    token,
    onSuccess
  }

  //usePlaidLink hook to open plaid link with config options
  const {open, ready} = usePlaidLink(config);

  return (
    <div>
      {situation_variant === 'primary' ? (
        <Button
        onClick={() => open()}
        disabled={!ready}
        className='plaidlink-primary'>
          Connect Bank
        </Button>
        ) : situation_variant === 'ghost' ? (
          <Button onClick={() => open()} variant='ghost'
          className='plaidlink-ghost'>
            <Image 
              src='icons/connect-bank.svg'
              alt='connect Bank'
              width={24}
              height={24}
              />
              <p className='hidden text-[16px] font-semibold text-black-2 xl:block'>
                Connect Bank
              </p>
          </Button>
          ) : (
            <Button onClick={() => open()} 
            className='plaid-default'>
              <Image 
              src='icons/connect-bank.svg'
              alt='connect Bank'
              width={24}
              height={24}
              />
              <p className='text-[16px] font-semibold text-black-2'>
                Connect Bank
              </p>
              </Button>)}
    </div>
  )
}

export default PlaidLink
