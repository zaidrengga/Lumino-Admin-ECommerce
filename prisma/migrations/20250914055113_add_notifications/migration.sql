-- CreateEnum
CREATE TYPE "public"."NotificationType" AS ENUM ('NEW_PRODUCT', 'UPDATE_PRODUCT', 'NEW_ORDER', 'ORDER_UPDATE', 'NEW_REVIEW', 'PROMOTION', 'GENERAL');

-- CreateTable
CREATE TABLE "public"."Notification" (
    "id" TEXT NOT NULL,
    "content" TEXT NOT NULL,
    "isRead" BOOLEAN NOT NULL DEFAULT false,
    "type" "public"."NotificationType" NOT NULL DEFAULT 'GENERAL',
    "link" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "userId" UUID NOT NULL,

    CONSTRAINT "Notification_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "public"."Notification" ADD CONSTRAINT "Notification_userId_fkey" FOREIGN KEY ("userId") REFERENCES "public"."Users"("id") ON DELETE CASCADE ON UPDATE CASCADE;
