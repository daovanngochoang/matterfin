import {SupabaseRepository} from "./repository";
import {PaymentMethod} from "@/lib/model/paymentMethod";
import {SupabaseClient} from "@supabase/supabase-js";
import {TableName} from "@/lib/repository/enums";
import {RepoResult} from "./result";


class PaymentMethodRepository extends SupabaseRepository<number, PaymentMethod> {
    create(user_id: string, data: PaymentMethod, org_id: string | undefined): Promise<RepoResult<boolean>> {
        throw new Error("Method not implemented.");
    }

    update(id: number, user_id: string, data: PaymentMethod, org_id: string | undefined): Promise<RepoResult<PaymentMethod>> {
        throw new Error("Method not implemented.");
    }

    getAll(org_id: string | undefined): Promise<RepoResult<PaymentMethod[]>> {
        throw new Error("Method not implemented.");
    }

    getByPage(page: number, org_id: string | undefined): Promise<RepoResult<PaymentMethod[]>> {
        throw new Error("Method not implemented.");
    }

    delete(user_id: string, id: number, org_id: string | undefined): Promise<RepoResult<boolean>> {
        throw new Error("Method not implemented.");
    }


    constructor(dbClient: SupabaseClient) {
        super(dbClient, TableName.paymentMethod)
    }


}


