'use client'
import React from 'react';
import Link from "next/link";
import SideBarData from "@/constants/sideBarData";
import {usePathname} from "next/navigation";


function SideBar() {

  const pathname = usePathname();

  return (

    <div className="border-r min-h-[calc(100vh-56px)] pl-8 pr-4 min-w-64 w-72 pt-5 flex flex-col gap-4 h-auto">
      {/*<div className="mx-auto grid w-full max-w-6xl gap-2">*/}
      {/*  <h1 className="text-3xl font-semibold">My Dashboard</h1>*/}
      {/*</div>*/}
      <div className="flex-1 ">
        <nav className="grid items-start text-sm font-medium ">
          {
            SideBarData.map(
              (data, key) => {
                return <Link
                  key={key}
                  href={data.link}
                  className={`pl-2 flex items-center gap-3 rounded-lg px-3 py-2 text-muted-foreground ${pathname === data.link ? "bg-muted text-primary" : ""} transition-all hover:text-primary `}
                >
                  <data.icon className="h-4 w-4" />
                  {data.name}
                </Link>
              }
            )
          }
        </nav>
      </div>
    </div>
  );

}

export default SideBar;
