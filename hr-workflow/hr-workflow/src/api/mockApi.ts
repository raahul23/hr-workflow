// src/api/mockApi.ts

export type Automation = {
  id: string;
  label: string;
  params: string[];
};

const automations: Automation[] = [
  {
    id: 'send_email',
    label: 'Send Email',
    params: ['to', 'subject'],
  },
  {
    id: 'generate_doc',
    label: 'Generate Document',
    params: ['template', 'recipient'],
  },
];

export function getAutomations(): Promise<Automation[]> {
  return Promise.resolve(automations);
}

export type SimulationStep = {
  step: number;
  nodeId: string;
  message: string;
};

export type SimulateResponse = {
  steps: SimulationStep[];
  errors: string[];
  nodeErrors: Record<string, string[]>;
};

export function simulateWorkflow(payload: {
  nodes: any[];
  edges: any[];
}): Promise<SimulateResponse> {
  const { nodes, edges } = payload;

  const errors: string[] = [];
  const nodeErrors: Record<string, string[]> = {};

  const addNodeError = (id: string, message: string) => {
    if (!nodeErrors[id]) nodeErrors[id] = [];
    nodeErrors[id].push(message);
  };

  const startNodes = nodes.filter((n) => n.type === 'start');
  const endNodes = nodes.filter((n) => n.type === 'end');

  if (startNodes.length === 0) {
    errors.push('Missing Start node');
  } else if (startNodes.length > 1) {
    errors.push('More than one Start node');
    startNodes.forEach((n) =>
      addNodeError(n.id, 'More than one Start node')
    );
  }

  if (endNodes.length === 0) {
    errors.push('Missing End node');
  }

  const graph: Record<string, string[]> = {};

  for (const edge of edges) {
    const { source, target } = edge;
    if (!source || !target) continue;

    if (!graph[source]) graph[source] = [];
    graph[source].push(target);
  }

  const steps: SimulationStep[] = [];

  if (startNodes.length !== 1) {
    nodes.forEach((n, index) => {
      steps.push({
        step: index + 1,
        nodeId: n.id,
        message: `Executed node ${n.data?.label || n.id} (${n.type})`,
      });
    });

    return Promise.resolve({ steps, errors, nodeErrors });
  }

  const startId = startNodes[0].id;
  const visited = new Set<string>();
  const queue: string[] = [startId];

  while (queue.length > 0) {
    const currentId = queue.shift() as string;
    if (visited.has(currentId)) continue;
    visited.add(currentId);

    const node = nodes.find((n) => n.id === currentId);
    if (!node) continue;

    steps.push({
      step: steps.length + 1,
      nodeId: node.id,
      message: `Executed node ${node.data?.label || node.id} (${node.type})`,
    });

    const neighbours = graph[currentId] || [];
    for (const nextId of neighbours) {
      if (!visited.has(nextId)) {
        queue.push(nextId);
      }
    }
  }

  const unreachable = nodes.filter((n) => !visited.has(n.id));

  if (unreachable.length > 0) {
    const names = unreachable.map((n) => n.data?.label || n.id).join(', ');
    errors.push(`Unreachable nodes from Start: ${names}`);

    unreachable.forEach((n) =>
      addNodeError(n.id, 'Unreachable from Start node')
    );
  }

  return Promise.resolve({ steps, errors, nodeErrors });
}
