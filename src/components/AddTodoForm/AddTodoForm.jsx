import './AddTodoForm.css';

export default function AddTodoForm({ draft, onDraftChange, priority, onPriorityChange, dueDate, onDueDateChange, todayString, onSubmit }) {
  return (
    <form className="add-form" onSubmit={onSubmit}>
      <div className="task-entry">
        <div className="task-title-field"><span className="add-icon" aria-hidden="true">＋</span><input aria-label="New todo" value={draft} onChange={(event) => onDraftChange(event.target.value)} placeholder="What would you like to get done?" /></div>
        <div className="task-options">
          <label className="visually-hidden" htmlFor="task-priority">Priority</label>
          <select id="task-priority" value={priority} onChange={(event) => onPriorityChange(event.target.value)}>
            <option value="low">Low priority</option><option value="normal">Normal priority</option><option value="high">High priority</option>
          </select>
          <label className="visually-hidden" htmlFor="task-due-date">Due date</label>
          <input id="task-due-date" type="date" aria-label="Due date" min={todayString} value={dueDate} onChange={(event) => onDueDateChange(event.target.value)} />
          <button className="button button-add" type="submit" disabled={!draft.trim()}>Add task <span aria-hidden="true">→</span></button>
        </div>
      </div>
    </form>
  );
}
