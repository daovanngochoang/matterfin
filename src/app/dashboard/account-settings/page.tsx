import React from 'react';
import UserProfile from './user-profile';
import OrganizationProfile from "@/app/dashboard/account-settings/organization-profile";

const AccountSettings = () => {

    return (
        <>
            <div className=" grid grid-cols-5 mb-16">
                <div className="col-span-3 space-y-6 min-w-[800px]">
                    <UserProfile/>
                    <OrganizationProfile/>
                </div>
            </div>
        </>
    );
};

export default AccountSettings;

