import { AutomatedStepNodeData } from '@/types/workflow';
import { useAutomations } from '@/hooks/useAutomations';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Skeleton } from '@/components/ui/skeleton';

interface AutomatedStepNodeFormProps {
  data: AutomatedStepNodeData;
  onChange: (data: Partial<AutomatedStepNodeData>) => void;
}

export const AutomatedStepNodeForm = ({ data, onChange }: AutomatedStepNodeFormProps) => {
  const { automations, loading, getAutomationById } = useAutomations();

  const selectedAutomation = getAutomationById(data.actionId);

  const handleActionChange = (actionId: string) => {
    const automation = getAutomationById(actionId);
    const newParams: Record<string, string> = {};
    
    if (automation) {
      automation.params.forEach((param) => {
        newParams[param] = data.actionParams[param] || '';
      });
    }

    onChange({ actionId, actionParams: newParams });
  };

  const handleParamChange = (param: string, value: string) => {
    onChange({
      actionParams: { ...data.actionParams, [param]: value },
    });
  };

  if (loading) {
    return (
      <div className="space-y-4">
        <Skeleton className="h-10 w-full" />
        <Skeleton className="h-10 w-full" />
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="title">Title</Label>
        <Input
          id="title"
          value={data.title}
          onChange={(e) => onChange({ title: e.target.value })}
          placeholder="Enter step title"
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="action">Action</Label>
        <Select value={data.actionId} onValueChange={handleActionChange}>
          <SelectTrigger>
            <SelectValue placeholder="Select an action" />
          </SelectTrigger>
          <SelectContent>
            {automations.map((automation) => (
              <SelectItem key={automation.id} value={automation.id}>
                {automation.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {selectedAutomation && selectedAutomation.params.length > 0 && (
        <div className="space-y-3 pt-2 border-t border-border">
          <Label className="text-muted-foreground">Action Parameters</Label>
          {selectedAutomation.params.map((param) => (
            <div key={param} className="space-y-1">
              <Label htmlFor={param} className="text-sm capitalize">
                {param.replace(/_/g, ' ')}
              </Label>
              <Input
                id={param}
                value={data.actionParams[param] || ''}
                onChange={(e) => handleParamChange(param, e.target.value)}
                placeholder={`Enter ${param}`}
              />
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
