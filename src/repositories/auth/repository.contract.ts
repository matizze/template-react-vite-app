import type { SignInSchema, UserSchema } from "@/schemas";

export interface SignInOutput {
  user: UserSchema;
  token: string;
}

export interface IAuthRepository {
  signIn(input: SignInSchema): Promise<SignInOutput>;
  signOut(): Promise<void>;
  getCurrentUser(): Promise<UserSchema>;
}
