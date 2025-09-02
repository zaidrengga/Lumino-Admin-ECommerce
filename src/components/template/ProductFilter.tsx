"use client";

import React from "react";
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "@/components/ui/select";

interface ProductFilterProps {
    value?: string;
    options: string[];
    onChange: (value?: string) => void;
    onReset?: () => void;
}

export const ProductFilter: React.FC<ProductFilterProps> = ({ value, options, onChange, onReset }) => {
    const handleValueChange = (val: string) => {
        if (val === "all") {
            onChange(undefined); // reset
            onReset?.();
        } else {
            onChange(val);
        }
    };

    return (
        <div className="flex flex-col sm:flex-row gap-2 items-center w-fit">
            <Select value={value ?? "all"} onValueChange={handleValueChange}>
                <SelectTrigger className="w-[180px]">
                    <SelectValue placeholder="Select Category" />
                </SelectTrigger>
                <SelectContent>
                    <SelectItem value="all">Semua Kategori</SelectItem>
                    {options.map((opt) => (
                        <SelectItem key={opt} value={opt}>
                            {opt}
                        </SelectItem>
                    ))}
                </SelectContent>
            </Select>
        </div>
    );
};