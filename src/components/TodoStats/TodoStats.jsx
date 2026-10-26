import './TodoStats.css';

export default function TodoStats({ total, remaining, completed, progress }) {
  return (
    <section className="dashboard-stats" aria-label="Task progress">
      <article className="stat-card"><span className="stat-label">In your list</span><strong>{total}</strong><span className="stat-caption">total {total === 1 ? 'task' : 'tasks'}</span></article>
      <article className="stat-card"><span className="stat-label">Still to do</span><strong>{remaining}</strong><span className="stat-caption">ready when you are</span></article>
      <article className="stat-card progress-stat"><div className="stat-progress-heading"><span className="stat-label">Your progress</span><strong>{progress}%</strong></div><div className="progress-track" role="progressbar" aria-label="Tasks completed" aria-valuemin="0" aria-valuemax="100" aria-valuenow={progress}><span style={{ width: `${progress}%` }} /></div><span className="stat-caption">{completed} {completed === 1 ? 'task' : 'tasks'} completed</span></article>
    </section>
  );
}
