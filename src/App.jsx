import { useEffect, useMemo, useState } from 'react';

const DEMO_EMAIL = 'student@example.com';
const DEMO_PASSWORD = 'password123';
const STORAGE_KEY = 'daylight-todos';
const FILTERS = ['All', 'Active', 'Completed'];

function readTodos() {
  try {
    const saved = JSON.parse(localStorage.getItem(STORAGE_KEY) || '[]');
    return Array.isArray(saved) ? saved : [];
  } catch {
    return [];
  }
}

function Login({ onLogin }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  function handleSubmit(event) {
    event.preventDefault();
    if (!email.trim() || !password) {
      setError('Please enter your email and password.');
      return;
    }
    if (!/^\S+@\S+\.\S+$/.test(email.trim())) {
      setError('Enter a valid email address.');
      return;
    }
    if (email.trim().toLowerCase() !== DEMO_EMAIL || password !== DEMO_PASSWORD) {
      setError('That email and password don’t match. Try the demo details below.');
      return;
    }
    setError('');
    onLogin();
  }

  return (
    <main className="login-layout">
      <section className="login-card" aria-labelledby="login-title">
        <div className="brand-mark" aria-hidden="true">✳</div>
        <p className="eyebrow">A little more focus</p>
        <h1 id="login-title">Make room for<br />what matters.</h1>
        <p className="login-copy">Sign in to your personal space and get today moving.</p>
        <form className="login-form" onSubmit={handleSubmit} noValidate>
          <label htmlFor="email">Email address</label>
          <input id="email" type="email" autoComplete="username" placeholder="you@example.com" value={email} onChange={(event) => setEmail(event.target.value)} />
          <label htmlFor="password">Password</label>
          <input id="password" type="password" autoComplete="current-password" placeholder="Enter your password" value={password} onChange={(event) => setPassword(event.target.value)} />
          {error && <p className="form-error" role="alert">{error}</p>}
          <button className="button button-primary login-button" type="submit">Sign in <span aria-hidden="true">→</span></button>
        </form>
        <div className="demo-note"><span className="demo-dot" /> Demo access <strong>student@example.com</strong><strong>password123</strong></div>
      </section>
      <aside className="login-art" aria-label="A calm place to plan your day">
        <div className="sun" />
        <div className="art-caption"><span>01 / TODAY</span><p>Small steps<br />still move you forward.</p></div>
        <div className="art-leaf leaf-one" /><div className="art-leaf leaf-two" /><div className="art-leaf leaf-three" />
      </aside>
    </main>
  );
}

function TodoApp({ onLogout }) {
  const [todos, setTodos] = useState(readTodos);
  const [filter, setFilter] = useState('All');
  const [draft, setDraft] = useState('');
  const remaining = todos.filter((todo) => !todo.completed).length;
  const visibleTodos = useMemo(() => todos.filter((todo) => {
    if (filter === 'Active') return !todo.completed;
    if (filter === 'Completed') return todo.completed;
    return true;
  }), [todos, filter]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(todos));
  }, [todos]);

  function addTodo(event) {
    event.preventDefault();
    const text = draft.trim();
    if (!text) return;
    setTodos((current) => [{ id: `${Date.now()}-${Math.random()}`, text, completed: false }, ...current]);
    setDraft('');
  }

  function toggleTodo(id) {
    setTodos((current) => current.map((todo) => todo.id === id ? { ...todo, completed: !todo.completed } : todo));
  }

  function deleteTodo(id) {
    setTodos((current) => current.filter((todo) => todo.id !== id));
  }

  return (
    <main className="todo-page">
      <header className="topbar">
        <a className="wordmark" href="#home" aria-label="Daylight home"><span className="brand-mark small">✳</span> daylight</a>
        <button className="button button-quiet logout-button" type="button" onClick={onLogout}>Log out <span aria-hidden="true">↗</span></button>
      </header>
      <section className="todo-shell">
        <div className="greeting-row"><div><p className="eyebrow">YOUR SPACE, YOUR PACE</p><h1>A fresh start.</h1><p className="subheading">One thing at a time. You’ve got this.</p></div><div className="date-chip"><span className="date-spark">✳</span><span>Make today count</span></div></div>
        <section className="todo-card" aria-label="Todo list">
          <form className="add-form" onSubmit={addTodo}>
            <span className="add-icon" aria-hidden="true">＋</span>
            <input aria-label="New todo" value={draft} onChange={(event) => setDraft(event.target.value)} placeholder="What would you like to get done?" />
            <button className="button button-add" type="submit" disabled={!draft.trim()}>Add task <span aria-hidden="true">→</span></button>
          </form>
          <div className="list-toolbar"><div className="filter-tabs" role="tablist" aria-label="Filter todos">{FILTERS.map((item) => <button key={item} className={`filter-tab ${filter === item ? 'selected' : ''}`} type="button" role="tab" aria-selected={filter === item} onClick={() => setFilter(item)}>{item}{item === 'All' && <span className="filter-count">{todos.length}</span>}</button>)}</div><span className="task-count">{remaining} {remaining === 1 ? 'task' : 'tasks'} left</span></div>
          {visibleTodos.length ? <ul className="todo-list">{visibleTodos.map((todo) => <li className={`todo-item ${todo.completed ? 'is-complete' : ''}`} key={todo.id}><button className="check-button" type="button" aria-label={todo.completed ? `Mark ${todo.text} as active` : `Mark ${todo.text} as completed`} aria-pressed={todo.completed} onClick={() => toggleTodo(todo.id)}>{todo.completed && <span aria-hidden="true">✓</span>}</button><span className="todo-text">{todo.text}</span><button className="delete-button" type="button" aria-label={`Delete ${todo.text}`} onClick={() => deleteTodo(todo.id)}>×</button></li>)}</ul> : <div className="empty-state"><span className="empty-icon" aria-hidden="true">✳</span><p>{todos.length === 0 ? 'A clear day starts here.' : `No ${filter.toLowerCase()} tasks right now.`}</p><span>{todos.length === 0 ? 'Add a task above and make it happen.' : 'Try another filter or add something new.'}</span></div>}
          <footer className="list-footer"><span><span className="footer-check">✓</span> A little progress adds up.</span>{todos.some((todo) => todo.completed) && <button type="button" className="clear-button" onClick={() => setTodos((current) => current.filter((todo) => !todo.completed))}>Clear completed</button>}</footer>
        </section>
        <p className="privacy-note"><span aria-hidden="true">◇</span> Your tasks are saved on this device.</p>
      </section>
      <footer className="page-footer"><span>DAYLIGHT</span><span>MAKE SPACE FOR GOOD THINGS</span></footer>
    </main>
  );
}

export default function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  return isLoggedIn ? <TodoApp onLogout={() => setIsLoggedIn(false)} /> : <Login onLogin={() => setIsLoggedIn(true)} />;
}
