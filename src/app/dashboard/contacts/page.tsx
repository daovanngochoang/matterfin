import React from 'react';
import ContactTable from "@/app/dashboard/contacts/components/contact-table";
// import serverActions from "@/lib/serverActions";
import {currentUser} from "@clerk/nextjs";
import {getAllContacts} from "@/lib/actions/contactAction";


const Contacts = async () => {
    const user = await currentUser();
    const {data} = await getAllContacts()

    return (
        <>
            <div className='w-full h-full'>
                <div className='flex flex-col gap-4 min-w-[800px]'>
                    {/* this is the greeting section*/}
                    <div className='flex flex-col gap-2 '>
                        <div className='text-4xl font-bold font-sans'>
                            {`Hi ${user?.firstName} ${user?.lastName}!`}
                        </div>
                        <div className='font-normal'>
                            {/* eslint-disable-next-line react/no-unescaped-entities */}
                            Here's your contact book
                        </div>
                    </div>

                    <ContactTable
                        contacts={data ?? []}
                    />
                </div>
            </div>
        </>
    );
};

export default Contacts;
