import { Notification, Product, Tols, Users } from "@/generated/prisma";

export const Category = ["Web Template", "Ai Agent"];

export interface ProductData extends Product {
    tools?: Tols[];
}

export interface NotificationData extends Notification {
    user: Users
}