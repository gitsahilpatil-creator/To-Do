import { useEffect, useMemo, useState } from 'react';
import TodoHeader from '../TodoHeader/TodoHeader.jsx';
import TodoStats from '../TodoStats/TodoStats.jsx';
import AddTodoForm from '../AddTodoForm/AddTodoForm.jsx';
import TodoToolbar from '../TodoToolbar/TodoToolbar.jsx';
import TodoList from '../TodoList/TodoList.jsx';
import './TodoApp.css';

const STORAGE_KEY = 'daylight-todos';

function readTodos() {
  try {
    const saved = JSON.parse(localStorage.getItem(STORAGE_KEY) || '[]');
    return Array.isArray(saved) ? saved : [];
  } catch {
    return [];
  }
}

export default function TodoApp({ onLogout }) {
  const [todos, setTodos] = useState(readTodos);
  const [filter, setFilter] = useState('All');
  const [draft, setDraft] = useState('');
  const [priority, setPriority] = useState('normal');
  const [dueDate, setDueDate] = useState('');
  const [search, setSearch] = useState('');
  const [editingTodoId, setEditingTodoId] = useState(null);
  const [editDraft, setEditDraft] = useState('');
  const remaining = todos.filter((todo) => !todo.completed).length;
  const completed = todos.length - remaining;
  const progress = todos.length ? Math.round((completed / todos.length) * 100) : 0;
  const today = new Date();
  const todayString = `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, '0')}-${String(today.getDate()).padStart(2, '0')}`;
  const visibleTodos = useMemo(() => todos.filter((todo) => {
    const matchesFilter = filter === 'All' || (filter === 'Active' ? !todo.completed : todo.completed);
    return matchesFilter && todo.text.toLowerCase().includes(search.trim().toLowerCase());
  }), [todos, filter, search]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(todos));
  }, [todos]);

  function addTodo(event) {
    event.preventDefault();
    const text = draft.trim();
    if (!text) return;
    setTodos((current) => [{ id: `${Date.now()}-${Math.random()}`, text, completed: false, priority, dueDate }, ...current]);
    setDraft('');
    setPriority('normal');
    setDueDate('');
  }

  function toggleTodo(id) {
    setTodos((current) => current.map((todo) => todo.id === id ? { ...todo, completed: !todo.completed } : todo));
  }

  function deleteTodo(id) {
    setTodos((current) => current.filter((todo) => todo.id !== id));
    if (editingTodoId === id) cancelEditing();
  }

  function startEditing(todo) {
    setEditingTodoId(todo.id);
    setEditDraft(todo.text);
  }

  function cancelEditing() {
    setEditingTodoId(null);
    setEditDraft('');
  }

  function saveTodo(event, id) {
    event.preventDefault();
    const text = editDraft.trim();
    if (!text) return;
    setTodos((current) => current.map((todo) => todo.id === id ? { ...todo, text } : todo));
    cancelEditing();
  }

  return (
    <main className="todo-page">
      <TodoHeader onLogout={onLogout} />
      <section className="todo-shell">
        <div className="greeting-row"><div><p className="eyebrow">YOUR SPACE, YOUR PACE</p><h1>A fresh start.</h1><p className="subheading">One thing at a time. You’ve got this.</p></div><div className="date-chip"><span className="date-spark">✳</span><span>Make today count</span></div></div>
        <TodoStats total={todos.length} remaining={remaining} completed={completed} progress={progress} />
        <section className="todo-card" aria-label="Todo list">
          <AddTodoForm draft={draft} onDraftChange={setDraft} priority={priority} onPriorityChange={setPriority} dueDate={dueDate} onDueDateChange={setDueDate} todayString={todayString} onSubmit={addTodo} />
          <TodoToolbar filter={filter} onFilterChange={setFilter} total={todos.length} search={search} onSearchChange={setSearch} remaining={remaining} />
          <TodoList todos={visibleTodos} todayString={todayString} search={search.trim()} filter={filter} editingTodoId={editingTodoId} editDraft={editDraft} onEditDraftChange={setEditDraft} onToggle={toggleTodo} onDelete={deleteTodo} onStartEditing={startEditing} onSave={saveTodo} onCancelEditing={cancelEditing} onClearCompleted={completed ? () => setTodos((current) => current.filter((todo) => !todo.completed)) : null} />
        </section>
        <p className="privacy-note"><span aria-hidden="true">◇</span> Your tasks are saved on this device.</p>
      </section>
      <footer className="page-footer"><span>DAYLIGHT</span><span>MAKE SPACE FOR GOOD THINGS</span></footer>
    </main>
  );
}
