"use client"

import React, {useState} from 'react';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger
} from "@/components/ui/dropdown-menu";
import {Tooltip, TooltipContent, TooltipProvider, TooltipTrigger} from "@/components/ui/tooltip";
import {ArrowDownUp} from "lucide-react";
import {useOrganizationList} from "@clerk/nextjs";
import {Avatar, AvatarImage} from "@/components/ui/avatar";
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle
} from "@/components/ui/alert-dialog";
import {OrganizationResource} from "@clerk/types";

function OrgSwitcher() {

    const {setActive, organizationList} = useOrganizationList()

    const [openAlert, setOpenAlert] = useState(false)

    const [selectedOrg, setSelectedOrg] = useState<OrganizationResource>()

    return (
        <div>
            <AlertDialog
                open={openAlert} onOpenChange={setOpenAlert}>
                <AlertDialogContent>
                    <AlertDialogHeader>
                        <AlertDialogTitle>Switch Account</AlertDialogTitle>
                        <AlertDialogDescription>
                            Are you sure to switch to { selectedOrg != undefined? selectedOrg!.name: "this organization"}?
                        </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                        <AlertDialogCancel>Cancel</AlertDialogCancel>
                        <AlertDialogAction
                            onClick={() => setActive !== undefined && setActive({organization: selectedOrg})}>
                            Continue</AlertDialogAction>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>
            <DropdownMenu>
                <TooltipProvider>
                    <Tooltip>
                        <TooltipTrigger>
                            <DropdownMenuTrigger asChild>
                                <ArrowDownUp className={"w-5 h-5"}/>
                            </DropdownMenuTrigger>

                        </TooltipTrigger>
                        <TooltipContent>
                            <p>Switch Organization</p>
                        </TooltipContent>
                    </Tooltip>
                </TooltipProvider>

                <DropdownMenuContent>
                    <DropdownMenuLabel>Switch Organization</DropdownMenuLabel>
                    <DropdownMenuSeparator/>
                    {
                        organizationList!.map((org, idx) => {
                            return (<div key={idx}>
                                    <DropdownMenuItem
                                        onClick={() => {
                                            setSelectedOrg(org.organization)
                                            setOpenAlert(true)
                                            console.log(selectedOrg)
                                        }}
                                        className={"flex gap-2 items-center"}
                                    >
                                        <Avatar>
                                            <AvatarImage src={org.organization.imageUrl} alt={"logo"}/>
                                        </Avatar>
                                        {org.organization.name}
                                    </DropdownMenuItem>
                                </div>

                            )
                        })
                    }

                </DropdownMenuContent>
            </DropdownMenu>
        </div>
    );
}

export default OrgSwitcher;