import {DialogFooter} from "@/components/ui/dialog";
import {Button} from "@/components/ui/button";
import {Loader2} from "lucide-react";
import {Input} from "@/components/ui/input";
import * as React from "react";
import {useState} from "react";
import {z} from "zod"
import {zodResolver} from "@hookform/resolvers/zod"
import {useForm} from "react-hook-form";
import {Form, FormControl, FormField, FormItem, FormLabel, FormMessage} from "@/components/ui/form";
import {CreateAction, UpdateAction} from "@/lib/actions/actionType";
import Contact from "@/lib/model/contact";
import {useToast} from "@/components/ui/use-toast";


type CreateContactFormButtonProps = {
    createAction?: CreateAction<Contact, boolean>;
    updateAction?: UpdateAction<number, Contact, Contact>
    isUpdateForm: boolean
    contactId?: number
    open: boolean,
    onOpenChange: React.Dispatch<React.SetStateAction<boolean>>
    defaultValues?: Contact
}

const formSchema = z.object({
    firstname: z.string({
        required_error: "FirstName is required",
        invalid_type_error: "FirstName must be a Text",
    }),
    lastname: z.string(
        {
            required_error: "LastName is required",
            invalid_type_error: "LastName must be a Text",
        }
    ),
    company_name: z.string(
        {
            required_error: "LastName is required",
            invalid_type_error: "LastName must be a Text",
        }
    ),
    phone: z.string({
        required_error: "Phone is required",
        invalid_type_error: "Phone must be a Text",
    }),
    email: z.string(
        {
            required_error: "Name is required",
            invalid_type_error: "Name must be a Text",
        }
    ).email({
        message: "Invalid email!",
    })
})
const ContactForm = (props: CreateContactFormButtonProps) => {

    const [pending, setPending] = useState(false)
    const {toast} = useToast()
    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: props.defaultValues
    })

    async function submitCreate(values: z.infer<typeof formSchema>): Promise<void> {
        let {data, error} = await props.createAction!(
            {
                company_name: values.company_name,
                email: values.email,
                firstname: values.firstname,
                lastname: values.lastname,
                phone: values.phone
            }
        )
        if (data !== false) {
            toast(
                {
                    variant: "default",
                    title: "Success",
                    description: "New contact is created!",
                }
            )
        } else {
            toast(
                {
                    variant: "destructive",
                    title: "Error",
                    description: error,
                }
            )
        }
    }


    async function submitUpdate(id: number, values: z.infer<typeof formSchema>): Promise<void> {
        let {error} = await props.updateAction!(
            id,
            {
                company_name: values.company_name,
                email: values.email,
                firstname: values.firstname,
                lastname: values.lastname,
                phone: values.phone
            }
        )
        console.log(error)
        if (error !== undefined) {
            toast(
                {
                    variant: "default",
                    title: "Success",
                    description: "Contact is updated!",
                }
            )
        } else {
            toast(
                {
                    variant: "destructive",
                    title: "Error",
                    description: error,
                }
            )
        }
    }

    // 2. Define a submit handler.
    async function onSubmit(values: z.infer<typeof formSchema>) {
        setPending(true)

        if (!props.isUpdateForm) {
            await submitCreate(values)
        } else {
            await submitUpdate(props.defaultValues!.id!, values)
        }

        setPending(true)

        // reset form after submit
        form.reset(
            {
                company_name: '',
                email: '',
                firstname: '',
                lastname: '',
                phone: ''
            }
        )
        props.onOpenChange(false)
    }

    return (
        <>
            <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                    <div className="flex gap-4">
                        <FormField
                            control={form.control}
                            name="firstname"
                            render={({field}) => (
                                <FormItem>
                                    <FormLabel>Firstname</FormLabel>
                                    <FormControl>
                                        <Input required={true} placeholder="enter firstname ..." {...field} />
                                    </FormControl>
                                    <FormMessage/>
                                </FormItem>

                            )}
                        />
                        <FormField
                            control={form.control}
                            name="lastname"
                            render={({field}) => (
                                <FormItem>
                                    <FormLabel>Lastname</FormLabel>
                                    <FormControl>
                                        <Input required={true}
                                               placeholder="Enter Lastname here ..." {...field} />
                                    </FormControl>
                                    <FormMessage/>
                                </FormItem>

                            )}
                        />
                    </div>

                    <FormField
                        control={form.control}
                        name="company_name"
                        render={({field}) => (
                            <FormItem>
                                <FormLabel>Company Name</FormLabel>
                                <FormControl>
                                    <Input required={true} placeholder="Enter Company here ..." {...field} />
                                </FormControl>
                                <FormMessage/>
                            </FormItem>
                        )}
                    />

                    <FormField
                        control={form.control}
                        name="email"
                        render={({field}) => (
                            <FormItem>
                                <FormLabel>Email</FormLabel>
                                <FormControl>
                                    <Input required={true} placeholder="Enter email here ..." {...field} />
                                </FormControl>
                                <FormMessage/>
                            </FormItem>
                        )}
                    />
                    <FormField
                        control={form.control}
                        name="phone"
                        render={({field}) => (
                            <FormItem>
                                <FormLabel>Phone</FormLabel>
                                <FormControl>
                                    <Input required={true} placeholder="Enter phone here ..." {...field} />
                                </FormControl>
                                <FormMessage/>
                            </FormItem>
                        )}
                    />
                    <DialogFooter>
                        {
                            pending ? (
                                    <Button disabled>
                                        <Loader2 className="mr-2 h-4 w-4 animate-spin"/>
                                        Please wait
                                    </Button>)
                                : (<Button type="submit" className="spin-in">Save changes</Button>)
                        }

                    </DialogFooter>
                </form>
            </Form>
        </>
    )
        ;
}

export default ContactForm;
