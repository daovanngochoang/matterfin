
type Contact = {
  id?: number;
  name?: string;
  firstname: string;
  lastname: string;
  company_name: string;
  email: string;
  phone: string;
  user_id?: string | null;
  org_id?: string | null;
  created_at?: Date | null;
  updated_at?: Date | null;
};

export default Contact;

