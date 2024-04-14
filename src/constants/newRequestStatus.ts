import { FilePlus, Link, LucideIcon, ScanEye } from "lucide-react";

export enum ProgressStatus {
  create,
  review,
  copyLink
}
type StatusBarItem = {
  name: string,
  status: ProgressStatus,
  icon: LucideIcon
}


export const StatusBarData: Array<StatusBarItem> = [
  {
    name: "Create new checkout page",
    status: ProgressStatus.create,
    icon: FilePlus
  },
  {
    name: "Review",
    status: ProgressStatus.review,
    icon: ScanEye
  },
  {
    name: "Copy Link",
    status: ProgressStatus.copyLink,
    icon: Link
  }
]


