import { Repository, SupabaseRepository } from "@/lib/repository/repository";
import Contact from "@/lib/model/contact";
import { Action, TableName } from "@/lib/repository/enums";
import { SupabaseClient } from "@supabase/supabase-js";
import { RepoResult } from "@/lib/repository/result";


export interface IContactRepository extends Repository<number, Contact> {
  createMany(contacts: Contact[]): Promise<RepoResult<boolean>>;
}

export class ContactRepository extends SupabaseRepository<number, Contact> implements IContactRepository {

  constructor(dbClient: SupabaseClient) {
    super(dbClient, TableName.contact);
  }

  createMany(contacts: Contact[]): Promise<RepoResult<boolean>> {
    throw new Error("Method not implemented.");
  }

  async create(user_id: string, data: Contact, org_id?: string | undefined): Promise<RepoResult<boolean>> {
    try {
      data.org_id = org_id
      const { error } = await this.dbClient.from(this.table).insert(data);
      if (error !== null) {
        return { error: error.message }
      }
      await this.audit(user_id, Action.CREATE, org_id, data)
      return { data: true };
    } catch (error) {
      return { error: (error as Error).message };
    }
  }

  async update(id: number, user_id: string, data: Contact, org_id: string): Promise<RepoResult<Contact>> {

    try {
      const result = await this.dbClient
        .from(this.table)
        .update(data)
        .eq("org_id", org_id)
        .eq("id", id)

      if (result.error !== null) {
        return {
          error: result.error.message
        }
      }
      data.id = id;
      await this.audit(user_id, Action.UPDATE, org_id, data)
      return {}

    } catch (e) {
      return { error: (e as Error).message };
    }
  }

  async getAll(org_id?: string | undefined): Promise<RepoResult<Contact[]>> {
    try {
      let {
        error,
        data,
        status,
        count
      } = await this.dbClient
        .from(this.table)
        .select("*")
        .eq("org_id", org_id)
      let result: Contact[] = []
      // if error
      if (error !== null) {
        return { error: error.message, status }
      }

      if (data != null) {
        result = data
          .map(item => {
            item.name = `${item.firstname} ${item.lastname}`
            return item;
          })
      }
      return {
        data: result,
        count: count != null ? count : undefined,
        status
      }
        ;
    } catch (e) {
      return { error: (e as Error).message };
    }

  }

  async getByPage(page: number, org_id: string | undefined): Promise<RepoResult<Contact[]>> {
    throw new Error("Method not implemented.");
  }

  async delete(user_id: string, id: number, org_id: string | undefined): Promise<RepoResult<boolean>> {
    try {
      const { status, error } = await this
        .dbClient
        .from(this.table)
        .delete()
        .eq("id", id)
      if (error !== null) return { error: error.message }
      return { data: true };
    } catch (e) {
      return { error: (e as Error).message }
    }
  }


}
