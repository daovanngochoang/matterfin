import { Button } from '@/components/ui/button';
import { currentUser } from '@clerk/nextjs';
import React from 'react';

const PaymentMethods = async () => {
const user = await currentUser();

  return (
    <>
      <div className='grid grid-cols-5 '>
        <div className='col-span-3 min-w-[800px]'>
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
          <div className='mt-3 border'/>
        </div>

      </div>

    </>
  );
};

export default PaymentMethods;
