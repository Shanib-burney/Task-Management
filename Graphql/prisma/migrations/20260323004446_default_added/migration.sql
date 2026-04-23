/*
  Warnings:

  - You are about to drop the column `status` on the `teams` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "projects" ALTER COLUMN "status" SET DEFAULT 0;

-- AlterTable
ALTER TABLE "tasks" ALTER COLUMN "status" SET DEFAULT 0;

-- AlterTable
ALTER TABLE "teams" DROP COLUMN "status";

-- AlterTable
ALTER TABLE "user_teams" ALTER COLUMN "role" SET DEFAULT 0;
