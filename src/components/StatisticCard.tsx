import React from 'react';
import {Card} from "@/components/ui/card";
import {Button} from "@/components/ui/button"

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

    const currencyFormatter = Intl.NumberFormat('en-US', {
        style: 'currency',
        currency: props.currency,
    });


    return (
        <>
            <Card className="flex flex-row h-[120px] justify-between items-center w-[800px] px-5 ">
                <div className={StatisticCardStyle.contentContainer}>
                    <p className="font-sans">Total</p>
                    <p className={StatisticCardStyle.moneyStyle}>
                        {`${currencyFormatter.format(props.total)}`}
                    </p>
                </div>

                <div className={StatisticCardStyle.contentContainer}>
                    <p className='text-green-500 font-sans'>Paid</p>
                    <p className={StatisticCardStyle.moneyStyle}>
                        {currencyFormatter.format(props.paid)}
                    </p>
                </div>

                <div className={StatisticCardStyle.contentContainer}>
                    <p className="text-red-500 font-sans">Overdue</p>
                    <p className={StatisticCardStyle.moneyStyle}>
                        {currencyFormatter.format(props.overdue)}
                    </p>
                </div>

                <div className="h-10 w-[1px] bg-gray-500"/>
                <Button>+ Create New Checkout Page</Button>

            </Card>
        </>
    );
}

export default StatisticCard;
