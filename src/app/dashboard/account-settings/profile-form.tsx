

"use client"
import type { UserResource } from '@clerk/types';
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { z } from "zod"
import { Button } from "@/components/ui/button"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage, } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { toast } from "@/components/ui/use-toast"
import * as React from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger
} from "@/components/ui/dialog";
import { useState } from "react"

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { UserIcon } from "lucide-react"
import DragDropFileSelector from "@/components/DragDropFileSelector"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Separator } from "@/components/ui/separator"
import { User } from "@clerk/nextjs/server"
import { useUser } from "@clerk/nextjs"

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

export default function ProfileForm({
  open,
  onOpenChange,
  children,
}: ProfileFormProps) {


  const { user } = useUser()


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



  function profilePhoto( user: UserResource): React.ReactNode {
    if (profileImage == undefined) {
      if (user.hasImage) {
        return (
          <>
            {/* <Avatar> */}
            <AvatarImage src={user.imageUrl} alt="profile image" />
            <AvatarFallback>{`${user.firstName}${user.lastName}`}</AvatarFallback>
            {/* </Avatar> */}
          </>
        )
      }
      return <UserIcon className="w-16 h-16" />
    } else {
      return (<>
        {/* <Avatar> */}
        <AvatarImage src={window.URL.createObjectURL(profileImage)} alt="profile image" />
        <AvatarFallback>{`${user.firstName}${user.lastName}`}</AvatarFallback>
        {/* </Avatar> */}
      </>)
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
          <Separator />
        </div>
        <Form {...form}>
          <div className="flex gap-3">
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
                  handleDrop={(e) => { }}
                  handleSelect={(e) => { }}
                >
                  <Button variant="outline">
                    Upload
                  </Button>
                </DragDropFileSelector>
                <Button variant="ghost" className="text-destructive hover:text-destructive">Remove</Button>
              </div>
             <p className="text-muted-foreground text-xs ">Recommended size 1:1, up to 10MB.</p>
            </div>
          </div>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <FormField
              control={form.control}
              name="firstname"
              render={({ field }) => (
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
                  <FormMessage />
                </FormItem>
              )}
            />
            <div>
              <FormField
                control={form.control}
                name="lastname"
                render={({ field }) => (
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
                    <FormMessage />
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
    </Popover >
  )
}


