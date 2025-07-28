# Kisan Card

This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://nextjs.org/docs/app/api-reference/cli/create-next-app).

## Getting Started

### 1. Configure Environment Variables

Create a `.env` file in the root directory and add the required environment variables.  
Example:

```env
DATABASE_URL="your_postgresql_connection_string"
NEXTAUTH_SECRET="your_nextauth_secret"
NODE_ENV="development"
NEXT_PUBLIC_API_URL="http://localhost:3000"
```

### 2. Generate Prisma Client

Run the following command to generate the Prisma client:

```bash
pnpm run db:generate
```

### 3. Start the Development Server

Start the development server:

```bash
pnpm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser to see the result.

---

## Learn More

- [Next.js Documentation](https://nextjs.org/docs)
- [Prisma Documentation](https://www.prisma.io/docs)
-