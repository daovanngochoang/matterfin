import {SupabaseRepository} from "@/lib/repository/repository";
import Attachment from "@/lib/model/attachment";
import {SupabaseClient} from "@supabase/supabase-js";
import {TableName} from "@/lib/repository/enums";
import {RepoResult} from "./result";


export class AttachmentRepository extends SupabaseRepository<number, Attachment> {
    create(user_id: string, data: Attachment, org_id: string | undefined): Promise<RepoResult<boolean>> {
        throw new Error("Method not implemented.");
    }

    update(id: number, user_id: string, data: Attachment, org_id: string | undefined): Promise<RepoResult<Attachment>> {
        throw new Error("Method not implemented.");
    }

    getAll(org_id: string | undefined): Promise<RepoResult<Attachment[]>> {
        throw new Error("Method not implemented.");
    }

    getByPage(page: number, org_id: string | undefined): Promise<RepoResult<Attachment[]>> {
        throw new Error("Method not implemented.");
    }

    delete(user_id: string, id: number, org_id: string | undefined): Promise<RepoResult<boolean>> {
        throw new Error("Method not implemented.");
    }

    constructor(dbClient: SupabaseClient) {
        super(dbClient, TableName.attachment);
    }


}

