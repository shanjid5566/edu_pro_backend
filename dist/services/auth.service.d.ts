/**
 * Service class for handling Authentication related business logic.
 * Contains methods for logging in, validating credentials, and generating tokens.
 */
export declare class AuthService {
    /**
     * Authenticates a user using their email and password.
     *
     * @param email - The email address of the user attempting to log in.
     * @param password - The raw password provided by the user.
     * @returns An object containing the authenticated user's details (excluding password) and a JWT token.
     * @throws {UnauthorizedError} If the email is not found, password doesn't match, or account is inactive.
     */
    static login(email: string, password: string): Promise<{
        user: {
            profile: {
                id: string;
                userId: string;
                address: string | null;
                dateOfBirth: Date | null;
                gender: import("@prisma/client").$Enums.Gender | null;
                bio: string | null;
            } | null;
            id: string;
            email: string;
            role: import("@prisma/client").$Enums.UserRole;
            name: string;
            avatar: string | null;
            phone: string | null;
            status: string;
            createdAt: Date;
            updatedAt: Date;
        };
        token: string;
    }>;
}
//# sourceMappingURL=auth.service.d.ts.map