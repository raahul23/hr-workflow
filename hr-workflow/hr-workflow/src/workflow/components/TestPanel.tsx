import type { SimulateResponse } from '../../api/mockApi';

type Props = {
  simulation: SimulateResponse | null;
  onRun: () => void;
};

function TestPanel({ simulation, onRun }: Props) {
  return (
    <div className="panel test-panel">
      <div className="panel-title">Test / Sandbox</div>
      <button onClick={onRun}>Run Simulation</button>

      {simulation && (
        <>
          {simulation.errors.length > 0 && (
            <ul className="test-errors">
              {simulation.errors.map((e, i) => (
                <li key={i}>{e}</li>
              ))}
            </ul>
          )}

          <ol className="test-steps">
            {simulation.steps.map((s) => (
              <li key={s.step}>
                Step {s.step}: {s.message}
              </li>
            ))}
          </ol>
        </>
      )}
    </div>
  );
}

export default TestPanel;
