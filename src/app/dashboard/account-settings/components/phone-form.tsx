import {Button} from "@/components/ui/button";
import {Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage} from "@/components/ui/form";
import {Input} from "@/components/ui/input";
import {Popover, PopoverContent, PopoverTrigger} from "@/components/ui/popover";
import {useToast} from "@/components/ui/use-toast";
import {useUser} from "@clerk/nextjs";
import {zodResolver} from "@hookform/resolvers/zod";
import {Loader2} from "lucide-react";
import {ReactNode, useState} from "react";
import {useForm} from "react-hook-form";
import {z} from "zod";
import {ClerkAPIResponseError} from "@clerk/shared";
import {PhoneNumberResource} from "@clerk/types";


const phoneNumberSchema = z.object({
    phone: z.string({
        required_error: "phone cannot be empty!"
    }).min(7, "Phone must be at least 7 numbers")

})

type PhoneFormValues = z.infer<typeof phoneNumberSchema>
type SuccessCallback = (phoneNumber: PhoneNumberResource) => Promise<void>;

export function PhoneForm({successCallback}: { successCallback: SuccessCallback }) {

    const {user} = useUser();
    const [isPending, setIsPending] = useState(false)
    const {toast} = useToast()


    const form = useForm<PhoneFormValues>({
        resolver: zodResolver(phoneNumberSchema),
        defaultValues: {
            phone: ""
        }
    })

    async function onSubmit(data: { phone: string; }): Promise<void> {

        try {
            setIsPending(true)
            const result = await user?.createPhoneNumber({phoneNumber: data.phone})
            setIsPending(false)
            if (result == undefined) {
                toast(
                    {
                        variant: "destructive",
                        title: "Unexpected Error",
                        description: "Sorry, we cannot create your phone number now, please try again."
                    }
                )
            } else {
                await result.prepareVerification()
                await successCallback(result)
            }
        } catch (e) {
            setIsPending(false)
            toast(
                {
                    variant: "destructive",
                    title: "Add phone number error ",
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
                        name="phone"
                        render={
                            ({field}) =>
                                <FormItem>
                                    <FormLabel>Phone number</FormLabel>
                                    <FormControl>
                                        <Input placeholder="+84897468382" {...field} />
                                    </FormControl>
                                    <FormDescription>
                                        Enter your phone number here and click submit when you are done.
                                    </FormDescription>
                                    <FormMessage/>
                                </FormItem>
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


export function PhoneFormPopup(
    {
        children,
        successCallback
    }:
        {
            children: ReactNode,
            successCallback: SuccessCallback
        }) {


    return (
        <>
            <Popover>
                <PopoverTrigger asChild>
                    {children}
                </PopoverTrigger>
                <PopoverContent className="w-[350px] space-y-4">
                    <div className="space-y-2">
                        <h4 className="font-medium leading-none">Add phone number</h4>
                        <p className="text-sm text-muted-foreground">
                            A text message containing a verification code will be sent to this phone number. Message and
                            data rates may apply.
                        </p>
                    </div>
                    <PhoneForm
                        successCallback={successCallback}/>
                </PopoverContent>
            </Popover>

        </>

    );

}





