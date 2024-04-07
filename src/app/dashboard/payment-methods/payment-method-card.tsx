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

export type PaymentMethodCardProps = {
  method: PaymentMethod
  description?: string
  placeholder?: string
}
export default function PaymentMethodCard(
  {
    method,
    description,
    placeholder,
  }: PaymentMethodCardProps) {


  const [editing, setEditing] = useState<boolean>()
  const [openConfirmAlert, setOpenConfirmAlert] = useState(false)
  const { toast } = useToast()
  const [isPending, setIsPending] = useState(false)

  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      information: method.information ?? ""
    },
  })

  async function onSubmit(formData: z.infer<typeof FormSchema>) {

    try {
      setIsPending(true)
      let methodData: PaymentMethod = {
        id: method.id,
        method_name: method.method_name,
        org_id: method.org_id,
        is_active: method.is_active,
        information: formData.information ?? "",
      }

      let { error, data } = await updatePaymentMethod(method.id!, methodData)
      setIsPending(false)
      if (error === undefined) {
        toast(
          {
            title: "Update Payment Method",
            description: "Payment method is updated successfully!"
          }
        )
      } else {
        toast(
          {
            variant: "destructive",
            title: "Update Payment Method",
            description: error
          }
        )
      }
    } catch (e) {
      toast({
        variant: "destructive",
        title: "Update Payment Method",
        description: (e as Error).message
      })
    }
    setEditing(false)
    setOpenConfirmAlert(true)
  }

  const statusStyle = {
    active: "bg-green-100 text-green-500 hover:bg-secondary",
    inActive: "bg-red-100 text-red-500 hover:bg-secondary"
  }


  function edit(method: PaymentMethod): void {
    setEditing(!editing)
  }

  async function activate(method: PaymentMethod): Promise<void> {
    try {
      method.is_active = !method.is_active
      let { error, data } = await updatePaymentMethod(method.id!, method)
      if (error === undefined) {
        toast(
          {
            title: "Payment Method",
            description: `Payment method ${method.method_name} is updated!`
          }
        )
      }
      else {
        toast(
          {
            variant: "destructive",
            title: "Payment Method",
            description: error
          }
        )
      }
    } catch (e) {

      toast(
        {
          variant: "destructive",
          title: "Payment Method",
          description: (e as Error).message
        }
      )
    }

  }

  return (
    <>
      <AlertDialog open={openConfirmAlert} onOpenChange={setOpenConfirmAlert}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Confirm Update</AlertDialogTitle>
            <AlertDialogDescription>
              Click continue to confirm your changes
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            {
              !isPending ?
                <AlertDialogAction onClick={form.handleSubmit(onSubmit)}>Continue</AlertDialogAction> :
                <Button disabled>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Please wait
                </Button>
            }
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>


      <Form {...form}>
        <form className=" w-full space-y-6">
          <FormField
            control={form.control}
            name="information"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="flex justify-between items-center ">
                  <div>{method.method_name}</div>
                  <Badge className={method.is_active ? statusStyle.active : statusStyle.inActive}
                    variant="outline"
                  >
                    {method.is_active ? "Active" : "Inactive"}
                  </Badge>
                </FormLabel>
                <FormControl>
                  <Textarea
                    readOnly={!editing}
                    className="min-h-[200px]"
                    placeholder={placeholder == undefined ? "Enter payment method information here" : placeholder} {...field} />
                </FormControl>
                <FormDescription>
                  {description}
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />


        </form>
      </Form>
      {
        // if not disable => allow change
        editing ?
          <Button onClick={() => setOpenConfirmAlert(true)}>Save Changes</Button>
          : <></>
      }
      <div className="flex gap-2">

        {
          !editing ?
            <Button
              variant={"outline"}
              onClick={() => edit(method)}
            >
              Edit
            </Button>
            : <Button
              onClick={() => setEditing(!editing)}
              className="bg-secondary text-primary hover:text-secondary"
            >
              Done
            </Button>

        }

        {/*<Button  type="submit">Edit</Button>*/}
        <Button onClick={() => activate(method)}
          className={method.is_active ? statusStyle.inActive : statusStyle.active}>
          {method.is_active ? "Disable" : "Activate"}
        </Button>
      </div>
    </>
  )
}




