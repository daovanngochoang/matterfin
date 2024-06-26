import {ActivityLog} from "@/lib/model/activityLog"
import {SupabaseClient} from "@supabase/supabase-js"
import {errorLog} from "../utils";
import {Action, TableName} from "@/lib/repository/enums";
import {RepoResult} from "@/lib/repository/result";


export interface Repository<I, T> {

    audit(user_id: string, action: Action, org_id: string, data?: T): Promise<void>;

    create(user_id: string, data: T, org_id: string): Promise<RepoResult<T>>;

    update(id: I, user_id: string, data: T, org_id: string): Promise<RepoResult<T>>;

    getAll(org_id: string): Promise<RepoResult<Array<T>>>;

    getByPage(page: number, org_id: string): Promise<RepoResult<Array<T>>>;

    delete(user_id: string, id: I, org_id: string): Promise<RepoResult<boolean>>;
}

export abstract class SupabaseRepository<I, T> implements Repository<I, T> {
    protected dbClient: SupabaseClient;
    protected table: TableName;

    protected constructor(dbClient: SupabaseClient, dataTable: TableName) {
        this.dbClient = dbClient;
        this.table = dataTable;
    }

    async audit(user_id: string, action: Action, org_id?: string | undefined, data?: T | undefined): Promise<void> {
        try {
            let log: ActivityLog = {
                user_id: user_id,
                org_id: org_id,
                activity: `${action} on ${this.table} with data : ${data}`,
                created_at: new Date()
            };
            await this.dbClient.from(TableName.activityLog).insert(log);
        } catch (e) {
            errorLog((e as Error).message)
        }
    }

    abstract create(user_id: string, data: T, org_id: string | undefined): Promise<RepoResult<T>> ;

    abstract update(id: I, user_id: string, data: T, org_id: string | undefined): Promise<RepoResult<T>> ;

    abstract getAll(org_id: string | undefined): Promise<RepoResult<T[]>> ;

    abstract getByPage(page: number, org_id: string | undefined): Promise<RepoResult<T[]>> ;

    abstract delete(user_id: string, id: I, org_id: string | undefined): Promise<RepoResult<boolean>> ;


}



