import type { Node } from 'reactflow';
import type { Automation } from '../../../api/mockApi';
import TaskNodeForm from './TaskNodeForm';
import ApprovalNodeForm from './ApprovalNodeForm';
import AutomatedNodeForm from './AutomatedNodeForm';

type Props = {
  node: Node | null;
  onChangeNode: (node: Node) => void;
  automations: Automation[];
};

function NodeFormPanel({ node, onChangeNode, automations }: Props) {
  if (!node) {
    return (
      <div className="panel">
        <div className="panel-title">Node Config</div>
        <div style={{ fontSize: 12, color: '#6b7280' }}>Select a node to edit</div>
      </div>
    );
  }

  if (node.type === 'task') {
    return (
      <div className="panel">
        <TaskNodeForm node={node} onChange={onChangeNode} />
      </div>
    );
  }

  if (node.type === 'approval') {
    return (
      <div className="panel">
        <ApprovalNodeForm node={node} onChange={onChangeNode} />
      </div>
    );
  }

  if (node.type === 'automated') {
    return (
      <div className="panel">
        <AutomatedNodeForm
          node={node}
          onChange={onChangeNode}
          automations={automations}
        />
      </div>
    );
  }

  const data = node.data || {};

  return (
    <div className="panel">
      <div className="panel-title">
        {node.type === 'start' ? 'Start Node' : 'End Node'}
      </div>
      <div className="node-form">
        <label>
          Title
          <input
            value={data.label || ''}
            onChange={(e) =>
              onChangeNode({ ...node, data: { ...data, label: e.target.value } })
            }
          />
        </label>
      </div>
    </div>
  );
}

export default NodeFormPanel;
