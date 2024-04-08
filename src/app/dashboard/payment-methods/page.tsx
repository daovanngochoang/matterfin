
import { Button } from '@/components/ui/button';
import { auth, useOrganization, useUser } from '@clerk/nextjs';
import React from 'react';
import { Separator } from "@/components/ui/separator";
import PaymentMethodCard from "@/app/dashboard/payment-methods/payment-method-card";
import { getPaymentMethods } from '@/lib/actions/paymentMethodAction';
import { currentUser } from '@clerk/nextjs/server';
import { PaymentSchedule } from '@/lib/model/enum';
import { GENERAL_CHECKOUT_PATH } from '@/constants/routingPath';
import { redirect, useRouter } from "next/navigation"
import { PaymentMethodBanner } from './payment-method-banner';


const PaymentMethods = async () => {
  const user = await currentUser();
  const { orgId } = auth()
  const { data } = await getPaymentMethods()
  const paynow = data?.filter((d) => d.schedule! === PaymentSchedule.NOW).sort((a, b) => a.id! - b.id!)
  const paylater = data?.filter((d) => d.schedule === PaymentSchedule.LATER).sort((a, b) => a.id! - b.id!)
  return (
    <>
      <div className='grid grid-cols-5  mb-16'>
        <div className='col-span-3 min-w-[800px] space-y-6'>
          <PaymentMethodBanner />
          <div className='space-y-14 flex flex-col'>
            <div className="space-y-6 mt-10">
              <div>
                <h3 className="text-xl font-bold">
                  Pay now
                </h3>
              </div>
              {
                paynow?.map((value, key) => {
                  return <PaymentMethodCard
                    key={key}
                    method={value}
                  />
                })
              }
              {/* <PaymentMethodCard */}
              {/*   method={ */}
              {/*     { */}
              {/*       id: 1, */}
              {/*       method_name: "Local Bank Transfer", */}
              {/*       org_id: "", */}
              {/*       is_active: false, */}
              {/*       information: "", */}
              {/*     } */}
              {/*   } */}
              {/* /> */}
              {/**/}
              {/* <PaymentMethodCard */}
              {/*   method={ */}
              {/*     { */}
              {/*       id: 1, */}
              {/*       method_name: "International Bank Transfer", */}
              {/*       org_id: "", */}
              {/*       is_active: false, */}
              {/*       information: "", */}
              {/*     } */}
              {/*   } */}
              {/* /> */}
              {/* <PaymentMethodCard */}
              {/*   method={ */}
              {/*     { */}
              {/*       id: 1, */}
              {/*       method_name: "Card Payment", */}
              {/*       org_id: "", */}
              {/*       is_active: false, */}
              {/*       information: "", */}
              {/*     } */}
              {/*   } */}
              {/* /> */}
            </div>

            <div className={"space-y-6"}>
              <div>
                <h3 className="text-xl font-bold">
                  Pay later
                </h3>
              </div>
              {
                paylater?.map((value, key) => {
                  return <PaymentMethodCard key={key} method={value} />
                })
              }
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default PaymentMethods;
