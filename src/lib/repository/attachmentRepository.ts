import { Repository, SupabaseRepository } from "@/lib/repository/repository";
import Attachment from "@/lib/model/attachment";
import { SupabaseClient } from "@supabase/supabase-js";
import { Action, TableName } from "@/lib/repository/enums";
import { RepoResult } from "./result";


export interface IAttachmentRepository extends Repository<number, Attachment>{}

export class AttachmentRepository extends SupabaseRepository<number, Attachment> implements IAttachmentRepository {
  async create(user_id: string, attachment: Attachment, org_id: string | undefined): Promise<RepoResult<Attachment>> {
    try {
      const { error, data } = await this.dbClient.from(this.table).insert(attachment).select()
      if (error !== null) {
        return {
          error: error.message
        }
      }
      this.audit(user_id, Action.CREATE, org_id, attachment)
      return {
        data: data[0]
      }
    } catch (e) {
      return {
        error: (e as Error).message
      }
    }
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

