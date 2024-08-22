import React from 'react'
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
import { Control, FieldPath } from 'react-hook-form'
import { authformSchema } from '@/lib/utils'
import {z} from 'zod'

const formschema = authformSchema('signup')

interface CustomInput {
    control: Control<z.infer<typeof formschema>>,
    naMe: FieldPath<z.infer<typeof formschema>>,
    label: string,
    placeholder: string
}

const CustomInput = ({ control, naMe, label, placeholder }: CustomInput) => {
  return (
    <FormField
          control={control}
          name={naMe}
          render={({ field }) => (
            <div className='form-item'>
                <FormLabel className='form-label'>
                    {label}
                </FormLabel>
                <div className='flex w-full flex-col'>
                    <FormControl>
                        <Input
                            placeholder={placeholder}
                            className='input-class'
                            type={naMe === 'password' ? 'password': 'text'}
                            {...field}
                        />
                    </FormControl>
                    <FormMessage 
                    className='form-message'/>
                </div>
        </div>
          )}
        />
  )
}

export default CustomInput
