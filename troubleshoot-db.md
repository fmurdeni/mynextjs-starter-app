# Database Connection Troubleshooting

## Current Issue
The registration is failing because Prisma cannot connect to PostgreSQL. The error shows connection attempts to wrong ports (51213/51214 instead of 5432).

## Quick Fix Steps

### 1. Check Your .env File
Make sure your `.env` file contains exactly this:

```bash
# Database - Standard PostgreSQL connection
DATABASE_URL="postgresql://postgres:pekanbaru@localhost:5432/auth_admin_db?schema=public"

# NextAuth.js
NEXTAUTH_URL="http://localhost:3000"
NEXTAUTH_SECRET="your-secret-key-here-change-this-in-production"
```

### 2. Verify PostgreSQL is Running
Check if PostgreSQL is running on the correct port:

**For Laragon users:**
- Open Laragon
- Make sure PostgreSQL service is started
- Check the port in Laragon settings (should be 5432)

**Alternative check:**
```bash
# Check if PostgreSQL is listening on port 5432
netstat -an | findstr :5432
```

### 3. Create Database
Connect to PostgreSQL and create the database:

```sql
-- Connect to PostgreSQL as postgres user
-- Then run:
CREATE DATABASE auth_admin_db;
```

### 4. Run Migration
After fixing the connection:

```bash
# Generate Prisma client
npx prisma generate

# Push schema to database (alternative to migrate)
npx prisma db push

# Or run migration
npx prisma migrate dev --name init
```

### 5. Test Connection
```bash
# Test database connection
npx prisma studio
```

## Alternative: Use SQLite for Development

If PostgreSQL continues to have issues, you can temporarily switch to SQLite for development:

1. Update `prisma/schema.prisma`:
```prisma
datasource db {
  provider = "sqlite"
  url      = "file:./dev.db"
}
```

2. Update `.env`:
```bash
DATABASE_URL="file:./dev.db"
NEXTAUTH_URL="http://localhost:3000"
NEXTAUTH_SECRET="your-secret-key-here"
```

3. Run migration:
```bash
npx prisma generate
npx prisma db push
```

## Expected Result
After fixing the database connection, you should be able to:
- Register new users successfully
- Login with created accounts
- Access role-based dashboards
- See user data in the database
