import HeaderBox from '@/components/ui/HeaderBox'
import RecentTransactions from '@/components/ui/RecentTransactions'
import Totalbalancebox from '@/components/ui/totalbalancebox'
import { getLoggedInUser } from '@/lib/ServerActions/user.action'
import React from 'react'

const Home = async () => {
    const loggedIn = await getLoggedInUser()

  return (
    <section className='home'>
      <div className='home-content'>
        <header className='home-header'>
            <HeaderBox 
                type='greeting'
                title='Welcome to the app'
                user = {loggedIn?.name || 'T'}
                subtext= 'Access your bank accounts from the palm of your hands'
            />
            <Totalbalancebox 
                accounts={[]}
                totalBanks={2}
                totalCurrentBalance={10000.76}
            />
        </header>
      </div>
      <RecentTransactions 
      user={loggedIn}
      transactions={[]}
      banks={[{currentBalance: 5600.50}, {currentBalance: 4400.26}]}/>
    </section>
  )
}

export default Home
