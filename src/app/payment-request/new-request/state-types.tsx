import Contact from "@/lib/model/contact"


export type PaymentRequestData = {
  amount: string,
  notes: string,
  dueDate: Date | undefined,
  files: File[],
  selectedContact: Contact | undefined,
  displayName: string
}


