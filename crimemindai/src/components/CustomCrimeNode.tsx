import { memo } from 'react';
import { Handle, Position } from '@xyflow/react';
import { User, Car, Phone, ShieldAlert, FileText, MapPin, Users } from 'lucide-react';
import { NetworkNodeData } from '../types';

const NODE_ICONS = {
  Person: User,
  Vehicle: Car,
  Phone: Phone,
  Weapon: ShieldAlert,
  Case: FileText,
  Location: MapPin,
  Associate: Users
};

const TYPE_COLORS = {
  Person: 'border-red-500/50 bg-red-950/40 text-red-400',
  Vehicle: 'border-amber-500/50 bg-amber-950/40 text-amber-400',
  Phone: 'border-cyan-500/50 bg-cyan-950/40 text-cyan-400',
  Weapon: 'border-rose-600/60 bg-rose-950/50 text-rose-300',
  Case: 'border-blue-500/50 bg-blue-950/40 text-blue-400',
  Location: 'border-emerald-500/50 bg-emerald-950/40 text-emerald-400',
  Associate: 'border-purple-500/50 bg-purple-950/40 text-purple-400'
};

export const CustomCrimeNode = memo(({ data }: { data: NetworkNodeData }) => {
  const IconComp = NODE_ICONS[data.type] || FileText;
  const colorClass = TYPE_COLORS[data.type] || TYPE_COLORS.Case;

  return (
    <div className={`px-4 py-3 rounded-xl border backdrop-blur-md shadow-lg transition-all hover:scale-105 cursor-pointer max-w-[220px] ${colorClass}`}>
      <Handle type="target" position={Position.Top} className="!bg-slate-400 !w-3 !h-3" />
      
      <div className="flex items-center gap-2 mb-1">
        <div className="p-1.5 rounded-lg bg-slate-900/80 shrink-0">
          <IconComp className="w-4 h-4" />
        </div>
        <div>
          <span className="text-[10px] uppercase tracking-wider font-semibold opacity-70 block">
            {data.type}
          </span>
          <h4 className="text-xs font-bold text-slate-100 truncate max-w-[140px]">
            {data.label}
          </h4>
        </div>
      </div>

      {data.subtitle && (
        <p className="text-[11px] text-slate-300 truncate font-mono mt-1">
          {data.subtitle}
        </p>
      )}

      {data.details && (
        <p className="text-[10px] text-slate-400 line-clamp-2 mt-1 italic">
          {data.details}
        </p>
      )}

      <Handle type="source" position={Position.Bottom} className="!bg-slate-400 !w-3 !h-3" />
    </div>
  );
});

CustomCrimeNode.displayName = 'CustomCrimeNode';
