import { StartNodeData } from '@/types/workflow';
import { BaseNode } from './BaseNode';

interface StartNodeProps {
  data: StartNodeData;
  selected?: boolean;
}

export const StartNode = ({ data, selected }: StartNodeProps) => {
  return (
    <BaseNode
      nodeType="start"
      title={data.title}
      subtitle={data.metadata.length > 0 ? `${data.metadata.length} metadata fields` : undefined}
      selected={selected}
    />
  );
};
