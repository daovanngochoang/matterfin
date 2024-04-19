"use client"

import { ColumnDef } from "@tanstack/react-table"
import { PaymentRequest } from "@/lib/model/paymentRequest"
import DataTable from "@/components/DataTable"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { formatCurrency } from "@/utils/currencyFormat"
import { PaymentMethod } from "@/lib/model/paymentMethod"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Button } from "@/components/ui/button"
import { Check, CircleCheckBig, Copy, Edit, Mail, MoreHorizontal, RefreshCwOff, ScanSearch, Send, Trash2 } from "lucide-react"
import { PaymentStatus } from "@/lib/model/enum"
import { Separator } from "@/components/ui/separator"
import { useRouter } from "next/navigation"
import getURL from "@/lib/utils"
import { PAYMENT_REQUEST_PATH } from "@/constants/routingPath"
import { toast } from "@/components/ui/use-toast"
import { Badge } from "@/components/ui/badge"


type DashboardTableType = {
  paymentRequests: PaymentRequest[],
  paymentMethods: PaymentMethod[]
}

export function DashboardTable({ paymentRequests }: DashboardTableType) {
  const router = useRouter()
  const columns: ColumnDef<PaymentRequest>[] = [
    {
      accessorKey: "created_at",
      header: "Created at",
      cell: ({ row }) => {
        return (
          <div className="font-semibold">
            {
              row.original.created_at !== null || row.original.created_at
                ? (new Date(row.original.created_at!)).toDateString().slice(0, -4)
                : ""}
          </div>
        )
      }
    },
    {
      accessorKey: "contact",
      header: "Contact",
      cell: ({ row }) => {
        const contact = row.original.contact!;
        return (<div className="flex items-center gap-2">
          <Avatar>
            <AvatarFallback>{`${contact.firstname.at(0)}${contact.lastname.at(0)}`}</AvatarFallback>
          </Avatar>
          <div>
            <p className="font-semibold">{contact!.firstname}{contact!.lastname} </p>
            <p className="text-sm">{contact.email}</p>
          </div>

        </div>
        )
      }
    }, {
      accessorKey: "amount",
      header: "Amount",
      cell: ({ row }) => {
        return (
          <p className="font-semibold text-sm">{formatCurrency(row.original.amount ?? 0)}</p>
        )
      }
    }, {
      accessorKey: "status",
      header: "Status",
      cell: ({ row }) => {
        const status = row.original.status;
        if (status === PaymentStatus.PAID) {
          return (
            <Badge variant={"outline"} className="bg-green-400">{status}</Badge>
          )
        } else if (status === PaymentStatus.ACTIVE) {
          return <Badge variant={"outline"}>{status}</Badge>
        }
        return (
          <Badge variant={"outline"} className="bg-red-400">{status}</Badge>
        )
      }
    },
    {
      accessorKey: "progress",
      header: "Progress",
      cell: ({ row }) => {
        const pr = row.original;
        return (
          <div>
            {
              pr.is_acknowledged === true
                ? <p className="text-green-600 text-sm">✓ Request acknowledged</p>
                : <p>- Not acknowledge</p>
            }
            {
              pr.payment_method === undefined || pr.payment_method == null
                ? <p>- Method Pending</p>
                : <p className="text-green-600 text-sm">✓ Pay Via {pr.payment_method!.method_name}</p>
            }
            {
              pr.status == PaymentStatus.PAID
                ? <p className="text-green-600 text-sm">✓ Payment received</p>
                : <p>- Payment pending</p>
            }
          </div>
        )
      }
    }, {
      accessorKey: "action",
      header: "Actions",
      cell: ({ row }) => {
        return (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="h-8 w-8 p-0">
                <span className="sr-only">Open menu</span>
                <MoreHorizontal className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="w-[200px]" align="end">
              <DropdownMenuLabel>Actions</DropdownMenuLabel>
              <Separator />
              {
                row.original.status == PaymentStatus.PAID ?
                  <DropdownMenuItem className="flex gap-2 ">
                    <RefreshCwOff className="h-4 w-4" />
                    Mark as not paid
                  </DropdownMenuItem>
                  : <DropdownMenuItem className="flex gap-2 ">
                    <CircleCheckBig className="h-4 w-4" />
                    Mark as Paid
                  </DropdownMenuItem>

              }
              <DropdownMenuItem className="flex gap-2 ">
                <Mail className="h-4 w-4" />
                Resend Email
              </DropdownMenuItem>
              <DropdownMenuItem
                className="flex gap-2"
                onClick={() => {
                  navigator.clipboard.writeText(getURL(`${PAYMENT_REQUEST_PATH}/${row.original.id}`));
                  toast(
                    {
                      title: "Copy URL",
                      description: "URL is copied to clipboard"
                    }
                  )
                }}>
                <Copy className="h-4 w-4" />
                Copy Link
              </DropdownMenuItem>
              <DropdownMenuItem onClick={
                () => {
                  router.push(getURL(`${PAYMENT_REQUEST_PATH}/${row.original.id}`))
                }
              } className="flex gap-2 ">
                <ScanSearch className="h-4 w-4" />
                View Detail
              </DropdownMenuItem>
              <DropdownMenuItem
                onClick={() => {

                }}
                className="flex gap-2 text-red-500"
              >
                <Trash2 className="h-4 w-4" color="#ef4444" />
                Delete
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        )
      }
    }
  ]
  return (
    <div>
      <p className="font-semibold text-xl">Action List</p>
      <DataTable columns={columns} data={paymentRequests} searchColumn={"contact"} />
    </div>
  )
}



