import { ContactRepository, IContactRepository } from "@/lib/repository/contactRepository";
import supabaseClient from "@/lib/supabaseClient";
import { IPaymentMethodRepository, PaymentMethodRepository } from "./paymentMethodRepository";

export class DataRepo {
  private readonly _contactRepo: IContactRepository = new ContactRepository(supabaseClient);

  private readonly _paymenMethodRepo: IPaymentMethodRepository = new PaymentMethodRepository(supabaseClient)
  // constructor() {}
  get contactRepo(): IContactRepository {
    return this._contactRepo;
  }

  get paymentRepo(): IPaymentMethodRepository {
    return this._paymenMethodRepo;
  }
}

const dataRepo = new DataRepo();
export default dataRepo;
