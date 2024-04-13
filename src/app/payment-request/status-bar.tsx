"use client"

import StatusBarData from "@/constants/newRequestStatus";
import Link from "next/link";
import { usePathname } from "next/navigation";

export default function CreatePaymenRequestProgressBar() {
  const pathname = usePathname();

  return (
    <div className=" ml-10 min-w-64 w-72 pt-5 flex flex-col gap-4 min-h-[calc(100vh-56px)] mt-5 ">
      {
        StatusBarData.map((item, index) => {
          return <Link
            key={index}
            href={item.link}
            className={`pl-2 text-sm flex items-center gap-3 rounded-lg px-3 py-2 text-muted-foreground ${pathname === item.link ? "bg-muted text-primary" : ""} transition-all hover:text-primary `}
          >
            <item.icon className="w-4 h-4"/>
            {item.name}
          </Link>
        })
      }
    </div>
  )
}


