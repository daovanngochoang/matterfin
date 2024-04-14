"use client"

import { useState } from "react";
import { PaymentRequestData } from "./state-types";
import { ProgressStatus } from "@/constants/newRequestStatus";
import Contact from "@/lib/model/contact";
import PaymentRequestForm from "./components/payment-request-form";
import { Button } from "@/components/ui/button";
import CreatePaymenRequestProgressBar from "./components/status-bar";






export function PageControl({ contacts }: { contacts: Contact[] }) {


  const [data, setData] = useState<PaymentRequestData>({
    amount: "0",
    notes: "",
    dueDate: undefined,
    files: [],
    selectedContact: undefined,
    displayName: "",
  })
  const [progress, setProgress] = useState<ProgressStatus>(ProgressStatus.create)


  function render() {
    if (progress === ProgressStatus.create) {
      return <PaymentRequestForm contacts={contacts!} formState={data} onNext={function(data: PaymentRequestData): void {
        setData(data)
        setProgress(ProgressStatus.review)
      }} />
    } else if (progress === ProgressStatus.review) {
      return (
        <div>REVIEW <Button onClick={() => setProgress(ProgressStatus.create)}>Back</Button></div>
      )
    } else {
      return (
        <div> COPY LINK</div>
      )
    }

  }

  return (
    <div className="flex ">
      <CreatePaymenRequestProgressBar status={progress} />
      <div className="flex flex-col w-full">
        <div className="flex w-full flex-1 flex-col gap-4 p-4 md:gap-8 md:py-5 md:px-10">
          {
            render()
          }
        </div>
      </div>
    </div>

  )




}






