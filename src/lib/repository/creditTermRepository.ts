import {SupabaseRepository} from "@/lib/repository/repository";
import CreditTerm from "@/lib/model/creditTerm";
import {SupabaseClient} from "@supabase/supabase-js";
import {TableName} from "@/lib/repository/enums";
import {RepoResult} from "./result";

class CreditTermRepository extends SupabaseRepository<number, CreditTerm> {
    create(user_id: string, data: CreditTerm, org_id: string | undefined): Promise<RepoResult<boolean>> {
        throw new Error("Method not implemented.");
    }

    update(id: number, user_id: string, data: CreditTerm, org_id: string | undefined): Promise<RepoResult<CreditTerm>> {
        throw new Error("Method not implemented.");
    }

    getAll(org_id: string | undefined): Promise<RepoResult<CreditTerm[]>> {
        throw new Error("Method not implemented.");
    }

    getByPage(page: number, org_id: string | undefined): Promise<RepoResult<CreditTerm[]>> {
        throw new Error("Method not implemented.");
    }

    delete(user_id: string, id: number, org_id: string | undefined): Promise<RepoResult<boolean>> {
        throw new Error("Method not implemented.");
    }


    constructor(dbClient: SupabaseClient) {
        super(dbClient, TableName.creditTerm);
    }


}

