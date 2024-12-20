/*
  Warnings:

  - You are about to drop the column `oodds1` on the `Game` table. All the data in the column will be lost.
  - Added the required column `oods1` to the `Game` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Game" DROP COLUMN "oodds1",
ADD COLUMN     "oods1" DOUBLE PRECISION NOT NULL;
