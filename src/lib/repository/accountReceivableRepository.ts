import AccountReceivable from "@/lib/model/accountReceivable";
import {SupabaseRepository} from "@/lib/repository/repository";
import {RepoResult} from "./result";
import {SupabaseClient} from "@supabase/supabase-js";
import {TableName} from "@/lib/repository/enums";


export class AccountReceivableRepository extends SupabaseRepository<number, AccountReceivable> {
    create(user_id: string, data: AccountReceivable, org_id: string | undefined): Promise<RepoResult<boolean>> {
        throw new Error("Method not implemented.");
    }

    update(id: number, user_id: string, data: AccountReceivable, org_id: string | undefined): Promise<RepoResult<AccountReceivable>> {
        throw new Error("Method not implemented.");
    }

    getAll(org_id: string | undefined): Promise<RepoResult<AccountReceivable[]>> {
        throw new Error("Method not implemented.");
    }

    getByPage(page: number, org_id: string | undefined): Promise<RepoResult<AccountReceivable[]>> {
        throw new Error("Method not implemented.");
    }

    delete(user_id: string, id: number, org_id: string | undefined): Promise<RepoResult<boolean>> {
        throw new Error("Method not implemented.");
    }
    constructor(dbClient: SupabaseClient) {
        super(dbClient, TableName.attachment);
    }


}

