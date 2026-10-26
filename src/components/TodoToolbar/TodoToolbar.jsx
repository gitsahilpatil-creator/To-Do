import './TodoToolbar.css';

const FILTERS = ['All', 'Active', 'Completed'];

export default function TodoToolbar({ filter, onFilterChange, total, search, onSearchChange, remaining }) {
  return (
    <div className="list-toolbar">
      <div className="filter-tabs" role="tablist" aria-label="Filter todos">
        {FILTERS.map((item) => <button key={item} className={`filter-tab ${filter === item ? 'selected' : ''}`} type="button" role="tab" aria-selected={filter === item} onClick={() => onFilterChange(item)}>{item}{item === 'All' && <span className="filter-count">{total}</span>}</button>)}
      </div>
      <label className="search-field"><span aria-hidden="true">⌕</span><input type="search" aria-label="Search tasks" placeholder="Search tasks" value={search} onChange={(event) => onSearchChange(event.target.value)} /></label>
      <span className="task-count">{remaining} {remaining === 1 ? 'task' : 'tasks'} left</span>
    </div>
  );
}
