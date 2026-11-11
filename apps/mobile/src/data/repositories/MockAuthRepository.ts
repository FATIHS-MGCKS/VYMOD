export interface SignUpResult {
  ok: true;
}

export interface SignUpValidationError {
  ok: false;
  field: 'email' | 'password' | 'passwordConfirm';
}

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const MIN_PASSWORD = 8;

export class MockAuthRepository {
  async signIn(email: string, password: string): Promise<void> {
    if (!EMAIL_RE.test(email.trim())) {
      throw new Error('validation:email');
    }
    if (password.length < MIN_PASSWORD) {
      throw new Error('validation:password');
    }
    await Promise.resolve();
  }

  async signUp(
    email: string,
    password: string,
    passwordConfirm: string,
  ): Promise<SignUpResult | SignUpValidationError> {
    if (!email.trim()) return { ok: false, field: 'email' };
    if (!EMAIL_RE.test(email.trim())) return { ok: false, field: 'email' };
    if (password.length < MIN_PASSWORD) return { ok: false, field: 'password' };
    if (!passwordConfirm) return { ok: false, field: 'passwordConfirm' };
    if (password !== passwordConfirm) return { ok: false, field: 'passwordConfirm' };
    await Promise.resolve();
    return { ok: true };
  }
}
