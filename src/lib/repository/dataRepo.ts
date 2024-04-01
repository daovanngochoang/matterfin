import {ContactRepository, IContactRepository} from "@/lib/repository/contactRepository";
import supabaseClient from "@/lib/supabaseClient";

export class DataRepo {
    private readonly _contactRepo: IContactRepository = new ContactRepository(supabaseClient);

    // constructor() {}
    get contactRepo(): IContactRepository {
        return this._contactRepo;
    }
}

const dataRepo = new DataRepo();
export default dataRepo;