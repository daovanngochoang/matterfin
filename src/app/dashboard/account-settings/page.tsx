import React from 'react';
import ProfileForm from "@/app/dashboard/account-settings/profile-form";
import {Separator} from "@/components/ui/separator";

const AccountSettings = () => {
    return (
        <>
            <div className=" grid grid-cols-5">
                <div className="col-span-3 space-y-6 min-w-[800px]">
                    <div>
                        <h3 className="text-lg font-medium">Profile</h3>
                        <p className="text-sm text-muted-foreground">
                            This is how others will see you on the site.
                        </p>
                    </div>
                    <Separator/>
                    <ProfileForm/>
                </div>
            </div>
        </>
    );
};

export default AccountSettings;

