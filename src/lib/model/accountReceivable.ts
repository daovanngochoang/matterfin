type AccountReceivable = {
  id: number;
  org_id: number;
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

export default AccountReceivable;
