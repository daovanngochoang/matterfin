"use client"
import React from 'react';
import {useOrganization} from "@clerk/nextjs";
import {Avatar, AvatarFallback, AvatarImage} from "@/components/ui/avatar";
import {Button} from "@/components/ui/button";
import OrgSwitcher from "@/app/dashboard/account-settings/components/organization/orgSwitcher";
import {OrganizationFormProfile} from "@/app/dashboard/account-settings/components/organization/orgForm";
import {Card, CardContent, CardDescription, CardHeader, CardTitle} from "@/components/ui/card";
import {Separator} from "@/components/ui/separator";


function OrganizationProfile() {

    const {organization} = useOrganization()

    return (
        <Card>
            <CardHeader>
                <CardTitle>Company Profile</CardTitle>
                <CardDescription>Manage your account information</CardDescription>
                <Separator/>
            </CardHeader>
            <CardContent>
                <div className={"space-y-6"}>
                    <div className={"flex justify-between items-center"}>
                        <div className={"flex items-center gap-5"}>
                            <Avatar className='w-16 h-16 border border-gray-200'>
                                <AvatarImage src={organization!.imageUrl} alt="Company Logo"/>
                                <AvatarFallback>{organization!.name.at(0)}</AvatarFallback>
                            </Avatar>
                            <div>
                                <p className={"text-sm font-semibold"}>{organization!.name}</p>
                                <Button variant={"link"} className={"pl-0 h-5"}>Update Logo</Button>
                            </div>
                        </div>
                        <div>
                            <OrgSwitcher/>
                        </div>
                    </div>

                    <OrganizationFormProfile/>

                </div>
            </CardContent>
        </Card>

    );
}

export default OrganizationProfile;
