'use server'
import AvailablePaymentMethods from "@/components/AvailablePaymentMethods";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Card, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { getActivePaymentMethod } from "@/lib/actions/paymentMethodAction";
import { getPaymentRequestsByID } from "@/lib/actions/paymentRequestAction";
import { clerkClient } from "@clerk/nextjs";
import { File } from "lucide-react";
import Link from "next/link";
import { Acknowledge } from "./acknowledge";
import { revalidatePath } from "next/cache";
import { PAYMENT_REQUEST_PATH } from "@/constants/routingPath";
import { formatCurrency } from "@/utils/currencyFormat";




export default async function PaymentCheckoutPage({ params }: { params: { id: number } }) {
  revalidatePath(`${PAYMENT_REQUEST_PATH}/[id]`, "page")
  try {
    const { data, error } = await getPaymentRequestsByID(params.id)

    if (error === undefined) {
      const organization = await clerkClient.organizations.getOrganization({ organizationId: data?.org_id! });
      const creator = await clerkClient.users.getUser(data?.creator_id!)
      const methodsResults = await getActivePaymentMethod({ isActive: true, orgId: data?.org_id })
      return (
        <div className="w-[550px] space-y-6 mb-24">
          <div className="w-full">
            <div className="flex items-center gap-4">
              <Avatar className="w-20 h-20">
                <AvatarImage width={200} height={200} src={organization?.imageUrl} />
                <AvatarFallback>{organization?.name.at(0)}</AvatarFallback>
              </Avatar>

              <div className="text-2xl font-semibold tracking-tight">
                {organization?.name}
              </div>
            </div>
          </div>

          <div className="space-y-2">
            <p className="text-sm text-muted-foreground font-medium">from {`${creator.firstName} ${creator.lastName}`} ({creator.emailAddresses.length > 0 ? creator.emailAddresses[0].emailAddress : ""} {creator.phoneNumbers.length > 0 ? creator.phoneNumbers[0].phoneNumber : ""})</p>
            <h3 className="text-xl font-semibold">
              Please complete this payment to {data?.display_name}
            </h3>
          </div>

          <Card>
            <CardHeader>
              <CardTitle className="text-xl">
                {formatCurrency(data?.amount!)}
              </CardTitle>
              {(new Date(data?.expired_date!)).toDateString()}
            </CardHeader>
          </Card>

          <div>

            {
              data?.attachment !== undefined && data?.attachment.length! > 0 ?
                <div className="space-y-2 mb-6">
                  <p className="text-2xl font-bold">Attachments</p>
                  <Separator />
                </div> : <></>
            }
            <div className="space-y-2">
              {
                data?.attachment !== null || data.attachment !== undefined ?
                  data?.attachment?.map((att, idx) => {
                    return (
                      <Card key={idx}>
                        <div className="m-5 flex items-center justify-between">
                          <div className="flex gap-2 items-center w-3/4">
                            <File className="w-8 h-8" />
                            <p className="truncate text-sm w-[80%]">
                              {att.object_path.split("/").slice(-1)}
                            </p>
                          </div>
                          <Link className="text-primary text-sm font-medium" href={att.public_url} download>Download</Link>
                        </div>
                      </Card>
                    )
                  })
                  : <div></div>
              }
            </div>
          </div>

          <AvailablePaymentMethods data={methodsResults.data!} />
          <Acknowledge paymentMethods={methodsResults.data!} orgId={organization.id} pr={data!} />
        </div>
      )
    }
  } catch (e) {
    return (
      <div>
        Payment is not found or expired
      </div>
    )
  }

}










