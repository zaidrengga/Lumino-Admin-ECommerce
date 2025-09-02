"use client";

import React from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

interface ProductSearchProps {
    value: string;
    onChange: (value: string) => void;
    onReset?: () => void;
}

export const ProductSearch: React.FC<ProductSearchProps> = ({ value, onChange, onReset }) => {
    return (
        <div className="relative flex items-center w-full">
            <Input
                placeholder="Search products..."
                value={value}
                onChange={(e) => onChange(e.target.value)}
                className="flex-1"
            />
            <Button
                variant="ghost"
                className="absolute right-0"
                onClick={onReset}
                size="icon"
            >
                <svg
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    strokeWidth={1.5}
                    stroke="currentColor"
                    className="w-4 h-4"
                >
                    <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M6 18L18 6M6 6l12 12"
                    />
                </svg>
            </Button>
        </div>
    );
};
