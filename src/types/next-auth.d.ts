import 'next-auth';
import { DefaultSession } from 'next-auth';
import { UserStatus,Role } from '@/lib/schema/auth';


declare module 'next-auth' {
  interface User {
    id?: string;
    name?: string | null;
    email?: string | null;
    phone?: string | null;
    userId?: string | null;
    role?: Role;
    status?: UserStatus;
  }

  interface Session {
    user: {
      id?: string;
      name?: string | null;
      email?: string | null;
      phone?: string | null;
      userId?: string | null;
      role?: Role;
      status?: UserStatus;
    } & DefaultSession['user'];
  }
}
