import { EndNodeData } from '@/types/workflow';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';

interface EndNodeFormProps {
  data: EndNodeData;
  onChange: (data: Partial<EndNodeData>) => void;
}

export const EndNodeForm = ({ data, onChange }: EndNodeFormProps) => {
  return (
    <div className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="endMessage">End Message</Label>
        <Input
          id="endMessage"
          value={data.endMessage}
          onChange={(e) => onChange({ endMessage: e.target.value })}
          placeholder="Enter completion message"
        />
      </div>

      <div className="flex items-center justify-between">
        <div className="space-y-0.5">
          <Label htmlFor="showSummary">Show Summary</Label>
          <p className="text-xs text-muted-foreground">
            Display workflow execution summary at the end
          </p>
        </div>
        <Switch
          id="showSummary"
          checked={data.showSummary}
          onCheckedChange={(checked) => onChange({ showSummary: checked })}
        />
      </div>
    </div>
  );
};
