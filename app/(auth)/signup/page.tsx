import AuthForm from '@/components/ui/AuthForm'
import { getLoggedInUser } from '@/lib/ServerActions/user.action'
import React from 'react'

const signup = async () => {
  const loggedInUser = await getLoggedInUser();

  return (
    <section className='flex-center size-full max-sm:px-6'>
      <AuthForm type='signup'/>
    </section>
  )
}

export default signup
