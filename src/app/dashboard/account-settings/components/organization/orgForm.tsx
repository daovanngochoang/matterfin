"use client"

import {zodResolver} from "@hookform/resolvers/zod"
import {useForm} from "react-hook-form"
import {z} from "zod"
import {Button} from "@/components/ui/button"
import {Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage,} from "@/components/ui/form"
import {Input} from "@/components/ui/input"
import {Textarea} from "@/components/ui/textarea"
import {toast} from "@/components/ui/use-toast"
import {useState} from "react";
import {Pencil} from "lucide-react";

const profileFormSchema = z.object({
    legaName: z
        .string()
        .min(2, {
            message: "Username must be at least 2 characters.",
        })
        .max(30, {
            message: "Username must not be longer than 30 characters.",
        }),
    companyPhone: z
        .string({
            required_error: "Please select an email to display.",
        })
        .email(),
    companyEmail: z
        .string({
            required_error: "Please select an email to display.",
        })
        .email(),
    companyAddress: z
        .string({
            required_error: "Please select an email to display.",
        })
        .email(),
    name: z
        .string({
            required_error: "Please select an email to display.",
        })
        .email(),
    mailingAddress: z.string().max(160).min(4),
})

type ProfileFormValues = z.infer<typeof profileFormSchema>

// This can come from your database or API.
const defaultValues: Partial<ProfileFormValues> = {

}

export function OrganizationFormProfile() {
    const [isEditing, setIsEditing] = useState(false)
    const form = useForm<ProfileFormValues>({
        resolver: zodResolver(profileFormSchema),
        defaultValues,
        mode: "onChange",
    })


    function onSubmit(data: ProfileFormValues) {
        toast({
            title: "You submitted the following values:",
            description: (
                <pre className="mt-2 w-[340px] rounded-md bg-slate-950 p-4">
          <code className="text-white">{JSON.stringify(data, null, 2)}</code>
        </pre>
            ),
        })
    }

    return (
        <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
                <FormField
                    control={form.control}
                    name="name"
                    disabled={!isEditing}
                    render={({field}) => (
                        <FormItem>
                            <FormLabel>Company Name</FormLabel>
                            <FormControl>
                                <Input placeholder="shadcn" {...field} />
                            </FormControl>
                            <FormDescription>
                                This is your public display name.
                            </FormDescription>
                            <FormMessage/>
                        </FormItem>
                    )}
                />
                <FormField
                    control={form.control}
                    name="companyPhone"
                    disabled={!isEditing}
                    render={({field}) => (
                        <FormItem>
                            <FormLabel>Company Phone</FormLabel>
                            <FormControl>
                                <Input placeholder="Enter your company phone" {...field} />
                            </FormControl>
                            <FormDescription>
                                This is the name that appears on MatterFin and in your notifications.
                            </FormDescription>
                            <FormMessage/>
                        </FormItem>
                    )}
                />
                <FormField
                    control={form.control}
                    name="companyEmail"
                    disabled={!isEditing}
                    render={({field}) => (
                        <FormItem>
                            <FormLabel>Company Email</FormLabel>
                            <FormControl>
                                <Input placeholder="Enter your company email" {...field} />
                            </FormControl>
                            <FormDescription>
                                This is your public display name. It can be your real name or a
                                pseudonym. You can only change this once every 30 days.
                            </FormDescription>
                            <FormMessage/>
                        </FormItem>
                    )}
                />

                <FormField
                    control={form.control}
                    name="mailingAddress"
                    disabled={!isEditing}
                    render={({field}) => (
                        <FormItem>
                            <FormLabel>Mailing Address</FormLabel>
                            <FormControl>
                                <Textarea
                                    placeholder="Enter your mailing address"
                                    className="resize-none"
                                    {...field}
                                />
                            </FormControl>
                            <FormDescription>
                                We’ll send physical things and surprise gifts to this address.
                            </FormDescription>
                            <FormMessage/>
                        </FormItem>
                    )}
                />
                <FormField
                    control={form.control}
                    name="companyAddress"
                    disabled={!isEditing}
                    render={({field}) => (
                        <FormItem>
                            <FormLabel>Legal Address</FormLabel>
                            <FormControl>
                                <Textarea
                                    placeholder="Enter your company address"
                                    className="resize-none"
                                    {...field}
                                />
                            </FormControl>
                            <FormDescription>
                                The billing address for your invoices and other required documents.
                            </FormDescription>
                            <FormMessage/>
                        </FormItem>
                    )}
                />
                <div className={"flex items-center gap-5"}>
                    <Button>
                        <Pencil className={"w-4 h-4"}/>
                        Edit
                    </Button>
                    <Button type="submit">Update profile</Button>
                </div>
            </form>
        </Form>
    )
}