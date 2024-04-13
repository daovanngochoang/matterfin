import { ContactRepository, IContactRepository } from "@/lib/repository/contactRepository";
import supabaseClient from "@/lib/supabaseClient";
import { IPaymentMethodRepository, PaymentMethodRepository } from "./paymentMethodRepository";
import { IPaymentRequestRepository, PaymentRequestRepository } from "./paymentRequestRepository";
import { Repository, SupabaseRepository } from "./repository";

export class DataRepo {
  private readonly _contactRepo: IContactRepository = new ContactRepository(supabaseClient);

  private readonly _paymenMethodRepo: IPaymentMethodRepository = new PaymentMethodRepository(supabaseClient)
  private readonly _paymenRequestRepo: IPaymentRequestRepository = new PaymentRequestRepository(supabaseClient)
  get contactRepo(): IContactRepository {
    return this._contactRepo;
  }

  get paymentRepo(): IPaymentMethodRepository {
    return this._paymenMethodRepo;
  }

  get paymentRequestRepo(): IPaymentRequestRepository {
   return this._paymenRequestRepo
  }
}

const dataRepo = new DataRepo();
export default dataRepo;
