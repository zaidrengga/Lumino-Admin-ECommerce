/*
  Warnings:

  - You are about to drop the column `tools` on the `Product` table. All the data in the column will be lost.
  - Made the column `image` on table `Product` required. This step will fail if there are existing NULL values in that column.
  - Made the column `description` on table `Product` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE "public"."Product" DROP COLUMN "tools",
ALTER COLUMN "image" SET NOT NULL,
ALTER COLUMN "description" SET NOT NULL;

-- CreateTable
CREATE TABLE "public"."Tols" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "icon" TEXT NOT NULL,

    CONSTRAINT "Tols_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."_ProductTools" (
    "A" TEXT NOT NULL,
    "B" TEXT NOT NULL,

    CONSTRAINT "_ProductTools_AB_pkey" PRIMARY KEY ("A","B")
);

-- CreateIndex
CREATE UNIQUE INDEX "Tols_name_key" ON "public"."Tols"("name");

-- CreateIndex
CREATE INDEX "_ProductTools_B_index" ON "public"."_ProductTools"("B");

-- AddForeignKey
ALTER TABLE "public"."_ProductTools" ADD CONSTRAINT "_ProductTools_A_fkey" FOREIGN KEY ("A") REFERENCES "public"."Product"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."_ProductTools" ADD CONSTRAINT "_ProductTools_B_fkey" FOREIGN KEY ("B") REFERENCES "public"."Tols"("id") ON DELETE CASCADE ON UPDATE CASCADE;
