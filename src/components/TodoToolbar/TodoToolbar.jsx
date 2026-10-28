import './TodoToolbar.css';

const FILTERS = ['All', 'Active', 'Completed'];

export default function TodoToolbar({ filter, onFilterChange, priorityFilter, onPriorityFilterChange, total, search, onSearchChange, remaining }) {
  return (
    <div className="list-toolbar">
      <div className="filter-tabs" role="tablist" aria-label="Filter todos">
        {FILTERS.map((item) => <button key={item} className={`filter-tab ${filter === item ? 'selected' : ''}`} type="button" role="tab" aria-selected={filter === item} onClick={() => onFilterChange(item)}>{item}{item === 'All' && <span className="filter-count">{total}</span>}</button>)}
      </div>
      <label className="priority-filter-field">
        <span className="visually-hidden">Filter by priority</span>
        <select aria-label="Filter by priority" value={priorityFilter} onChange={(event) => onPriorityFilterChange(event.target.value)}>
          <option value="All">All priorities</option>
          <option value="high">High priority</option>
          <option value="normal">Normal priority</option>
          <option value="low">Low priority</option>
        </select>
      </label>
      <label className="search-field"><span aria-hidden="true">⌕</span><input type="search" aria-label="Search tasks" placeholder="Search tasks" value={search} onChange={(event) => onSearchChange(event.target.value)} /></label>
      <span className="task-count">{remaining} {remaining === 1 ? 'task' : 'tasks'} left</span>
    </div>
  );
}
