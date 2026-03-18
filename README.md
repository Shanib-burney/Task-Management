## 🗄️ Database Management (Prisma)

Follow these steps to sync your database and generate the type-safe client.

### 1. Initial Setup
Run this after cloning the repo and setting up your `.env` file. This ensures your local database schema matches the Prisma models immediately.

```bash
npx prisma db push
```

### 2. Generate Client

Since this project uses a custom output path for the Prisma Client
(located in `src/generated`), you must run this command to generate
the TypeScript types used in the source code:

```bash
npx prisma generate
```

### 3. Migrations (Development)

Use this when you make permanent changes to `schema.prisma`.
It creates a named migration file and updates the database schema.

```bash
npx prisma migrate dev --name <migration_name>
```


### 4. Prisma Studio

Run this to open a visual GUI in your browser to view, filter,
and edit your database data easily.

```bash
npx prisma studio
```
