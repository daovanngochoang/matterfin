import { ContactRepository, IContactRepository } from "@/lib/repository/contactRepository";
import supabaseClient from "@/lib/supabaseClient";
import { IPaymentMethodRepository, PaymentMethodRepository } from "./paymentMethodRepository";
import { IPaymentRequestRepository, PaymentRequestRepository } from "./paymentRequestRepository";
import { AttachmentRepository, IAttachmentRepository } from "./attachmentRepository";

export class DataRepo {
  private readonly _contactRepo: IContactRepository = new ContactRepository(supabaseClient);
  private readonly _paymenMethodRepo: IPaymentMethodRepository = new PaymentMethodRepository(supabaseClient)
  private readonly _paymenRequestRepo: IPaymentRequestRepository = new PaymentRequestRepository(supabaseClient)
  private readonly _attachmentRepo: IAttachmentRepository = new AttachmentRepository(supabaseClient)
  get contactRepo(): IContactRepository {
    return this._contactRepo;
  }

  get paymentRepo(): IPaymentMethodRepository {
    return this._paymenMethodRepo;
  }

  get paymentRequestRepo(): IPaymentRequestRepository {
    return this._paymenRequestRepo
  }

  get attachmentRepo(): IAttachmentRepository {
    return this._attachmentRepo;
  }
}

const dataRepo = new DataRepo();
export default dataRepo;
