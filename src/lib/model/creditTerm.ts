type CreditTerm = {
  id: number;
  org_id: number;
  is_active: boolean;
  terms: string;
  created_at?: Date | null;
  updated_at?: Date | null;
};

export default CreditTerm;
