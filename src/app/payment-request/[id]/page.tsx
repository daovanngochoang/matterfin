'use server'
import AvailablePaymentMethods from "@/components/AvailablePaymentMethods";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { getActivePaymentMethod } from "@/lib/actions/paymentMethodAction";
import { getPaymentRequestsByID } from "@/lib/actions/paymentRequestAction";
import { clerkClient, useOrganization } from "@clerk/nextjs";
import { CircleX, File, Lightbulb, Siren } from "lucide-react";
import Link from "next/link";
import { Acknowledge } from "./acknowledge";




export default async function PaymentCheckoutPage({ params }: { params: { id: number } }) {
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
                {data?.amount}
              </CardTitle>
              {(new Date(data?.expired_date!)).toDateString()}
            </CardHeader>
          </Card>

          <div>

            {
              data?.attachment !== undefined && data?.attachment.length! > 0 ?
                <div className="space-y-2 mb-6">
                  <Label>Attachments</Label>
                  <Separator />
                </div> : <></>
            }
            {
              data?.attachment !== null || data.attachment !== undefined ?
                data?.attachment?.map((att, idx) => {
                  console.log(att)
                  return (
                    <Card key={idx}>
                      <div className="m-5 flex items-center justify-between">
                        <div className="flex gap-2 items-center">
                          <File className="w-8 h-8" />
                          <p className="truncate text-sm">
                            {att.object_path.split("/").slice(-1)}
                          </p>
                        </div>
                        <Link href={att.public_url} download={true}>Download</Link>
                      </div>
                    </Card>
                  )
                })
                : <div></div>
            }
          </div>

          <AvailablePaymentMethods data={methodsResults.data!} />
          <Acknowledge paymentMethods={methodsResults.data!} orgId={organization.id} />
        </div>
      )
    }
  } catch (e) {
    return (
      <div>
        {(e as Error).message}
      </div>
    )
  }

}










