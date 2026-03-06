export declare class AuthService {
    static login(email: string, password: string): Promise<{
        user: {
            profile: {
                userId: string;
                id: string;
                address: string | null;
                dateOfBirth: Date | null;
                gender: import("../../generated/prisma/enums.js").Gender | null;
                bio: string | null;
            } | null;
            role: import("../../generated/prisma/enums.js").UserRole;
            id: string;
            email: string;
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