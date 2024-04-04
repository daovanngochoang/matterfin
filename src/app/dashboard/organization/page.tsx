import React from 'react';
import {OrganizationProfile} from "@clerk/nextjs";

function OrganizationPage() {
    return (
        <>
            <div className="flex w-full h-full flex-grow">
                <OrganizationProfile/>
            </div>
        </>
    )
}

export default OrganizationPage;