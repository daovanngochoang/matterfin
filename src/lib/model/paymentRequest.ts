import Attachment from "./attachment";
import Contact from "./contact";
import { PaymentStatus } from "./enum";
import { PaymentMethod } from "./paymentMethod";

export type PaymentRequest = {
  id?: number;
  org_id?: string | undefined;
  contact_id?: number | null;
  creator_id?: string | null;
  expired_date?: string | null;
  display_name?: string | null;
  payment_method_id?: number | null
  notes?: string;
  is_acknowledged?: boolean;
  status?: PaymentStatus;
  amount?: number;
  attachment?: Attachment[]
  created_at?: Date | null;
  updated_at?: Date | null;
};


