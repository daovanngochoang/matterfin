import React from 'react';
import {auth, UserProfile} from "@clerk/nextjs";

function Page() {
    const {user} = auth()
    return (
        <>
            <UserProfile/>
        </>
    );
}

export default Page;