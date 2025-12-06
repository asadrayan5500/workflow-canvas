import { UserPlus, Calendar, FileCheck, Award } from 'lucide-react';
import { workflowTemplates, WorkflowTemplate } from '@/data/workflowTemplates';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { useState } from 'react';

const iconMap: Record<string, React.ComponentType<{ className?: string }>> = {
  UserPlus,
  Calendar,
  FileCheck,
  Award,
};

interface TemplateSelectorProps {
  onSelectTemplate: (template: WorkflowTemplate) => void;
}

export const TemplateSelector = ({ onSelectTemplate }: TemplateSelectorProps) => {
  const [open, setOpen] = useState(false);

  const handleSelect = (template: WorkflowTemplate) => {
    onSelectTemplate(template);
    setOpen(false);
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" size="sm">
          Templates
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle>Workflow Templates</DialogTitle>
          <DialogDescription>
            Select a template to get started quickly
          </DialogDescription>
        </DialogHeader>
        <div className="grid grid-cols-2 gap-4 py-4">
          {workflowTemplates.map((template) => {
            const Icon = iconMap[template.icon] || FileCheck;
            return (
              <button
                key={template.id}
                onClick={() => handleSelect(template)}
                className="flex flex-col items-start gap-2 p-4 rounded-lg border border-border bg-card hover:bg-accent hover:border-primary transition-colors text-left"
              >
                <div className="flex items-center gap-2">
                  <div className="p-2 rounded-md bg-primary/10">
                    <Icon className="w-5 h-5 text-primary" />
                  </div>
                  <span className="font-medium text-foreground">{template.name}</span>
                </div>
                <p className="text-sm text-muted-foreground">{template.description}</p>
                <span className="text-xs text-muted-foreground">
                  {template.nodes.length} nodes • {template.edges.length} connections
                </span>
              </button>
            );
          })}
        </div>
      </DialogContent>
    </Dialog>
  );
};
