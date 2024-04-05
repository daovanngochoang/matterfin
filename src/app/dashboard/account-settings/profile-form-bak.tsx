//
//
// "use client"
//
// import { zodResolver } from "@hookform/resolvers/zod"
// import { useForm } from "react-hook-form"
// import { z } from "zod"
// import { Button } from "@/components/ui/button"
// import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage, } from "@/components/ui/form"
// import { Input } from "@/components/ui/input"
// import { toast } from "@/components/ui/use-toast"
// import * as React from "react";
// import {
//   Dialog,
//   DialogContent,
//   DialogDescription,
//   DialogFooter,
//   DialogHeader,
//   DialogTitle,
//   DialogTrigger
// } from "@/components/ui/dialog";
// import { useState } from "react"
// import { Avatar } from "@radix-ui/react-avatar"
// import { AvatarFallback, AvatarImage } from "@/components/ui/avatar"
// import { UserIcon } from "lucide-react"
// import DragDropFileSelector from "@/components/DragDropFileSelector"
//
// const profileFormSchema = z.object({
//   firstname: z
//     .string({
//       required_error: "First name cannot be empty."
//     }).min(1, "First name cannot be empty."),
//   lastname: z
//     .string({
//       required_error: "Last name cannot be empty.",
//     }).min(1, "Last name cannot be empty.")
// })
//
// type ProfileFormValues = z.infer<typeof profileFormSchema>
//
//
// type ProfileFormProps = {
//   firstname?: string | undefined
//   lastname?: string | undefined
//   imageUrl?: string | undefined
//   image?: File | undefined
//   open: boolean
//   onOpenChange: React.Dispatch<React.SetStateAction<boolean>>
//   children: React.ReactNode
// }
//
// export default function ProfileForm({
//   firstname,
//   lastname,
//   image,
//   imageUrl,
//   open,
//   onOpenChange,
//   children,
// }: ProfileFormProps) {
//
//
//   // This can come from your database or API.
//   const defaultValues: Partial<ProfileFormValues> = {
//     firstname: firstname ?? undefined,
//     lastname: lastname ?? undefined,
//   }
//   const form = useForm<ProfileFormValues>({
//     resolver: zodResolver(profileFormSchema),
//     defaultValues,
//     mode: "onChange",
//   })
//
//
//   const [profileImage, setProfileImage] = useState<File | undefined>(image)
//   const [openFileSelector, setOpenFileSelector] = useState<boolean>(false)
//   function onSubmit(data: ProfileFormValues) {
//     toast({
//       title: "You submitted the following values:",
//       description: (
//         <pre className="mt-2 w-[340px] rounded-md bg-slate-950 p-4">
//           <code className="text-white">{JSON.stringify(data, null, 2)}</code>
//         </pre>
//       ),
//     })
//   }
//
//
//
//   function profilePhoto(): React.ReactNode {
//     if (profileImage == undefined) {
//       if (imageUrl != undefined) {
//         return (
//           <>
//             <AvatarImage src={imageUrl} alt="profile image" />
//             <AvatarFallback>CN</AvatarFallback>
//           </>
//         )
//       }
//       return <UserIcon className="w-16 h-16"/>
//     } else {
//       return (<>
//         <AvatarImage src={imageUrl} alt="profile image" />
//         <AvatarFallback>CN</AvatarFallback>
//       </>)
//     }
//   }
//
//   return (
//     <Dialog open={open} onOpenChange={onOpenChange}>
//       <DialogTrigger asChild>
//         {children}
//       </DialogTrigger>
//       <DialogContent>
//         <DialogHeader>
//           <DialogTitle>Edit profile</DialogTitle>
//           <DialogDescription>
//             {/* eslint-disable-next-line react/no-unescaped-entities */}
//             Make changes to your profile here. Click save when you're done.
//           </DialogDescription>
//         </DialogHeader>
//         <Form {...form}>
//           <div className="flex gap-3">
//             <Avatar className="w-16 h-16">
//               {profilePhoto()}
//             </Avatar>
//             <div className="flex gap-2 justify-center items-center">
//               <DragDropFileSelector
//                 open={openFileSelector}
//                 onOpenChange={setOpenFileSelector}
//                 handleDrop={(e) => {}}
//                 handleSelect={(e) => {}}
//               >
//                <Button>
//                   Upload
//                 </Button>
//               </DragDropFileSelector>
//               <Button variant="ghost">Remove</Button>
//             </div>
//           </div>
//           <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
//             <FormField
//               control={form.control}
//               name="firstname"
//               render={({ field }) => (
//                 <FormItem>
//                   <FormLabel>Firstname</FormLabel>
//                   <FormControl>
//                     <Input
//                       required={true}
//                       placeholder="Enter your firstname"
//                       className="resize-none"
//                       {...field}
//                     />
//                   </FormControl>
//                   <FormMessage />
//                 </FormItem>
//               )}
//             />
//             <div>
//               <FormField
//                 control={form.control}
//                 name="lastname"
//                 render={({ field }) => (
//                   <FormItem>
//                     <FormLabel>
//                       Lastname
//                     </FormLabel>
//                     <FormControl>
//                       <Input
//                         placeholder="Enter your Lastname"
//                         required={true}
//                         {...field} />
//                     </FormControl>
//                     <FormMessage />
//                   </FormItem>
//                 )}
//               />
//             </div>
//             <DialogFooter>
//               <Button type="submit">Save changes</Button>
//             </DialogFooter>
//           </form>
//         </Form>
//       </DialogContent>
//     </Dialog>
//   )
// }
//
//
