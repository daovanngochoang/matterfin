'use client'

import { ACCOUNT_SETTING, CREATE_ORGANIZATION_PATH } from "@/constants/routingPath"
import { useAuth, useOrganizationList } from "@clerk/nextjs"
import { useRouter } from "next/router"
import { useEffect } from "react"
import {redirect} from "next/navigation";

export default function SyncOrganization({ memberships }: CustomJwtSessionClaims) {


  //get user session
  const { setActive, isLoaded } = useOrganizationList()

  const { orgId } = useAuth()

  // if there is an Organization then select the first org in the list.
  const firstOrgId = Object.keys(memberships ?? {})?.[0]

  useEffect( () => {
    if (!isLoaded) return;

    //check whether the user has any active Organization or not
    if (!orgId) {

      //if not => set first org in the list
      if (firstOrgId) {

        // then set active org to the first org in the list in case user has no active orgID.
        void setActive({ organization: firstOrgId })
      }
      // else {
      //   //if there is no org memberships => force to create a Organization.
      //   redirect(CREATE_ORGANIZATION_PATH)
      // }
    }
  }, [setActive, isLoaded, orgId, firstOrgId]
  )


  return (<></>)
}
