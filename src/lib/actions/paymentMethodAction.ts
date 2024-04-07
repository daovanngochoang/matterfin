"use server"
import { auth } from "@clerk/nextjs";
import { PaymentMethod } from "../model/paymentMethod";
import dataRepo from "../repository/dataRepo";
import { ActionResult } from "./actionResult";
import { PaymentMethodName, PaymentSchedule } from "../model/enum";
import { revalidatePath } from "next/cache";
import { PAYMENT_METHOD } from "@/constants/routingPath";


export async function getPaymentMethods(): Promise<ActionResult<PaymentMethod[]>> {

  try {
    let { orgId, userId } = auth()
    let { error, count, status, data } = await dataRepo.paymentRepo.getAll(orgId!)

    if (data!.length === 0) {
      let newData: PaymentMethod = {
        org_id: orgId!,
        is_active: false
      }
      newData.method_name = PaymentMethodName.LOCAL_BANK_TRANSFER
      newData.schedule = PaymentSchedule.NOW
      await dataRepo.paymentRepo.create(userId!, newData, orgId!)

      newData.method_name = PaymentMethodName.INTERNATIONAL_BANK_TRANSFER
      await dataRepo.paymentRepo.create(userId!, newData, orgId!)

      newData.method_name = PaymentMethodName.CARD_PAYMENT
      await dataRepo.paymentRepo.create(userId!, newData, orgId!)

      newData.schedule = PaymentSchedule.LATER
      newData.method_name = PaymentMethodName.CREDIT_TERMS
      await dataRepo.paymentRepo.create(userId!, newData, orgId!)

      let { error, count, status, data } = await dataRepo.paymentRepo.getAll(orgId!)

      revalidatePath(PAYMENT_METHOD)
      if (error === undefined) {
        return {
          data: data,
          count: count
        }
      }

      return {
        error: error
      }
    }
    revalidatePath(PAYMENT_METHOD)
    if (error === undefined) {
      return {
        data: data,
        count: count
      }
    }

    return {
      error: error
    }
  } catch (e) {
    console.log(e)
    return {
      error: (e as Error).message
    }
  }
}

export async function getPaymentMethodByID(pid: number): Promise<ActionResult<PaymentMethod>> {
  try {
    let { orgId } = auth()
    return {}
  } catch (e) {
    return {}
  }
}

export async function updatePaymentMethod(pid: number, method: PaymentMethod) {
  try {
    let { userId, orgId } = auth()

    method.updated_at = new Date(Date.now())
    let { error, data } = await dataRepo.paymentRepo.update(pid, userId!, method, orgId!)
   
    console.log(data)
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

export async function createPaymentMethod(method: PaymentMethod) {
  try {
    let { userId, orgId } = auth()
    let { error, data } = await dataRepo.paymentRepo.create(userId!, method, orgId!)

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








