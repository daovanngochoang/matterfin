import { FilePlus, Link, LucideIcon, ScanEye } from "lucide-react";
import { CREATE_PAYMENT_REQUEST_PATH, PAYMENT_REQUEST_CREATED_PATH, REVIEW_PAYMENT_REQUEST_PATH } from "./routingPath"


type StatusBarItem = {
  name: string,
  link: string,
  icon: LucideIcon
}


const StatusBarData: Array<StatusBarItem> = [
  {
    name: "Create new checkout page",
    link: CREATE_PAYMENT_REQUEST_PATH,
    icon: FilePlus
  },
  {
    name: "Review",
    link: REVIEW_PAYMENT_REQUEST_PATH,
    icon: ScanEye
  },
  {
    name: "Copy Link",
    link: PAYMENT_REQUEST_CREATED_PATH,
    icon: Link
  }
]

export default StatusBarData;

