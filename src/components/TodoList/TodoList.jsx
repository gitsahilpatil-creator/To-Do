import TodoItem from '../TodoItem/TodoItem.jsx';
import './TodoList.css';

export default function TodoList({ todos, todayString, search, filter, editingTodoId, editDraft, onEditDraftChange, editPriority, onEditPriorityChange, editDueDate, onEditDueDateChange, editDueTime, onEditDueTimeChange, onToggle, onDelete, onStartEditing, onSave, onCancelEditing, onClearCompleted }) {
  return (
    <>
      {todos.length ? <ul className="todo-list">{todos.map((todo) => <TodoItem key={todo.id} todo={todo} todayString={todayString} editingTodoId={editingTodoId} editDraft={editDraft} onEditDraftChange={onEditDraftChange} editPriority={editPriority} onEditPriorityChange={onEditPriorityChange} editDueDate={editDueDate} onEditDueDateChange={onEditDueDateChange} editDueTime={editDueTime} onEditDueTimeChange={onEditDueTimeChange} onToggle={onToggle} onDelete={onDelete} onStartEditing={onStartEditing} onSave={onSave} onCancelEditing={onCancelEditing} />)}</ul> : <div className="empty-state"><span className="empty-icon" aria-hidden="true">✳</span><p>{search ? 'No matching tasks.' : `No ${filter.toLowerCase()} tasks right now.`}</p><span>{search ? 'Try a different search.' : 'Try another filter or add something new.'}</span></div>}
      <footer className="list-footer"><span><span className="footer-check">✓</span> A little progress adds up.</span>{onClearCompleted && <button type="button" className="clear-button" onClick={onClearCompleted}>Clear completed</button>}</footer>
    </>
  );
}
