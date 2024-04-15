import AvailablePaymentMethods from "@/components/AvailablePaymentMethods";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { GENERAL_CHECKOUT_PATH } from "@/constants/routingPath";
import { getActivePaymentMethod } from "@/lib/actions/paymentMethodAction";
import { clerkClient } from "@clerk/nextjs";
import { revalidatePath } from "next/cache";


export default async function GeneralCheckoutPage({ params }: { params: { orgId: string } }) {
  revalidatePath(GENERAL_CHECKOUT_PATH)
  let organization = await clerkClient.organizations.getOrganization({ organizationId: params.orgId! })
  let data = await getActivePaymentMethod({ isActive: true, orgId: organization.id });

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
        <AvailablePaymentMethods  data={data.data!} />
      </div>
    </div>
  </>
}




