import { Label } from "@/components/ui/label";
import { CATEGORIES } from "@/constants/finance";

interface CategorySelectProps {
  value: string;
  onChange: (val: string) => void;
}

export const CategorySelect = ({ value, onChange }: CategorySelectProps) => (
  <div className="space-y-2">
    <Label>Category</Label>
    <select 
      value={value} 
      onChange={(e) => onChange(e.target.value)} 
      className="w-full h-10 border rounded-md px-3 text-sm bg-white focus:ring-2 focus:ring-primary/20 outline-none" 
      required
    >
      <option value="" disabled>Select category...</option>
      {CATEGORIES.map(cat => (
        <option key={cat.name} value={cat.name}>{cat.icon} {cat.name}</option>
      ))}
    </select>
  </div>
);