/*
  Warnings:

  - The `status` column on the `Order` table would be dropped and recreated. This will lead to data loss if there is data in the column.

*/
-- CreateEnum
CREATE TYPE "public"."StatusOrder" AS ENUM ('Panding', 'Process', 'Finished', 'Cancelled');

-- AlterTable
ALTER TABLE "public"."Order" DROP COLUMN "status",
ADD COLUMN     "status" "public"."StatusOrder" NOT NULL DEFAULT 'Panding';
