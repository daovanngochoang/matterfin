"use client"
import { Button } from "@/components/ui/button"
import { PaymentRequestData } from "../state-types"
import { ArrowLeft } from "lucide-react";
import { formatCurrency } from "@/utils/currencyFormat";
import { Input } from "@/components/ui/input";
import AvailablePaymentMethods from "@/components/AvailablePaymentMethods";
import { useOrganization } from "@clerk/nextjs";
import { useEffect, useState } from "react";
import { PaymentMethod } from "@/lib/model/paymentMethod";
import { getActivePaymentMethod } from "@/lib/actions/paymentMethodAction";
import Loading from "@/app/loading";
import { Checkbox } from "@/components/ui/checkbox"
import { Label } from "@/components/ui/label"



type PaymentRequestReviewProps = {
  data: PaymentRequestData,
  onBack: () => void;
  onSubmit: () => Promise<void>
}

export function PaymentRequestReview({ data, onBack, onSubmit }: PaymentRequestReviewProps) {

  const { organization } = useOrganization()
  const [paymentMethods, setPaymentMethods] = useState<PaymentMethod[] | undefined>()
  useEffect(() => {
    getActivePaymentMethod({ isActive: true, orgId: organization!.id }).then(value => {
      setPaymentMethods(value.data ?? [])
    })
  })

  if (paymentMethods === undefined) {
    return <Loading />
  }

  return (
    <div className="w-full space-y-10">
      <h2 className="text-3xl font-bold">Payment Request Review</h2>
      <div className="space-y-4">
        <p className="text-3xl font-medium">{formatCurrency(parseInt(data.amount))}</p>
        <div className="text-sm">
          <p>To</p>
          <p>{data.selectedContact?.firstname} {data.selectedContact?.lastname}</p>
          <p>{data.selectedContact?.company_name}</p>
          <p>{data.selectedContact?.email}</p>
          <p>{data.selectedContact?.phone}</p>
        </div>

        <div className="space-y-2">
          <p className="text-sm font-medium">Due Date</p>
          <Input className="w-1/2" readOnly={true} value={data.dueDate?.toDateString()} />
        </div>
      </div>

      <AvailablePaymentMethods data={paymentMethods} />
      <div className="flex items-center space-x-2">
        <Checkbox onCheckedChange={(checked) => {
          data.sendMail = true
        }} id="terms" />
        <Label htmlFor="terms" className="font-normal flex gap-1">Send email to <p className="font-medium">{data.selectedContact?.email}</p></Label>
      </div>

      <div className="flex gap-4 w-full">
        <Button
          variant={"outline"}
          onClick={onBack}
          className="flex gap-2"
        >
          <ArrowLeft className="w-4 h-4" />
          Back
        </Button>
        <Button
          onClick={onSubmit}
        >
          Create Request
        </Button>
      </div>
    </div>
  )
}




