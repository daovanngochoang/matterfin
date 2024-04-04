"use client"

import {Button} from '@/components/ui/button';
import React, {useState} from 'react';


import {zodResolver} from "@hookform/resolvers/zod"
import {useForm} from "react-hook-form"
import {z} from "zod"

import {Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage,} from "@/components/ui/form"
import {Badge} from "@/components/ui/badge";
import {Textarea} from "@/components/ui/textarea";
import {PaymentMethod} from "@/lib/model/paymentMethod";
import {toast} from "@/components/ui/use-toast";

const FormSchema = z.object({
    information: z.string().min(2, {
        message: "Username must be at least 2 characters.",
    })
})

type ActivateMethod = (method: PaymentMethod) => void

type EditMethod = (method: PaymentMethod) => void

export type PaymentMethodCardProps = {
    method: PaymentMethod
    disabled: boolean
    description?: string
    placeholder?: string
    activate: ActivateMethod
    edit: EditMethod
}
export default function PaymentMethodCard(
    {
        method,
        disabled,
        description,
        placeholder,
        activate,
        edit,
    }: PaymentMethodCardProps) {

    const form = useForm<z.infer<typeof FormSchema>>({
        resolver: zodResolver(FormSchema),
        defaultValues: {
            information: method.information
        },
    })

    function onSubmit(data: z.infer<typeof FormSchema>) {
        toast({
            title: "You submitted the following values:",
            description: (
                <pre className="mt-2 w-[340px] rounded-md bg-slate-950 p-4">
          <code className="text-white">{JSON.stringify(data, null, 2)}</code>
        </pre>
            ),
        })
    }


    const statusStyle = {
        active: "bg-green-200 text-green-500 hover:bg-secondary",
        inActive: "bg-red-200 text-red-500 hover:bg-secondary"
    }

    return (
        <>
            <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="w-full space-y-6">
                    <FormField
                        control={form.control}
                        name="information"
                        render={({field}) => (
                            <FormItem>
                                <FormLabel className="flex justify-between items-center ">
                                    <div>{method.method_name}</div>
                                    <Badge className={method.is_active ? statusStyle.active : statusStyle.inActive}
                                           variant="outline"
                                    >
                                        {method.is_active ? "Active": "Inactive"}
                                    </Badge>
                                </FormLabel>
                                <FormControl>
                                    <Textarea
                                        disabled
                                        className="min-h-[200px]"
                                        placeholder={placeholder == undefined ? "Enter payment method information here" : placeholder} {...field} />
                                </FormControl>
                                <FormDescription>
                                    {description}
                                </FormDescription>
                                <FormMessage/>
                            </FormItem>
                        )}
                    />

                    {
                        // if not disable => allow change
                        !disabled ?
                            <Button type="submit">Save Changes</Button>
                            : <></>
                    }
                </form>
            </Form>

            <div className="flex gap-2">
                <Button
                    onClick={() => edit(method)}
                    className="bg-secondary text-primary hover:text-secondary"
                >
                    Edit
                </Button>

                {/*<Button  type="submit">Edit</Button>*/}
                <Button onClick={() => activate(method)}
                        className={method.is_active ? statusStyle.inActive : statusStyle.active}>
                    {method.is_active? "Disable": "Activate"}
                </Button>
            </div>
        </>
    )
}




