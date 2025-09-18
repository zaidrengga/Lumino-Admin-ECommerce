/*
  Warnings:

  - You are about to drop the `ProductTools` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "public"."ProductTools" DROP CONSTRAINT "ProductTools_productId_fkey";

-- DropForeignKey
ALTER TABLE "public"."ProductTools" DROP CONSTRAINT "ProductTools_tolsId_fkey";

-- DropTable
DROP TABLE "public"."ProductTools";
