"use client"

import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { number, z } from "zod"

import { Button } from "@/components/ui/button"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage, } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import React, { useState } from "react";
import { CloudUpload, ImageIcon, Loader2 } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger
} from "@/components/ui/dialog"
import { Badge } from "@/components/ui/badge"
import { createOrgAction } from "@/lib/actions/organizationAction"

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger
} from "@/components/ui/alert-dialog"
import { useToast } from "@/components/ui/use-toast"
import { DASHBOARD_PATH } from "@/constants/routingPath";
import { redirect, useRouter } from "next/navigation"
import DragDropFileSelector from "@/components/DragDropFileSelector"

const FormSchema = z.object({
  orgName: z.string(
    {
      required_error: "Organization name can not be empty."
    }
  ),
  slug: z.string().optional(),
})

export function NewOrganizationForm() {

  const [orgLogo, setOrLogo] = useState<File | null>(null)
  const [open, setOpen] = useState<boolean>(false)
  const { toast } = useToast()
  const [alertOpen, setAlertOpen] = useState<boolean>(false)
  const [pending, setPending] = useState(false)

  const router = useRouter()

  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      orgName: "",
      slug: ""
    },
  })

  const sleepNow = (delay: number) => new Promise((resolve) => setTimeout(resolve, delay))
  async function onSubmit(data: z.infer<typeof FormSchema>) {

    try {
      const formData = new FormData()

      formData.append("orgName", data.orgName)
      formData.append("slug", data.slug!)
      if (orgLogo != null) {
        formData.append("file", orgLogo!)
      }

      setPending(true)
      const { error } = await createOrgAction(formData)
      setPending(false)

      if (error === undefined) {

        toast({
          title: "Success!",
          variant: "default",
          description: "Your Organization is created!"
        })
        setPending(false)

        await sleepNow(1000)

        setAlertOpen(false)

        setTimeout(() => {
          router.push(DASHBOARD_PATH)
        }, 500)
      } else {
        toast({
          title: "Unexpected error",
          variant: "default",
          description: error
        })
      }

    } catch (e) {
      toast({
        title: "Unexpected error",
        variant: "default",
        description: (e as Error).message
      })
    }
    setPending(false)

  }

  function handleDropEvent(event: React.DragEvent<HTMLDivElement>) {
    event.preventDefault();
    if (event.dataTransfer.files) {
      setOrLogo(event.dataTransfer.files[0]);
      setOpen(false)
    }
  }
  function allowDrop(event: React.DragEvent<HTMLDivElement>) {
    event.preventDefault();
  }

  function handleOnChangeEvent(event: React.ChangeEvent<HTMLInputElement>) {
    if (event.target.files) {
      const selectedFile = event.target.files[0];
      setOrLogo(selectedFile);
      setOpen(false)
    }
  }


  return (
    <>
      <Card className="w-[350px] mt-10">
        <CardHeader>
          <CardTitle>
            Create Organization
          </CardTitle>
          <CardDescription>
            To continue with MatterFin you have to create an organization first.
          </CardDescription>
        </CardHeader>
        <CardContent className="grid gap-4">
          <Form {...form}>
            <form className="space-y-6">
              <div className="flex gap-4 h-16">
                <div className="w-16 h-16 flex items-center justify-center">
                  {
                    orgLogo != null ?
                      <img
                        src={URL.createObjectURL(orgLogo)}
                        alt="Org Logo"
                        className="object-fill max-w-full max-h-full"
                      />
                      : <ImageIcon className="w-full h-full opacity-60" />
                  }
                </div>
                <div className=" flex flex-col justify-center">
                  <p className="text-sm">Logo</p>
                  <DragDropFileSelector
                    open={open}
                    onOpenChange={setOpen}
                    handleDrop={handleDropEvent}
                    handleSelect={handleOnChangeEvent}
                  >
                    <Button onClick={() => setOpen(true)} variant="link" className="h-5 pl-0">
                      Choose logo
                    </Button>
                  </DragDropFileSelector>
                  {/*<Dialog open={open} onOpenChange={setOpen}>*/}
                  {/*  <DialogTrigger asChild>*/}
                  {/*    <Button onClick={() => setOpen(true)} variant="link" className="h-5 pl-0">*/}
                  {/*      Choose logo*/}
                  {/*    </Button>*/}
                  {/*  </DialogTrigger>*/}
                  {/*  <DialogContent className="sm:max-w-[425px]">*/}
                  {/*    <DialogHeader>*/}
                  {/*      <DialogTitle>Select Logo</DialogTitle>*/}
                  {/*      <DialogDescription>*/}
                  {/*        Drag and Drop or click select to select your organization logo.*/}
                  {/*      </DialogDescription>*/}
                  {/*    </DialogHeader>*/}
                  {/*    <Card>*/}
                  {/*      <div onDrop={handleDropEvent} onDragOver={allowDrop} className="w-full h-32 flex justify-center items-center ">*/}
                  {/*        <CloudUpload className="w-16 h-16 opacity-60" />*/}
                  {/*      </div>*/}
                  {/*    </Card>*/}
                  {/*    <DialogFooter>*/}
                  {/*      <Input type="file" onChange={handleOnChangeEvent} />*/}
                  {/*    </DialogFooter>*/}
                  {/*  </DialogContent>*/}
                  {/*</Dialog>*/}
                </div>
              </div>

              <FormField
                control={form.control}
                name="orgName"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Name</FormLabel>
                    <FormControl>
                      <Input required placeholder="Enter organization Name here" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="slug"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="flex justify-between">
                      Slug
                      <Badge variant="outline">
                        ? Optional
                      </Badge>
                    </FormLabel>
                    <FormControl>
                      <Input required={false} placeholder="Enter slug name here" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <AlertDialog open={alertOpen} onOpenChange={setAlertOpen}>
                <AlertDialogTrigger asChild>
                  <Button onClick={() => setAlertOpen(true)}>Create</Button>
                </AlertDialogTrigger>
                <AlertDialogContent>
                  <AlertDialogHeader>
                    <AlertDialogTitle>Confirm Dialog</AlertDialogTitle>
                    <AlertDialogDescription>
                      Click create to confirm and create your own organization or cancel to exit.
                    </AlertDialogDescription>
                  </AlertDialogHeader>
                  <AlertDialogFooter>
                    <AlertDialogCancel>Cancel</AlertDialogCancel>

                    {
                      !pending ? <AlertDialogAction
                        onClick={form.handleSubmit(onSubmit)}
                      >
                        Create
                      </AlertDialogAction>
                        : <AlertDialogAction disabled>
                          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                          Please wait

                        </AlertDialogAction>

                    }
                  </AlertDialogFooter>
                </AlertDialogContent>
              </AlertDialog>
            </form>
          </Form>
        </CardContent>
      </Card >
    </>
  );
}
