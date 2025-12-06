import { useState, useCallback, useRef, useEffect } from 'react';
import { 
  useNodesState, 
  useEdgesState, 
  addEdge, 
  Connection,
  Node,
  Edge,
} from '@xyflow/react';
import { v4 as uuidv4 } from 'uuid';
import { 
  WorkflowNodeData, 
  NodeType,
  getDefaultNodeData,
  WorkflowValidation,
  ValidationError,
  WorkflowNode,
} from '@/types/workflow';

interface WorkflowSnapshot {
  nodes: Node[];
  edges: Edge[];
}

const initialNodes: Node[] = [];
const initialEdges: Edge[] = [];

export const useWorkflow = () => {
  const [nodes, setNodes, onNodesChange] = useNodesState(initialNodes);
  const [edges, setEdges, onEdgesChange] = useEdgesState(initialEdges);
  const [selectedNodeId, setSelectedNodeId] = useState<string | null>(null);

  // History management
  const [past, setPast] = useState<WorkflowSnapshot[]>([]);
  const [future, setFuture] = useState<WorkflowSnapshot[]>([]);
  const isUndoRedoAction = useRef(false);
  const lastSnapshot = useRef<string>('');

  const canUndo = past.length > 0;
  const canRedo = future.length > 0;

  // Take a snapshot of current state
  const takeSnapshot = useCallback(() => {
    const snapshot = JSON.stringify({ nodes, edges });
    if (snapshot !== lastSnapshot.current && !isUndoRedoAction.current) {
      setPast(prev => [...prev.slice(-49), { nodes: JSON.parse(JSON.stringify(nodes)), edges: JSON.parse(JSON.stringify(edges)) }]);
      setFuture([]);
      lastSnapshot.current = snapshot;
    }
  }, [nodes, edges]);

  const undo = useCallback(() => {
    if (past.length === 0) return;
    
    isUndoRedoAction.current = true;
    const previous = past[past.length - 1];
    const newPast = past.slice(0, -1);
    
    setFuture(prev => [{ nodes: JSON.parse(JSON.stringify(nodes)), edges: JSON.parse(JSON.stringify(edges)) }, ...prev]);
    setPast(newPast);
    setNodes(previous.nodes);
    setEdges(previous.edges);
    lastSnapshot.current = JSON.stringify(previous);
    
    setTimeout(() => {
      isUndoRedoAction.current = false;
    }, 0);
  }, [past, nodes, edges, setNodes, setEdges]);

  const redo = useCallback(() => {
    if (future.length === 0) return;
    
    isUndoRedoAction.current = true;
    const next = future[0];
    const newFuture = future.slice(1);
    
    setPast(prev => [...prev, { nodes: JSON.parse(JSON.stringify(nodes)), edges: JSON.parse(JSON.stringify(edges)) }]);
    setFuture(newFuture);
    setNodes(next.nodes);
    setEdges(next.edges);
    lastSnapshot.current = JSON.stringify(next);
    
    setTimeout(() => {
      isUndoRedoAction.current = false;
    }, 0);
  }, [future, nodes, edges, setNodes, setEdges]);

  const onConnect = useCallback(
    (params: Connection) => {
      takeSnapshot();
      setEdges((eds) => addEdge({ 
        ...params, 
        type: 'smoothstep',
        animated: true,
        style: { strokeWidth: 2 }
      }, eds));
    },
    [setEdges, takeSnapshot]
  );

  const addNode = useCallback((type: NodeType, position: { x: number; y: number }) => {
    takeSnapshot();
    const newNode: Node = {
      id: uuidv4(),
      type: type,
      position,
      data: getDefaultNodeData(type),
    };
    setNodes((nds) => [...nds, newNode]);
    return newNode.id;
  }, [setNodes, takeSnapshot]);

  const updateNodeData = useCallback((nodeId: string, data: Partial<WorkflowNodeData>) => {
    takeSnapshot();
    setNodes((nds) =>
      nds.map((node) =>
        node.id === nodeId
          ? { ...node, data: { ...node.data, ...data } }
          : node
      )
    );
  }, [setNodes, takeSnapshot]);

  const deleteNode = useCallback((nodeId: string) => {
    takeSnapshot();
    setNodes((nds) => nds.filter((node) => node.id !== nodeId));
    setEdges((eds) => eds.filter((edge) => edge.source !== nodeId && edge.target !== nodeId));
    if (selectedNodeId === nodeId) {
      setSelectedNodeId(null);
    }
  }, [setNodes, setEdges, selectedNodeId, takeSnapshot]);

  const deleteEdge = useCallback((edgeId: string) => {
    takeSnapshot();
    setEdges((eds) => eds.filter((edge) => edge.id !== edgeId));
  }, [setEdges, takeSnapshot]);

  const selectNode = useCallback((nodeId: string | null) => {
    setSelectedNodeId(nodeId);
  }, []);

  const getSelectedNode = useCallback((): WorkflowNode | undefined => {
    const node = nodes.find((n) => n.id === selectedNodeId);
    return node as WorkflowNode | undefined;
  }, [nodes, selectedNodeId]);

  const validateWorkflow = useCallback((): WorkflowValidation => {
    const errors: ValidationError[] = [];
    
    const getNodeData = (n: Node) => n.data as WorkflowNodeData;
    const startNodes = nodes.filter(n => getNodeData(n).type === 'start');
    const endNodes = nodes.filter(n => getNodeData(n).type === 'end');

    if (startNodes.length === 0) {
      errors.push({ message: 'Workflow must have a Start node', severity: 'error' });
    }

    if (startNodes.length > 1) {
      errors.push({ message: 'Workflow should have only one Start node', severity: 'warning' });
    }

    if (endNodes.length === 0) {
      errors.push({ message: 'Workflow must have an End node', severity: 'error' });
    }

    // Check connections
    nodes.forEach(node => {
      const nodeData = getNodeData(node);
      if (nodeData.type !== 'start' && !edges.some(e => e.target === node.id)) {
        errors.push({ 
          nodeId: node.id, 
          message: `"${'title' in nodeData ? nodeData.title : 'Node'}" has no incoming connection`, 
          severity: 'warning' 
        });
      }
      if (nodeData.type !== 'end' && !edges.some(e => e.source === node.id)) {
        errors.push({ 
          nodeId: node.id, 
          message: `"${'title' in nodeData ? nodeData.title : 'Node'}" has no outgoing connection`, 
          severity: 'warning' 
        });
      }
    });

    return {
      isValid: errors.filter(e => e.severity === 'error').length === 0,
      errors,
    };
  }, [nodes, edges]);

  const exportWorkflow = useCallback(() => {
    return JSON.stringify({ nodes, edges }, null, 2);
  }, [nodes, edges]);

  const importWorkflow = useCallback((json: string) => {
    try {
      const { nodes: importedNodes, edges: importedEdges } = JSON.parse(json);
      takeSnapshot();
      setNodes(importedNodes);
      setEdges(importedEdges);
      setSelectedNodeId(null);
      return true;
    } catch {
      return false;
    }
  }, [setNodes, setEdges, takeSnapshot]);

  const clearWorkflow = useCallback(() => {
    takeSnapshot();
    setNodes([]);
    setEdges([]);
    setSelectedNodeId(null);
  }, [setNodes, setEdges, takeSnapshot]);

  const loadTemplate = useCallback((templateNodes: Node[], templateEdges: Edge[]) => {
    takeSnapshot();
    setNodes(JSON.parse(JSON.stringify(templateNodes)));
    setEdges(JSON.parse(JSON.stringify(templateEdges)));
    setSelectedNodeId(null);
  }, [setNodes, setEdges, takeSnapshot]);

  // Handle node position changes (drag end)
  const handleNodesChange = useCallback((changes: Parameters<typeof onNodesChange>[0]) => {
    const hasDragEnd = changes.some(c => c.type === 'position' && !('dragging' in c && c.dragging));
    const hasDragStart = changes.some(c => c.type === 'position' && 'dragging' in c && c.dragging);
    
    if (hasDragStart) {
      takeSnapshot();
    }
    
    onNodesChange(changes);
  }, [onNodesChange, takeSnapshot]);

  return {
    nodes: nodes as WorkflowNode[],
    edges,
    selectedNodeId,
    onNodesChange: handleNodesChange,
    onEdgesChange,
    onConnect,
    addNode,
    updateNodeData,
    deleteNode,
    deleteEdge,
    selectNode,
    getSelectedNode,
    validateWorkflow,
    exportWorkflow,
    importWorkflow,
    clearWorkflow,
    loadTemplate,
    undo,
    redo,
    canUndo,
    canRedo,
  };
};
