import { WorkflowNode, WorkflowEdge } from '@/types/workflow';

export interface WorkflowTemplate {
  id: string;
  name: string;
  description: string;
  icon: string;
  nodes: WorkflowNode[];
  edges: WorkflowEdge[];
}

export const workflowTemplates: WorkflowTemplate[] = [
  {
    id: 'onboarding',
    name: 'Employee Onboarding',
    description: 'Complete onboarding workflow for new employees',
    icon: 'UserPlus',
    nodes: [
      { id: 'start-1', type: 'start', position: { x: 250, y: 0 }, data: { type: 'start', title: 'New Hire Initiated', metadata: [{ key: 'department', value: '' }] } },
      { id: 'task-1', type: 'task', position: { x: 250, y: 100 }, data: { type: 'task', title: 'Collect Documents', description: 'Gather ID, tax forms, and certifications', assignee: 'HR Coordinator', dueDate: '', customFields: [] } },
      { id: 'task-2', type: 'task', position: { x: 250, y: 200 }, data: { type: 'task', title: 'Setup Workstation', description: 'Prepare desk, computer, and access cards', assignee: 'IT Support', dueDate: '', customFields: [] } },
      { id: 'automated-1', type: 'automated', position: { x: 250, y: 300 }, data: { type: 'automated', title: 'Send Welcome Email', actionId: 'send_email', actionParams: { to: 'new_hire', subject: 'Welcome to the team!' } } },
      { id: 'approval-1', type: 'approval', position: { x: 250, y: 400 }, data: { type: 'approval', title: 'Manager Approval', approverRole: 'Manager', autoApproveThreshold: 0 } },
      { id: 'task-3', type: 'task', position: { x: 250, y: 500 }, data: { type: 'task', title: 'Orientation Session', description: 'Complete company orientation and training', assignee: 'HR Trainer', dueDate: '', customFields: [] } },
      { id: 'end-1', type: 'end', position: { x: 250, y: 600 }, data: { type: 'end', endMessage: 'Onboarding complete! Employee is ready to start.', showSummary: true } },
    ],
    edges: [
      { id: 'e1', source: 'start-1', target: 'task-1' },
      { id: 'e2', source: 'task-1', target: 'task-2' },
      { id: 'e3', source: 'task-2', target: 'automated-1' },
      { id: 'e4', source: 'automated-1', target: 'approval-1' },
      { id: 'e5', source: 'approval-1', target: 'task-3' },
      { id: 'e6', source: 'task-3', target: 'end-1' },
    ],
  },
  {
    id: 'leave-request',
    name: 'Leave Request',
    description: 'Standard leave request approval workflow',
    icon: 'Calendar',
    nodes: [
      { id: 'start-1', type: 'start', position: { x: 250, y: 0 }, data: { type: 'start', title: 'Leave Request Submitted', metadata: [{ key: 'leaveType', value: '' }, { key: 'duration', value: '' }] } },
      { id: 'automated-1', type: 'automated', position: { x: 250, y: 100 }, data: { type: 'automated', title: 'Check Leave Balance', actionId: 'generate_doc', actionParams: { template: 'leave_balance', recipient: 'employee' } } },
      { id: 'approval-1', type: 'approval', position: { x: 250, y: 200 }, data: { type: 'approval', title: 'Manager Approval', approverRole: 'Manager', autoApproveThreshold: 2 } },
      { id: 'approval-2', type: 'approval', position: { x: 250, y: 300 }, data: { type: 'approval', title: 'HR Approval', approverRole: 'HRBP', autoApproveThreshold: 5 } },
      { id: 'automated-2', type: 'automated', position: { x: 250, y: 400 }, data: { type: 'automated', title: 'Update Calendar', actionId: 'send_email', actionParams: { to: 'team', subject: 'Leave notification' } } },
      { id: 'end-1', type: 'end', position: { x: 250, y: 500 }, data: { type: 'end', endMessage: 'Leave request processed successfully', showSummary: true } },
    ],
    edges: [
      { id: 'e1', source: 'start-1', target: 'automated-1' },
      { id: 'e2', source: 'automated-1', target: 'approval-1' },
      { id: 'e3', source: 'approval-1', target: 'approval-2' },
      { id: 'e4', source: 'approval-2', target: 'automated-2' },
      { id: 'e5', source: 'automated-2', target: 'end-1' },
    ],
  },
  {
    id: 'document-verification',
    name: 'Document Verification',
    description: 'Verify and approve employee documents',
    icon: 'FileCheck',
    nodes: [
      { id: 'start-1', type: 'start', position: { x: 250, y: 0 }, data: { type: 'start', title: 'Document Submitted', metadata: [{ key: 'documentType', value: '' }] } },
      { id: 'task-1', type: 'task', position: { x: 250, y: 100 }, data: { type: 'task', title: 'Initial Review', description: 'Check document completeness and validity', assignee: 'Document Specialist', dueDate: '', customFields: [] } },
      { id: 'approval-1', type: 'approval', position: { x: 250, y: 200 }, data: { type: 'approval', title: 'Verification Approval', approverRole: 'Compliance Officer', autoApproveThreshold: 0 } },
      { id: 'automated-1', type: 'automated', position: { x: 250, y: 300 }, data: { type: 'automated', title: 'Generate Certificate', actionId: 'generate_doc', actionParams: { template: 'verification_cert', recipient: 'employee' } } },
      { id: 'automated-2', type: 'automated', position: { x: 250, y: 400 }, data: { type: 'automated', title: 'Send Confirmation', actionId: 'send_email', actionParams: { to: 'employee', subject: 'Document verified' } } },
      { id: 'end-1', type: 'end', position: { x: 250, y: 500 }, data: { type: 'end', endMessage: 'Document verification complete', showSummary: true } },
    ],
    edges: [
      { id: 'e1', source: 'start-1', target: 'task-1' },
      { id: 'e2', source: 'task-1', target: 'approval-1' },
      { id: 'e3', source: 'approval-1', target: 'automated-1' },
      { id: 'e4', source: 'automated-1', target: 'automated-2' },
      { id: 'e5', source: 'automated-2', target: 'end-1' },
    ],
  },
  {
    id: 'performance-review',
    name: 'Performance Review',
    description: 'Annual performance review process',
    icon: 'Award',
    nodes: [
      { id: 'start-1', type: 'start', position: { x: 250, y: 0 }, data: { type: 'start', title: 'Review Cycle Started', metadata: [{ key: 'reviewPeriod', value: '' }] } },
      { id: 'task-1', type: 'task', position: { x: 250, y: 100 }, data: { type: 'task', title: 'Self Assessment', description: 'Employee completes self-evaluation form', assignee: 'Employee', dueDate: '', customFields: [] } },
      { id: 'task-2', type: 'task', position: { x: 250, y: 200 }, data: { type: 'task', title: 'Manager Review', description: 'Manager reviews performance and provides feedback', assignee: 'Manager', dueDate: '', customFields: [] } },
      { id: 'approval-1', type: 'approval', position: { x: 250, y: 300 }, data: { type: 'approval', title: 'HR Calibration', approverRole: 'HRBP', autoApproveThreshold: 0 } },
      { id: 'task-3', type: 'task', position: { x: 250, y: 400 }, data: { type: 'task', title: 'Feedback Meeting', description: 'Conduct one-on-one feedback session', assignee: 'Manager', dueDate: '', customFields: [] } },
      { id: 'automated-1', type: 'automated', position: { x: 250, y: 500 }, data: { type: 'automated', title: 'Archive Review', actionId: 'generate_doc', actionParams: { template: 'performance_summary', recipient: 'hr_records' } } },
      { id: 'end-1', type: 'end', position: { x: 250, y: 600 }, data: { type: 'end', endMessage: 'Performance review cycle complete', showSummary: true } },
    ],
    edges: [
      { id: 'e1', source: 'start-1', target: 'task-1' },
      { id: 'e2', source: 'task-1', target: 'task-2' },
      { id: 'e3', source: 'task-2', target: 'approval-1' },
      { id: 'e4', source: 'approval-1', target: 'task-3' },
      { id: 'e5', source: 'task-3', target: 'automated-1' },
      { id: 'e6', source: 'automated-1', target: 'end-1' },
    ],
  },
];
