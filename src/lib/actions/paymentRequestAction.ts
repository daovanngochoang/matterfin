'use server'
import { auth } from "@clerk/nextjs"
import Contact from "../model/contact"
import { PaymentRequest } from "../model/paymentRequest"
import dataRepo from "../repository/dataRepo"
import { List } from "postcss/lib/list"
import { upLoadPublicFiles } from "../fileUploader"

export const createPaymentRequest = async (formData: FormData) => {
  try {

    const { orgId, userId } = auth()

    const targetContact: Contact = JSON.parse(formData.get("contact")?.toString()!)
    if (targetContact.id === undefined && targetContact.org_id === undefined) {
      const { error } = await dataRepo.contactRepo.create(userId!, targetContact, orgId!)
      if (error !== undefined) {
        return {
          error: error
        }
      }
    }

    const files: File[] = formData.getAll("files") as File[]
    let { data, error } = await upLoadPublicFiles(orgId!, files)

    if (error !== undefined) {
      return {
        error: error
      }
    } else {
      let anyError = data?.filter((item) => {
        return item.error !== undefined
      })

      if (anyError !== undefined && anyError!.length > 0) {
        return {
          error: "Something wrong, please try again!"
        }
      }
    }

    const paymentRequest: PaymentRequest = {
      
    }

  } catch (e) {
    console.log(e)
  }
}


export const getPaymentRequests = async () => {

}


export const getPaymentRequestsByID = async (id: number, orgId: string) => {

}

export const updatePaymentRequest = async (id: number, orgId: string, payReq: PaymentRequest) => {

}

export const deletePaymentRequest = async (id: number,) => {

}

