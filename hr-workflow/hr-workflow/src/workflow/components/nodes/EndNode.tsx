import { Handle, Position } from 'reactflow';

export default function EndNode({ data }: any) {
  return (
    <div className="node-box end-node">
      <div className="node-title">{data.label || "END"}</div>

      <Handle type="target" position={Position.Left} />
    </div>
  );
}
