export type PaymentMethod = {
  id: number;
  method_name: string;
  org_id: number;
  is_active: boolean;
  information?: string;
  created_at?: Date | null;
  updated_at?: Date | null;
};
