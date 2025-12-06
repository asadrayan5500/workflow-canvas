import { ApprovalNodeData } from '@/types/workflow';
import { BaseNode } from './BaseNode';

interface ApprovalNodeProps {
  data: ApprovalNodeData;
  selected?: boolean;
}

export const ApprovalNode = ({ data, selected }: ApprovalNodeProps) => {
  return (
    <BaseNode
      nodeType="approval"
      title={data.title}
      subtitle={data.approverRole}
      selected={selected}
    />
  );
};
