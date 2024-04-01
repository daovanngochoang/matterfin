export type ActivityLog = {
  id?: number | null;
  created_at: Date | null;
  user_id: string;
  org_id?: string| null;
  activity: string;
};

