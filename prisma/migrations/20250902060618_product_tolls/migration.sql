-- CreateTable
CREATE TABLE "public"."ProductTools" (
    "productId" TEXT NOT NULL,
    "tolsId" TEXT NOT NULL,

    CONSTRAINT "ProductTools_pkey" PRIMARY KEY ("productId","tolsId")
);

-- AddForeignKey
ALTER TABLE "public"."ProductTools" ADD CONSTRAINT "ProductTools_productId_fkey" FOREIGN KEY ("productId") REFERENCES "public"."Product"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."ProductTools" ADD CONSTRAINT "ProductTools_tolsId_fkey" FOREIGN KEY ("tolsId") REFERENCES "public"."Tols"("id") ON DELETE CASCADE ON UPDATE CASCADE;
