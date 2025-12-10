import { Handle, Position } from 'reactflow';

export default function TaskNode({ data }: any) {
  return (
    <div className="node-box task-node">
      <div className="node-title">{data.label || "TASK"}</div>

      <Handle type="target" position={Position.Left} />
      <Handle type="source" position={Position.Right} />
    </div>
  );
}
