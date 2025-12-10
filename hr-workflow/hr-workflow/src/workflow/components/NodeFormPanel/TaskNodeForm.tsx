import type { Node } from 'reactflow';


type Props = {
  node: Node;
  onChange: (node: Node) => void;
};

function TaskNodeForm({ node, onChange }: Props) {
  const data = node.data || {};

  const update = (patch: Record<string, any>) => {
    onChange({ ...node, data: { ...data, ...patch } });
  };

  return (
    <div className="node-form">
      <div className="panel-title">Task Node</div>

      <label>
        Title
        <input
          value={data.label || ''}
          onChange={(e) => update({ label: e.target.value })}
        />
      </label>

      <label>
        Assignee
        <input
          value={data.assignee || ''}
          onChange={(e) => update({ assignee: e.target.value })}
        />
      </label>

      <label>
        Description
        <textarea
          rows={3}
          value={data.description || ''}
          onChange={(e) => update({ description: e.target.value })}
        />
      </label>
    </div>
  );
}

export default TaskNodeForm;
