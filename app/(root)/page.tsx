import HeaderBox from '@/components/ui/HeaderBox'
import RecentTransactions from '@/components/ui/RecentTransactions'
import Rightsidebar from '@/components/ui/RightSideBar'
import SideBar from '@/components/ui/SideBar'
import Totalbalancebox from '@/components/ui/totalbalancebox'
import { getAccount, getAccounts } from '@/lib/ServerActions/bank.actions'
import { getLoggedInUser } from '@/lib/ServerActions/user.action'
import React from 'react'

const Home = async ({searchParams: {id, page}}: SearchParamProps) => {

    const currentPage = Number(page as string) || 1
    const loggedIn = await getLoggedInUser()

    const accounts = await getAccounts({userId: loggedIn.$id})

    if (!accounts) return;

    const accountsData = accounts?.data
    

    const appwriteItemId = (id as string) || accountsData[0]?.appwriteItemId

    const account = await getAccount({appwriteItemId})
    
  
  return (
    <section className='home'>
      <div className='home-content'>
        <header className='home-header'>
            <HeaderBox 
                type='greeting'
                title='Welcome to the app'
                user = {loggedIn?.firstName || 'T'}
                subtext= 'Access your bank accounts from the palm of your hands'
            />
            <Totalbalancebox 
                accounts={accountsData}
                totalBanks={accounts?.totalBanks}
                totalCurrentBalance={accounts?.totalCurrentBalance}
            />
        </header>
        <RecentTransactions 
          accounts={accountsData}
          transactions={account?.transactions}
          appwriteItemId={appwriteItemId}
          page={currentPage}
        />
      </div>
      <Rightsidebar
        user={loggedIn}
        transactions={account?.transactions}
        banks={accountsData?.slice(0, 2)}
      />
    </section>
  )
}

export default Home
