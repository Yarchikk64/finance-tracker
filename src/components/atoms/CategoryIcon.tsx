import { getIcon } from "@/helpers/icons";
import { Props } from "@/types/interfaces"


export const CategoryIcon = ({ category, type }: Props) => (
  <div className={`w-9 h-9 flex items-center justify-center rounded-full text-lg ${
    type === 'income' ? 'bg-green-50' : 'bg-slate-50'
  }`}>
    {type === 'income' ? "📈" : getIcon(category)}
  </div>
);