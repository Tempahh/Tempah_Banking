import BankCard from '@/components/ui/BankCard'
import HeaderBox from '@/components/ui/HeaderBox'
import { getAccounts } from '@/lib/ServerActions/bank.actions'
import { getLoggedInUser } from '@/lib/ServerActions/user.action'
import React from 'react'

const myBanks = async () => {
  const loggedIn = await getLoggedInUser()
  const accounts = await getAccounts({userId: loggedIn.$id})

  return (
    <section className='flex'>
      <div className='my-banks'>
        <HeaderBox
          title='My Bank Accounts'
          subtext='Manage your bank accounts in one place.'
        />
        <div className='space-y-4'>
          <h2 className='header-2'>
            Your Cards
          </h2>
          <div className='flex flex-wrap gap-6'>
            {accounts && accounts.data.map((a: Account) => (
              <BankCard 
                key={accounts.id}
                account={a}
                userName={loggedIn?.firstName}
              />
              
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}

export default myBanks
