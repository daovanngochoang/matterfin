"use client"

import { Button } from '@/components/ui/button';
import React, { memo, useState } from 'react';


import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { z } from "zod"

import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage, } from "@/components/ui/form"
import { Badge } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/textarea";
import { PaymentMethod } from "@/lib/model/paymentMethod";
import { updatePaymentMethod } from '@/lib/actions/paymentMethodAction';
import { useToast } from '@/components/ui/use-toast';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from '@/components/ui/alert-dialog';
import { Loader2 } from 'lucide-react';

const FormSchema = z.object({
  information: z.string().min(2, {
    message: "Username must be at least 2 characters.",
  })
})

export type PaymentMethodCardReadonlyProps = {
  method: PaymentMethod
}
export default function PaymentMethodCardReadonly(
  {
    method,
  }: PaymentMethodCardReadonlyProps
) {

  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      information: method.information ?? ""
    },
  })

  return (
    <>
      <Form {...form}>
        <form className=" w-full space-y-6">
          <FormField
            control={form.control}
            name="information"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="flex justify-between items-center ">
                  <div>{method.method_name}</div>
                </FormLabel>
                <FormControl>
                  <Textarea
                    readOnly={true}
                    className="min-h-[200px]"
                    {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </form>
      </Form>
    </>
  )
}




