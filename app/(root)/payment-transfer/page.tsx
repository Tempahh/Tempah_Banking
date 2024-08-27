import HeaderBox from '@/components/ui/HeaderBox'
import PaymentTransferForm from '@/components/ui/PaymentTransferForm'
import { getAccounts } from '@/lib/ServerActions/bank.actions'
import { getLoggedInUser } from '@/lib/ServerActions/user.action'
import React from 'react'

const paymentTransfer = async () => {
  const loggedIn = await getLoggedInUser()
  const accounts = await getAccounts({userId: loggedIn.$id})

  if (!accounts) {
    return null
  }

  const accountData = accounts?.data

  return (
    <section className='payment-transfer'>
      <HeaderBox
        title='Payment Transfer'
        subtext='Transfer money to your friends and family.'
      />

      <section className='size-full pt-5'>
        <PaymentTransferForm accounts={accountData}/>
      </section>
    </section>
  )
}

export default paymentTransfer
