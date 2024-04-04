"use client"

import {Button} from '@/components/ui/button';
import {useUser} from '@clerk/nextjs';
import React from 'react';
import {Separator} from "@/components/ui/separator";
import PaymentMethodCard from "@/app/dashboard/payment-methods/payment-method-card";


const PaymentMethods = () => {
    // const user = await currentUser();
    const {user} = useUser()

    return (
        <>
            <div className='grid grid-cols-5 '>
                <div className='col-span-3 min-w-[800px] space-y-6'>
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
                        <Button>
                            General Checkout Page
                        </Button>
                    </div>
                    <Separator className="mt-3"/>
                    <div className="space-y-6">
                        <div>
                            <h3 className="text-xl font-bold">
                                Pay now
                            </h3>
                        </div>
                        <PaymentMethodCard
                            disabled={true}
                            method={
                                {
                                    id: 1,
                                    method_name: "Local Bank Transfer",
                                    org_id: "",
                                    is_active: false,
                                    information: "",
                                }
                            }
                            activate={(method) => {console.log(method)}}
                            edit={(method) => {console.log(method)}}
                        />

                        <PaymentMethodCard
                            disabled={true}
                            method={
                                {
                                    id: 1,
                                    method_name: "International Bank Transfer",
                                    org_id: "",
                                    is_active: false,
                                    information: "",
                                }
                            }
                            activate={(method) => {console.log(method)}}
                            edit={(method) => {console.log(method)}}
                        />
                        <PaymentMethodCard
                            disabled={true}
                            method={
                                {
                                    id: 1,
                                    method_name: "Card Payment",
                                    org_id: "",
                                    is_active: false,
                                    information: "",
                                }
                            }
                            activate={(method) => {console.log(method)}}
                            edit={(method) => {console.log(method)}}
                        />

                    </div>


                </div>

            </div>

        </>
    );
};

export default PaymentMethods;
