/*
  Warnings:

  - You are about to drop the column `oods1` on the `Game` table. All the data in the column will be lost.
  - Added the required column `odds1` to the `Game` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Game" DROP COLUMN "oods1",
ADD COLUMN     "odds1" DOUBLE PRECISION NOT NULL;
