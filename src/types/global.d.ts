export {}

declare global {
    interface CustomJwtSessionClaims {
        memberships: Record<string, string>
    }
}