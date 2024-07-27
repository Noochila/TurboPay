/*
  Warnings:

  - Added the required column `number` to the `Recharge` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Recharge" ADD COLUMN     "number" TEXT NOT NULL;
