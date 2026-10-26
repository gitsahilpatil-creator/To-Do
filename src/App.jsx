import { useState } from 'react';
import Login from './components/Login/Login.jsx';
import TodoApp from './components/TodoApp/TodoApp.jsx';

export default function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  return isLoggedIn ? <TodoApp onLogout={() => setIsLoggedIn(false)} /> : <Login onLogin={() => setIsLoggedIn(true)} />;
}
