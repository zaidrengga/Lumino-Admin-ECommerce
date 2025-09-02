"use client";

import { Input } from "../ui/input";
import { Label } from "../ui/label";
import React, { useState } from "react";
import { Textarea } from "../ui/textarea";
import { Select, SelectContent, SelectItem, SelectValue, SelectTrigger } from "../ui/select";
import { Button } from "../ui/button";
import { Check, Plus, X } from "lucide-react";

// FORM INPUT

interface FormInputProps extends React.InputHTMLAttributes<HTMLInputElement> {
    label: string;
}

export const FormInput: React.FC<FormInputProps> = ({ label, id, ...props }) => {
    return (
        <div className="space-y-2">
            <Label htmlFor={id}>{label}</Label>
            <Input id={id} {...props} />
        </div>
    );
};

// FORM TEXTAREA

interface FormTextreaProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
    label: string;
}

export const FormTextrea: React.FC<FormTextreaProps> = ({ label, id, ...props }) => {
    return (
        <div className="space-y-2">
            <Label htmlFor={id}>{label}</Label>
            <Textarea id={id} {...props} />
        </div>
    );
};


// FORM SELECT


interface FormSelectProps {
    id?: string;
    label: string;
    placeholder: string;
    options: { value: string; label: string }[];
    value?: string | string[];
    onChange?: (value: string | string[]) => void;
    required?: boolean;
    multiple?: boolean;
}

export const FormSelect: React.FC<FormSelectProps> = ({
    id,
    label,
    options,
    placeholder,
    value,
    onChange,
    required,
    multiple = false,
}) => {
    const [search, setSearch] = useState("");

    // Filter options berdasarkan search
    const filteredOptions = options.filter((opt) =>
        opt.label.toLowerCase().includes(search.toLowerCase())
    );

    // Handle select item click
    const handleSelect = (selectedValue: string) => {
        if (multiple) {
            const currentValues = Array.isArray(value) ? value : [];
            if (currentValues.includes(selectedValue)) {
                onChange?.(currentValues.filter((v) => v !== selectedValue));
            } else {
                onChange?.([...currentValues, selectedValue]);
            }
        } else {
            onChange?.(selectedValue);
        }
    };

    // Tampilkan value yang dipilih
    const displayValue = multiple
        ? Array.isArray(value) && value.length > 0
            ? options
                .filter((opt) => value.includes(opt.value))
                .map((opt) => opt.label)
                .join(", ")
            : ""
        : options.find((opt) => opt.value === value)?.label || "";

    return (
        <div className="space-y-2">
            <Label htmlFor={id}>{label}</Label>
            <Select
                value={typeof value === "string" ? value : ""}
                onValueChange={handleSelect}
                required={required}
            >
                <SelectTrigger id={id}>
                    <SelectValue placeholder={placeholder}>
                        {displayValue || placeholder}
                    </SelectValue>
                </SelectTrigger>
                <SelectContent className="space-y-2">
                    {multiple && (
                        <Input
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                            placeholder="Search..."
                            className="mb-2"
                        />
                    )}
                    {filteredOptions.map((option) => (
                        <SelectItem key={option.value} value={option.value}>
                            {option.label}
                            {multiple &&
                                Array.isArray(value) &&
                                value.includes(option.value) ? (
                                <Check className="ml-2 h-4 w-4" />
                            ) : null}
                        </SelectItem>
                    ))}
                </SelectContent>
            </Select>
        </div>
    );
};

// FORM LIST INPUT

interface FormListInputProps {
    label: string;
    values: string[];
    onChange: (newValues: string[]) => void;
    placeholder?: string;
}

export const FormListInput = ({
    label,
    values,
    onChange,
    placeholder = "Add item",
}: FormListInputProps) => {
    const [newValue, setNewValue] = useState("");

    const handleAdd = () => {
        if (!newValue.trim()) return;
        onChange([...values, newValue.trim()]);
        setNewValue("");
    };

    const handleRemove = (index: number) => {
        onChange(values.filter((_, i) => i !== index));
    };

    return (
        <div className="space-y-2">
            <Label>{label}</Label>
            <div className="flex gap-2">
                <Input
                    type="text"
                    placeholder={placeholder}
                    value={newValue}
                    onChange={(e) => setNewValue(e.target.value)}
                />
                <Button
                    type="button"
                    size="icon"
                    onClick={handleAdd}
                    disabled={!newValue}
                >
                    <Plus />
                </Button>
            </div>

            <ul className="list-disc pl-5 space-y-1">
                {values.map((val, i) => (
                    <li
                        key={i}
                        className="flex items-center justify-between gap-2 bg-muted px-2 py-1 rounded"
                    >
                        <span>{val}</span>
                        <Button
                            type="button"
                            variant="destructive"
                            size="icon"
                            onClick={() => handleRemove(i)}
                        >
                            <X />
                        </Button>
                    </li>
                ))}
            </ul>
        </div>
    );
};


// FORM LIST OBJECT

interface Field {
    key: string; // nama field misalnya "name", "icon"
    placeholder: string;
}

interface FormListObjectProps<T extends Record<string, string>> {
    label: string;
    fields: Field[];
    values: T[];
    onChange: (newValues: T[]) => void;
}

export const FormListObject = <T extends Record<string, string>>({
    label,
    fields,
    values,
    onChange,
}: FormListObjectProps<T>) => {
    const [inputs, setInputs] = useState<Record<string, string>>({});

    const handleChange = (key: string, value: string) => {
        setInputs((prev) => ({ ...prev, [key]: value }));
    };

    const handleAdd = () => {
        if (fields.some((f) => !inputs[f.key]?.trim())) return;
        onChange([...values, inputs as T]);
        setInputs({});
    };

    const handleRemove = (index: number) => {
        onChange(values.filter((_, i) => i !== index));
    };

    return (
        <div className="space-y-2">
            <Label>{label}</Label>
            <div className="flex gap-2">
                {fields.map((f) => (
                    <Input
                        key={f.key}
                        type="text"
                        placeholder={f.placeholder}
                        value={inputs[f.key] || ""}
                        onChange={(e) => handleChange(f.key, e.target.value)}
                    />
                ))}
                <Button type="button" size="icon" onClick={handleAdd}>
                    <Plus />
                </Button>
            </div>

            <ul className="list-disc pl-5 space-y-1">
                {values.map((item, i) => (
                    <li
                        key={i}
                        className="flex items-center justify-between gap-2 bg-muted px-2 py-1 rounded"
                    >
                        <span>
                            {fields.map((f, idx) => (
                                <span key={f.key}>
                                    {item[f.key]}
                                    {idx < fields.length - 1 && " - "}
                                </span>
                            ))}
                        </span>
                        <Button
                            type="button"
                            variant="destructive"
                            size="icon"
                            onClick={() => handleRemove(i)}
                        >
                            <X />
                        </Button>
                    </li>
                ))}
            </ul>
        </div>
    );
};