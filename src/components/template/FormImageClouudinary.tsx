"use client";

import React, { useState } from "react";
import Image from "next/image";
import { Label } from "@/components/ui/label";

interface Props {
    label: string;
    value?: string;
    onChange: (url: string) => void;
}

export const FormImageCloudinary: React.FC<Props> = ({ label, value, onChange }) => {
    const [preview, setPreview] = useState<string | null>(value || null);
    const [uploading, setUploading] = useState(false);

    const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        setUploading(true);

        // Ambil signature dari backend
        const res = await fetch("/api/cloudinary");
        const data = await res.json();

        const formData = new FormData();
        formData.append("file", file);
        formData.append("api_key", data.api_key);
        formData.append("timestamp", data.timestamp);
        formData.append("signature", data.signature);

        const uploadRes = await fetch(
            `https://api.cloudinary.com/v1_1/${data.cloud_name}/auto/upload`,
            { method: "POST", body: formData }
        );

        const result = await uploadRes.json();
        setPreview(result.secure_url);
        onChange(result.secure_url);
        setUploading(false);
    };

    return (
        <div className="space-y-2">
            <Label>{label}</Label>
            <div className="border-2 relative border-dashed rounded-lg p-6 flex flex-col items-center justify-center cursor-pointer hover:bg-foreground/20">
                {preview ? (
                    <Image src={preview} alt="Preview" width={200} height={200} />
                ) : (
                    <p className="text-gray-500">{uploading ? "Uploading..." : "Drag & drop or click to upload"}</p>
                )}
                <input
                    type="file"
                    accept="image/*"
                    className="absolute w-full h-full opacity-0 cursor-pointer"
                    onChange={handleFileChange}
                />
            </div>
        </div>
    );
};
