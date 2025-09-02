// Interface untuk User
export interface User {
    id: string; // UUID
    username: string;
    user_email: string;
    user_password: string;
    role: "admin" | "user";
}

export interface Product {
    title: string;
    image: string;
    price: number;
    category: "Web Template" | "Ai Agent";
    description: string;
    features: string[];
    rating: number;
    tools: string[];
}

export const Category = ["Web Template", "Ai Agent"];