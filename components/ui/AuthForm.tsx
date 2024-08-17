'use client'

import Link from 'next/link'
import Image from 'next/image'
import React, { useState } from 'react'
import {z} from 'zod'
import {useForm} from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/Input'
import {Form,
    FormControl,
    FormDescription,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from '@/components/ui/Form'

const formSchema = z.object({
    username: z.string().min(3).max(50,
    { message: 'Username must be between 3 and 50 characters',}),
})

const AuthForm = ({type}: {type: string}) => {

    const [user, setUser] = useState(null)

    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            username: '',
        },
    })

    function onSubmit(data: z.infer<typeof formSchema>) {
        console.log(data)
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
                {/**plaidlink */}
            </div>
        ):
        (
            <>
                <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
        <FormField
          control={form.control}
          name="email"
          render={({ field }) => (
            <div className='form-item'>
                <FormLabel className='form-label'>
                    Email
                </FormLabel>
                <div className='flex w-full flex-col'>
                    <FormControl>
                        <Input
                            placeholder='Enter your email'
                            className='input-class'
                            {...field}
                            
                        />
                    </FormControl>
                </div>
            </div>
          )}
        />
        <Button type="submit">Submit</Button>
      </form>
    </Form>
            </>
        )}
    </section>
  )
}

export default AuthForm
