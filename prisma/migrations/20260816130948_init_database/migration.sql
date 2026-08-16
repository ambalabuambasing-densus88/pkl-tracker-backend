/*
  Warnings:

  - You are about to drop the column `latitude` on the `User` table. All the data in the column will be lost.
  - You are about to drop the column `longitude` on the `User` table. All the data in the column will be lost.

*/
-- DropForeignKey
ALTER TABLE "Logbook" DROP CONSTRAINT "Logbook_userId_fkey";

-- DropForeignKey
ALTER TABLE "Presensi" DROP CONSTRAINT "Presensi_userId_fkey";

-- AlterTable
ALTER TABLE "User" DROP COLUMN "latitude",
DROP COLUMN "longitude",
ADD COLUMN     "guru_uid" TEXT,
ADD COLUMN     "pkl_lat" DOUBLE PRECISION,
ADD COLUMN     "pkl_lng" DOUBLE PRECISION,
ADD COLUMN     "pkl_place_address" TEXT,
ADD COLUMN     "pkl_place_name" TEXT;

-- CreateIndex
CREATE INDEX "Logbook_userId_idx" ON "Logbook"("userId");

-- CreateIndex
CREATE INDEX "Presensi_userId_idx" ON "Presensi"("userId");

-- AddForeignKey
ALTER TABLE "Presensi" ADD CONSTRAINT "Presensi_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Logbook" ADD CONSTRAINT "Logbook_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
