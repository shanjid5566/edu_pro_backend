import bcryptjs from "bcryptjs";
import { PrismaClient } from "../../generated/prisma/client.js";
import { UnauthorizedError } from "../utils/errors.js";
import { generateToken } from "../utils/token.js";
const prisma = new PrismaClient();
export class AuthService {
    static async login(email, password) {
        const user = await prisma.user.findUnique({
            where: { email },
            include: { profile: true },
        });
        if (!user) {
            throw new UnauthorizedError("Invalid email or password");
        }
        if (user.status !== "active") {
            throw new UnauthorizedError("Your account is currently inactive");
        }
        const isMatch = await bcryptjs.compare(password, user.password);
        if (!isMatch) {
            throw new UnauthorizedError("Invalid email or password");
        }
        const token = generateToken(user.id, user.role);
        // remove password from returned user object
        const { password: _p, ...userWithoutPassword } = user;
        return {
            user: userWithoutPassword,
            token,
        };
    }
}
//# sourceMappingURL=auth.service.js.map