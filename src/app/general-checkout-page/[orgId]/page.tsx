import { getActivePaymentMethod } from "@/lib/actions/paymentMethodAction";
import { Separator } from "@/components/ui/separator"
import { PaymentSchedule } from "@/lib/model/enum";
import PaymentMethodCardReadonly from "./payment-method";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { clerkClient } from "@clerk/nextjs";


export default async function GeneralCheckoutPage({ params }: { params: { orgId: string } }) {

  let organization = await clerkClient.organizations.getOrganization({ organizationId: params.orgId! })
  let data = await getActivePaymentMethod({ isActive: true, orgId: params.orgId });
  let paynow = data.data?.filter((pm) => pm.schedule === PaymentSchedule.NOW).sort((a, b) => a.id! - b.id!)
  let payLater = data.data?.filter((pm) => pm.schedule === PaymentSchedule.LATER).sort((a, b) => a.id! - b.id!)

  return <>
    <div className="flex justify-center  w-full h-screen mt-20">

      <div className="w-[750px] space-y-8">
        <div className="flex items-center gap-8">
          <Avatar className="w-24 h-24">
            <AvatarImage width={200} height={200} src={organization?.imageUrl} />
            <AvatarFallback>{organization?.name.at(0)}</AvatarFallback>
          </Avatar>

          <div className="text-xl font-semibold tracking-tight">
            {organization?.name}
          </div>

        </div>


        <div className="flex flex-col gap-8">
          <h2 className="text-xl font-bold tracking-tight">Available payment options</h2>
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

          <Button className="mb-40 w-32">Request service</Button>
        </div>
      </div>
    </div>
  </>
}




