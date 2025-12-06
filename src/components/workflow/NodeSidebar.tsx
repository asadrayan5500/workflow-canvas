import { NodeType, NODE_TYPE_CONFIG } from '@/types/workflow';
import { Play, ClipboardList, UserCheck, Zap, Flag, GripVertical } from 'lucide-react';
import { cn } from '@/lib/utils';

const iconMap = {
  Play,
  ClipboardList,
  UserCheck,
  Zap,
  Flag,
};

interface NodeSidebarProps {
  onDragStart: (event: React.DragEvent, nodeType: NodeType) => void;
}

export const NodeSidebar = ({ onDragStart }: NodeSidebarProps) => {
  const nodeTypes: NodeType[] = ['start', 'task', 'approval', 'automated', 'end'];

  const colorClasses: Record<NodeType, string> = {
    start: 'border-l-success hover:bg-success/5',
    task: 'border-l-primary hover:bg-primary/5',
    approval: 'border-l-node-approval hover:bg-node-approval/5',
    automated: 'border-l-warning hover:bg-warning/5',
    end: 'border-l-destructive hover:bg-destructive/5',
  };

  const iconColorClasses: Record<NodeType, string> = {
    start: 'text-success',
    task: 'text-primary',
    approval: 'text-node-approval',
    automated: 'text-warning',
    end: 'text-destructive',
  };

  return (
    <div className="w-64 bg-card border-r border-border flex flex-col">
      <div className="p-4 border-b border-border">
        <h2 className="font-semibold text-foreground">Node Types</h2>
        <p className="text-xs text-muted-foreground mt-1">Drag nodes onto the canvas</p>
      </div>
      
      <div className="flex-1 overflow-y-auto p-3 space-y-2">
        {nodeTypes.map((type) => {
          const config = NODE_TYPE_CONFIG[type];
          const Icon = iconMap[config.icon as keyof typeof iconMap];

          return (
            <div
              key={type}
              draggable
              onDragStart={(e) => onDragStart(e, type)}
              className={cn(
                'flex items-center gap-3 p-3 rounded-lg border border-border border-l-4 cursor-grab active:cursor-grabbing transition-colors',
                colorClasses[type]
              )}
            >
              <GripVertical className="w-4 h-4 text-muted-foreground" />
              <Icon className={cn('w-5 h-5', iconColorClasses[type])} />
              <div className="flex-1">
                <p className="font-medium text-sm text-foreground">{config.label}</p>
                <p className="text-xs text-muted-foreground">
                  {getNodeDescription(type)}
                </p>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

const getNodeDescription = (type: NodeType): string => {
  switch (type) {
    case 'start':
      return 'Workflow entry point';
    case 'task':
      return 'Human task assignment';
    case 'approval':
      return 'Manager approval step';
    case 'automated':
      return 'System automation';
    case 'end':
      return 'Workflow completion';
  }
};
