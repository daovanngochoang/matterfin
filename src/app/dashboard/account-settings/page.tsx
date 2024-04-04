import React from 'react';
import ProfileForm from "@/app/dashboard/account-settings/profile-form";
import { Separator } from "@/components/ui/separator";
import UserProfile from './user-profile';
const AccountSettings = () => {

  return (
    <>
      <div className=" grid grid-cols-5">
        <div className="col-span-3 space-y-6 min-w-[800px]">
          <UserProfile/>
        </div>
      </div>
    </>
  );
};

export default AccountSettings;

