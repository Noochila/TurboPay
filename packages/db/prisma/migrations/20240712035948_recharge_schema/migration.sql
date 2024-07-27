/*
  Warnings:

  - The values [Pending,Success,Failure] on the enum `RechargeStatus` will be removed. If these variants are still used in the database, this will fail.

*/
-- AlterEnum
BEGIN;
CREATE TYPE "RechargeStatus_new" AS ENUM ('processing', 'success', 'failure');
ALTER TABLE "Recharge" ALTER COLUMN "status" TYPE "RechargeStatus_new" USING ("status"::text::"RechargeStatus_new");
ALTER TYPE "RechargeStatus" RENAME TO "RechargeStatus_old";
ALTER TYPE "RechargeStatus_new" RENAME TO "RechargeStatus";
DROP TYPE "RechargeStatus_old";
COMMIT;
