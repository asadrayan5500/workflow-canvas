import { Handle, Position } from '@xyflow/react';
import { cn } from '@/lib/utils';
import { NodeType, NODE_TYPE_CONFIG } from '@/types/workflow';
import { Play, ClipboardList, UserCheck, Zap, Flag } from 'lucide-react';

const iconMap = {
  Play,
  ClipboardList,
  UserCheck,
  Zap,
  Flag,
};

interface BaseNodeProps {
  nodeType: NodeType;
  title: string;
  subtitle?: string;
  selected?: boolean;
  children?: React.ReactNode;
}

export const BaseNode = ({ nodeType, title, subtitle, selected, children }: BaseNodeProps) => {
  const config = NODE_TYPE_CONFIG[nodeType];
  const Icon = iconMap[config.icon as keyof typeof iconMap];

  const colorClasses: Record<NodeType, string> = {
    start: 'border-l-success bg-success/5',
    task: 'border-l-primary bg-primary/5',
    approval: 'border-l-node-approval bg-node-approval/5',
    automated: 'border-l-warning bg-warning/5',
    end: 'border-l-destructive bg-destructive/5',
  };

  const iconColorClasses: Record<NodeType, string> = {
    start: 'bg-success text-success-foreground',
    task: 'bg-primary text-primary-foreground',
    approval: 'bg-node-approval text-primary-foreground',
    automated: 'bg-warning text-warning-foreground',
    end: 'bg-destructive text-destructive-foreground',
  };

  return (
    <div
      className={cn(
        'workflow-node min-w-[180px] max-w-[220px] border-l-4',
        colorClasses[nodeType],
        selected && 'ring-2 ring-primary ring-offset-2 ring-offset-background'
      )}
    >
      {nodeType !== 'start' && (
        <Handle
          type="target"
          position={Position.Top}
          className="node-handle"
        />
      )}

      <div className="p-3">
        <div className="flex items-center gap-2 mb-1">
          <div className={cn('p-1.5 rounded-md', iconColorClasses[nodeType])}>
            <Icon className="w-3.5 h-3.5" />
          </div>
          <span className="text-[10px] font-medium uppercase tracking-wider text-muted-foreground">
            {config.label}
          </span>
        </div>
        <h4 className="font-semibold text-sm text-foreground truncate">{title}</h4>
        {subtitle && (
          <p className="text-xs text-muted-foreground truncate mt-0.5">{subtitle}</p>
        )}
        {children}
      </div>

      {nodeType !== 'end' && (
        <Handle
          type="source"
          position={Position.Bottom}
          className="node-handle"
        />
      )}
    </div>
  );
};
