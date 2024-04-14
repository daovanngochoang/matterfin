import { Repository, SupabaseRepository } from "./repository";
import { PaymentMethod } from "@/lib/model/paymentMethod";
import { SupabaseClient } from "@supabase/supabase-js";
import { Action, TableName } from "@/lib/repository/enums";
import { RepoResult } from "./result";


export interface IPaymentMethodRepository extends Repository<number, PaymentMethod> { }

export class PaymentMethodRepository extends SupabaseRepository<number, PaymentMethod> {
  constructor(dbClient: SupabaseClient) {
    super(dbClient, TableName.paymentMethod)
  }


  async create(user_id: string, method: PaymentMethod, org_id: string): Promise<RepoResult<PaymentMethod>> {

    try {
      method.org_id = org_id
      let { error, data } = await this.dbClient.from(this.table).insert(method).select()
      await this.audit(user_id, Action.CREATE, org_id, method)
      if (error === null) {
        return { data: data![0] }
      }
      return { error: error!.message }
    } catch (e) {
      return { error: (e as Error).message }
    }
  }

  async update(id: number, user_id: string, data: PaymentMethod, org_id: string): Promise<RepoResult<PaymentMethod>> {
    try {

      data.org_id = org_id

      let { error } = await this.dbClient
        .from(this.table)
        .update(data)
        .eq("org_id", org_id)
        .eq("id", id)

      await this.audit(user_id, Action.UPDATE, org_id, data)
      if (error === null) {
        return {}
      }
      return {
        error: error!.message
      }
    } catch (e) {
      return {
        error: (e as Error).message
      }
    }

  }

  async getAll(org_id: string | undefined): Promise<RepoResult<PaymentMethod[]>> {
    try {
      let {
        error,
        data,
        status,
        count
      } = await this.dbClient.from(this.table).select("*").eq("org_id", org_id)

      if (error === null) {
        return {
          data: data ?? [],
          count: count ?? 0,
          status: status,
        }
      }

      return {
        error: error!.message
      }
    } catch (e) {
      return {
        error: (e as Error).message
      }
    }
  }

  async getByPage(page: number, org_id: string | undefined): Promise<RepoResult<PaymentMethod[]>> {
    try {
      return {}
    } catch (e) {
      return {}
    }
  }

  async delete(user_id: string, id: number, org_id: string): Promise<RepoResult<boolean>> {
    try {
      let { error } = await this.dbClient.from(this.table).delete().eq('id', id).eq("org_id", org_id)
      await this.audit(user_id, Action.DELETE, org_id, { id: id, method_name: "", is_active: true, org_id: org_id })
      if (error === null) {
        return {
          data: true
        }
      }
      return {
        error: error!.message
      }
    } catch (e) {
      return {
        error: (e as Error).message
      }

    }
  }
}


