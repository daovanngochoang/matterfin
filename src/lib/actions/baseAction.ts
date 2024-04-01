import {ActionResult} from "@/lib/actions/actionResult";
import {DataRepo} from "@/lib/repository/dataRepo";

export abstract class BaseAction<T> {
    repo: DataRepo;

    constructor(repo: DataRepo) {
        this.repo = repo;
    }


    abstract create(data: T): Promise<ActionResult<boolean>>;

    abstract update(id: number, data: T): Promise<ActionResult<T>>;

    abstract getAll(): Promise<ActionResult<Array<T>>>;

    abstract getByPage(page: number): Promise<ActionResult<Array<T>>>;

    abstract delete(id: number): Promise<ActionResult<boolean>>;

}


