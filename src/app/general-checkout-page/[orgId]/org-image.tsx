'use client'

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { useOrganization } from "@clerk/nextjs"




export function OrgInformation() {

  const { organization } = useOrganization()

  return (
    <div className="flex items-center gap-8">
      <Avatar className="w-24 h-24">
        <AvatarImage width={200} height={200} src={organization?.imageUrl} />
        <AvatarFallback>{organization?.name.at(0)}</AvatarFallback>
      </Avatar>

      <div className="text-xl font-semibold tracking-tight">
        {organization?.name}
      </div>

    </div>
  )
}





