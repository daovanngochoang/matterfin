import {ACCOUNT_SETTING, DASHBOARD_PATH, CONTACT_BOOK, PAYMENT_METHOD, ORGANIZATION_PATH} from "./routingPath";
import {Building2, Contact, LayoutDashboard, LucideIcon, Settings, WalletCards} from "lucide-react"


type SideBarItem = {
    link: string,
    name: string,
    icon: LucideIcon
}


const SideBarData: Array<SideBarItem> = [
    {
        link: DASHBOARD_PATH,
        name: "Action Board",
        icon: LayoutDashboard
    },
    {
        name: "Contact Book",
        link: CONTACT_BOOK,
        icon: Contact,
    },
    {
        name: "Payment Methods",
        link: PAYMENT_METHOD,
        icon: WalletCards,
    },
    {
        name: "Account & Settings",
        link: ACCOUNT_SETTING,
        icon: Settings
    },
    {
        name: "Organization",
        link: ORGANIZATION_PATH,
        icon: Building2
    }
]

export default SideBarData;

