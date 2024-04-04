import React from 'react';
import {SignUp} from "@clerk/nextjs";

function SignUpPage() {
    return (
        <>
            <div className="w-screen flex items-center justify-center mt-10">
                <SignUp/>
            </div>
        </>
    );
}

export default SignUpPage;