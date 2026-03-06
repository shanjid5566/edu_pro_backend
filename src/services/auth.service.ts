import bcryptjs from "bcryptjs";
import { UnauthorizedError } from "../utils/errors.js";
import { generateToken } from "../utils/token.js";
import { db } from "../config/database.config.js";

/**
 * Service class for handling Authentication related business logic.
 * Contains methods for logging in, validating credentials, and generating tokens.
 */
export class AuthService {
  /**
   * Authenticates a user using their email and password.
   *
   * @param email - The email address of the user attempting to log in.
   * @param password - The raw password provided by the user.
   * @returns An object containing the authenticated user's details (excluding password) and a JWT token.
   * @throws {UnauthorizedError} If the email is not found, password doesn't match, or account is inactive.
   */
  static async login(email: string, password: string) {
    // 1. Find the user by their email address, including their profile details
    const user = await db.user.findUnique({
      where: { email },
      include: { profile: true },
    });

    // 2. If no user is found, throw a 401 Unauthorized error
    if (!user) {
      throw new UnauthorizedError("Invalid email");
    }

    // 3. Ensure the user's account status is active before allowing login
    if (user.status !== "active") {
      throw new UnauthorizedError("Your account is currently inactive");
    }

    // 4. Compare the provided password with the hashed password stored in the database
    const isMatch = await bcryptjs.compare(password, user.password);
    if (!isMatch) {
      throw new UnauthorizedError("Invalid password");
    }

    // 5. Generate a JSON Web Token (JWT) containing the user ID and role
    const token = generateToken(user.id, user.role);

    // 6. Exclude the password field from the returned user object for security
    const { password: _p, ...userWithoutPassword } = user;

    // 7. Return the sanitized user object along with the generated token
    return {
      user: userWithoutPassword,
      token,
    };
  }
}
