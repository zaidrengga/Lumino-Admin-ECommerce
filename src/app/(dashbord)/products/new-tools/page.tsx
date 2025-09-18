"use client"

import { FormInput } from '@/components/template/FormField';
import { Button } from '@/components/ui/button';
import { Tols } from '@/generated/prisma';
import { useCrud } from '@/hooks/use-crud';
import React from 'react';
import { toast } from 'sonner';

type ToolFormData = Omit<Tols, 'id'>;

const NewToolsPage = () => {
    // Gunakan alias yang lebih deskriptif jika diperlukan, misal: 'existingTools'
    const { items: tools, add: addTool, loading } = useCrud<Tols>("tools");

    const [formData, setFormData] = React.useState<ToolFormData>({
        name: "",
        icon: "",
    });

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { id, value } = e.target;
        setFormData(prev => ({ ...prev, [id]: value }));
    };

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault(); // Mencegah reload halaman saat form disubmit

        try {
            // Validasi input
            if (!formData.name || !formData.icon) {
                toast.error("Please fill all the required fields");
                return;
            }

            // Pengecekan duplikasi nama (case-insensitive lebih baik)
            if (tools.some(tool => tool.name.toLowerCase() === formData.name.toLowerCase())) {
                toast.error("A tool with this name already exists");
                return;
            }

            // Buat objek tool baru dengan ID unik saat submit
            const newTool: Tols = {
                id: crypto.randomUUID(),
                ...formData,
            };

            await addTool(newTool);

            toast.success("Tool added successfully! 🎉");

            // Reset form setelah berhasil
            setFormData({ name: "", icon: "" });

        } catch (error) {
            console.error(error);
            toast.error("Failed to add tool. Please try again.");
        }
    };

    return (
        <div className='space-y-4'>
            <h1 className='text-2xl font-bold text-primary'>New Tools</h1>

            {/* Gunakan elemen <form> untuk semantik dan aksesibilitas yang lebih baik */}
            <form onSubmit={handleSubmit} className="space-y-4">
                <div className="space-y-2">
                    <FormInput
                        label="Name"
                        id="name"
                        value={formData.name}
                        onChange={handleInputChange}
                        disabled={loading}
                    />
                    <FormInput
                        label="Icon"
                        id="icon"
                        value={formData.icon}
                        onChange={handleInputChange}
                        disabled={loading}
                    />
                </div>

                {/* Ganti onClick dengan type="submit" di dalam <form> */}
                <Button type="submit" disabled={loading}>
                    {loading ? "Submitting..." : "Submit"}
                </Button>
            </form>
        </div>
    );
}

export default NewToolsPage;