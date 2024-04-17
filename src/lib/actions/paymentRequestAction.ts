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
        error: "Something wrong, please try again!"
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
        console.error(atResult.map(itm => itm.error))
        return {
          error: atResult.map(itm => itm.error).toString()
        }
      // return {
      //   error: "Something wrong, please try again!"
      // }
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
      console.error(prResult.error)
    return {
      error: error
    }
  }

  return {
    data: prResult.data
  }

  } catch (e) {
    console.error(e)
    return {
      error: (e as Error).message
    }
  }
}


export const getPaymentRequests = async () => {

}


export const getPaymentRequestsByID = async (id: number): Promise<ActionResult<PaymentRequest>> => {
  try {
    const pr = await dataRepo.paymentRequestRepo.getByID(id)
    return {
      error: pr.error,
      data: pr.data
    }
  } catch (e) {
    return {
      error: (e as Error).message
    }
  }
}

export const updatePaymentRequest = async (id: number, orgId: string, payReq: PaymentRequest) => {

}

export const deletePaymentRequest = async (id: number,) => {

}

