import './TodoItem.css';
import ClockPicker from '../ClockPicker/ClockPicker.jsx';

export default function TodoItem({ todo, todayString, editingTodoId, editDraft, onEditDraftChange, editPriority, onEditPriorityChange, editDueDate, onEditDueDateChange, editDueTime, onEditDueTimeChange, onToggle, onDelete, onStartEditing, onSave, onCancelEditing }) {
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
        <input aria-label="Todo title" autoFocus value={editDraft} onChange={(event) => onEditDraftChange(event.target.value)} />
        <div className="edit-options">
          <label className="visually-hidden" htmlFor={`edit-priority-${todo.id}`}>Priority</label>
          <select id={`edit-priority-${todo.id}`} aria-label="Edit priority" value={editPriority} onChange={(event) => onEditPriorityChange(event.target.value)}>
            <option value="low">Low priority</option><option value="normal">Normal priority</option><option value="high">High priority</option>
          </select>
          <label className="visually-hidden" htmlFor={`edit-date-${todo.id}`}>Due date</label>
          <input id={`edit-date-${todo.id}`} type="date" aria-label="Edit due date" value={editDueDate} onChange={(event) => onEditDueDateChange(event.target.value)} />
          <ClockPicker value={editDueTime} onChange={onEditDueTimeChange} label="Edit due time" />
        </div>
        <div className="edit-actions">
          <button className="button edit-save-button" type="submit" disabled={!editDraft.trim()}>Save</button>
          <button className="button edit-cancel-button" type="button" onClick={onCancelEditing}>Cancel</button>
        </div>
      </form> : <span className="todo-text">{todo.text}</span>}
      {!isEditing && <span className={`priority-badge priority-${taskPriority}`}>{taskPriority}</span>}
      {!isEditing && (dueLabel || todo.dueTime) && <time className={`due-date ${isOverdue ? 'is-overdue' : ''}`} dateTime={todo.dueDate && todo.dueTime ? `${todo.dueDate}T${todo.dueTime}` : todo.dueDate || todo.dueTime}>{dueLabel ? `${isOverdue ? 'Overdue · ' : 'Due '}${dueLabel}` : ''}{todo.dueTime && <span className="due-time">{dueLabel ? ' · ' : ''}{todo.dueTime}</span>}</time>}
      {!isEditing && <button className="edit-button" type="button" aria-label={`Edit ${todo.text}`} onClick={() => onStartEditing(todo)}>Edit</button>}
      <button className="delete-button" type="button" aria-label={`Delete ${todo.text}`} onClick={() => onDelete(todo.id)}>×</button>
    </li>
  );
}
