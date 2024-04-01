import {SupabaseRepository} from "@/lib/repository/repository";
import {Organization} from "@clerk/backend";
import {SupabaseClient} from "@supabase/supabase-js";
import { RepoResult } from "./result";


class OrganizationRepository extends SupabaseRepository<Organization> {
    create(user_id: string, data: Organization, org_id?: string | undefined): Promise<RepoResult<boolean>> {
        throw new Error("Method not implemented.");
    }
    update(user_id: string, data: Organization, org_id?: string | undefined): Promise<RepoResult<Organization>> {
        throw new Error("Method not implemented.");
    }
    getAll(user_id: string, org_id?: string | undefined): Promise<RepoResult<Organization[]>> {
        throw new Error("Method not implemented.");
    }
    getByPage(user_id: string, page: number, org_id?: string | undefined): Promise<RepoResult<Organization[]>> {
        throw new Error("Method not implemented.");
    }
    delete(user_id: string, id: number, org_id?: string | undefined): Promise<RepoResult<boolean>> {
        throw new Error("Method not implemented.");
    }

}


