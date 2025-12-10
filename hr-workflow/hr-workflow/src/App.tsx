// src/App.tsx
import { useEffect, useState, useRef } from 'react';
import WorkflowCanvas from './workflow/components/WorkflowCanvas';
import SidebarPalette, { type NodeType } from './workflow/components/SidebarPalette';
import NodeFormPanel from './workflow/components/NodeFormPanel/NodeFormPanel';
import TestPanel from './workflow/components/TestPanel';
import { getAutomations, simulateWorkflow } from './api/mockApi';
import type { Automation, SimulateResponse } from './api/mockApi';
import type { Edge, Node } from 'reactflow';

let idCounter = 1;
const getId = () => `node-${idCounter++}`;

type Snapshot = {
  nodes: Node[];
  edges: Edge[];
};

function App() {
  const [nodes, setNodes] = useState<Node[]>([]);
  const [edges, setEdges] = useState<Edge[]>([]);
  const [selectedNodeId, setSelectedNodeId] = useState<string | null>(null);
  const [automations, setAutomations] = useState<Automation[]>([]);
  const [simulation, setSimulation] = useState<SimulateResponse | null>(null);

  // file input for Load JSON
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  // --- History for Undo / Redo ---
  const [history, setHistory] = useState<Snapshot[]>([]);
  const [historyIndex, setHistoryIndex] = useState(-1);
  const historyIndexRef = useRef(-1);
  const isApplyingHistoryRef = useRef(false);

  useEffect(() => {
    getAutomations().then(setAutomations);
  }, []);

  // whenever nodes/edges change (user actions), push snapshot to history
  useEffect(() => {
    if (isApplyingHistoryRef.current) {
      // change came from undo/redo or simulation styling → don't create new history entry
      isApplyingHistoryRef.current = false;
      return;
    }

    if (nodes.length === 0 && edges.length === 0) {
      // nothing to store yet
      return;
    }

    const snapshot: Snapshot = {
      nodes: JSON.parse(JSON.stringify(nodes)),
      edges: JSON.parse(JSON.stringify(edges)),
    };

    setHistory((prev) => {
      // drop "future" when recording a new action after undo
      const trimmed = prev.slice(0, historyIndexRef.current + 1);
      const updated = [...trimmed, snapshot];
      historyIndexRef.current = updated.length - 1;
      setHistoryIndex(historyIndexRef.current);
      return updated;
    });
  }, [nodes, edges]);

  const canUndo = historyIndex > 0;
  const canRedo = historyIndex >= 0 && historyIndex < history.length - 1;

  const handleUndo = () => {
    if (!canUndo) return;
    const newIndex = historyIndex - 1;
    const snapshot = history[newIndex];
    isApplyingHistoryRef.current = true;
    setNodes(snapshot.nodes);
    setEdges(snapshot.edges);
    setSelectedNodeId(null);
    setSimulation(null);
    historyIndexRef.current = newIndex;
    setHistoryIndex(newIndex);
  };

  const handleRedo = () => {
    if (!canRedo) return;
    const newIndex = historyIndex + 1;
    const snapshot = history[newIndex];
    isApplyingHistoryRef.current = true;
    setNodes(snapshot.nodes);
    setEdges(snapshot.edges);
    setSelectedNodeId(null);
    setSimulation(null);
    historyIndexRef.current = newIndex;
    setHistoryIndex(newIndex);
  };

  const handleAddNode = (nodeType: NodeType) => {
    const newNode: Node = {
      id: getId(),
      type: nodeType,
      position: { x: 100 + nodes.length * 40, y: 100 + nodes.length * 30 },
      data: { label: nodeType.toUpperCase() },
    };
    setNodes((prev) => [...prev, newNode]);
  };

  const handleRunSimulation = async () => {
    const result = await simulateWorkflow({ nodes, edges });
    setSimulation(result);

    // we don't want simulation styling to create history entries
    isApplyingHistoryRef.current = true;

    const errorMap = result.nodeErrors || {};

    setNodes((prev) =>
      prev.map((n) => {
        const nodeErrs = errorMap[n.id] || [];
        const data: any = { ...(n.data || {}) };

        if (nodeErrs.length === 0) {
          delete data.error;
          delete data.errorMessages;
        } else {
          const isCritical = nodeErrs.some((e: string) =>
            e.toLowerCase().includes('start') ||
            e.toLowerCase().includes('end')
          );
          data.error = isCritical ? 'critical' : 'warning';
          data.errorMessages = nodeErrs;
        }

        return { ...n, data };
      })
    );
  };

  const handleExportWorkflow = () => {
    const data = {
      exportedAt: new Date().toISOString(),
      nodes,
      edges,
    };

    const blob = new Blob([JSON.stringify(data, null, 2)], {
      type: 'application/json',
    });

    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    const timestamp = new Date().toISOString().replace(/[:.]/g, '-');

    link.href = url;
    link.download = `workflow-${timestamp}.json`;
    document.body.appendChild(link);
    link.click();
    link.remove();
    URL.revokeObjectURL(url);
  };

  const handleImportWorkflow = async (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const file = event.target.files?.[0];
    if (!file) return;

    try {
      const text = await file.text();
      const parsed = JSON.parse(text);

      const importedNodes = Array.isArray(parsed.nodes)
        ? parsed.nodes
        : Array.isArray(parsed.workflow?.nodes)
        ? parsed.workflow.nodes
        : null;

      const importedEdges = Array.isArray(parsed.edges)
        ? parsed.edges
        : Array.isArray(parsed.workflow?.edges)
        ? parsed.workflow.edges
        : null;

      if (!importedNodes || !importedEdges) {
        alert('Invalid workflow file structure.');
        return;
      }

      setNodes(importedNodes);
      setEdges(importedEdges);
      setSelectedNodeId(null);
      setSimulation(null);
      // import is a new user action → history effect will capture it
    } catch (err) {
      console.error(err);
      alert('Failed to load workflow JSON.');
    } finally {
      event.target.value = '';
    }
  };

  // 🔹 AUTO LAYOUT: BFS from Start, arrange nodes into rows
  const handleAutoLayout = () => {
    if (nodes.length === 0) return;

    const nodeMap = new Map<string, Node>();
    nodes.forEach((n) => nodeMap.set(n.id, { ...n }));

    const layerMap = new Map<string, number>();

    const startNode = nodes.find((n) => n.type === 'start');
    const adjacency = new Map<string, string[]>();

    edges.forEach((e) => {
      if (!adjacency.has(e.source)) adjacency.set(e.source, []);
      adjacency.get(e.source)!.push(e.target);
    });

    const queue: string[] = [];
    if (startNode) {
      layerMap.set(startNode.id, 0);
      queue.push(startNode.id);
    }

    while (queue.length) {
      const current = queue.shift() as string;
      const baseLayer = layerMap.get(current) ?? 0;
      const neighbours = adjacency.get(current) || [];
      neighbours.forEach((nextId) => {
        if (!layerMap.has(nextId)) {
          layerMap.set(nextId, baseLayer + 1);
          queue.push(nextId);
        }
      });
    }

    let maxLayer = -1;
    layerMap.forEach((l) => {
      if (l > maxLayer) maxLayer = l;
    });

    // Any nodes not reached from Start → put them after the last layer
    nodes.forEach((n) => {
      if (!layerMap.has(n.id)) {
        maxLayer += 1;
        layerMap.set(n.id, maxLayer);
      }
    });

    const layers: Record<number, Node[]> = {};
    nodes.forEach((n) => {
      const l = layerMap.get(n.id) ?? 0;
      if (!layers[l]) layers[l] = [];
      layers[l].push(nodeMap.get(n.id)!);
    });

    const H_GAP = 220;
    const V_GAP = 140;
    const START_X = 150;
    const START_Y = 80;

    const sortedLayers = Object.keys(layers)
      .map((k) => Number(k))
      .sort((a, b) => a - b);

    sortedLayers.forEach((layer) => {
      const group = layers[layer];
      group.forEach((node, index) => {
        node.position = {
          x: START_X + index * H_GAP,
          y: START_Y + layer * V_GAP,
        };
      });
    });

    const laidOutNodes = nodes.map((n) => nodeMap.get(n.id)!);
    setNodes(laidOutNodes);
  };

  const selectedNode = nodes.find((n) => n.id === selectedNodeId) || null;

  const handleChangeNode = (updated: Node) => {
    setNodes((prev) => prev.map((n) => (n.id === updated.id ? updated : n)));
  };

  return (
    <div className="app-root">
      <aside className="sidebar">
        <SidebarPalette onAddNode={handleAddNode} />
      </aside>

      <main className="canvas-wrapper">
        <WorkflowCanvas
          nodes={nodes}
          setNodes={setNodes}
          edges={edges}
          setEdges={setEdges}
          onSelectNode={setSelectedNodeId}
        />
      </main>

      <aside className="right-panel">
        {/* Workflow actions: Save / Load / Undo / Redo / Auto Layout */}
        <div className="panel">
          <div className="panel-title">Workflow Actions</div>
          <div className="actions-row" style={{ flexWrap: 'wrap' }}>
            <button className="primary-btn" onClick={handleExportWorkflow}>
              Save JSON
            </button>
            <button
              className="secondary-btn"
              onClick={() => fileInputRef.current?.click()}
            >
              Load JSON
            </button>
            <button
              className="secondary-btn"
              onClick={handleUndo}
              disabled={!canUndo}
            >
              Undo
            </button>
            <button
              className="secondary-btn"
              onClick={handleRedo}
              disabled={!canRedo}
            >
              Redo
            </button>
            <button
              className="secondary-btn"
              onClick={handleAutoLayout}
              disabled={nodes.length === 0}
            >
              Auto Layout
            </button>
            <input
              ref={fileInputRef}
              type="file"
              accept="application/json"
              style={{ display: 'none' }}
              onChange={handleImportWorkflow}
            />
          </div>
        </div>

        <NodeFormPanel
          node={selectedNode}
          onChangeNode={handleChangeNode}
          automations={automations}
        />
        <TestPanel simulation={simulation} onRun={handleRunSimulation} />
      </aside>
    </div>
  );
}

export default App;
