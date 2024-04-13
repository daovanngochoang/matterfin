import Contact from "./contact";
import { PaymentStatus } from "./enum";
import { PaymentMethod } from "./paymentMethod";

export type PaymentRequest = {
  id: number;
  org_id?: string | undefined;
  contact_id?: number | null;
  payment_method_id?: number | null;
  expired_date?: Date | null;
  note?: string;
  is_acknowledged: boolean;
  status: PaymentStatus;
  amount: number;
  created_at?: Date | null;
  updated_at?: Date | null;
};


export type PaymentRequestDto = {
  id: number;
  org_id: string;
  contact: Contact | null;
  payment_method?: PaymentMethod | null;
  expired_date?: Date | null;
  note?: string;
  is_acknowledged: boolean;
  status: PaymentStatus;
  amount: number;
  created_at?: Date | null;
  updated_at?: Date | null;
}


