'use server'
import { ActionResult } from "@/lib/actions/actionResult";
import Contact from "@/lib/model/contact";
import dataRepo from "@/lib/repository/dataRepo";
import { auth } from "@clerk/nextjs";
import { revalidatePath } from "next/cache";
import { CONTACT_BOOK } from "@/constants/routingPath";


export async function getAllContacts(): Promise<ActionResult<Contact[]>> {
  const { userId, orgId } = auth()
  try {
    let result = await dataRepo.contactRepo.getAll(orgId!);
    return {
      data: result.data
    }
  } catch (e) {
    return {
      error: (e as Error).message
    }
  }
}


export async function createContact(data: Contact): Promise<ActionResult<boolean>> {
  const { userId, orgId } = auth()
  try {
    let result = await dataRepo.contactRepo.create(userId!, data, orgId!)
    console.log(result)
    revalidatePath(CONTACT_BOOK)
    return { data: result.data }
  } catch (e) {
    return {
      error: (e as Error).message
    }
  }
}

export async function updateContact(id: number, data: Contact): Promise<ActionResult<Contact>> {
  try {
    const { userId, orgId } = auth()
    let result = await dataRepo.contactRepo.update(id, userId!, data, orgId!);
    revalidatePath(CONTACT_BOOK)
    if (result.error === undefined) {
      return {
        data: result.data
      }
    }
    return { error: result.error }

  } catch (e) {
    return { error: (e as Error).message }
  }
}

export async function deleteContact(id: number): Promise<ActionResult<boolean>> {
  try {
    const { userId, orgId } = auth()
    const { error, data, status } = await dataRepo.contactRepo.delete(userId!, id, orgId!)

    revalidatePath(CONTACT_BOOK)

    if (error === undefined) {
      return { data: data }
    } else {
      return { error }
    }

  } catch (e) {
    return { error: (e as Error).message }
  }
}














