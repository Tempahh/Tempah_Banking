import AuthForm from '@/components/ui/AuthForm'
import React from 'react'

const signin = () => {
  return (
    <section className='flex-center size-full max-sm:px-6'>
      <AuthForm type='signin'/>
    </section>
  )
}

export default signin
