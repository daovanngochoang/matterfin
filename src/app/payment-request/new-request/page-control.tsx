"use client"

import { useState } from "react";
import { PaymentRequestData } from "./state-types";
import { ProgressStatus } from "@/constants/newRequestStatus";
import Contact from "@/lib/model/contact";
import PaymentRequestForm from "./components/payment-request-form";
import { Button } from "@/components/ui/button";
import CreatePaymenRequestProgressBar from "./components/status-bar";
import Loading from "../loading";
import { PaymentRequestReview } from "./components/payment-request-review";
import { toast } from "@/components/ui/use-toast";
import { createPaymentRequest } from "@/lib/actions/paymentRequestAction";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { CircleCheck, CopyIcon } from "lucide-react";
import { useRouter, useSearchParams } from "next/navigation";
import { DASHBOARD_PATH, PAYMENT_REQUEST_PATH } from "@/constants/routingPath";
import getURL from "@/lib/utils";
import { formatCurrency } from "@/utils/currencyFormat";



export function PageControl({ contacts }: { contacts: Contact[] }) {

  const searchParams = useSearchParams()
  const contactId = searchParams.get('contact_id')

  const [stateData, setStateData] = useState<PaymentRequestData>({
    amount: "0",
    notes: "",
    dueDate: undefined,
    files: [],
    selectedContact: undefined,
    displayName: "",
    sendMail: false
  })

  if (contactId !== null && stateData.selectedContact === undefined) {
    stateData.selectedContact = contacts.filter((ct) => ct.id! === parseInt(contactId)).at(0)
  }
  const [progress, setProgress] = useState<ProgressStatus>(ProgressStatus.create)
  const [loading, setLoading] = useState<boolean>(false)
  const router = useRouter();
  const [copied, setCopied] = useState(false)

  async function submit(prData: PaymentRequestData) {
    try {
      const formData = new FormData()
      let targetContact: Contact = prData.selectedContact!

      prData.files.forEach((file) => {
        formData.append("files", file)
      })

      formData.append("contact", JSON.stringify(targetContact))
      formData.append("amount", prData.amount)
      formData.append("displayName", prData.displayName)
      formData.append("dueDate", prData.dueDate!.toISOString())
      formData.append("notes", prData.notes)
      formData.append("notify", `${prData.sendMail}`)

      setLoading(true)
      const { error, data } = await createPaymentRequest(formData)
      if (error === undefined) {
        setStateData({ ...stateData, result: data })
        setProgress(ProgressStatus.copyLink)
        toast({
          title: "Success",
          description: "Your payment request is created!",
        })
      } else {
        toast({
          title: "Failed",
          description: error,
          variant: "destructive"
        })
      }

    } catch (e) {
      toast({
        title: "Create Payment Request Failed",
        description: (e as Error).message,
        variant: "destructive"
      })
    }

  }


  function render() {
    if (loading) {
      setTimeout(() => {
        setLoading(false)
      }, 500)
      return (
        <div className="w-full h-full justify-center items-center">
          <Loading />
        </div>
      )
    }

    if (progress === ProgressStatus.create) {
      return <PaymentRequestForm
        contacts={contacts!}
        formState={stateData}
        onNext={
          function(data: PaymentRequestData): void {
            setStateData(data)
            setLoading(true)
            setProgress(ProgressStatus.review)
          }
        } />
    } else if (progress === ProgressStatus.review) {
      return (
        <PaymentRequestReview
          data={stateData}
          onBack={() => setProgress(ProgressStatus.create)}
          onSubmit={
            async () => {
              await submit(stateData)
            }
          } />
        ///* <div>REVIEW <Button onClick={() => setProgress(ProgressStatus.create)}>Back</Button></div> */ }
      )
    } else {
      return (
        <div className="space-y-8">
          <div className="space-y-6">
            <div className="flex flex-col justify-center items-center gap-2">
              <CircleCheck className="w-12 h-12" color="green" />
              <div className="flex flex-col justify-center items-center">
                <p className="text-lg">You’ve emailed a checkout link to {stateData.selectedContact?.firstname ?? ""} {stateData.selectedContact?.lastname ?? ""}</p>
                <p>{stateData.selectedContact?.email}</p>
              </div>
            </div>

            <div>
              <Label>
                Amount
              </Label>
              <Input className="w-2/5" value={formatCurrency(parseInt(stateData.amount))} />
            </div>
            <div className="grid flex-1 gap-2">
              <Label htmlFor="link">
                Copy Link
              </Label>

              <div className="flex items-center space-x-2">
                <Button onClick={() => {
                  navigator.clipboard.writeText(getURL(`${PAYMENT_REQUEST_PATH}/${stateData.result?.id}`))
                  setCopied(true)
                  toast({
                    title: "URL copied",
                    description: "URL is copied to clipboard!"
                  })
                }} type="submit" size="sm" className="px-3">
                  <span className="sr-only">Copy</span>
                  <CopyIcon className="h-4 w-4" />
                </Button>
                <Input
                  id="link"
                  defaultValue={getURL(`${PAYMENT_REQUEST_PATH}/${stateData.result?.id}`)}
                  readOnly
                />
              </div>
              <p className="text-sm text-muted-foreground">Expires on {stateData.dueDate?.toDateString()}</p>
            </div>
          </div>

          <div className="flex flex-col space-y-2 w-full items-center">
            <Button onClick={() => router.push(DASHBOARD_PATH)} className="w-fit">View All Payment Request</Button>
            <Button onClick={() => {
              setProgress(ProgressStatus.create)
              setStateData({
                amount: "0",
                notes: "",
                dueDate: undefined,
                files: [],
                selectedContact: undefined,
                displayName: "",
                sendMail: false
              })
            }} className="w-fit text-muted-foreground" variant={"link"}>Create Another Reqest</Button>
          </div>
        </div>
      )
    }

  }

  return (
    <div className="flex ">
      <CreatePaymenRequestProgressBar status={progress} />
      <div className="flex flex-col w-full">
        <div className="flex w-full flex-1 flex-col gap-4 p-4 md:gap-8 md:py-5 md:px-10">
          <div className="w-[550px] min-h-[calc(100vh-56px)] mt-5 mb-32">
            {
              render()
            }
          </div>
        </div>
      </div>
    </div>

  )




}






