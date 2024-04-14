
"use client"

import { Command, CommandGroup, CommandItem, CommandList } from "@/components/ui/command";
import { StatusBarData, ProgressStatus } from "@/constants/newRequestStatus";
export default function CreatePaymenRequestProgressBar({ status }: { status: ProgressStatus }) {
  return (
    <div className=" ml-10 min-w-64 w-72 pt-5 flex flex-col gap-4 min-h-[calc(100vh-56px)] mt-5 ">
      {
        StatusBarData.map((item, index) => {
          return <div
            key={index}
            className={`pl-2 text-sm flex items-center gap-3 rounded-lg px-3 py-2 text-muted-foreground ${status == item.status ? "bg-muted text-primary" : ""} `}
          >
            <item.icon className="w-4 h-4" />
            {item.name}
          </div>
        })
      }
    </div>
  )
}

