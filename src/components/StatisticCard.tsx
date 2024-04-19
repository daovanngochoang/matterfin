'use client'

import React from 'react';
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button"
import { useRouter } from 'next/navigation';
import { CREATE_PAYMENT_REQUEST_PATH } from '@/constants/routingPath';
import { formatCurrency } from '@/utils/currencyFormat';

type StatisticCardProps = {
  total: number,
  paid: number,
  overdue: number,
  currency: string,
}


const StatisticCardStyle = {
  moneyStyle: "text-2xl font-medium font-sans",
  contentContainer: "flex flex-col gap-2",
}

function StatisticCard(props: StatisticCardProps) {


  const router = useRouter();
  return (
    <>
      <Card className="flex flex-row min-h-[120px] w-fit justify-between items-center min-w-[800px] px-5 ">
        <div className={StatisticCardStyle.contentContainer}>
          <p className="font-sans">Total</p>
          <p className={StatisticCardStyle.moneyStyle}>
            {`${formatCurrency(props.total)}`}
          </p>
        </div>
        <div className={StatisticCardStyle.contentContainer}>
          <p className='text-green-500 font-sans'>Paid</p>
          <p className={StatisticCardStyle.moneyStyle}>
            {formatCurrency(props.paid)}
          </p>
        </div>
        <div className={StatisticCardStyle.contentContainer}>
          <p className="text-red-500 font-sans">Overdue</p>
          <p className={StatisticCardStyle.moneyStyle}>
            {formatCurrency(props.overdue)}
          </p>
        </div>
        <div className="h-10 w-[1px] bg-gray-500" />
        <Button onClick={() => router.push(CREATE_PAYMENT_REQUEST_PATH)}>+ Create New Checkout Page</Button>

      </Card>
    </>
  );
}

export default StatisticCard;
