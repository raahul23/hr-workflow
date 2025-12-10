import type { Node } from 'reactflow';
import type { Automation } from '../../../api/mockApi';

type Props = {
  node: Node;
  automations: Automation[];
  onChange: (node: Node) => void;
};

function AutomatedNodeForm({ node, automations, onChange }: Props) {
  const data = node.data || {};

  const update = (patch: Record<string, any>) => {
    onChange({ ...node, data: { ...data, ...patch } });
  };

  const selectedAutomation =
    automations.find((a) => a.id === data.actionId) || null;

  return (
    <div className="node-form">
      <div className="panel-title">Automated Node</div>

      <label>
        Title
        <input
          value={data.label || ''}
          onChange={(e) => update({ label: e.target.value })}
        />
      </label>

      <label>
        Action
        <select
          value={data.actionId || ''}
          onChange={(e) => update({ actionId: e.target.value })}
        >
          <option value="">Select action</option>
          {automations.map((a) => (
            <option key={a.id} value={a.id}>
              {a.label}
            </option>
          ))}
        </select>
      </label>

      {selectedAutomation && (
        <>
          {selectedAutomation.params.map((p: string) => (
            <label key={p}>
              {p}
              <input
                value={data.params?.[p] || ''}
                onChange={(e) =>
                  update({
                    params: {
                      ...(data.params || {}),
                      [p]: e.target.value,
                    },
                  })
                }
              />
            </label>
          ))}
        </>
      )}
    </div>
  );
}

export default AutomatedNodeForm;
