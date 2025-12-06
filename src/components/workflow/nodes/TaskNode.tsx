import { TaskNodeData } from '@/types/workflow';
import { BaseNode } from './BaseNode';

interface TaskNodeProps {
  data: TaskNodeData;
  selected?: boolean;
}

export const TaskNode = ({ data, selected }: TaskNodeProps) => {
  return (
    <BaseNode
      nodeType="task"
      title={data.title}
      subtitle={data.assignee || 'Unassigned'}
      selected={selected}
    />
  );
};
