import { CURRENCIES } from "@/constants/finance";
import { Coins } from "lucide-react";
import { CurrencySelectProps } from "@/types/interfaces";


export const CurrencySelect = ({ value, onChange }: CurrencySelectProps) => (
  <div className="flex items-center gap-2 border-r pr-4 mr-2">
    <Coins size={18} className="text-primary" />
    <select 
      value={value} 
      onChange={(e) => onChange(e.target.value)} 
      className="bg-transparent font-bold text-sm focus:outline-none cursor-pointer"
    >
      {CURRENCIES.map(c => <option key={c.symbol} value={c.symbol}>{c.label}</option>)}
    </select>
  </div>
);