import { TaskNodeData, KeyValuePair } from '@/types/workflow';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { Plus, X } from 'lucide-react';

interface TaskNodeFormProps {
  data: TaskNodeData;
  onChange: (data: Partial<TaskNodeData>) => void;
}

export const TaskNodeForm = ({ data, onChange }: TaskNodeFormProps) => {
  const addCustomField = () => {
    onChange({
      customFields: [...data.customFields, { key: '', value: '' }],
    });
  };

  const updateCustomField = (index: number, field: 'key' | 'value', value: string) => {
    const newFields = [...data.customFields];
    newFields[index] = { ...newFields[index], [field]: value };
    onChange({ customFields: newFields });
  };

  const removeCustomField = (index: number) => {
    onChange({
      customFields: data.customFields.filter((_, i) => i !== index),
    });
  };

  return (
    <div className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="title">Title *</Label>
        <Input
          id="title"
          value={data.title}
          onChange={(e) => onChange({ title: e.target.value })}
          placeholder="Enter task title"
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="description">Description</Label>
        <Textarea
          id="description"
          value={data.description}
          onChange={(e) => onChange({ description: e.target.value })}
          placeholder="Describe the task..."
          rows={3}
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="assignee">Assignee</Label>
        <Input
          id="assignee"
          value={data.assignee}
          onChange={(e) => onChange({ assignee: e.target.value })}
          placeholder="e.g., john.doe@company.com"
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="dueDate">Due Date</Label>
        <Input
          id="dueDate"
          type="date"
          value={data.dueDate}
          onChange={(e) => onChange({ dueDate: e.target.value })}
        />
      </div>

      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <Label>Custom Fields</Label>
          <Button type="button" variant="ghost" size="sm" onClick={addCustomField}>
            <Plus className="w-4 h-4 mr-1" />
            Add
          </Button>
        </div>

        {data.customFields.length === 0 && (
          <p className="text-sm text-muted-foreground">No custom fields</p>
        )}

        {data.customFields.map((item, index) => (
          <div key={index} className="flex gap-2 items-center">
            <Input
              placeholder="Field name"
              value={item.key}
              onChange={(e) => updateCustomField(index, 'key', e.target.value)}
              className="flex-1"
            />
            <Input
              placeholder="Value"
              value={item.value}
              onChange={(e) => updateCustomField(index, 'value', e.target.value)}
              className="flex-1"
            />
            <Button
              type="button"
              variant="ghost"
              size="icon"
              onClick={() => removeCustomField(index)}
            >
              <X className="w-4 h-4" />
            </Button>
          </div>
        ))}
      </div>
    </div>
  );
};
