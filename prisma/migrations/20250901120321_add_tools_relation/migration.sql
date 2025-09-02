/*
  Warnings:

  - You are about to drop the `Tools` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "public"."Tools" DROP CONSTRAINT "Tools_productId_fkey";

-- AlterTable
ALTER TABLE "public"."Product" ADD COLUMN     "tools" JSONB;

-- DropTable
DROP TABLE "public"."Tools";
