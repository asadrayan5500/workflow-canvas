import { useCallback, useRef, useEffect } from 'react';
import {
  ReactFlow,
  Background,
  Controls,
  MiniMap,
  ReactFlowProvider,
  useReactFlow,
  Node,
} from '@xyflow/react';
import '@xyflow/react/dist/style.css';

import { nodeTypes } from './nodes';
import { NodeSidebar } from './NodeSidebar';
import { NodeEditPanel } from './NodeEditPanel';
import { SandboxPanel } from './SandboxPanel';
import { TemplateSelector } from './TemplateSelector';
import { useWorkflow } from '@/hooks/useWorkflow';
import { NodeType, WorkflowNode } from '@/types/workflow';
import { WorkflowTemplate } from '@/data/workflowTemplates';
import { Button } from '@/components/ui/button';
import { Undo2, Redo2 } from 'lucide-react';

const WorkflowCanvasInner = () => {
  const reactFlowWrapper = useRef<HTMLDivElement>(null);
  const { screenToFlowPosition } = useReactFlow();

  const {
    nodes,
    edges,
    selectedNodeId,
    onNodesChange,
    onEdgesChange,
    onConnect,
    addNode,
    updateNodeData,
    deleteNode,
    selectNode,
    getSelectedNode,
    exportWorkflow,
    importWorkflow,
    clearWorkflow,
    loadTemplate,
    undo,
    redo,
    canUndo,
    canRedo,
  } = useWorkflow();

  const handleSelectTemplate = (template: WorkflowTemplate) => {
    loadTemplate(template.nodes, template.edges);
  };

  // Keyboard shortcuts for undo/redo
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'z') {
        if (e.shiftKey) {
          e.preventDefault();
          redo();
        } else {
          e.preventDefault();
          undo();
        }
      }
      if ((e.metaKey || e.ctrlKey) && e.key === 'y') {
        e.preventDefault();
        redo();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [undo, redo]);

  const selectedNode = getSelectedNode();

  const onDragOver = useCallback((event: React.DragEvent) => {
    event.preventDefault();
    event.dataTransfer.dropEffect = 'move';
  }, []);

  const onDrop = useCallback(
    (event: React.DragEvent) => {
      event.preventDefault();

      const type = event.dataTransfer.getData('application/reactflow') as NodeType;
      if (!type) return;

      const position = screenToFlowPosition({
        x: event.clientX,
        y: event.clientY,
      });

      addNode(type, position);
    },
    [screenToFlowPosition, addNode]
  );

  const onDragStart = (event: React.DragEvent, nodeType: NodeType) => {
    event.dataTransfer.setData('application/reactflow', nodeType);
    event.dataTransfer.effectAllowed = 'move';
  };

  const onNodeClick = useCallback(
    (_: React.MouseEvent, node: Node) => {
      selectNode(node.id);
    },
    [selectNode]
  );

  const onPaneClick = useCallback(() => {
    selectNode(null);
  }, [selectNode]);

  return (
    <div className="flex h-screen bg-background">
      <NodeSidebar onDragStart={onDragStart} />

      <div className="flex-1 flex flex-col">
        <header className="h-14 border-b border-border bg-card px-4 flex items-center justify-between">
          <div>
            <h1 className="font-semibold text-foreground">HR Workflow Designer</h1>
            <p className="text-xs text-muted-foreground">Design and test HR workflows</p>
          </div>
          <div className="flex items-center gap-4">
            <TemplateSelector onSelectTemplate={handleSelectTemplate} />
            <div className="flex items-center gap-1">
              <Button
                variant="ghost"
                size="sm"
                onClick={undo}
                disabled={!canUndo}
                title="Undo (Ctrl+Z)"
              >
                <Undo2 className="w-4 h-4" />
              </Button>
              <Button
                variant="ghost"
                size="sm"
                onClick={redo}
                disabled={!canRedo}
                title="Redo (Ctrl+Shift+Z)"
              >
                <Redo2 className="w-4 h-4" />
              </Button>
            </div>
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <span>{nodes.length} nodes</span>
              <span>•</span>
              <span>{edges.length} connections</span>
            </div>
          </div>
        </header>

        <div ref={reactFlowWrapper} className="flex-1">
          <ReactFlow
            nodes={nodes}
            edges={edges}
            onNodesChange={onNodesChange}
            onEdgesChange={onEdgesChange}
            onConnect={onConnect}
            onDrop={onDrop}
            onDragOver={onDragOver}
            onNodeClick={onNodeClick}
            onPaneClick={onPaneClick}
            nodeTypes={nodeTypes}
            fitView
            snapToGrid
            snapGrid={[15, 15]}
            defaultEdgeOptions={{
              type: 'smoothstep',
              animated: true,
              style: { strokeWidth: 2, stroke: 'hsl(var(--primary))' },
            }}
          >
            <Background gap={15} size={1} color="hsl(var(--border))" />
            <Controls />
            <MiniMap 
              nodeStrokeWidth={3}
              pannable
              zoomable
            />
          </ReactFlow>
        </div>
      </div>

      {selectedNode ? (
        <NodeEditPanel
          node={selectedNode}
          onUpdate={(data) => updateNodeData(selectedNode.id, data)}
          onDelete={() => deleteNode(selectedNode.id)}
          onClose={() => selectNode(null)}
        />
      ) : (
        <div className="w-80 bg-card border-l border-border">
          <SandboxPanel
            nodes={nodes}
            edges={edges}
            onExport={exportWorkflow}
            onImport={importWorkflow}
            onClear={clearWorkflow}
          />
        </div>
      )}
    </div>
  );
};

export const WorkflowCanvas = () => {
  return (
    <ReactFlowProvider>
      <WorkflowCanvasInner />
    </ReactFlowProvider>
  );
};
