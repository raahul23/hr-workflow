export type NodeType = 'start' | 'task' | 'approval' | 'automated' | 'end';

type Props = {
  onAddNode: (type: NodeType) => void;
};


function SidebarPalette({ onAddNode }: Props) {
  return (
    <div>
      <div className="sidebar-title">Node Types</div>
            <button className="palette-item" onClick={() => onAddNode('start')}>
        Start
      </button>
      <button className="palette-item" onClick={() => onAddNode('task')}>
        Task
      </button>
      <button className="palette-item" onClick={() => onAddNode('approval')}>
        Approval
      </button>
      <button className="palette-item" onClick={() => onAddNode('automated')}>
        Automated
      </button>
      <button className="palette-item" onClick={() => onAddNode('end')}>
        End
      </button>

    </div>
  );
}

export default SidebarPalette;
