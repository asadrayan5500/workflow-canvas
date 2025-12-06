import { Automation, SimulationResult, SimulationStep, WorkflowNode, WorkflowEdge, NodeType, WorkflowNodeData } from '@/types/workflow';

// Simulated network delay
const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

export const automations: Automation[] = [
  { id: 'send_email', label: 'Send Email', params: ['to', 'subject', 'body'] },
  { id: 'generate_doc', label: 'Generate Document', params: ['template', 'recipient'] },
  { id: 'send_slack', label: 'Send Slack Message', params: ['channel', 'message'] },
  { id: 'create_ticket', label: 'Create Support Ticket', params: ['title', 'priority'] },
  { id: 'update_hrms', label: 'Update HRMS Record', params: ['employeeId', 'field', 'value'] },
  { id: 'schedule_meeting', label: 'Schedule Meeting', params: ['attendees', 'duration', 'topic'] },
];

export const getAutomations = async (): Promise<Automation[]> => {
  await delay(300);
  return automations;
};

const getNodeData = (node: WorkflowNode): WorkflowNodeData => node.data as WorkflowNodeData;

export const simulateWorkflow = async (
  nodes: WorkflowNode[],
  edges: WorkflowEdge[]
): Promise<SimulationResult> => {
  await delay(500);

  const errors: string[] = [];
  const steps: SimulationStep[] = [];

  // Validate workflow structure
  const startNodes = nodes.filter(n => getNodeData(n).type === 'start');
  const endNodes = nodes.filter(n => getNodeData(n).type === 'end');

  if (startNodes.length === 0) {
    errors.push('Workflow must have at least one Start node');
  }

  if (startNodes.length > 1) {
    errors.push('Workflow should have only one Start node');
  }

  if (endNodes.length === 0) {
    errors.push('Workflow must have at least one End node');
  }

  // Check for disconnected nodes
  nodes.forEach(node => {
    const nodeData = getNodeData(node);
    if (nodeData.type !== 'start' && !edges.some(e => e.target === node.id)) {
      errors.push(`Node "${getNodeTitle(node)}" has no incoming connection`);
    }
    if (nodeData.type !== 'end' && !edges.some(e => e.source === node.id)) {
      errors.push(`Node "${getNodeTitle(node)}" has no outgoing connection`);
    }
  });

  // Check for cycles (simple detection)
  const hasCycle = detectCycle(nodes, edges);
  if (hasCycle) {
    errors.push('Workflow contains a cycle, which may cause infinite loops');
  }

  if (errors.length > 0) {
    return { success: false, steps: [], errors };
  }

  // Simulate execution
  const executionOrder = getExecutionOrder(nodes, edges);
  
  for (const node of executionOrder) {
    const nodeData = getNodeData(node);
    const step: SimulationStep = {
      nodeId: node.id,
      nodeTitle: getNodeTitle(node),
      nodeType: nodeData.type as NodeType,
      status: 'completed',
      message: getStepMessage(node),
      timestamp: new Date().toISOString(),
    };
    steps.push(step);
    await delay(200); // Simulate step execution
  }

  return { success: true, steps, errors: [] };
};

const getNodeTitle = (node: WorkflowNode): string => {
  const data = getNodeData(node);
  if ('title' in data) {
    return data.title as string;
  }
  if ('endMessage' in data) {
    return 'End';
  }
  return 'Unknown';
};

const getStepMessage = (node: WorkflowNode): string => {
  const data = getNodeData(node);
  switch (data.type) {
    case 'start':
      return `Workflow started: ${data.title}`;
    case 'task':
      return `Task "${data.title}" assigned to ${data.assignee || 'unassigned'}`;
    case 'approval':
      return `Awaiting approval from ${data.approverRole}`;
    case 'automated':
      return `Executing automated action: ${data.title}`;
    case 'end':
      return data.endMessage;
    default:
      return 'Step executed';
  }
};

const detectCycle = (nodes: WorkflowNode[], edges: WorkflowEdge[]): boolean => {
  const visited = new Set<string>();
  const recursionStack = new Set<string>();

  const adjacencyList = new Map<string, string[]>();
  nodes.forEach(node => adjacencyList.set(node.id, []));
  edges.forEach(edge => {
    adjacencyList.get(edge.source)?.push(edge.target);
  });

  const dfs = (nodeId: string): boolean => {
    visited.add(nodeId);
    recursionStack.add(nodeId);

    for (const neighbor of adjacencyList.get(nodeId) || []) {
      if (!visited.has(neighbor)) {
        if (dfs(neighbor)) return true;
      } else if (recursionStack.has(neighbor)) {
        return true;
      }
    }

    recursionStack.delete(nodeId);
    return false;
  };

  for (const node of nodes) {
    if (!visited.has(node.id)) {
      if (dfs(node.id)) return true;
    }
  }

  return false;
};

const getExecutionOrder = (nodes: WorkflowNode[], edges: WorkflowEdge[]): WorkflowNode[] => {
  const adjacencyList = new Map<string, string[]>();
  const inDegree = new Map<string, number>();

  nodes.forEach(node => {
    adjacencyList.set(node.id, []);
    inDegree.set(node.id, 0);
  });

  edges.forEach(edge => {
    adjacencyList.get(edge.source)?.push(edge.target);
    inDegree.set(edge.target, (inDegree.get(edge.target) || 0) + 1);
  });

  const queue: string[] = [];
  nodes.forEach(node => {
    if (inDegree.get(node.id) === 0) {
      queue.push(node.id);
    }
  });

  const result: WorkflowNode[] = [];
  const nodeMap = new Map(nodes.map(n => [n.id, n]));

  while (queue.length > 0) {
    const nodeId = queue.shift()!;
    const node = nodeMap.get(nodeId);
    if (node) result.push(node);

    for (const neighbor of adjacencyList.get(nodeId) || []) {
      inDegree.set(neighbor, (inDegree.get(neighbor) || 0) - 1);
      if (inDegree.get(neighbor) === 0) {
        queue.push(neighbor);
      }
    }
  }

  return result;
};
