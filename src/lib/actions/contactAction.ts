import {ActionResult} from "@/lib/actions/actionResult";
import Contact from "@/lib/model/contact";
import dataRepo from "@/lib/repository/dataRepo";
import {auth} from "@clerk/nextjs";
import {revalidatePath} from "next/cache";
import {CONTACT_BOOK} from "@/constants/routingPath";


export async function getAllContacts(): Promise<ActionResult<Contact[]>> {
    'use server'
    const {userId, orgId} = auth()

    try {
        let result = await dataRepo.contactRepo.getAll(userId!, orgId!);
        return {
            data: result.data
        }
    } catch (e) {
        return {
            error: (e as Error).message
        }
    }
}


export async function createContact(data: Contact): Promise<ActionResult<boolean>> {
    'use server'
        const {userId, orgId} = auth()
        try {
            let result = await dataRepo.contactRepo.create(userId!, data, orgId!)
            revalidatePath(CONTACT_BOOK)
            return {data: result.data}
        } catch (e) {
            return {
                error: (e as Error).message
            }
        }
}

//
// export abstract class IContactAction extends BaseAction<Contact> {
// }
//
// export class ContactAction extends IContactAction {
//
//     constructor(repo: DataRepo) {
//         super(repo);
//     }
//
//     async getAll(): Promise<ActionResult<Contact[]>> {
//         'use server'
//         const {userId, orgId} = auth()
//
//         try {
//             let result = await this.repo.contactRepo.getAll(userId!, orgId!);
//             return {
//                 data: result.data
//             }
//         } catch (e) {
//             return {
//                 error: (e as Error).message
//             }
//         }
//     }
//
//     async create(data: Contact): Promise<ActionResult<boolean>> {
//         'use server'
//         const {userId, orgId} = auth()
//         try {
//             let result = await this.repo.contactRepo.create(userId!, data, orgId!)
//             return {data: result.data}
//         } catch (e) {
//             return {
//                 error: (e as Error).message
//             }
//         }
//     }
//
//     async update(id: number, data: Contact): Promise<ActionResult<Contact>> {
//         'use server'
//
//         throw new Error("Method not implemented.");
//     }
//
//     async getByPage(page: number): Promise<ActionResult<Contact[]>> {
//         'use server'
//
//         throw new Error("Method not implemented.");
//     }
//
//     async delete(id: number): Promise<ActionResult<boolean>> {
//         'use server'
//
//         throw new Error("Method not implemented.");
//     }
// }