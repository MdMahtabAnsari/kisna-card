/*
  Warnings:

  - Made the column `createdById` on table `Card` required. This step will fail if there are existing NULL values in that column.
  - Made the column `approvedById` on table `Card` required. This step will fail if there are existing NULL values in that column.
  - Added the required column `approvedById` to the `Shop` table without a default value. This is not possible if the table is not empty.
  - Made the column `createdById` on table `Shop` required. This step will fail if there are existing NULL values in that column.

*/
-- CreateEnum
CREATE TYPE "ShopStatus" AS ENUM ('OPEN', 'CLOSED', 'PENDING');

-- DropForeignKey
ALTER TABLE "Card" DROP CONSTRAINT "Card_approvedById_fkey";

-- DropForeignKey
ALTER TABLE "Card" DROP CONSTRAINT "Card_createdById_fkey";

-- DropIndex
DROP INDEX "Card_approvedById_key";

-- DropIndex
DROP INDEX "Card_createdById_key";

-- DropIndex
DROP INDEX "Shop_createdById_key";

-- DropIndex
DROP INDEX "User_approvedById_key";

-- DropIndex
DROP INDEX "User_createdById_key";

-- AlterTable
ALTER TABLE "Card" ALTER COLUMN "createdById" SET NOT NULL,
ALTER COLUMN "approvedById" SET NOT NULL;

-- AlterTable
ALTER TABLE "Shop" ADD COLUMN     "approvedById" TEXT NOT NULL,
ADD COLUMN     "status" "ShopStatus" NOT NULL DEFAULT 'PENDING',
ALTER COLUMN "createdById" SET NOT NULL;

-- AddForeignKey
ALTER TABLE "Shop" ADD CONSTRAINT "Shop_createdById_fkey" FOREIGN KEY ("createdById") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Shop" ADD CONSTRAINT "Shop_approvedById_fkey" FOREIGN KEY ("approvedById") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Card" ADD CONSTRAINT "Card_createdById_fkey" FOREIGN KEY ("createdById") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Card" ADD CONSTRAINT "Card_approvedById_fkey" FOREIGN KEY ("approvedById") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
