/*
  Warnings:

  - Added the required column `lat` to the `Place` table without a default value. This is not possible if the table is not empty.
  - Added the required column `lng` to the `Place` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Place" ADD COLUMN     "lat" INTEGER NOT NULL,
ADD COLUMN     "lng" INTEGER NOT NULL;
