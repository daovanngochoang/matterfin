"use client"

import React, { useState } from 'react';
import ProfileForm from './profile-form';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { CalendarIcon, MoreHorizontal, UserIcon } from 'lucide-react';
import { useUser } from '@clerk/nextjs';
import type { UserResource } from "@clerk/types"
import { Badge } from "@/components/ui/badge";
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from '@/components/ui/command';
import { DropdownMenu, DropdownMenuTrigger } from '@radix-ui/react-dropdown-menu';
import { DropdownMenuContent, DropdownMenuItem } from '@/components/ui/dropdown-menu';
import { PhoneFormPopup } from './phone-form';
import { EmailFormPopup } from './email-form';
import { PhoneNumber } from '@clerk/nextjs/server';

export default function UserProfile() {

  const [openEditProfile, setOpenEditProfile] = useState<boolean>(false)

  // profile image.
  //
  // firstname + lastname - display in in a profile form.
  //
  // phones - the primary with badge (primary) + an add button to add new phoneNumber.
  // emails - primary with badge (primary) + the listing of phones.
  //
  // the security part - which is added later.
  //
  // a button to delete account.
  // and account activity.
  //


  const { user } = useUser()

  function profileImage(user: UserResource) {
    if (user.hasImage) {
      return (
        <>
          <AvatarImage src={user.imageUrl} alt="profile image" />
          <AvatarFallback>{`${user.firstName}${user.lastName}`}</AvatarFallback>
        </>
      )
    }
    return <UserIcon className="w-16 h-16" />
  }

  function removePhoneNumber(currentPhoneId: string): void {
    throw new Error('Function not implemented.');
  }

  function removeEmail(currentEmailId: string): void {


  }

  console.log(user?.primaryEmailAddress, user?.emailAddresses)

  return (
    <div>

      {/* user image, user full name, edit profile button.*/}

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
                          {
                            //check whether the email is primay ornot
                            email.id === user.primaryEmailAddress?.id ? <Badge variant="outline">Primary</Badge> : <></>
                          }
                          {
                            // if not yet verified show status
                            email.id === user.primaryEmailAddress?.id && email.verification.status !== "verified" ? <Badge></Badge> : <></>
                          }
                        </div>

                        <DropdownMenu>
                          <DropdownMenuTrigger>
                            <MoreHorizontal />
                          </DropdownMenuTrigger>
                          <DropdownMenuContent>
                            <DropdownMenuItem onClick={() => removeEmail(email.id)} className='text-sm text-destructive'>
                              Remove
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>

                      </div>
                    );
                  })}
                  <EmailFormPopup>
                    <Button variant="link" className='pl-0'>+ Add Email Address</Button>
                  </EmailFormPopup>
                </div>
              </div>

              <div className=' w-full grid grid-cols-6 items-center '>

                <div className="col-span-2 text-sm font-medium leading-none">
                  Phone Numbers
                </div>


                <div className="col-span-4 text-sm">
                  {
                    user?.phoneNumbers.map((p, k) => {
                      return (
                        <div key={k} className='flex justify-between'>
                          <div className='flex gap-2 items-center'>
                            {p.phoneNumber}
                            <Badge variant="outline">Primary</Badge>
                          </div>
                          <DropdownMenu>
                            <DropdownMenuTrigger>
                              <MoreHorizontal />
                            </DropdownMenuTrigger>
                            <DropdownMenuContent>
                              <DropdownMenuItem onClick={() => removePhoneNumber(p.id)} className='text-sm text-destructive'>
                                Remove
                              </DropdownMenuItem>
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </div>
                      )
                    })
                  }
                  <PhoneFormPopup>
                    <Button variant="link" className='pl-0'>+ Add Phone Number</Button>
                  </PhoneFormPopup>
                </div>
              </div>
            </div>

          </div>

        </CardContent>

        <CardHeader>
          <CardTitle>Company Profile</CardTitle>
          <CardDescription>Manage your account information</CardDescription>
          <Separator />
        </CardHeader>

      </Card>

      {/*    */}

    </div>
  );
}



