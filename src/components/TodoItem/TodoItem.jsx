import './TodoItem.css';

export default function TodoItem({ todo, todayString, editingTodoId, editDraft, onEditDraftChange, onToggle, onDelete, onStartEditing, onSave, onCancelEditing }) {
  const taskPriority = todo.priority || 'normal';
  const isOverdue = !todo.completed && todo.dueDate && todo.dueDate < todayString;
  const dueLabel = todo.dueDate
    ? new Date(`${todo.dueDate}T00:00:00`).toLocaleDateString(undefined, { month: 'short', day: 'numeric' })
    : '';
  const isEditing = editingTodoId === todo.id;

  return (
    <li className={`todo-item ${todo.completed ? 'is-complete' : ''}`}>
      <button className="check-button" type="button" aria-label={todo.completed ? `Mark ${todo.text} as active` : `Mark ${todo.text} as completed`} aria-pressed={todo.completed} onClick={() => onToggle(todo.id)}>{todo.completed && <span aria-hidden="true">✓</span>}</button>
      {isEditing ? <form className="edit-form" onSubmit={(event) => onSave(event, todo.id)}>
        <label className="visually-hidden" htmlFor={`edit-todo-${todo.id}`}>Edit todo title</label>
        <input id={`edit-todo-${todo.id}`} aria-label="Todo title" autoFocus value={editDraft} onChange={(event) => onEditDraftChange(event.target.value)} />
        <button className="button edit-save-button" type="submit" disabled={!editDraft.trim()}>Save</button>
        <button className="button edit-cancel-button" type="button" onClick={onCancelEditing}>Cancel</button>
      </form> : <span className="todo-text">{todo.text}</span>}
      <span className={`priority-badge priority-${taskPriority}`}>{taskPriority}</span>
      {dueLabel && <time className={`due-date ${isOverdue ? 'is-overdue' : ''}`} dateTime={todo.dueDate}>{isOverdue ? 'Overdue · ' : 'Due '}{dueLabel}</time>}
      {!isEditing && <button className="edit-button" type="button" aria-label={`Edit ${todo.text}`} onClick={() => onStartEditing(todo)}>Edit</button>}
      <button className="delete-button" type="button" aria-label={`Delete ${todo.text}`} onClick={() => onDelete(todo.id)}>×</button>
    </li>
  );
}
