import Contact from "@/lib/model/contact"
import { PaymentRequest } from "@/lib/model/paymentRequest"


export type PaymentRequestData = {
  amount: string,
  notes: string,
  dueDate: Date | undefined,
  files: File[],
  selectedContact: Contact | undefined,
  displayName: string,
  result?: PaymentRequest | undefined,
  sendMail: boolean
}


