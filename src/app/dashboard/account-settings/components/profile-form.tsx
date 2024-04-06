"use client"
import type {UserResource} from '@clerk/types';
import {zodResolver} from "@hookform/resolvers/zod"
import {useForm} from "react-hook-form"
import {Button} from "@/components/ui/button"
import {Form, FormControl, FormField, FormItem, FormLabel, FormMessage,} from "@/components/ui/form"
import {Input} from "@/components/ui/input"
import * as React from "react";
import {useState} from "react";
import {DialogFooter} from "@/components/ui/dialog";

import {Avatar, AvatarFallback, AvatarImage} from "@/components/ui/avatar"
import {UserIcon} from "lucide-react"
import DragDropFileSelector from "@/components/DragDropFileSelector"
import {Popover, PopoverContent, PopoverTrigger} from "@/components/ui/popover"
import {Separator} from "@/components/ui/separator"
import {useUser} from "@clerk/nextjs"
import {z} from "zod";
import {UpdateUserParams} from "@clerk/types/dist/user";
import {toast} from "@/components/ui/use-toast";

const profileFormSchema = z.object({
    firstname: z
        .string({
            required_error: "First name cannot be empty."
        }).min(1, "First name cannot be empty."),
    lastname: z
        .string({
            required_error: "Last name cannot be empty.",
        }).min(1, "Last name cannot be empty.")
})

type ProfileFormValues = z.infer<typeof profileFormSchema>


type ProfileFormProps = {
    open: boolean
    onOpenChange: React.Dispatch<React.SetStateAction<boolean>>
    children: React.ReactNode
}

export default function ProfileForm(
    {
        open,
        onOpenChange,
        children,
    }: ProfileFormProps
) {


    const {user} = useUser()


    // This can come from your database or API.
    const defaultValues: Partial<ProfileFormValues> = {
        firstname: user!.firstName ?? undefined,
        lastname: user!.lastName ?? undefined,
    }
    const form = useForm<ProfileFormValues>({
        resolver: zodResolver(profileFormSchema),
        defaultValues,
        mode: "onChange",
    })

    const [profileImage, setProfileImage] = useState<File | undefined>()
    const [openFileSelector, setOpenFileSelector] = useState<boolean>(false)

    async function onSubmit(data: ProfileFormValues) {
        try {
            if (profileImage !== undefined) {
                await user?.setProfileImage({
                    file: profileImage!
                })
            }

            let params: UpdateUserParams = {}

            if (user!.firstName !== data.firstname) {
                params.firstName = data.firstname
            }
            if (user!.lastName !== data.lastname) {
                params.lastName = data.lastname
            }

            await user!.update(
                params
            )
            toast({
                title: "Profile updated!",
                description: "Your profile is updated successfully"
            })
        } catch (e) {
            toast({
                variant: "destructive",
                title: "Unexpected Error",
                description: (e as Error).message

            })
        }
    }


    function profilePhoto(user: UserResource): React.ReactNode {
        if (profileImage == undefined) {
            if (user.hasImage) {
                return (
                    <>
                        <AvatarImage src={user.imageUrl} alt="profile image"/>
                        <AvatarFallback>{`${user.firstName}${user.lastName}`}</AvatarFallback>
                    </>
                )
            }
            return <UserIcon className="w-16 h-16"/>
        } else {
            return (<>
                <AvatarImage src={window.URL.createObjectURL(profileImage)} alt="profile image"/>
                <AvatarFallback>{`${user.firstName}${user.lastName}`}</AvatarFallback>
            </>)
        }
    }

    function handleDropEvent(event: React.DragEvent<HTMLDivElement>) {
        if (event.dataTransfer.files) {
            setProfileImage(event.dataTransfer.files[0]);
            setOpenFileSelector(false)
        }
    }

    function handleSelectFileEvent(event: React.ChangeEvent<HTMLInputElement>) {
        if (event.target.files) {
            const selectedFile = event.target.files[0];
            setProfileImage(selectedFile);
            setOpenFileSelector(false)
        }
    }


    return (
        <Popover open={open} onOpenChange={onOpenChange}>
            <PopoverTrigger asChild>
                {children}
            </PopoverTrigger>
            <PopoverContent className="w-[400px] space-y-4">
                <div className="space-y-4">
                    <div className="space-y-2">
                        <h3 className="text-lg font-medium">Edit Profile</h3>
                        <p className="text-sm text-muted-foreground">
                            {/* eslint-disable-next-line react/no-unescaped-entities */}
                            Make changes to your profile here. Click save when you're done.
                        </p>
                    </div>
                    <Separator/>
                </div>
                <Form {...form}>
                    <div className="flex gap-3 items-center">
                        <div>
                            <Avatar className="w-16 h-16 ">
                                {profilePhoto(user!)}
                            </Avatar>
                        </div>

                        <div className="flex flex-col gap-1">
                            <div className="flex gap-2 items-center">
                                <DragDropFileSelector
                                    open={openFileSelector}
                                    onOpenChange={setOpenFileSelector}
                                    handleDrop={handleDropEvent}
                                    handleSelect={handleSelectFileEvent}
                                >
                                    <Button variant="outline">
                                        Upload
                                    </Button>
                                </DragDropFileSelector>
                                <Button variant="ghost"
                                        className="text-destructive hover:text-destructive">Remove</Button>
                            </div>
                            <p className="text-muted-foreground text-xs ">Recommended size 1:1, up to 10MB.</p>
                        </div>
                    </div>
                    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                        <FormField
                            control={form.control}
                            name="firstname"
                            render={({field}) => (
                                <FormItem>
                                    <FormLabel>Firstname</FormLabel>
                                    <FormControl>
                                        <Input
                                            required={true}
                                            placeholder="Enter your firstname"
                                            className="resize-none"
                                            {...field}
                                        />
                                    </FormControl>
                                    <FormMessage/>
                                </FormItem>
                            )}
                        />
                        <div>
                            <FormField
                                control={form.control}
                                name="lastname"
                                render={({field}) => (
                                    <FormItem>
                                        <FormLabel>
                                            Lastname
                                        </FormLabel>
                                        <FormControl>
                                            <Input
                                                placeholder="Enter your Lastname"
                                                required={true}
                                                {...field} />
                                        </FormControl>
                                        <FormMessage/>
                                    </FormItem>
                                )}
                            />
                        </div>
                        <DialogFooter>
                            <Button type="submit">Save changes</Button>
                        </DialogFooter>
                    </form>
                </Form>
            </PopoverContent>
        </Popover>
    )
}


