import { EndNodeData } from '@/types/workflow';
import { BaseNode } from './BaseNode';

interface EndNodeProps {
  data: EndNodeData;
  selected?: boolean;
}

export const EndNode = ({ data, selected }: EndNodeProps) => {
  return (
    <BaseNode
      nodeType="end"
      title="End"
      subtitle={data.endMessage}
      selected={selected}
    />
  );
};
