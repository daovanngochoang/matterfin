"use server"
import { Card, CardHeader } from "@/components/ui/card";
import { ArrowRight } from "lucide-react";
import PaymentRequestForm from "./components/payment-request-form";
import { getAllContacts } from "@/lib/actions/contactAction";
import Link from "next/link";
import { GENERAL_CHECKOUT_PATH } from "@/constants/routingPath";
import { auth } from "@clerk/nextjs";
import { PageControl } from "./page-control";


export default async function NewPaymentRequestPage() {


  try {
    const { data, error } = await getAllContacts()

    return (
      <div className="flex flex-col w-full">
        <div className="flex w-full flex-1 flex-col gap-4 p-4 md:gap-8 md:py-5 md:px-10">
          <PageControl contacts={data ?? []} />
        </div>
      </div>
    )
  } catch (e) {
    return <div>
      {(e as Error).message}
    </div>
  }

}


