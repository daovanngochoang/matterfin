import {SupabaseRepository} from "@/lib/repository/repository";
import {User} from "@clerk/backend";
import {SupabaseClient} from "@supabase/supabase-js";
import {TableName} from "@/lib/repository/enums";
import {RepoResult} from "./result";


class UserRepository extends SupabaseRepository<string, User> {
    create(user_id: string, data: User, org_id: string | undefined): Promise<RepoResult<boolean>> {
        throw new Error("Method not implemented.");
    }

    update(id: string, user_id: string, data: User, org_id: string | undefined): Promise<RepoResult<User>> {
        throw new Error("Method not implemented.");
    }

    getAll(org_id: string | undefined): Promise<RepoResult<User[]>> {
        throw new Error("Method not implemented.");
    }

    getByPage(page: number, org_id: string | undefined): Promise<RepoResult<User[]>> {
        throw new Error("Method not implemented.");
    }

    delete(user_id: string, id: string, org_id: string | undefined): Promise<RepoResult<boolean>> {
        throw new Error("Method not implemented.");
    }


    constructor(dbClient: SupabaseClient) {
        super(dbClient, TableName.userTable)
    }


}

