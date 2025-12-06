import { useState } from 'react';
import { WorkflowNode, WorkflowEdge, SimulationResult, SimulationStep, NODE_TYPE_CONFIG } from '@/types/workflow';
import { simulateWorkflow } from '@/api/mockApi';
import { Button } from '@/components/ui/button';
import { 
  Play, 
  AlertCircle, 
  CheckCircle2, 
  Clock, 
  Loader2, 
  X,
  Download,
  Upload,
  FileJson
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Textarea } from '@/components/ui/textarea';
import { toast } from '@/hooks/use-toast';

interface SandboxPanelProps {
  nodes: WorkflowNode[];
  edges: WorkflowEdge[];
  onExport: () => string;
  onImport: (json: string) => boolean;
  onClear: () => void;
}

export const SandboxPanel = ({ nodes, edges, onExport, onImport, onClear }: SandboxPanelProps) => {
  const [isSimulating, setIsSimulating] = useState(false);
  const [result, setResult] = useState<SimulationResult | null>(null);
  const [importJson, setImportJson] = useState('');

  const runSimulation = async () => {
    setIsSimulating(true);
    setResult(null);

    try {
      const simResult = await simulateWorkflow(nodes, edges);
      setResult(simResult);
    } catch (error) {
      setResult({
        success: false,
        steps: [],
        errors: ['Simulation failed unexpectedly'],
      });
    } finally {
      setIsSimulating(false);
    }
  };

  const handleExport = () => {
    const json = onExport();
    const blob = new Blob([json], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'workflow.json';
    a.click();
    URL.revokeObjectURL(url);
    toast({ title: 'Workflow exported', description: 'JSON file downloaded successfully' });
  };

  const handleImport = () => {
    const success = onImport(importJson);
    if (success) {
      toast({ title: 'Workflow imported', description: 'Workflow loaded successfully' });
      setImportJson('');
    } else {
      toast({ title: 'Import failed', description: 'Invalid JSON format', variant: 'destructive' });
    }
  };

  return (
    <div className="h-full flex flex-col">
      <div className="p-4 border-b border-border">
        <h3 className="font-semibold text-foreground">Workflow Sandbox</h3>
        <p className="text-xs text-muted-foreground mt-1">Test and validate your workflow</p>
      </div>

      <div className="p-4 space-y-3 border-b border-border">
        <Button
          onClick={runSimulation}
          disabled={isSimulating || nodes.length === 0}
          className="w-full"
        >
          {isSimulating ? (
            <>
              <Loader2 className="w-4 h-4 mr-2 animate-spin" />
              Simulating...
            </>
          ) : (
            <>
              <Play className="w-4 h-4 mr-2" />
              Run Simulation
            </>
          )}
        </Button>

        <div className="grid grid-cols-2 gap-2">
          <Button variant="outline" size="sm" onClick={handleExport} disabled={nodes.length === 0}>
            <Download className="w-4 h-4 mr-1" />
            Export
          </Button>
          
          <Dialog>
            <DialogTrigger asChild>
              <Button variant="outline" size="sm">
                <Upload className="w-4 h-4 mr-1" />
                Import
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Import Workflow</DialogTitle>
              </DialogHeader>
              <div className="space-y-4">
                <Textarea
                  placeholder="Paste workflow JSON here..."
                  value={importJson}
                  onChange={(e) => setImportJson(e.target.value)}
                  rows={10}
                  className="font-mono text-sm"
                />
                <Button onClick={handleImport} className="w-full">
                  <FileJson className="w-4 h-4 mr-2" />
                  Import Workflow
                </Button>
              </div>
            </DialogContent>
          </Dialog>
        </div>

        <Button variant="ghost" size="sm" onClick={onClear} disabled={nodes.length === 0} className="w-full text-muted-foreground">
          <X className="w-4 h-4 mr-1" />
          Clear Canvas
        </Button>
      </div>

      <div className="flex-1 overflow-y-auto p-4">
        {result && (
          <div className="space-y-4">
            {/* Status Banner */}
            <div
              className={cn(
                'p-3 rounded-lg flex items-center gap-2',
                result.success ? 'bg-success/10 text-success' : 'bg-destructive/10 text-destructive'
              )}
            >
              {result.success ? (
                <CheckCircle2 className="w-5 h-5" />
              ) : (
                <AlertCircle className="w-5 h-5" />
              )}
              <span className="font-medium">
                {result.success ? 'Simulation Completed' : 'Simulation Failed'}
              </span>
            </div>

            {/* Errors */}
            {result.errors.length > 0 && (
              <div className="space-y-2">
                <h4 className="text-sm font-medium text-destructive">Errors</h4>
                {result.errors.map((error, index) => (
                  <div
                    key={index}
                    className="p-2 bg-destructive/10 rounded text-sm text-destructive"
                  >
                    {error}
                  </div>
                ))}
              </div>
            )}

            {/* Execution Steps */}
            {result.steps.length > 0 && (
              <div className="space-y-2">
                <h4 className="text-sm font-medium text-foreground">Execution Log</h4>
                <div className="space-y-1">
                  {result.steps.map((step, index) => (
                    <StepItem key={index} step={step} index={index} />
                  ))}
                </div>
              </div>
            )}
          </div>
        )}

        {!result && nodes.length === 0 && (
          <div className="text-center text-muted-foreground py-8">
            <FileJson className="w-12 h-12 mx-auto mb-3 opacity-50" />
            <p className="text-sm">Add nodes to the canvas to get started</p>
          </div>
        )}

        {!result && nodes.length > 0 && (
          <div className="text-center text-muted-foreground py-8">
            <Play className="w-12 h-12 mx-auto mb-3 opacity-50" />
            <p className="text-sm">Click "Run Simulation" to test your workflow</p>
          </div>
        )}
      </div>
    </div>
  );
};

const StepItem = ({ step, index }: { step: SimulationStep; index: number }) => {
  const config = NODE_TYPE_CONFIG[step.nodeType];
  
  const statusColors = {
    pending: 'text-muted-foreground',
    running: 'text-primary',
    completed: 'text-success',
    failed: 'text-destructive',
  };

  const StatusIcon = {
    pending: Clock,
    running: Loader2,
    completed: CheckCircle2,
    failed: AlertCircle,
  }[step.status];

  return (
    <div className="flex items-start gap-3 p-2 rounded hover:bg-accent/50 transition-colors">
      <div className="flex-shrink-0 w-6 h-6 rounded-full bg-muted flex items-center justify-center text-xs font-medium">
        {index + 1}
      </div>
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2">
          <span className="text-xs font-medium uppercase text-muted-foreground">
            {config.label}
          </span>
          <StatusIcon className={cn('w-3.5 h-3.5', statusColors[step.status])} />
        </div>
        <p className="text-sm font-medium text-foreground truncate">{step.nodeTitle}</p>
        <p className="text-xs text-muted-foreground">{step.message}</p>
      </div>
    </div>
  );
};
