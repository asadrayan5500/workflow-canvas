# HR Workflow Designer

A visual workflow designer module for HR administrators to create and test internal workflows such as onboarding, leave approval, and document verification.

![React](https://img.shields.io/badge/React-18.3-blue)
![TypeScript](https://img.shields.io/badge/TypeScript-5.0-blue)
![React Flow](https://img.shields.io/badge/React%20Flow-12.9-green)
![Tailwind CSS](https://img.shields.io/badge/Tailwind%20CSS-3.4-cyan)

## Features

- **Visual Workflow Canvas** - Drag-and-drop interface for building workflows
- **5 Node Types** - Start, Task, Approval, Automated Step, and End nodes
- **Node Configuration Forms** - Dynamic forms for each node type with validation
- **Workflow Templates** - Pre-built templates (Onboarding, Leave Request, Document Verification, Performance Review)
- **Undo/Redo** - Full history management with keyboard shortcuts (Ctrl+Z / Ctrl+Shift+Z)
- **Workflow Simulation** - Test workflows with step-by-step execution logs
- **Import/Export** - Save and load workflows as JSON
- **Workflow Validation** - Detect missing connections, cycles, and structural issues

## Getting Started

### Prerequisites

- Node.js 18+ 
- npm or yarn

### Installation

```bash
# Clone the repository
git clone <repository-url>
cd hr-workflow-designer

# Install dependencies
npm install

# Start development server
npm run dev
```

The application will be available at `http://localhost:5173`

### Build for Production

```bash
npm run build
npm run preview
```

## Architecture

### Project Structure

```
src/
├── api/
│   └── mockApi.ts          # Mock API layer for automations and simulation
├── components/
│   └── workflow/
│       ├── nodes/          # Custom React Flow node components
│       │   ├── BaseNode.tsx
│       │   ├── StartNode.tsx
│       │   ├── TaskNode.tsx
│       │   ├── ApprovalNode.tsx
│       │   ├── AutomatedStepNode.tsx
│       │   └── EndNode.tsx
│       ├── forms/          # Node configuration form components
│       │   ├── StartNodeForm.tsx
│       │   ├── TaskNodeForm.tsx
│       │   ├── ApprovalNodeForm.tsx
│       │   ├── AutomatedStepNodeForm.tsx
│       │   └── EndNodeForm.tsx
│       ├── NodeSidebar.tsx      # Draggable node palette
│       ├── NodeEditPanel.tsx    # Selected node editor
│       ├── SandboxPanel.tsx     # Workflow testing panel
│       ├── TemplateSelector.tsx # Template dropdown
│       └── WorkflowCanvas.tsx   # Main canvas orchestrator
├── data/
│   └── workflowTemplates.ts    # Pre-defined workflow templates
├── hooks/
│   ├── useWorkflow.ts          # Core workflow state management
│   ├── useAutomations.ts       # Automations data fetching
│   └── useHistory.ts           # Generic history hook
├── types/
│   └── workflow.ts             # TypeScript interfaces
└── pages/
    └── Index.tsx               # Main page component
```

### Design Choices

#### 1. **Component Architecture**

- **Separation of Concerns**: Canvas logic, node rendering, and form handling are decoupled into distinct components
- **Composition over Inheritance**: Node components use a shared `BaseNode` wrapper for consistent styling
- **Form Modularity**: Each node type has its own form component, making it easy to add new node types

#### 2. **State Management**

- **Custom Hook Pattern**: `useWorkflow` encapsulates all workflow state (nodes, edges, selection, history)
- **History Stack**: Undo/redo implemented via snapshot-based history with configurable max size (50 states)
- **React Flow Integration**: Leverages React Flow's built-in state management for node positioning and connections

#### 3. **Type Safety**

- **Discriminated Unions**: Node data types use a discriminated union pattern based on `type` field
- **Strict Interfaces**: All workflow structures have explicit TypeScript interfaces
- **Index Signatures**: Added for React Flow compatibility while maintaining type safety

#### 4. **Mock API Layer**

- **Promise-based**: Simulates async API calls with realistic delays
- **Validation Logic**: Server-side validation simulation for workflow structure
- **Extensible**: Easy to replace with real API endpoints

#### 5. **Styling Approach**

- **Tailwind CSS**: Utility-first styling with custom design tokens
- **CSS Variables**: Theme colors defined as HSL values for easy customization
- **Consistent Spacing**: Uses Tailwind's spacing scale throughout

### Node Types

| Node | Purpose | Key Configuration |
|------|---------|-------------------|
| **Start** | Workflow entry point | Title, metadata key-value pairs |
| **Task** | Human task assignment | Title, description, assignee, due date, custom fields |
| **Approval** | Manager/HR approval step | Title, approver role, auto-approve threshold |
| **Automated Step** | System-triggered action | Action selection, dynamic parameters |
| **End** | Workflow completion | End message, summary flag |

### Workflow Validation

The simulation engine validates:

- ✅ Exactly one Start node exists
- ✅ At least one End node exists
- ✅ No disconnected nodes
- ✅ No circular dependencies (cycle detection)
- ✅ All nodes are reachable from Start

## Usage Guide

### Creating a Workflow

1. **Drag nodes** from the left sidebar onto the canvas
2. **Connect nodes** by dragging from a node's handle to another
3. **Configure nodes** by clicking on them to open the edit panel
4. **Use templates** for quick starting points

### Testing a Workflow

1. Click **"Test Workflow"** button in the header
2. The sandbox panel shows validation results
3. Click **"Run Simulation"** to execute step-by-step
4. View execution logs with timing and status

### Keyboard Shortcuts

| Shortcut | Action |
|----------|--------|
| `Ctrl + Z` | Undo |
| `Ctrl + Shift + Z` / `Ctrl + Y` | Redo |
| `Delete` / `Backspace` | Delete selected node |

## Assumptions & Limitations

1. **No Persistence**: Workflows are stored in-memory only; use Export/Import for saving
2. **Single Workflow**: Only one workflow can be edited at a time
3. **Mock Simulation**: Execution simulation is mocked; no real integrations
4. **Linear Validation**: Assumes workflows are DAGs (Directed Acyclic Graphs)
5. **Browser Compatibility**: Tested on modern browsers (Chrome, Firefox, Safari, Edge)

## Extensibility

### Adding a New Node Type

1. Create node component in `src/components/workflow/nodes/`
2. Create form component in `src/components/workflow/forms/`
3. Add type definition to `src/types/workflow.ts`
4. Register in `nodeTypes` object in `WorkflowCanvas.tsx`
5. Add to `NodeSidebar.tsx` for drag-and-drop

### Adding New Automation Actions

Update `mockAutomations` in `src/api/mockApi.ts`:

```typescript
{
  id: "new_action",
  label: "New Action",
  params: ["param1", "param2"]
}
```

## Tech Stack

- **React 18** - UI framework
- **TypeScript** - Type safety
- **React Flow** - Graph/workflow visualization
- **Tailwind CSS** - Styling
- **Vite** - Build tool
- **TanStack Query** - Data fetching
- **shadcn/ui** - UI components

## License

MIT
