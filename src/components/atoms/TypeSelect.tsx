import { Label } from "@/components/ui/label";

interface TypeSelectProps {
  value: string;
  onChange: (val: string) => void;
}

export const TypeSelect = ({ value, onChange }: TypeSelectProps) => (
  <div className="space-y-2">
    <Label>Type</Label>
    <select 
      value={value} 
      onChange={(e) => onChange(e.target.value)} 
      className="w-full h-10 border rounded-md px-3 text-sm bg-white focus:ring-2 focus:ring-primary/20 outline-none"
    >
      <option value="expense">Expense</option>
      <option value="income">Income</option>
    </select>
  </div>
);