'use client'
import React from 'react';
import { ClerkLoaded, ClerkLoading, SignedIn, SignedOut, SignInButton, useClerk, useUser } from "@clerk/nextjs";
import { ModeToggle } from "./theme-toggle";
import { Button } from './ui/button';
import Image from 'next/image';
import logoImage from '../../public/logo-component.svg'
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger
} from "@/components/ui/dropdown-menu";
import { UserResource } from "@clerk/types";
import { Building2, LogOut, User } from "lucide-react";
import { useRouter } from 'next/navigation'
import { ACCOUNT_SETTING, DASHBOARD_PATH, ORGANIZATION_PATH, SIGN_IN_PATH } from "@/constants/routingPath";
import { Skeleton } from "@/components/ui/skeleton";
import { ReloadIcon } from "@radix-ui/react-icons";
import Link from 'next/link';


const HeaderBar = () => {

  const { user } = useUser()
  const { signOut } = useClerk();
  const router = useRouter()

  function userAvatar(user: UserResource | null | undefined) {
    return (<Avatar className="h-8 w-8">
      {
        user !== undefined && user !== null
          ? (
            !user?.hasImage ?
              <AvatarFallback
                className="border border-primary text-lg font-bold">{`${user!.firstName?.charAt(0)}${user!.lastName?.charAt(0)}`}
              </AvatarFallback>
              : <AvatarImage src={user!.imageUrl} />
          ) : <Skeleton className="h-12 w-12 rounded-full" />
      }
    </Avatar>
    )
  }


  return (
    <div className=" w-100 md:h-14 flex justify-between px-24 items-center border-b-2">

      {/*Website logo*/}
      <Link href={DASHBOARD_PATH}>
        <div className='flex flex-row items-center'>
          <Image
            src={logoImage}
            alt='Brand Logo'
            width={15}
          />
          <h2 className='text-2xl font-semibold content-center'>matterfin</h2>
        </div>
      </Link>

      <div className="inline-flex items-center gap-2 ">

        {/*    Theme Toggle*/}
        <ModeToggle />
        {/*User logo*/}
        <SignedIn>
          <DropdownMenu>
            <DropdownMenuTrigger>
              {userAvatar(user)}
            </DropdownMenuTrigger>
            <DropdownMenuContent>
              <DropdownMenuLabel>My Account</DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem
                onClick={() => router.push(ACCOUNT_SETTING)}
                className="flex gap-2"
              >
                <User className="h-4 w-4" />
                Profile
              </DropdownMenuItem>
              <DropdownMenuItem
                onClick={() => router.push(ORGANIZATION_PATH)}
                className="flex gap-2"
              >
                <Building2 className="h-4 w-4" />
                Organization
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem
                onClick={() => signOut(() => router.push(SIGN_IN_PATH))}
                className="flex gap-2"
              >
                <LogOut className="h-4 w-4" />
                Log out
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </SignedIn>
        <SignedOut>
          <ClerkLoaded>
            <Button>
              <SignInButton afterSignInUrl="/dashboard" redirectUrl="/dashboard" />
            </Button>
          </ClerkLoaded>

          <ClerkLoading>
            <Button disabled>
              <ReloadIcon className="mr-2 h-4 w-4 animate-spin" />
              Loading...
            </Button>
          </ClerkLoading>
        </SignedOut>

      </div>
    </div>
  );
}

export default HeaderBar;
