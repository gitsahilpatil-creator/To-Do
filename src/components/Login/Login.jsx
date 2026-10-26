import { useState } from 'react';
import './Login.css';

const DEMO_EMAIL = 'student@example.com';
const DEMO_PASSWORD = 'password123';

export default function Login({ onLogin }) {
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
