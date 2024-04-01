import React from 'react';
import { auth, clerkClient, SignedIn, SignedOut, SignInButton, UserButton } from "@clerk/nextjs";
import { User } from "@clerk/backend";
import { ModeToggle } from "./theme-toggle";
import { Button } from './ui/button';
import Image from 'next/image';
import logoImage from '../../public/logo-component.svg'


const HeaderBar = async () => {

  const { userId } = auth();
  let user: User | undefined = undefined;
  if (userId != null) {
    user = await clerkClient.users.getUser(userId);
  }
  console.log(user?.id);

  return (
    <div className=" w-100 h-20 flex justify-between px-24 items-center border-b-2">

      {/*Website logo*/}

      <div className='flex flex-row items-center'>
        <Image
          src={logoImage}
          alt='Brand Logo'
          width={15}
        />
        <h2 className='text-2xl font-semibold content-center'>matterfin</h2>
      </div>

      <div className="inline-flex items-center gap-2 ">
        {/*    Theme Toggle*/}
        <ModeToggle />
        {/*User logo*/}
        <SignedIn>
          {/* Mount the UserButton component */}
          <UserButton afterSignOutUrl="/" userProfileUrl="/profile" />
        </SignedIn>
        <SignedOut>
          <Button>
            <SignInButton afterSignInUrl="/dashboard" redirectUrl="/dashboard" />
          </Button>
        </SignedOut>

      </div>
    </div>
  );
}

export default HeaderBar;
