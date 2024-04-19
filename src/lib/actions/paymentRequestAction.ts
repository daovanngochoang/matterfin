'use server'
import { auth } from "@clerk/nextjs"
import Contact from "../model/contact"
import { PaymentRequest } from "../model/paymentRequest"
import dataRepo from "../repository/dataRepo"
import { upLoadPublicFiles } from "./fileUploader"
import { PaymentStatus } from "../model/enum"
import { revalidatePath } from "next/cache"
import { CREATE_PAYMENT_REQUEST_PATH, PAYMENT_REQUEST_PATH } from "@/constants/routingPath"
import getURL from "../utils"
import { sendEmail } from "./mailService"
import { ActionResult } from "./actionResult"

export const createPaymentRequest = async (formData: FormData) => {
  try {

    const { orgId, userId } = auth()

    // create contact if not exist
    const targetContact: Contact = JSON.parse(formData.get("contact")?.toString()!)


    if (targetContact.id === undefined && targetContact.org_id === undefined) {
      const { error, data } = await dataRepo.contactRepo.create(userId!, targetContact, orgId!)
      if (error !== undefined) {
        return {
          error: error
        }
      } else {
        targetContact.id = data!.id
      }
    }

    // upload files
    const files: File[] = formData.getAll("files") as File[]
    let { data, error } = await upLoadPublicFiles(orgId!, files)

    if (error !== undefined) {
      return {
        error: error
      }
    } else {
      let anyError = data?.filter((item) => {
        return item.error !== null
      })

      if (anyError !== undefined && anyError!.length > 0) {
        return {
          error: anyError.map((item) => item.error?.message).toString()
          // error: "Something wrong, please try again!"
        }
      }
    }

    let amount = parseInt(formData.get("amount") as string)
    let dueDate = formData.get("dueDate") as string
    let notes = formData.get("notes") as string
    let displayName = formData.get("displayName") as string

    const paymentRequest: PaymentRequest = {
      contact_id: targetContact.id,
      is_acknowledged: false,
      status: PaymentStatus.ACTIVE,
      amount: amount,
      expired_date: new Date(dueDate).toDateString(),
      notes: notes,
      display_name: displayName,
      org_id: orgId!,
    }


    const prResult = await dataRepo.paymentRequestRepo.create(userId!, paymentRequest, orgId!)

    if (prResult.error === undefined) {
      const atResult = await Promise.all(data!.map(async (item) => {
        return await dataRepo.attachmentRepo.create(userId!, {
          public_url: item.publicUrl!,
          object_id: item.data.id,
          object_path: item.data.fullPath,
          pr_id: prResult.data!.id!
        }, orgId!)
      }))

      if (atResult.filter(item => { return item.error !== undefined }).length > 0) {
        return {
          error: atResult.map(itm => itm.error).toString()
        }
      }
      const notify: boolean = formData.get("notify") == "true"
      if (notify) {
        sendEmail({
          email: targetContact.email,
          name: displayName,
          message: getURL(`${PAYMENT_REQUEST_PATH}/${prResult.data!.id}`),
          subject: "New payment request from " + displayName
        })
      }
    }

    revalidatePath(CREATE_PAYMENT_REQUEST_PATH)
    if (prResult.error !== undefined) {
      return {
        error: error
      }
    }
    return {
      data: prResult.data
    }

  } catch (e) {
    return {
      error: (e as Error).message
    }
  }
}


export const getPaymentRequests = async () => {

  try {
    const { orgId } = auth()
    const { data, error } = await dataRepo.paymentRequestRepo.getAll(orgId!)
    if (error === undefined) {
      return {
        data: data
      }
    }
    return {
      error: error
    }
  } catch (e) {
    return {
      error: (e as Error).message
    }
  }

}


export const getPaymentRequestsByID = async (id: number): Promise<ActionResult<PaymentRequest>> => {
  try {
    const pr = await dataRepo.paymentRequestRepo.getByID(id)

    if (pr.error === undefined) {
      return {
        data: pr.data
      }
    }
    return {
      error: pr.error,
    }
  } catch (e) {
    return {
      error: (e as Error).message
    }
  }
}


export const acknowledgeRequest = async (id: number, orgId: string, paymentMethodId: number) => {
  try {
    const { data, error } = await dataRepo.paymentRequestRepo.update(id, "anonymous", { is_acknowledged: true, payment_method_id: paymentMethodId}, orgId!)
    if (error === undefined) {
      return {
        data: data
      }
    }
    return {
      error: error
    }
  } catch (e) {
    return {
      error: (e as Error).message
    }
  }
}

export const updatePaymentRequest = async (id: number, payReq: PaymentRequest) => {
  try {
    const { userId, orgId } = auth()
    const { data, error } = await dataRepo.paymentRequestRepo.update(id, userId!, payReq, orgId!)
    revalidatePath(`${PAYMENT_REQUEST_PATH}/[id]`)
    if (error === undefined) {
      return {
        data: data!
      }
    }
    return {
      error: error
    }
  } catch (e) {
    return {
      error: (e as Error).message
    }
  }
}

export const deletePaymentRequest = async (id: number,) => {

}

