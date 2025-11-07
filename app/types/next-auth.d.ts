import { DefaultSession } from "next-auth";

declare module "next-auth" {
  interface Session {
    user?: DefaultSession["user"] & {
      id: string;
      fullName?: string;
      birthDate?: string | null;
    };
  }

  interface User {
    fullName?: string | null;
    birthDate?: Date | null;
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    id?: string;
    fullName?: string;
    birthDate?: string | null;
  }
}
