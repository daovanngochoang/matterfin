'use server'
import { ACCOUNT_SETTING, CREATE_ORGANIZATION_PATH } from "@/constants/routingPath";
import { auth, clerkClient } from "@clerk/nextjs/server";
import { revalidatePath } from "next/cache";
import { ActionResult } from "./actionResult";
import { OrganizationMetadata } from "@/lib/model/organizationMetadata";
import { ClerkAPIResponseError } from "@clerk/shared";

const orgDB = clerkClient.organizations;

export async function createOrgAction(formData: FormData): Promise<ActionResult<boolean>> {
  try {

    const { userId } = auth()

    let name = formData.get("orgName")!.toString()
    let slug = formData.get("slug") != null && formData.get("slug") != "" ? formData.get("slug")!.toString() : undefined

    let result = await clerkClient.organizations.createOrganization({
      name: name,
      createdBy: userId!,
      slug: slug
    })
    let file = formData.get("file")

    if (file != null && file != undefined) {
      await orgDB.updateOrganizationLogo(result.id!, {
        file: file as File,
        uploaderUserId: userId!
      })
    }
    revalidatePath(CREATE_ORGANIZATION_PATH)

    return {
      data: true
    }
  } catch (e) {
    return {
      error: (e as Error).message
    }
  }
}


export async function uploadOrgLogo(file: File) {
  try {
    const { orgId, userId } = auth()
    await orgDB.updateOrganizationLogo(orgId!, {
      file: file,
      uploaderUserId: userId!
    })

  } catch (e) {
    return {
      error: (e as Error).message
    }
  }
}


export async function updateOrgMetadata(data: OrganizationMetadata): Promise<ActionResult<boolean>> {
  try {
    const orgMeta: OrganizationMetadata = {
      companyAddress: data.companyAddress ?? undefined,
      companyEmail: data.companyEmail ?? undefined,
      companyPhone: data.companyPhone ?? undefined,
      legalName: data.legalName ?? undefined,
      mailingAddress: data.mailingAddress ?? undefined
    }
    const { orgId } = auth()
    await orgDB.updateOrganizationMetadata(orgId!, {
      publicMetadata: orgMeta
    })
    revalidatePath(ACCOUNT_SETTING)
    return { data: true }
  } catch (e) {
    return {
      error: (e as ClerkAPIResponseError).errors[0].message
    }
  }
}



