"use client"

import Contact from "@/lib/model/contact";
import { UseFormReturn } from "react-hook-form";
import { PRContactDetailForm, PRContactDetailSchemaType } from "./contact-detail";
import { Separator } from "@/components/ui/separator";
import { ChangeEvent, useState } from "react";
import { Input } from "@/components/ui/input";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Button } from "@/components/ui/button";
import { CalendarIcon, CircleX, CloudUpload, File } from "lucide-react";
import { Calendar } from "@/components/ui/calendar";
import { format } from "date-fns";
import { cn } from "@/lib/utils";
import DisplayNameSelector from "./display-name-selector";
import { useOrganization } from "@clerk/nextjs";
import { OrganizationMetadata } from "@/lib/model/organizationMetadata";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardHeader } from "@/components/ui/card";


type PaymentRequestFormProps = {
  contacts: Contact[]
}

type PaymentRequestFormErrors = {
  displayName?: string | undefined,
  dueDate?: string | undefined,
  amount?: string | undefined
}

export default function PaymentRequestForm({ contacts }: PaymentRequestFormProps) {

  const [displayName, setDisplayName] = useState<string>()
  const [amount, setAmount] = useState<string>("0")
  const [dueDate, setDueDate] = useState<Date>()
  const [selectedContact, setSelectedContact] = useState<Contact | undefined>()
  const [files, setFiles] = useState<File[]>([])
  const [notes, setNotes] = useState<string>("")
  const [errors, setErrors] = useState<PaymentRequestFormErrors>({})

  const { organization } = useOrganization()
  const displayNameList: string[] = [organization?.name ?? "", (organization?.publicMetadata as OrganizationMetadata).legalName ?? ""].filter((name) => {
    return name !== ""
  })

  const formatCurrency = (value: number) => {
    // Format the value into currency without fractions
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      maximumFractionDigits: 0, // Set maximum fraction digits to 0
    }).format(value);
  };

  function handleAmountChange(event: ChangeEvent<HTMLInputElement>): void {
    let input = event.target.value
    input = input.replace(/\D/g, "")

    // Check if the input is a valid number
    if (!isNaN(parseInt(input))) {
      setAmount(input);
    } else {
      setAmount("0")
    }
  }


  function handleFiles(fileList: FileList) {
    let selectedFiles: File[] = []
    for (let i = 0; i < fileList.length; i++) {
      if (fileList.item(i) !== null) {
        selectedFiles.push(fileList.item(i)!)
      }
    }

    setFiles([...files, ...selectedFiles])
  }

  function handleDropEvent(event: React.DragEvent<HTMLDivElement>) {
    event.preventDefault();
    if (event.dataTransfer.files) {
      handleFiles(event.dataTransfer.files)
    }
  }


  function handleBrowseSelect(event: React.ChangeEvent<HTMLInputElement>) {
    if (event.target.files) {
      handleFiles(event.target.files)
    }
  }

  function allowDrop(event: React.DragEvent<HTMLDivElement>) {
    event.preventDefault();
  }


  return (
    <div className="space-y-12">
      <div className="space-y-8">
        <div className="space-y-2">
          <p className="text-2xl font-semibold">Contact details</p>
          <p className="text-sm">Select an existing contact or create one by entering their name and email below.    </p>
          <Separator />
        </div>
        <PRContactDetailForm
          onChanged={function(contact: Contact | undefined, form: UseFormReturn<PRContactDetailSchemaType>): void {
            console.log(contact)
          }}
          contacts={contacts} />
      </div>


      <div className="w-full space-y-8">
        <div className="space-y-2">
          <p className="text-2xl font-semibold">Request details</p>
          <p className="text-sm">Enter the amount and due date in the below sections </p>
          <Separator />
        </div>

        <div className="w-full space-y-4">
          <div className="flex gap-4 w-full justify-between">
            <div className="w-full space-y-2">
              <p className="text-sm w-full font-medium">Amount</p>
              <Input
                value={formatCurrency(parseInt(amount))}
                onChange={handleAmountChange}
              />
              {
                errors.amount !== undefined ?
                  <p className={cn("text-sm font-medium", errors.amount !== undefined && "text-destructive")}>{errors.amount}</p>
                  : <div> </div>
              }

            </div>
            <div className="space-y-2">
              <p className="text-sm font-medium">Due Date</p>
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant={"outline"}
                    className={cn(
                      "w-[240px] justify-start text-left font-normal",
                      !dueDate && "text-muted-foreground"
                    )}
                  >
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {dueDate ? format(dueDate, "PPP") : <span>Pick a date</span>}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="start">
                  <Calendar
                    mode="single"
                    selected={dueDate}
                    onSelect={(date) => {
                      setDueDate(date)
                    }}
                    initialFocus
                  />
                </PopoverContent>
              </Popover>
              {
                errors.dueDate !== undefined ?
                  <p className={cn("text-sm font-medium", errors.dueDate !== undefined && "text-destructive")}>{errors.dueDate}</p>
                  : <div> </div>
              }
            </div>
          </div>


          <div className="space-y-2">
            <p className="text-sm font-medium">Name to show on the request</p>
            <DisplayNameSelector names={displayNameList} onChange={function(name: string): void {
              throw new Error("Function not implemented.");
            }} />
            {
              errors.displayName !== undefined ?
                <p className={cn("text-sm font-medium", errors.displayName !== undefined && "text-destructive")}>{errors.displayName}</p>
                : <div> </div>
            }

          </div>
        </div>
      </div>
      <div className="space-y-8">
        <div className="space-y-2">
          <p className="text-2xl font-semibold">Notes / Attachments (Optional)</p>
          <p className="text-sm">These will be visible to the sender via the checkout link.</p>
          <Separator />
        </div>

        <div className="space-y-2">
          <p className="text-sm font-medium">Notes</p>
          <Textarea
            className="h-40"
            onChange={(e) => {
              setNotes(e.target.value)
            }}
          />
        </div>

        <div className="space-y-2">
          <p className="text-sm font-medium">Attachments</p>
          <Card>
            <CardHeader>
              <Card>
                <div onDrop={handleDropEvent} onDragOver={allowDrop}
                  className="w-full h-32 flex justify-center items-center ">
                  <CloudUpload className="w-16 h-16 opacity-60" />
                </div>
              </Card>
              <Input type="file" multiple onChange={handleBrowseSelect} />

            </CardHeader>
          </Card>

          {
            files.map(
              (file, idx) => {
                return (
                  <Card key={idx}>
                    <div className="m-5 flex items-center justify-between">
                      <div className="flex gap-2 items-center">
                        <File w-8 h-8 />
                        <p className="truncate text-sm">
                          {file.name}
                        </p>
                      </div>
                      <Button
                        onClick={() => {
                          setFiles([...files.slice(0, idx), ...files.slice(idx + 1)])
                        }}
                        variant={"ghost"} size={"icon"}>
                        <CircleX className="w-4 h-4" />
                      </Button>
                    </div>
                  </Card>
                )
              }
            )
          }
        </div>
      </div>
    </div>
  )
}






