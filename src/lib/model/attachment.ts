type Attachment = {
  id?: number | undefined | null;
  public_url: string;
  object_id: string;
  object_path: string;
  pr_id: number;
  created_at?: Date | null;
  updated_at?: Date | null;
};

export default Attachment;
