import {ActionResult} from "@/lib/actions/actionResult";
// P mean param and R is Result and I is id type.

export type CreateAction<P, R> = (data: P) => Promise<ActionResult<R>>

export type UpdateAction<I, P, R> = (id: I, data: P) => Promise<ActionResult<R>>


