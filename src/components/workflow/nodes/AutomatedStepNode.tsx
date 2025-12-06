import { AutomatedStepNodeData } from '@/types/workflow';
import { BaseNode } from './BaseNode';

interface AutomatedStepNodeProps {
  data: AutomatedStepNodeData;
  selected?: boolean;
}

export const AutomatedStepNode = ({ data, selected }: AutomatedStepNodeProps) => {
  return (
    <BaseNode
      nodeType="automated"
      title={data.title}
      subtitle={data.actionId || 'No action selected'}
      selected={selected}
    />
  );
};
