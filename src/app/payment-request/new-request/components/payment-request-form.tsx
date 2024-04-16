"use client"

import Contact from "@/lib/model/contact";
import { UseFormReturn } from "react-hook-form";
import { PRContactDetailForm, PRContactDetailSchemaType } from "./contact-detail";
import { Separator } from "@/components/ui/separator";
import { ChangeEvent, useState } from "react";
import { Input } from "@/components/ui/input";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Button } from "@/components/ui/button";
import { ArrowRight, CalendarIcon, CircleX, CloudUpload, File } from "lucide-react";
import { Calendar } from "@/components/ui/calendar";
import { format } from "date-fns";
import { cn } from "@/lib/utils";
import DisplayNameSelector from "./display-name-selector";
import { useOrganization } from "@clerk/nextjs";
import { OrganizationMetadata } from "@/lib/model/organizationMetadata";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardHeader } from "@/components/ui/card";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog";
import { createPaymentRequest } from "@/lib/actions/paymentRequestAction";
import { toast } from "@/components/ui/use-toast";
import { PaymentRequestData } from "../state-types";
import Link from "next/link";
import { GENERAL_CHECKOUT_PATH } from "@/constants/routingPath";
import { formatCurrency } from "../utils";


type PaymentRequestFormProps = {
  contacts: Contact[],
  formState: PaymentRequestData,
  onNext: (data: PaymentRequestData) => void
}

type PaymentRequestFormErrors = {
  displayName?: string | undefined,
  dueDate?: string | undefined,
  amount?: string | undefined
}

export default function PaymentRequestForm({ contacts, formState, onNext }: PaymentRequestFormProps) {

  const { organization } = useOrganization()

  const displayNameList: string[] = [organization?.name ?? "", (organization?.publicMetadata as OrganizationMetadata).legalName ?? ""].filter((name) => {
    return name !== ""
  })

  const [displayName, setDisplayName] = useState<string>(displayNameList.length > 0 ? displayNameList[0] : "")
  const [amount, setAmount] = useState<string>(formState.amount)
  const [dueDate, setDueDate] = useState<Date | undefined>(formState.dueDate)
  const [selectedContact, setSelectedContact] = useState<Contact | undefined>(formState.selectedContact)
  const [files, setFiles] = useState<File[]>(formState.files)
  const [notes, setNotes] = useState<string>(formState.notes)
  const [errors, setErrors] = useState<PaymentRequestFormErrors>({})
  const [prContactDetailForm, setPrContactDetailForm] = useState<UseFormReturn<PRContactDetailSchemaType>>()
  const [openAlert, setOpenAlert] = useState<boolean>(false)


  function handleAmountChange(event: ChangeEvent<HTMLInputElement>): void {
    let input = event.target.value
    input = input.replace(/\D/g, "")

    // Check if the input is a valid number
    if (!isNaN(parseInt(input))) {
      setAmount(input);
      errors.amount = undefined
      setErrors(errors)
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

  function validate(): boolean {

    if (amount === "0" || amount === "") {
      errors.amount = "Amount cannot be empty"
    }

    if (displayName === "" || displayName === undefined) {
      errors.displayName = "Please select a name to display on the request"
    }

    if (dueDate === undefined) {
      errors.dueDate = "Please select a due date for this payment request"
    }

    setErrors(errors)

    if (selectedContact === undefined && prContactDetailForm === undefined) {
      setOpenAlert(true)
    } else if (prContactDetailForm !== undefined) {

      const { firstName, lastName, email, company, phone } = prContactDetailForm.getValues();

      if (firstName === "") {
        prContactDetailForm.setError("firstName", {
          message: "Please enter the first name",
          type: "required"
        });
      }

      if (lastName === "") {
        prContactDetailForm.setError("lastName", {
          message: "Please enter the last name",
          type: "required"
        });
      }

      if (company === "") {
        prContactDetailForm.setError("company", {
          message: "Please enter the company name",
          type: "required"
        });
      }

      if (phone === "") {
        prContactDetailForm.setError("phone", {
          message: "Please enter the phone number",
          type: "required"
        });
      }

      if (email === "") {
        prContactDetailForm.setError("email", {
          message: "Please enter the email",
          type: "required"
        });
      }
    }

    let requestDetail = amount !== "0" && displayName !== "" && dueDate !== undefined
    let contactDetail = selectedContact !== undefined || (prContactDetailForm?.formState.isValid ?? false)
    return requestDetail && contactDetail
  }


  function getSelectedContact(): Contact {
    let targetContact: Contact
    if (selectedContact !== undefined) {
      targetContact = selectedContact
    } else {
      const { firstName, lastName, email, company, phone } = prContactDetailForm!.getValues();

      targetContact = {
        firstname: firstName,
        lastname: lastName,
        email: email,
        phone: phone,
        company_name: company
      }
    }
    return targetContact
  }



  return (
    <div className="space-y-12 " >
      <div className="flex flex-col gap-12">
        <p className="text-3xl font-bold">Create A Checkout Page</p>
        <Link href={`${GENERAL_CHECKOUT_PATH}/${organization?.id!}`}>
          <Card className="hover:bg-secondary hover:cursor-pointer">
            <CardHeader>
              <div className="flex justify-between items-center">
                <div className="flex gap-2">
                  <p className="font-bold">Send a General Checkout Page?</p>
                  <p>Click here</p>
                </div>
                <ArrowRight className="w-6 h-4" />
              </div>
            </CardHeader>
          </Card>
        </Link>
      </div>

      <div className="space-y-12">
        <AlertDialog open={openAlert} onOpenChange={setOpenAlert}>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Missing Fields?</AlertDialogTitle>
              <AlertDialogDescription>
                Please select a contact or create a new one to send the request
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogAction>Got it!</AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>

        <div className="space-y-8">
          <div className="space-y-2">
            <p className="text-2xl font-semibold">Contact details</p>
            <p className="text-sm">Select an existing contact or create one by entering their name and email below.    </p>
            <Separator />
          </div>
          <PRContactDetailForm
            onChanged={function(contact: Contact | undefined, form: UseFormReturn<PRContactDetailSchemaType>): void {
              if (prContactDetailForm === undefined) setPrContactDetailForm(form);
              setSelectedContact(contact);
            }}
            contacts={contacts} defaultData={formState.selectedContact!} />
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
                <p className={cn("text-sm font-medium", errors.dueDate !== undefined && "text-destructive")}>Due Date</p>
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
                        errors.dueDate = undefined
                        setErrors(errors)
                      }}
                      initialFocus
                    />
                  </PopoverContent>
                </Popover>
                {
                  errors.dueDate !== undefined ?
                    <p className="text-sm text-destructive">{errors.dueDate}</p>
                    : <div> </div>
                }
              </div>
            </div>


            <div className="space-y-2">
              <p className={cn("text-sm font-medium", errors.displayName !== undefined && "text-destructive")}>Name to show on the request</p>
              <DisplayNameSelector
                defaultValue={displayName}
                names={displayNameList}
                onChange={function(name: string): void {
                  setDisplayName(name)
                  errors.dueDate = undefined
                  setErrors(errors)
                }} />
              {
                errors.displayName !== undefined ?
                  <p className={"text-sm text-destructive"}>{errors.displayName}</p>
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
                          <File className="h-8 w-8" />
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


          <div className="w-full flex justify-end">
            <Button
              onClick={() => {
                if (validate()) {
                  let data: PaymentRequestData = {
                      amount: amount,
                      notes: notes,
                      dueDate: dueDate,
                      files: files,
                      selectedContact: getSelectedContact(),
                      displayName: displayName,
                      sendMail: false
                  }
                  onNext(data)
                }
              }}
              className="flex items-center gap-2"
            >
              Next
              <ArrowRight className="w-4" />
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}






