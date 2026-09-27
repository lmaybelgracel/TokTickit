import bcrypt from "bcryptjs";

const DEFAULT_SALT_ROUNDS = 10;

export interface PasswordValidationResult {
  isValid: boolean;
  errors: string[];
}

export function validatePasswordComplexity(password: string): PasswordValidationResult {
  const errors: string[] = [];

  if (!password || typeof password !== "string") {
    return { isValid: false, errors: ["Password is required"] };
  }

  if (password.length < 8) {
    errors.push("Password must be at least 8 characters long");
  }

  if (!/[A-Z]/.test(password)) {
    errors.push("Password must contain at least one uppercase letter");
  }

  if (!/[a-z]/.test(password)) {
    errors.push("Password must contain at least one lowercase letter");
  }

  if (!/[0-9]/.test(password)) {
    errors.push("Password must contain at least one numeric digit");
  }

  return {
    isValid: errors.length === 0,
    errors,
  };
}

export function hashPassword(password: string, saltRounds = DEFAULT_SALT_ROUNDS): string {
  return bcrypt.hashSync(password, saltRounds);
}

export function comparePassword(plain: string, hashed: string): boolean {
  return bcrypt.compareSync(plain, hashed);
}
