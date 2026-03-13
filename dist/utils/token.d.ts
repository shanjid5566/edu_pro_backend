export interface TokenPayload {
    id: string;
    email: string;
    role: string;
}
export declare const generateToken: (userId: string, email: string, role: string) => string;
export declare const verifyToken: (token: string) => TokenPayload;
//# sourceMappingURL=token.d.ts.map