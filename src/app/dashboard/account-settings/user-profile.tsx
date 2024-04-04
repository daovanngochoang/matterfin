"use client"

import React, { useState } from 'react';
import ProfileForm from './profile-form';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { User } from '@clerk/nextjs/server';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { UserIcon } from 'lucide-react';
import { useUser } from '@clerk/nextjs';
import type { UserResource } from "@clerk/types"

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
          {/* <Avatar> */}
          <AvatarImage src={user.imageUrl} alt="profile image" />
          <AvatarFallback>{`${user.firstName}${user.lastName}`}</AvatarFallback>
          {/* </Avatar> */}
        </>
      )
    }
    return <UserIcon className="w-16 h-16" />
  }

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

          <div className='grid grid-cols-6'>
            <div className='flex gap-4 items-center '>
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
                    <Button onClick={() => setOpenEditProfile(true)} variant="link" className="h-5 pl-0">
                      Update profile
                    </Button>
                  </ProfileForm>

                </div>

              </div>
            </div>


            <div>

            </div>

          </div>


        </CardContent>

      </Card>

      {/*    */}

    </div>
  );
}



