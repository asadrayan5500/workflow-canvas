import { ApprovalNodeData } from '@/types/workflow';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

interface ApprovalNodeFormProps {
  data: ApprovalNodeData;
  onChange: (data: Partial<ApprovalNodeData>) => void;
}

const APPROVER_ROLES = [
  'Manager',
  'HRBP',
  'Director',
  'VP',
  'CEO',
  'Finance',
  'Legal',
  'IT Admin',
];

export const ApprovalNodeForm = ({ data, onChange }: ApprovalNodeFormProps) => {
  return (
    <div className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="title">Title</Label>
        <Input
          id="title"
          value={data.title}
          onChange={(e) => onChange({ title: e.target.value })}
          placeholder="Enter approval title"
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="approverRole">Approver Role</Label>
        <Select
          value={data.approverRole}
          onValueChange={(value) => onChange({ approverRole: value })}
        >
          <SelectTrigger>
            <SelectValue placeholder="Select approver role" />
          </SelectTrigger>
          <SelectContent>
            {APPROVER_ROLES.map((role) => (
              <SelectItem key={role} value={role}>
                {role}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div className="space-y-2">
        <Label htmlFor="threshold">Auto-Approve Threshold</Label>
        <Input
          id="threshold"
          type="number"
          min={0}
          value={data.autoApproveThreshold}
          onChange={(e) => onChange({ autoApproveThreshold: parseInt(e.target.value) || 0 })}
          placeholder="0 = manual approval required"
        />
        <p className="text-xs text-muted-foreground">
          Set a value amount below which requests are auto-approved. Set to 0 for manual approval.
        </p>
      </div>
    </div>
  );
};
