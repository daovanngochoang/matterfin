export type RepoResult<T> = {
    error?: string | undefined;
    data?: T;
    count?: number | undefined;
    status?: number
}
