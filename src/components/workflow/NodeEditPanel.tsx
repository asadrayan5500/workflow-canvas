import { WorkflowNode, WorkflowNodeData, StartNodeData, TaskNodeData, ApprovalNodeData, AutomatedStepNodeData, EndNodeData } from '@/types/workflow';
import { StartNodeForm } from './forms/StartNodeForm';
import { TaskNodeForm } from './forms/TaskNodeForm';
import { ApprovalNodeForm } from './forms/ApprovalNodeForm';
import { AutomatedStepNodeForm } from './forms/AutomatedStepNodeForm';
import { EndNodeForm } from './forms/EndNodeForm';
import { Button } from '@/components/ui/button';
import { X, Trash2 } from 'lucide-react';
import { NODE_TYPE_CONFIG } from '@/types/workflow';

interface NodeEditPanelProps {
  node: WorkflowNode;
  onUpdate: (data: Partial<WorkflowNodeData>) => void;
  onDelete: () => void;
  onClose: () => void;
}

export const NodeEditPanel = ({ node, onUpdate, onDelete, onClose }: NodeEditPanelProps) => {
  const nodeData = node.data as WorkflowNodeData;
  const config = NODE_TYPE_CONFIG[nodeData.type];

  const renderForm = () => {
    switch (nodeData.type) {
      case 'start':
        return <StartNodeForm data={nodeData as StartNodeData} onChange={onUpdate} />;
      case 'task':
        return <TaskNodeForm data={nodeData as TaskNodeData} onChange={onUpdate} />;
      case 'approval':
        return <ApprovalNodeForm data={nodeData as ApprovalNodeData} onChange={onUpdate} />;
      case 'automated':
        return <AutomatedStepNodeForm data={nodeData as AutomatedStepNodeData} onChange={onUpdate} />;
      case 'end':
        return <EndNodeForm data={nodeData as EndNodeData} onChange={onUpdate} />;
    }
  };

  return (
    <div className="w-80 bg-card border-l border-border flex flex-col animate-slide-in">
      <div className="p-4 border-b border-border flex items-center justify-between">
        <div>
          <h3 className="font-semibold text-foreground">Edit {config.label} Node</h3>
          <p className="text-xs text-muted-foreground">Configure node properties</p>
        </div>
        <Button variant="ghost" size="icon" onClick={onClose}>
          <X className="w-4 h-4" />
        </Button>
      </div>

      <div className="flex-1 overflow-y-auto p-4">
        {renderForm()}
      </div>

      <div className="p-4 border-t border-border">
        <Button
          variant="destructive"
          className="w-full"
          onClick={onDelete}
        >
          <Trash2 className="w-4 h-4 mr-2" />
          Delete Node
        </Button>
      </div>
    </div>
  );
};
