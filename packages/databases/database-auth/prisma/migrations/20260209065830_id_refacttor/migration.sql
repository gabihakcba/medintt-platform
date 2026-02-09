/*
  Warnings:

  - You are about to drop the column `metadata` on the `members` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[externalId]` on the table `organizations` will be added. If there are existing duplicate values, this will fail.

*/
-- AlterTable
ALTER TABLE "members" DROP COLUMN "metadata";

-- AlterTable
ALTER TABLE "organizations" ADD COLUMN     "externalId" TEXT;

-- CreateIndex
CREATE UNIQUE INDEX "organizations_externalId_key" ON "organizations"("externalId");
