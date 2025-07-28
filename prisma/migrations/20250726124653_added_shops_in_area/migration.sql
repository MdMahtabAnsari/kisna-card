/*
  Warnings:

  - A unique constraint covering the columns `[createdById]` on the table `Shop` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `areaId` to the `Shop` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Shop" ADD COLUMN     "areaId" TEXT NOT NULL,
ADD COLUMN     "createdById" TEXT;

-- CreateIndex
CREATE UNIQUE INDEX "Shop_createdById_key" ON "Shop"("createdById");

-- AddForeignKey
ALTER TABLE "Shop" ADD CONSTRAINT "Shop_areaId_fkey" FOREIGN KEY ("areaId") REFERENCES "Area"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
