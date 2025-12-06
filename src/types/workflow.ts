import { Node, Edge } from '@xyflow/react';

export type NodeType = 'start' | 'task' | 'approval' | 'automated' | 'end';

export interface KeyValuePair {
  key: string;
  value: string;
}

export interface StartNodeData {
  type: 'start';
  title: string;
  metadata: KeyValuePair[];
  [key: string]: unknown;
}

export interface TaskNodeData {
  type: 'task';
  title: string;
  description: string;
  assignee: string;
  dueDate: string;
  customFields: KeyValuePair[];
  [key: string]: unknown;
}

export interface ApprovalNodeData {
  type: 'approval';
  title: string;
  approverRole: string;
  autoApproveThreshold: number;
  [key: string]: unknown;
}

export interface AutomatedStepNodeData {
  type: 'automated';
  title: string;
  actionId: string;
  actionParams: Record<string, string>;
  [key: string]: unknown;
}

export interface EndNodeData {
  type: 'end';
  endMessage: string;
  showSummary: boolean;
  [key: string]: unknown;
}

export type WorkflowNodeData = 
  | StartNodeData 
  | TaskNodeData 
  | ApprovalNodeData 
  | AutomatedStepNodeData 
  | EndNodeData;

export type WorkflowNode = Node<WorkflowNodeData>;
export type WorkflowEdge = Edge;

export interface Automation {
  id: string;
  label: string;
  params: string[];
}

export interface SimulationStep {
  nodeId: string;
  nodeTitle: string;
  nodeType: NodeType;
  status: 'pending' | 'running' | 'completed' | 'failed';
  message: string;
  timestamp: string;
}

export interface SimulationResult {
  success: boolean;
  steps: SimulationStep[];
  errors: string[];
}

export interface WorkflowValidation {
  isValid: boolean;
  errors: ValidationError[];
}

export interface ValidationError {
  nodeId?: string;
  message: string;
  severity: 'error' | 'warning';
}

export const NODE_TYPE_CONFIG: Record<NodeType, {
  label: string;
  color: string;
  icon: string;
}> = {
  start: { label: 'Start', color: 'node-start', icon: 'Play' },
  task: { label: 'Task', color: 'node-task', icon: 'ClipboardList' },
  approval: { label: 'Approval', color: 'node-approval', icon: 'UserCheck' },
  automated: { label: 'Automated', color: 'node-automated', icon: 'Zap' },
  end: { label: 'End', color: 'node-end', icon: 'Flag' },
};

export const getDefaultNodeData = (type: NodeType): WorkflowNodeData => {
  switch (type) {
    case 'start':
      return { type: 'start', title: 'Start', metadata: [] };
    case 'task':
      return { type: 'task', title: 'New Task', description: '', assignee: '', dueDate: '', customFields: [] };
    case 'approval':
      return { type: 'approval', title: 'Approval Required', approverRole: 'Manager', autoApproveThreshold: 0 };
    case 'automated':
      return { type: 'automated', title: 'Automated Step', actionId: '', actionParams: {} };
    case 'end':
      return { type: 'end', endMessage: 'Workflow completed', showSummary: true };
  }
};
