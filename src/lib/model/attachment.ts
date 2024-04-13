type Attachment = {
  id?: number | undefined;
  url: string;
  name: string;
  pr_id: number;
  created_at?: Date | null;
  updated_at?: Date | null;
};

export default Attachment;
