import { DateSelectProps } from "@/types/interfaces";

export const DateSelect = ({ value, options, onChange }: DateSelectProps) => (
  <select 
    value={value} 
    onChange={(e) => onChange(Number(e.target.value))} 
    className="p-2 bg-white border rounded-md text-sm focus:ring-2 focus:ring-primary/20 outline-none"
  >
    {options.map(opt => (
      <option key={opt.value} value={opt.value}>{opt.label}</option>
    ))}
  </select>
);
