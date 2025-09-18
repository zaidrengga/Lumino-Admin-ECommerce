import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"
import { format, parseISO } from 'date-fns';
import { id } from 'date-fns/locale';


export const formattedDate = (date: Date) => {
  return format(parseISO(date.toString()), 'dd/MM/yyyy', { locale: id });
}


export const formatRupiah = (value: number | string) => {
  if (!value) return "";
  const number = typeof value === "string" ? parseInt(value.replace(/\D/g, "")) : value;
  return new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    minimumFractionDigits: 0,
  }).format(number);
};

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}