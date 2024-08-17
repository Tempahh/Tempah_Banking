import AuthForm from '@/components/ui/AuthForm'
import React from 'react'

const signup = () => {
  return (
    <section className='flex-center size-full max-sm:px-6'>
      <AuthForm type='signup'/>
    </section>
  )
}

export default signup
