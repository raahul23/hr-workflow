import { Handle, Position } from 'reactflow';

export default function StartNode({ data }: any) {
  return (
    <div className="node-box start-node">
      <div className="node-title">{data.label || "START"}</div>

      <Handle type="source" position={Position.Right} />
    </div>
  );
}
