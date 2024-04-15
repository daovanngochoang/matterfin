import { getActivePaymentMethod } from "@/lib/actions/paymentMethodAction";
import { PaymentSchedule } from "@/lib/model/enum";
import { Separator } from "./ui/separator";
import PaymentMethodCardReadonly from "./PaymentMethodCardReadonly";
import { PaymentMethod } from "@/lib/model/paymentMethod";




export default function AvailablePaymentMethods({ data }: { data: PaymentMethod[] }) {

  let paynow = data.filter((pm) => pm.schedule === PaymentSchedule.NOW).sort((a, b) => a.id! - b.id!)
  let payLater = data.filter((pm) => pm.schedule === PaymentSchedule.LATER).sort((a, b) => a.id! - b.id!)

  return (
    <div className="flex flex-col gap-6">
      <h2 className="text-2xl font-bold tracking-tight">Available payment options</h2>
      <div className="space-y-6">
        <h3 className="flex flex-col gap-2 text-lg font-semibold tracking-tight">
          Direct Payment
          <Separator />
        </h3>
        {
          paynow?.map((data, key) => {
            return <PaymentMethodCardReadonly key={key} method={data} />
          })
        }
      </div>

      <div className="space-y-6">
        <h3 className="flex flex-col gap-2 text-lg font-semibold tracking-tight">
          Pay Later
          <Separator />
        </h3>
        {
          payLater?.map((data, key) => {
            return <PaymentMethodCardReadonly key={key} method={data} />
          })
        }
      </div>
    </div>
  );
}




