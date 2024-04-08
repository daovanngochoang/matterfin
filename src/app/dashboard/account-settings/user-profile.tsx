"use client"

import React, { SetStateAction, useState } from 'react';
import ProfileForm from './components/profile-form';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { MoreHorizontal, UserIcon } from 'lucide-react';
import { useUser } from '@clerk/nextjs';
import type { EmailAddressResource, PhoneNumberResource, UserResource } from "@clerk/types"
import { Badge } from "@/components/ui/badge";
import { DropdownMenu, DropdownMenuTrigger } from '@radix-ui/react-dropdown-menu';
import { DropdownMenuContent, DropdownMenuItem } from '@/components/ui/dropdown-menu';
import { PhoneFormPopup } from './components/phone-form';
import { EmailFormPopup } from './components/email-form';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle
} from '@/components/ui/alert-dialog';
import { OTPFormPopup, ResendOTPFunction, VerifyOTPFunction } from './components/otp-form';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";


type OtpDialogData = {
  title: string
  description: string
  verify?: VerifyOTPFunction<PhoneNumberResource | EmailAddressResource>
  retry?: ResendOTPFunction<PhoneNumberResource | EmailAddressResource>
}
type AlertDialogAction = () => void
type AlertDialogData = {
  title: string
  description: string
  dialogAction: AlertDialogAction
}
export default function UserProfile() {
  const [openAlertDialog, setOpenAlertDialog] = useState<boolean>(false)
  const [openEditProfile, setOpenEditProfile] = useState<boolean>(false)


  let selectedPhone: PhoneNumberResource | undefined;
  let selectedEmail: EmailAddressResource | undefined;

  const [openOtpPopup, setOpenOtpPopup] = useState(false)
  const [dialogData, setDialogData] = useState<AlertDialogData>({
    title: "",
    description: "",
    dialogAction: () => {
    }
  })
  const [otpDialogData, setOtpDialogData] = useState<OtpDialogData>({ title: "", description: "" })

  const { user } = useUser()

  function profileImage(user: UserResource) {
    if (user.hasImage) {
      return (
        <>
          <AvatarImage src={user.imageUrl} alt="profile image" />
          <AvatarFallback>{`${user.firstName !== null ? user.firstName?.at(0) : ""}${user.lastName !== null ? user.lastName.at(0) : ""}`}</AvatarFallback>
        </>
      )
    }
    return <UserIcon className="w-16 h-16" />
  }

  async function removePhoneNumber(p: PhoneNumberResource): Promise<void> {
    selectedPhone = p;
    setDialogData(
      {
        title: "Are you absolutely sure?",
        description: "This action cannot be undone. This will permanently delete your phone number'",
        dialogAction: async () => {
          await selectedPhone!.destroy()
          setOpenAlertDialog(false)
        }
      }
    )
    setOpenAlertDialog(true)
  }

  async function verifyPhone(p: PhoneNumberResource): Promise<void> {
    await p.prepareVerification()

    setOtpDialogData(
      {
        title: "Verify phone number",
        description: "Enter the verification code sent to your phone number",
        verify: async (code: string) => {
          return await p.attemptVerification({
            code: code
          })
        },
        retry: async () => {
          return await p.prepareVerification()
        }
      }
    )

    setOpenOtpPopup(true)

  }

  async function verifyEmail(email: EmailAddressResource) {
    await email.prepareVerification({
      strategy: "email_code"
    })
    setOtpDialogData(
      {
        title: "Verify email address",
        description: "Enter the verification code sent to your email",
        verify: async (code: string) => {
          return await email.attemptVerification({
            code: code
          })
        },
        retry: async () => {
          return await email.prepareVerification({
            strategy: "email_code"
          })
        }
      }
    )
    setOpenOtpPopup(true)
  }

  function removeEmail(email: EmailAddressResource): void {
    selectedEmail = email;
    setDialogData(
      {
        title: "Are you absolutely sure?",
        description: "This action cannot be undone. This will permanently delete your email address'",
        dialogAction: async () => {
          await selectedEmail!.destroy()
          setOpenAlertDialog(false)
        }
      }
    )
    setOpenAlertDialog(true)

  }

  function renderBadge(resource: EmailAddressResource | PhoneNumberResource, primaryId?: string | null) {
    if (resource.id === primaryId) {
      return <Badge variant="outline">Primary</Badge>
    } else if (resource.id !== primaryId && resource.verification.status !== "verified") {
      return <Badge variant={"outline"} className={"text-destructive"}>Unverified</Badge>
    }
    return <></>
  }

  return (
    <div>
      <AlertDialogConfirm
        open={openAlertDialog}
        onOpenChange={setOpenAlertDialog}
        title={dialogData!.title}
        description={dialogData!.description}
        onClick={dialogData!.dialogAction}
      />


      <OTPFormPopup
        open={openOtpPopup}
        onOpenChange={setOpenOtpPopup}
        title={otpDialogData!.title}
        description={otpDialogData!.description}
        verify={otpDialogData!.verify}
        retryFunction={otpDialogData!.retry}
      />

      <Card>
        <CardHeader>
          <CardTitle>Profile details</CardTitle>
          <CardDescription>Manage your account information</CardDescription>
          <Separator />
        </CardHeader>
        <CardContent>
          <div className="space-y-6">
            {/*User Profile part*/}
            <div className='flex gap-4 items-center'>
              <Avatar className='w-16 h-16'>
                {profileImage(user!)}
              </Avatar>
              <div className='flex flex-col'>
                <p className='text-sm font-semibold'>{user!.firstName} {user!.lastName}</p>
                <div>
                  <ProfileForm
                    open={openEditProfile}
                    onOpenChange={setOpenEditProfile}
                  >
                    <Button onClick={() => setOpenEditProfile(true)} variant="link"
                      className="h-5 pl-0">
                      Update profile
                    </Button>
                  </ProfileForm>

                </div>

              </div>
            </div>

            {/*Phone numbers*/}
            <div className="space-y-4">
              <div className=' w-full grid grid-cols-6 '>
                <div className="col-span-2 text-sm font-medium leading-none">
                  Email Addresses
                </div>
                <div className="col-span-4 text-sm">
                  {user?.emailAddresses.map((email, key) => {
                    return (
                      <div key={key} className='w-full flex justify-between'>
                        <div className='flex gap-2 items-center'>
                          {
                            // display email
                            email.emailAddress
                          }
                          {renderBadge(email, user!.primaryEmailAddressId!)}
                        </div>

                        <DropdownMenu>
                          <DropdownMenuTrigger>
                            <MoreHorizontal />
                          </DropdownMenuTrigger>
                          <DropdownMenuContent>
                            {
                              // if email ist not primary & status is Unverified => show button to verify email.
                              email.id !== user.primaryEmailAddress?.id && email.verification.status !== "verified" ?
                                <DropdownMenuItem
                                  onClick={async () => {
                                    await verifyEmail(email)
                                  }} className='text-sm '>
                                  Verify Email Address
                                </DropdownMenuItem>
                                : <div></div>
                            }
                            <DropdownMenuItem
                              onClick={() => removeEmail(email)}
                              className='text-sm text-destructive'>
                              Remove
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>

                      </div>
                    );
                  })}
                  <EmailFormPopup setOpenOtpPopup={setOpenOtpPopup}>
                    <Button variant="link" className='pl-0'>+ Add Email Address</Button>
                  </EmailFormPopup>
                </div>
              </div>

              <div className=' w-full grid grid-cols-6 items-start '>

                <div className="col-span-2 text-sm font-medium leading-none">
                  Phone Numbers
                </div>


                <div className="col-span-4 text-sm">
                  {
                    user?.phoneNumbers.map((p, k) => {
                      return (
                        <div key={k} className='flex justify-between'>
                          <div className='flex gap-4 items-center'>
                            {p.phoneNumber}
                            {
                              renderBadge(p, user!.primaryPhoneNumberId)
                            }

                          </div>
                          <DropdownMenu>
                            <DropdownMenuTrigger>
                              <MoreHorizontal />
                            </DropdownMenuTrigger>
                            <DropdownMenuContent>
                              {
                                p.id !== user.primaryPhoneNumber?.id && p.verification.status !== "verified"
                                  ? <DropdownMenuItem
                                    onClick={async () => {
                                      await verifyPhone(p)
                                    }} className='text-sm'>
                                    Verify phone number
                                  </DropdownMenuItem>
                                  : <></>
                              }

                              <DropdownMenuItem
                                onClick={async () => {
                                  await removePhoneNumber(p)
                                }} className='text-sm text-destructive'>
                                Remove
                              </DropdownMenuItem>
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </div>
                      )
                    })
                  }
                  <PhoneFormPopup
                    successCallback={
                      async (phoneNumber) => {
                        setOtpDialogData(
                          {
                            title: "Verify phone number",
                            description: "Enter the verification code sent to your phone number",
                            verify: async (code: string) => {
                              return await phoneNumber.attemptVerification({
                                code: code
                              })
                            },
                            retry: async () => {
                              return await phoneNumber.prepareVerification()
                            }
                          }
                        )

                        setOpenOtpPopup(true)
                      }
                    }
                  >
                    <Button variant="link" className='pl-0'>+ Add Phone Number</Button>
                  </PhoneFormPopup>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

    </div>
  );
}


type ActionFunction = () => void;
type AlertDialogConfirmProps = {
  open: boolean
  onOpenChange: React.Dispatch<SetStateAction<boolean>>
  title: string
  description: string
  onClick: ActionFunction
}

function AlertDialogConfirm({ open, onOpenChange, title, description, onClick }: AlertDialogConfirmProps) {

  return (
    <div>
      <AlertDialog open={open} onOpenChange={onOpenChange}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>{title}</AlertDialogTitle>
            <AlertDialogDescription>
              {description}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={onClick}>Remove</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  )
}





