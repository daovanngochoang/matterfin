"use server"
import { Card, CardHeader } from "@/components/ui/card";
import { ArrowRight } from "lucide-react";
import PaymentRequestForm from "./payment-request-form";
import { getAllContacts } from "@/lib/actions/contactAction";
import Link from "next/link";
import { GENERAL_CHECKOUT_PATH } from "@/constants/routingPath";
import { auth } from "@clerk/nextjs";


export default async function NewPaymentRequestPage() {


  try {
    const {orgId} = auth()
    const { data, error } = await getAllContacts()

    return (
      <div className="w-[550px] min-h-[calc(100vh-56px)] mt-5 space-y-12 mb-32">
        <div className="flex flex-col gap-12">
          <p className="text-3xl font-bold">Create A Checkout Page</p>
          <Link href={`${GENERAL_CHECKOUT_PATH}/${orgId}`}>
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

        <PaymentRequestForm contacts={data!} />
      </div>
    )
  } catch (e) {
    return <div>
      {(e as Error).message}
    </div>
  }

}


