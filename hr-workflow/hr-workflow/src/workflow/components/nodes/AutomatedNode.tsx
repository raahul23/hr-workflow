import { Handle, Position } from 'reactflow';

export default function AutomatedNode({ data }: any) {
  return (
    <div className="node-box automated-node">
      <div className="node-title">{data.label || "AUTOMATED"}</div>

      <Handle type="target" position={Position.Left} />
      <Handle type="source" position={Position.Right} />
    </div>
  );
}
