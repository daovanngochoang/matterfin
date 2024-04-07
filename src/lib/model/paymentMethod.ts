import { PaymentSchedule } from "./enum";

export type PaymentMethod = {
  id?: number;
  method_name?: string;
  org_id?: string;
  is_active?: boolean;
  information?: string;
  schedule?: PaymentSchedule
  created_at?: Date | null;
  updated_at?: Date | null;
};
