import { StartNode } from './StartNode';
import { TaskNode } from './TaskNode';
import { ApprovalNode } from './ApprovalNode';
import { AutomatedStepNode } from './AutomatedStepNode';
import { EndNode } from './EndNode';
import { NodeTypes } from '@xyflow/react';

export const nodeTypes: NodeTypes = {
  start: StartNode,
  task: TaskNode,
  approval: ApprovalNode,
  automated: AutomatedStepNode,
  end: EndNode,
};

export { StartNode, TaskNode, ApprovalNode, AutomatedStepNode, EndNode };
