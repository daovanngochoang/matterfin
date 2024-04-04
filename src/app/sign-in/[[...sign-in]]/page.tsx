import React from 'react';
import {SignIn} from "@clerk/nextjs";

function Page() {
    return (
        <div className='flex w-screen h-100 justify-center items-center flex-shrink flex-auto mt-10'>
            <SignIn/>
        </div>
    );
}

export default Page;