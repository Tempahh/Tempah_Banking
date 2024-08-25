'use client'

import Link from 'next/link'
import Image from 'next/image'
import React, { useState } from 'react'
import {useForm} from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import {z} from 'zod'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import {Form,
    FormControl,
    FormDescription,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from '@/components/ui/form'
import CustomInput from './CustomInput'
import { authformSchema } from '@/lib/utils'
import { Loader2 } from 'lucide-react'
import { useRouter } from 'next/navigation'
import {signUp, signIn} from '@/lib/ServerActions/user.action'
import PlaidLink from './PlaidLink'



const AuthForm = ({type}: {type: string}) => {

    const router = useRouter();

    const [user, setUser] = useState(null)
    const [isLoading, setIsLoading] = useState(false)

    const formschema = authformSchema(type)

    const form = useForm<z.infer<typeof formschema>>({
        resolver: zodResolver(formschema),
        defaultValues: {
            email: '',
            password: ''
        },
    })

    const onSubmit = async (data: z.infer<typeof formschema>) => {
        setIsLoading(true)

        
        try {
            
            //sign up with appwrite
            if (type === 'signup') {
                //reassign request values for constant typescript variable prescence
                const userData = {
                    firstName: data.firstName!,
                    lastName: data.lastName!,
                    address1: data.address1!,
                    city: data.city!,
                    state: data.state!,
                    postalCode: data.postalcode!,
                    dateOfBirth: data.dateOfBirth!,
                    ssn: data.ssn!,
                    email: data.email,
                    password: data.password
                }

                const newuser = await signUp(userData)

                setUser(newuser)
            }

            //sign in with appwrite
            if (type === 'signin') {
                const response = await signIn({
                    email: data.email,
                    password: data.password
                })

                if(response) router.push('/')
                // const result = await appwrite.account.createSession(data.email, data.password)
                // console.log(result)
            }

        } catch (error) {
            console.log(error)
        }
        finally {
            setIsLoading(false)
        }
    }

  return (
    <section className='auth-form'>
        <header className='flex flex-col gap-5 md:gap-8'>
        <Link href="/" className='
            cursor-pointer
            flex
            items-center
            gap-1'>
                <Image 
                      src="/icons/logo.svg"
                      width={34}
                      height={34} alt='Pressmoney Logo'
                      className='size-[24px]
                      max-xl:size-14'/>
                      <h1 className='text-26 font-ibm-plex-serif font-bold text-black-2'>
                        PressMoney
                      </h1>
            </Link>
            <div className='flex flex-col gap-1 md:gap-3'>
                <h1 className='text-24 lg:text-36 font-semibold text-gray-900'>
                    {
                        user ? 'link account' :
                        type === 'signin' ?
                        'Sign In' : 'Sign Up'
                    }
                    <p className='text-16 font-normal text-gray-600'>
                        {user ? 'Link your account to get started'
                        : 'Please enter your details'}
                    </p>
                </h1>
            </div>
        </header>
        {user ? ( 
            <div className='flex flex-col gap-4'>
                <PlaidLink user={user} situation_variant='primary'/>
            </div>
         ): ( 
    <>
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
        {type === 'signup' && (
            <>
            <div className='flex gap-4'>
            <CustomInput
                naMe='firstName' control={form.control}
                label='First Name' placeholder='Enter your first name'
            />
            <CustomInput
                naMe='lastName' control={form.control}
                label='Last Name' placeholder='Enter your last name'
            />
            </div>
            <CustomInput
                naMe='address1' control={form.control}
                label='Address' placeholder='Enter your address'
            />
            <CustomInput 
                naMe='city' control={form.control}
                label='City' placeholder='Ex: Lagos'
            />
            <div className='flex gap-4'>
            <CustomInput
                naMe='state' control={form.control}
                label='State' placeholder='Ex: Lagos'
            />
            <CustomInput
                naMe='postalcode' control={form.control}
                label='Postal Code' placeholder='Ex: 100001'
            />
            </div>
            <div className='flex gap-4'>
            <CustomInput
                naMe='dateOfBirth' control={form.control}
                label='Date of Birth' placeholder='yyyy-mm-dd'
            />
            <CustomInput
                naMe='ssn' control={form.control}
                label='ssn' placeholder='Ex: 12345678901'
            />
            </div>
            </>
        )}
        <CustomInput
            naMe='email' control={form.control}
            label='Email' placeholder='Enter your email'
            />
        <CustomInput
            naMe='password' control={form.control}
            label='Password' placeholder='Enter your password'
            />
                <div className='flx flex-col gap-4'>
                    <Button type="submit"
                    disabled={isLoading}
                    className='form-btn'>{
                        isLoading ? (
                            <>
                                <Loader2 size={20}
                                    className='animate-spin'/> &nbsp;Loading...
                            </>
                        ): type === 'signin' ? 'Sign-In' : 'Sign-Up'
                    }</Button>
                </div>
        </form>
    </Form>
    
    <footer className='flex justify-center gap-1'>
        <p className='font-normal text-14 text-gray-600'>
            {type === 'signin' ? 'New to PressMoney?' : 'Already have an account?'}
        </p>
        <Link href={type === 'signin' ? '/signup' : '/signin'}>
            {type === 'signin' ? 'Sign up' : 'Sign In'}
        </Link>
    </footer>
            </>
         )}
    </section>
  )
}


export default AuthForm
