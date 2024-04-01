import {ActionResult} from "@/lib/actions/actionResult";

export type CreateAction<P, R> = (data: P) => Promise<ActionResult<R>>