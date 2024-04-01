import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger
} from "@/components/ui/dialog";
import {Button} from "@/components/ui/button";
import {Loader2, PlusCircle} from "lucide-react";
import {Input} from "@/components/ui/input";
import * as React from "react";
import {useState} from "react";
import {z} from "zod"
import {zodResolver} from "@hookform/resolvers/zod"
import {useForm} from "react-hook-form";
import {Form, FormControl, FormField, FormItem, FormLabel, FormMessage} from "@/components/ui/form";
import {CreateAction} from "@/lib/actions/actionType";
import Contact from "@/lib/model/contact";
import {useToast} from "@/components/ui/use-toast";


type CreateContactFormButtonProps = {
    action: CreateAction<Contact, boolean>
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
const CreateContactFormButton = (props: CreateContactFormButtonProps) => {
    const [pending, setPending] = useState(false)
    const [open, setOpen] = useState(false)
    const {toast} = useToast()

    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
    })

    // 2. Define a submit handler.
    async function onSubmit(values: z.infer<typeof formSchema>) {
        setPending(true)
        let {data, error} = await props.action(
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
        setPending(true)
        setOpen(false)
    }

    return (
        <>
            <Dialog open={open} onOpenChange={setOpen}>
                <DialogTrigger asChild>
                    <Button
                        size="sm"
                        className="h-8 gap-1"
                        // variant="outline"
                    >
                        <PlusCircle className="h-3.5 w-3.5"/>
                        <span className="sr-only sm:not-sr-only sm:whitespace-nowrap">
                            Add Contact
                        </span>
                    </Button>
                </DialogTrigger>
                <DialogContent className="sm:max-w-[425px]">
                    <DialogHeader>
                        <DialogTitle>Edit profile</DialogTitle>
                        <DialogDescription>
                            {/* eslint-disable-next-line react/no-unescaped-entities */}
                            Make changes to your profile here. Click save when you're done.
                        </DialogDescription>
                    </DialogHeader>

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

                </DialogContent>
            </Dialog>
        </>
    )
        ;
}

export default CreateContactFormButton;