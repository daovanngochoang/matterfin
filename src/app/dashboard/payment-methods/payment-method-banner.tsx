
'use client'
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { GENERAL_CHECKOUT_PATH } from "@/constants/routingPath";
import { useOrganization, useUser } from "@clerk/nextjs";
import { useRouter } from "next/navigation";


export function PaymentMethodBanner() {

  const router = useRouter()
  const { user } = useUser()
  const { organization } = useOrganization()

  return (
    <div>
      <div className='flex items-center justify-between '>
        {/* this is the greeting section*/}
        <div className='flex flex-col gap-2 '>
          <div className='text-4xl font-bold font-sans'>
            {`Hi ${user?.firstName} ${user?.lastName}!`}
          </div>
          <div className='font-normal'>
            Here are your setting for payment method
          </div>
        </div>
        <Button onClick={() => {
          router.push(`${GENERAL_CHECKOUT_PATH}/${organization?.id}`)
        }}>
          General Checkout Page
        </Button>
      </div>
      <Separator className="mt-3" />
    </div>
  )
}


