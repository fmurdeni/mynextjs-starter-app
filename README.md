# Auth Admin App

A Next.js authentication application with admin dashboard built using the latest tech stack.

## Tech Stack

- **Next.js 15** - React framework with App Router
- **TypeScript** - Type safety
- **TailwindCSS** - Utility-first CSS framework
- **NextAuth.js** - Authentication library
- **Prisma** - Database ORM
- **PostgreSQL** - Database
- **bcryptjs** - Password hashing

## Features

- ✅ User registration and login
- ✅ Role-based access control (USER/ADMIN)
- ✅ Admin dashboard
- ✅ User dashboard
- ✅ Modern responsive UI
- ✅ Protected routes
- ✅ Session management

## Setup Instructions

### 1. Environment Variables

Create a `.env` file in the root directory with the following content:

```bash
# Database
DATABASE_URL="postgresql://postgres:pekanbaru@localhost:5432/auth_admin_db?schema=public"

# NextAuth.js
NEXTAUTH_URL="http://localhost:3000"
NEXTAUTH_SECRET="your-secret-key-here-change-this-in-production"
```

### 2. Database Setup

Make sure PostgreSQL is running and create the database:

```sql
CREATE DATABASE auth_admin_db;
```

### 3. Run Database Migration

```bash
npx prisma migrate dev --name init
```

### 4. Generate Prisma Client

```bash
npx prisma generate
```

### 5. Start Development Server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) to see the application.

## Usage

1. **Register**: Create a new account at `/register`
2. **Login**: Sign in at `/login`
3. **User Dashboard**: Regular users are redirected to `/dashboard`
4. **Admin Dashboard**: Admin users can access `/admin`

## Creating an Admin User

To create an admin user, you can either:

1. Register normally and update the role in the database:
   ```sql
   UPDATE "User" SET role = 'ADMIN' WHERE email = 'your-email@example.com';
   ```

2. Or use Prisma Studio:
   ```bash
   npx prisma studio
   ```

## Project Structure

```
src/
├── app/
│   ├── admin/          # Admin dashboard
│   ├── api/            # API routes
│   ├── dashboard/      # User dashboard
│   ├── login/          # Login page
│   ├── register/       # Registration page
│   └── layout.tsx      # Root layout
├── components/
│   └── providers/      # React providers
├── lib/
│   ├── auth.ts         # NextAuth configuration
│   └── prisma.ts       # Prisma client
└── types/
    └── next-auth.d.ts  # NextAuth type definitions
```

## Database Schema

The application uses the following main models:

- **User**: Stores user information and roles
- **Account**: NextAuth account linking
- **Session**: User sessions
- **VerificationToken**: Email verification tokens

## Development

To contribute to this project:

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request
