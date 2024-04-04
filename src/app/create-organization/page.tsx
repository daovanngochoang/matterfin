import React from 'react';
import {NewOrganizationForm} from './new-org-form';

//


async function CreateOrganization() {

  return (
    <>
        <div className="flex justify-center items-center h-[calc(100vh - 56px)]">
            <NewOrganizationForm/>
        </div>
    </>
  )

}

export default  CreateOrganization;
