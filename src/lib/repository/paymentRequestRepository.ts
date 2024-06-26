import { PaymentRequest } from "@/lib/model/paymentRequest";
import { Repository, SupabaseRepository } from "@/lib/repository/repository";
import { RepoResult } from "./result";
import { SupabaseClient } from "@supabase/supabase-js";
import { Action, TableName } from "@/lib/repository/enums";
import { PaymentStatus } from "../model/enum";

export interface IPaymentRequestRepository extends Repository<number, PaymentRequest> {

  getByID(id: number): Promise<RepoResult<PaymentRequest>>;
}

export class PaymentRequestRepository extends SupabaseRepository<number, PaymentRequest> implements IPaymentRequestRepository {
  async create(user_id: string, paymentReq: PaymentRequest, org_id: string | undefined): Promise<RepoResult<PaymentRequest>> {
    try {
      paymentReq.org_id = org_id;
      paymentReq.creator_id = user_id;

      const { error, data } = await this.dbClient.from(this.table).insert(paymentReq).select();

      if (error !== null) {
        return {
          error: error.message,
        }
      }

      await this.audit(user_id, Action.CREATE, org_id, paymentReq)
      return {
        data: data[0]
      }
    } catch (e) {
      return {
        error: (e as Error).message
      }
    }
  }
  async getByID(id: number): Promise<RepoResult<PaymentRequest>> {
    try {
      const { data, error } = await this.dbClient
        .from(this.table)
        .select(`*, attachment(*)`).eq("id", id)
      if (error !== null) {
        return {
          error: error.message
        }
      }
      return {
        data: data[0]
      }
    } catch (e) {
      return {
        error: (e as Error).message
      }
    }
  }
  async update(id: number, user_id: string, prData: PaymentRequest, org_id: string | undefined): Promise<RepoResult<PaymentRequest>> {
    try {
      let { data, error } = await this.dbClient.from(this.table).update(prData).eq("id", id).select("*")
      if (error === null) return {
        data: data![0]
      }
      await this.audit(user_id, Action.UPDATE, org_id, prData)
      return {
        error: error?.message
      }
    } catch (e) {
      return {
        error: (e as Error).message
      }
    }
  }

  async getAll(org_id: string | undefined): Promise<RepoResult<PaymentRequest[]>> {
    try {
      let { data, error } = await this.dbClient.from(this.table).select(`*, attachment(*), contact(*), payment_method(*)`).eq("org_id", org_id);
      if (error === null) {
        return {
          data: data!
        }
      }
      return {
        error: error?.message
      }
    } catch (e) {
      return {
        error: (e as Error).message
      }
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

