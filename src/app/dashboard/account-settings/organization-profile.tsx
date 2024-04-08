"use client"
import React, { useState } from 'react';
import { isClerkAPIResponseError, useOrganization } from "@clerk/nextjs";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import OrgSwitcher from "@/app/dashboard/account-settings/components/organization/orgSwitcher";
import { OrganizationFormProfile } from "@/app/dashboard/account-settings/components/organization/orgForm";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import DragDropFileSelector from '@/components/DragDropFileSelector';
import { toast } from '@/components/ui/use-toast';
import { ClerkAPIResponseError } from "@clerk/shared";


function OrganizationProfile() {
  const [open, setOpen] = useState<boolean>(false)

  const { organization } = useOrganization()

  const [orgLogo, setOrLogo] = useState<File | null>(null)

  function handleDropEvent(event: React.DragEvent<HTMLDivElement>) {
    event.preventDefault();
    if (event.dataTransfer.files) {
      setOrLogo(event.dataTransfer.files[0]);
      setOpen(false)
    }
  }


  function handleOnChangeEvent(event: React.ChangeEvent<HTMLInputElement>) {
    if (event.target.files) {
      const selectedFile = event.target.files[0];
      setOrLogo(selectedFile);
      setOpen(false)
    }
  }

  async function updateLogo() {
    try {
      await organization?.setLogo({ file: orgLogo })

      toast(
        {
          title: "Update organization profile",
          description: "Organization profile is updated successfully!"
        }
      )
    } catch (e) {

      let message = "Unexpected error"
      if (e instanceof ClerkAPIResponseError) {
        message = (e as ClerkAPIResponseError).errors[0].message
      } else {
        message = (e as Error).message
      }
      toast(
        {
          variant: "destructive",
          title: "Update organization profile",
          description: message
        }
      )
    }
  }


  return (
    <Card>
      <CardHeader>
        <CardTitle>Company Profile</CardTitle>
        <CardDescription>Manage your company information</CardDescription>
        <Separator />
      </CardHeader>
      <CardContent>
        <div className={"space-y-6"}>
          <div className={"flex justify-between items-center"}>
            <div className={"flex items-center gap-5"}>
              <Avatar className='w-16 h-16 border border-gray-200'>
                <AvatarImage src={orgLogo != null ? window.URL.createObjectURL(orgLogo) : organization!.imageUrl} alt="Company Logo" />
                <AvatarFallback>{organization!.name.at(0)}</AvatarFallback>
              </Avatar>
              <div>
                <p className={"text-sm font-semibold"}>{organization!.name}</p>
                <DragDropFileSelector
                  open={open}
                  onOpenChange={setOpen}
                  handleDrop={handleDropEvent}
                  handleSelect={handleOnChangeEvent}
                >
                </DragDropFileSelector>
                {
                  orgLogo == null ?
                    <Button onClick={() => setOpen(true)} variant="link" className="h-5 pl-0">
                      Choose logo
                    </Button>
                    : <div className='flex ga-4'>
                      <Button onClick={async () => {
                        await updateLogo()
                        setOrLogo(null)
                      }} variant="link" className="h-5 pl-0">
                        Update
                      </Button>
                      <Button onClick={() => setOrLogo(null)} variant="link" className="h-5 pl-0 text-destructive">
                        Cancel
                      </Button>

                    </div>

                }
                {/* <Button variant={"link"} className={"pl-0 h-5"}>Update Logo</Button> */}
              </div>
            </div>
            <div>
              <OrgSwitcher />
            </div>
          </div>

          <OrganizationFormProfile />

        </div>
      </CardContent>
    </Card>

  );
}

export default OrganizationProfile;
