"use client"

import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { z } from "zod"
import { Button } from "@/components/ui/button"
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage, } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { toast } from "@/components/ui/use-toast"
import { useState } from "react";
import { Check, Loader2, Pencil } from "lucide-react";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from "@/components/ui/alert-dialog"
import { useOrganization } from "@clerk/nextjs"
import { OrganizationMetadata } from "@/lib/model/organizationMetadata"
import { updateOrgMetadata } from "@/lib/actions/organizationAction"
import { ClerkAPIResponseError } from "@clerk/shared";


const profileFormSchema = z.object({
  legalName: z
    .string()
    .min(2, {
      message: "legal name must be at least 2 characters.",
    }).optional(),
  companyPhone: z
    .string({
      required_error: "Company phone cannot be empty",
    }),
  companyEmail: z
    .string({
      required_error: "Please select an email to display.",
    })
    .email(),
  companyAddress: z
    .string().optional(),
  name: z
    .string({
      required_error: "Please select an email to display.",
    }),
  mailingAddress: z.string().optional(),
})

type ProfileFormValues = z.infer<typeof profileFormSchema>
export function OrganizationFormProfile() {
  const [isEditing, setIsEditing] = useState(false)
  const [openConfirmAlert, setOpenConfirmAlert] = useState(false)
  const { organization } = useOrganization()
  const [isPending, setIsPending] = useState(false)

  const orgMetaData: OrganizationMetadata | undefined = organization?.publicMetadata;
  // This can come from your database or API.
  const defaultValues: Partial<ProfileFormValues> = {
    name: organization?.name,
    legalName: orgMetaData !== undefined ? (orgMetaData!.legalName ?? "") : "",
    mailingAddress: orgMetaData !== undefined ? (orgMetaData!.mailingAddress ?? "") : "",
    companyAddress: orgMetaData !== undefined ? (orgMetaData!.companyAddress ?? "") : "",
    companyEmail: orgMetaData !== undefined ? (orgMetaData!.companyEmail ?? "") : "",
    companyPhone: orgMetaData !== undefined ? (orgMetaData!.companyPhone ?? "") : "",
  }


  const form = useForm<ProfileFormValues>({
    resolver: zodResolver(profileFormSchema),
    defaultValues,
    mode: "onChange",
  })


  async function onSubmit(data: ProfileFormValues) {

    try {
      let updateData: OrganizationMetadata = {}
      let orgMetaData: OrganizationMetadata | undefined = organization!.publicMetadata;

      updateData.legalName = orgMetaData.legalName !== data.legalName ? data.legalName : undefined
      updateData.companyPhone = orgMetaData.companyPhone !== data.companyPhone ? data.companyPhone : undefined
      updateData.mailingAddress = orgMetaData.mailingAddress !== data.mailingAddress ? data.mailingAddress : undefined
      updateData.companyAddress = orgMetaData.companyAddress !== data.companyAddress ? data.companyAddress : undefined
      updateData.companyEmail = orgMetaData.companyEmail !== data.companyEmail ? data.companyEmail : undefined

      setIsPending(true)
      if (data.name != organization?.name) {
        await organization?.update({
          name: data.name,
        })
      }
      let result = await updateOrgMetadata(updateData)
      setIsPending(false)
      if (result.error === undefined) {
        toast(
          {
            title: "Update Company Profile",
            description: "Your comapny pofile is updated successfully!"
          }
        )
      } else {
        toast(
          {
            variant: "destructive",
            title: "Update Company Profile",
            description: result.error
          }
        )
      }
      setOpenConfirmAlert(false)

    } catch (e) {
      let message = "Unexpected Error"
      if (e instanceof ClerkAPIResponseError) {
        message = (e as ClerkAPIResponseError).errors[0].message
      } else {
        message = (e as Error).message
      }
      toast(
        {
          variant: "destructive",
          title: "Update Company Profile",
          description: message
        }
      )

    }

  }

  return (
    <div className="space-y-8">

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
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
          <FormField
            control={form.control}
            name="legalName"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="flex gap-1">Legal Name <p className="text-muted-foreground">(optional)</p></FormLabel>
                <FormControl>
                  <Input
                    readOnly={!isEditing}
                    placeholder="Enter company Legal Name" {...field}
                  />
                </FormControl>
                <FormDescription>
                  This is your public display name.
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="name"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Company Name *</FormLabel>
                <FormControl>
                  <Input
                    readOnly={!isEditing}
                    placeholder="Enter company name" {...field}
                  />
                </FormControl>
                <FormDescription>
                  This is the name that appears on MatterFin and in your notifications.
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="companyPhone"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Company Phone*</FormLabel>
                <FormControl>
                  <Input
                    readOnly={!isEditing}
                    placeholder="Enter your company phone" {...field}
                  />
                </FormControl>
                <FormDescription>
                  This is your company phone number
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="companyEmail"
            //
            render={({ field }) => (
              <FormItem>
                <FormLabel>Company Email *</FormLabel>
                <FormControl>
                  <Input
                    readOnly={!isEditing}
                    placeholder="Enter your company email" {...field}
                  />
                </FormControl>
                <FormDescription>

                  This is your company email
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="mailingAddress"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="flex gap-1">Mailing Address <p className="text-muted-foreground">(optional)</p></FormLabel>
                <FormControl>
                  <Textarea
                    readOnly={!isEditing}
                    placeholder="Enter your mailing address"
                    className="resize-none"
                    {...field}
                  />
                </FormControl>
                <FormDescription>
                  We’ll send physical things and surprise gifts to this address.
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="companyAddress"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="flex gap-1">Legal Address <p className="text-muted-foreground">(optional)</p></FormLabel>
                <FormControl>
                  <Textarea
                    readOnly={!isEditing}
                    placeholder="Enter your company address"
                    className="resize-none"
                    {...field}
                  />
                </FormControl>
                <FormDescription>
                  The billing address for your invoices and other required documents.
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
        </form>
      </Form>
      <div className={"flex items-center gap-5"}>
        <Button variant={"outline"} onClick={() => setIsEditing(!isEditing)} className="flex gap-2">
          {!isEditing ? <Pencil className={"w-3 h-3"} /> : <Check className={"w-3 h-3"} />}
          {!isEditing ? "Edit" : "Done"}
        </Button>
        <Button onClick={() => setOpenConfirmAlert(true)}>Update</Button>
      </div>
    </div>
  )
}
