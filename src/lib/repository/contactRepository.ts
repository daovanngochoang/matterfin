import {Repository, SupabaseRepository} from "@/lib/repository/repository";
import Contact from "@/lib/model/contact";
import {TableName} from "@/lib/repository/enums";
import {SupabaseClient} from "@supabase/supabase-js";
import {RepoResult} from "@/lib/repository/result";


export interface IContactRepository extends Repository<Contact> {
    createMany(contacts: Contact[]): Promise<RepoResult<boolean>>;
}

export class ContactRepository extends SupabaseRepository<Contact> implements IContactRepository {

    constructor(dbClient: SupabaseClient) {
        super(dbClient, TableName.contact);
    }

    createMany(contacts: Contact[]): Promise<RepoResult<boolean>> {
        throw new Error("Method not implemented.");
    }

    async create(user_id: string, data: Contact, org_id?: string | undefined): Promise<RepoResult<boolean>> {
        try {
            data.user_id = user_id;
            data.org_id = org_id
            const {error} = await this.dbClient.from(this.table).insert(data);
            if (error !== null) {
                return {error: error.message}
            }
            return {data: true};
        } catch (error) {
            return {error: (error as Error).message};
        }
    }

    update(user_id: string, data: Contact, org_id?: string | undefined): Promise<RepoResult<Contact>> {
        throw new Error("Method not implemented.");
    }

    async getAll(user_id: string, org_id?: string | undefined): Promise<RepoResult<Contact[]>> {
        try {
            let {error, data, status, count} = await this.dbClient.from(this.table).select("*").eq("user_id", user_id)
            let result: Contact[] = []
            // if error
            if (error !== null) {
                return {error: error.message}
            }

            // if has data
            if (data != null) {

                result = data
                    .map(item => {
                        item.name = `${item.firstname} ${item.lastname}`
                        return item;
                    })

                if (org_id !== undefined) {
                    result = result.filter(item => {
                        return item.org_id == org_id;
                    })
                }

            }
            return {
                data: result,
                count: count != null ? count : undefined,
            }
                ;
        } catch (e) {
            return {error: (e as Error).message};
        }

    }

    getByPage(user_id: string, page: number, org_id?: string | undefined): Promise<RepoResult<Contact[]>> {
        throw new Error("Method not implemented.");
    }

    delete(user_id: string, id: number, org_id?: string | undefined): Promise<RepoResult<boolean>> {
        throw new Error("Method not implemented.");
    }


}
