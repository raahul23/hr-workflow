import type { Node } from 'reactflow';

type Props = {
  node: Node;
  onChange: (node: Node) => void;
};

function ApprovalNodeForm({ node, onChange }: Props) {
  const data = node.data || {};

  const update = (patch: Record<string, any>) => {
    onChange({ ...node, data: { ...data, ...patch } });
  };

  return (
    <div className="node-form">
      <div className="panel-title">Approval Node</div>

      <label>
        Title
        <input
          value={data.label || ''}
          onChange={(e) => update({ label: e.target.value })}
        />
      </label>

      <label>
        Approver role
        <input
          value={data.approverRole || ''}
          onChange={(e) => update({ approverRole: e.target.value })}
        />
      </label>

      <label>
        Auto-approve threshold (days)
        <input
          type="number"
          value={data.autoApproveThreshold ?? ''}
          onChange={(e) =>
            update({
              autoApproveThreshold:
                e.target.value === '' ? undefined : Number(e.target.value),
            })
          }
        />
      </label>
    </div>
  );
}

export default ApprovalNodeForm;
