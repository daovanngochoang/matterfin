import { PaymentRequest } from "@/lib/model/paymentRequest";
import { Repository, SupabaseRepository } from "@/lib/repository/repository";
import { RepoResult } from "./result";
import { SupabaseClient } from "@supabase/supabase-js";
import { Action, TableName } from "@/lib/repository/enums";

export interface IPaymentRequestRepository extends Repository<number, PaymentRequest> { }

export class PaymentRequestRepository extends SupabaseRepository<number, PaymentRequest> implements IPaymentRequestRepository {
  async create(user_id: string, data: PaymentRequest, org_id: string | undefined): Promise<RepoResult<boolean>> {
    try {
      data.org_id = org_id;
      const { error } = await this.dbClient.from(this.table).insert(data);

      if (error !== null) {
        return {
          error: error.message,
          data: false
        }
      }

      await this.audit(user_id, Action.CREATE, org_id, data)
      return {
        data: true
      }
    } catch (e) {
      return {
        error: (e as Error).message
      }
    }
  }

  async update(id: number, user_id: string, data: PaymentRequest, org_id: string | undefined): Promise<RepoResult<PaymentRequest>> {
    try {
      return {

      }
    } catch (e) {
      return {

      }
    }
  }

  async getAll(org_id: string | undefined): Promise<RepoResult<PaymentRequest[]>> {
    try {
      return {}
    } catch (e) {
      return {}
    }
  }

  async getByPage(page: number, org_id: string | undefined): Promise<RepoResult<PaymentRequest[]>> {
    try {
      return {}
    } catch (e) {
      return {}
    }
  }

  async delete(user_id: string, id: number, org_id: string | undefined): Promise<RepoResult<boolean>> {
    try {
      return {}
    } catch (e) {
      return {}
    }
  }
  constructor(dbClient: SupabaseClient) {
    super(dbClient, TableName.paymentRequest);
  }


}

