import {Button} from "@/components/ui/button";
import {Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage} from "@/components/ui/form";
import {Input} from "@/components/ui/input";
import {Popover, PopoverContent, PopoverTrigger} from "@/components/ui/popover";
import {zodResolver} from "@hookform/resolvers/zod";
import React, {Dispatch, ReactNode, SetStateAction, useState} from "react";
import {useForm} from "react-hook-form";
import {z} from "zod";
import {useUser} from "@clerk/nextjs";
import {useToast} from "@/components/ui/use-toast";
import {Loader2} from "lucide-react";
import {ClerkAPIResponseError} from "@clerk/shared";


const emailSchema = z.object({
    email: z.string({
        required_error: "Email cannot be empty!"
    }).email("invalid email address!").min(7, "Email must be atleast 7 numbers")

})

type EmailFormValues = z.infer<typeof emailSchema>


export function EmailForm({successCallback}: { successCallback: Function }) {
    const {user} = useUser();
    const [isPending, setIsPending] = useState(false)
    const {toast} = useToast()

    const form = useForm<EmailFormValues>({
        resolver: zodResolver(emailSchema),
        defaultValues: {
            email: ""
        }
    })

    async function onSubmit(data: EmailFormValues) {
        try {
            setIsPending(true)
            const result = await user?.createEmailAddress({email: data.email})
            setIsPending(false)

            if (result == undefined) {
                toast(
                    {
                        variant: "destructive",
                        title: "Unexpected Error",
                        description: "Sorry, we cannot add new email address now, please try again."
                    }
                )
            } else {
                await result.prepareVerification({
                    strategy: "email_code"
                })
                await successCallback()
                // setOpenOtpPopup(true)
            }
        } catch (e) {
            setIsPending(false)
            toast(
                {
                    variant: "destructive",
                    title: "Unexpected Error",
                    description: (e as ClerkAPIResponseError).errors[0].message
                }
            )
        }
    }

    return (
        <>
            <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                    <FormField
                        control={form.control}
                        name="email"
                        render={
                            ({field}) => (
                                <FormItem>
                                    <FormLabel>Email</FormLabel>
                                    <FormControl>
                                        <Input placeholder="matterfin@gmail.com" {...field} />
                                    </FormControl>
                                    <FormDescription>Enter new email here and click submit when you are
                                        done</FormDescription>
                                    <FormMessage/>
                                </FormItem>
                            )
                        }
                    />

                    {
                        !isPending ?
                            <Button type="submit">Submit</Button> :
                            <Button disabled>
                                <Loader2 className="mr-2 h-4 w-4 animate-spin"/>
                                Please wait
                            </Button>
                    }
                </form>
            </Form>
        </>
    );

}


export function EmailFormPopup(
    {
        setOpenOtpPopup,
        children
    }:
        {
            children: ReactNode,
            setOpenOtpPopup: Dispatch<SetStateAction<boolean>>
        }
) {

    return (
        <>
            <Popover>
                <PopoverTrigger asChild>
                    {children}
                </PopoverTrigger>
                <PopoverContent className="w-[350px] space-y-4">
                    <div className="space-y-2">
                        <h4 className="font-medium leading-none">Add email address</h4>
                        <p className="text-sm text-muted-foreground">
                            An email containing a verification code will be sent to this email address.
                        </p>
                    </div>
                    <EmailForm successCallback={
                        async () => {
                            setOpenOtpPopup(true)
                        }
                    }/>
                </PopoverContent>
            </Popover>
        </>

    );

}
