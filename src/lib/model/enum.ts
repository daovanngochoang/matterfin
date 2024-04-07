
// Account Receivable Status.
export enum PaymentStatus {
  ACTIVE = 'ACTIVE',
  OVERDUE = 'OVERDUE',
  PAID = 'PAID',
}

export enum PaymentMethodName {
  LOCAL_BANK_TRANSFER = "Local Bank Transfer", 
  INTERNATIONAL_BANK_TRANSFER = "International Bank Transfer", 
  CARD_PAYMENT = "Card Payment", 
  CREDIT_TERMS = "Credit Terms", 
}

export enum PaymentRequestType {
  PAYMENT_REQUEST = "PAYMENT_REQUEST",
  GENERAL = "GENERAL"
}

export enum PaymentSchedule {
  NOW = "NOW",
  LATER = "LATER"
}
