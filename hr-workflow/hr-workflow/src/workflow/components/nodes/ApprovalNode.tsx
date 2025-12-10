import { Handle, Position } from 'reactflow';

export default function ApprovalNode({ data }: any) {
  return (
    <div className="node-box approval-node">
      <div className="node-title">{data.label || "APPROVAL"}</div>

      <Handle type="target" position={Position.Left} />
      <Handle type="source" position={Position.Right} />
    </div>
  );
}
