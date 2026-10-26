import './TodoHeader.css';

export default function TodoHeader({ onLogout }) {
  return (
    <header className="topbar">
      <a className="wordmark" href="#home" aria-label="Daylight home"><span className="brand-mark small">✳</span> daylight</a>
      <button className="button button-quiet logout-button" type="button" onClick={onLogout}>Log out <span aria-hidden="true">↗</span></button>
    </header>
  );
}
