describe('Todo app', () => {
  beforeEach(() => {
    cy.visit('http://localhost:5173', {
      onBeforeLoad(window) {
        window.localStorage.removeItem('daylight-todos');
      },
    });
  });

  function logIn() {
    cy.get('#email').should('be.visible').type('student@example.com');
    cy.get('#password').should('be.visible').type('password123');
    cy.get('button[type="submit"]').contains('Sign in').click();
    cy.contains('h1', 'A fresh start.').should('be.visible');
  }

  it('logs in and supports the todo task workflow', () => {
    // Login validation and successful login.
    cy.get('#email').type('student@example.com');
    cy.get('#password').type('wrong-password');
    cy.get('button[type="submit"]').contains('Sign in').click();
    cy.contains('[role="alert"]', 'don’t match').should('be.visible');
    cy.get('#password').clear().type('password123');
    cy.get('button[type="submit"]').contains('Sign in').click();
    cy.contains('h1', 'A fresh start.').should('be.visible');

    // Add a task with priority and due date.
    const dueDate = new Date();
    dueDate.setDate(dueDate.getDate() + 1);
    const dueDateValue = `${dueDate.getFullYear()}-${String(dueDate.getMonth() + 1).padStart(2, '0')}-${String(dueDate.getDate()).padStart(2, '0')}`;

    cy.get('[aria-label="New todo"]').type('Prepare Cypress report');
    cy.get('#task-priority').select('high');
    cy.get('#task-due-date').type(dueDateValue);
    cy.contains('button', 'Add task').click();

    cy.contains('.todo-text', 'Prepare Cypress report').should('be.visible');
    cy.contains('.priority-badge', 'high').should('be.visible');
    cy.get(`time[datetime="${dueDateValue}"]`).should('be.visible');
    cy.contains('.task-count', '1 task left').should('be.visible');

    // Mark complete and confirm the completed filter.
    cy.get('[aria-label="Mark Prepare Cypress report as completed"]').click();
    cy.get('.todo-item').should('have.class', 'is-complete');
    cy.contains('.task-count', '0 tasks left').should('be.visible');
    cy.get('[role="tab"]').contains('Active').click();
    cy.contains('.empty-state', 'No active tasks right now.').should('be.visible');
    cy.get('[role="tab"]').contains('Completed').click();
    cy.contains('.todo-text', 'Prepare Cypress report').should('be.visible');

    // Save an edit, then cancel another edit without changing the title.
    cy.get('[aria-label="Edit Prepare Cypress report"]').click();
    cy.get('[aria-label="Todo title"]').clear().type('Revised Cypress report');
    cy.contains('button', 'Save').click();
    cy.contains('.todo-text', 'Revised Cypress report').should('be.visible');
    cy.get('[aria-label="Edit Revised Cypress report"]').click();
    cy.get('[aria-label="Todo title"]').clear().type('Discard this draft');
    cy.contains('button', 'Cancel').click();
    cy.contains('.todo-text', 'Revised Cypress report').should('be.visible');
    cy.contains('.todo-text', 'Discard this draft').should('not.exist');

    // Search, clear completed, and verify the empty state.
    cy.get('[aria-label="Search tasks"]').type('Revised');
    cy.contains('.todo-text', 'Revised Cypress report').should('be.visible');
    cy.get('[aria-label="Search tasks"]').clear();
    cy.contains('button', 'Clear completed').click();
    cy.contains('.empty-state', 'No completed tasks right now.').should('be.visible');

    // Add and delete a second task, then log out.
    cy.get('[role="tab"]').contains('All').click();
    cy.get('[aria-label="New todo"]').type('Task to delete');
    cy.contains('button', 'Add task').click();
    cy.contains('.todo-text', 'Task to delete').should('be.visible');
    cy.get('[aria-label="Delete Task to delete"]').click();
    cy.contains('.todo-text', 'Task to delete').should('not.exist');
    cy.contains('button', 'Log out').click();
    cy.get('#email').should('be.visible');
  });

  it('logs in with the demo account', () => {
    logIn();
  });

  it('filters completed tasks and filters by priority', () => {
    logIn();

    const laterDate = new Date();
    laterDate.setDate(laterDate.getDate() + 3);
    const laterDateValue = `${laterDate.getFullYear()}-${String(laterDate.getMonth() + 1).padStart(2, '0')}-${String(laterDate.getDate()).padStart(2, '0')}`;

    cy.get('[aria-label="New todo"]').type('Due high task');
    cy.get('#task-priority').select('high');
    cy.get('#task-due-date').type(laterDateValue);
    cy.contains('button', 'Add task').click();
    cy.get('[aria-label="New todo"]').type('Undated normal task');
    cy.contains('button', 'Add task').click();
    cy.get('[aria-label="New todo"]').type('Due low completed task');
    cy.get('#task-priority').select('low');
    cy.get('#task-due-date').type(laterDateValue);
    cy.contains('button', 'Add task').click();
    cy.get('[aria-label="Mark Due low completed task as completed"]').click();

    cy.get('[aria-label="Filter by priority"]').select('high');
    cy.get('.todo-item').should('have.length', 1);
    cy.contains('.todo-text', 'Due high task').should('be.visible');
    cy.get('[aria-label="Filter by priority"]').select('All');

    cy.get('[role="tab"]').contains('Completed').click();
    cy.get('.todo-item').should('have.length', 1);
    cy.contains('.todo-text', 'Due low completed task').should('be.visible');
  });

  it('orders tasks by due date and then by priority', () => {
    logIn();

    const today = new Date();
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    const dateValue = (date) => `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`;

    const addTask = (title, priority, dueDate) => {
      cy.get('[aria-label="New todo"]').type(title);
      cy.get('#task-priority').select(priority);
      if (dueDate) cy.get('#task-due-date').type(dueDate);
      cy.contains('button', 'Add task').click();
    };

    addTask('Tomorrow high', 'high', dateValue(tomorrow));
    addTask('Today low', 'low', dateValue(today));
    addTask('Today high', 'high', dateValue(today));
    addTask('No date', 'high', '');

    cy.get('.todo-text').then(($tasks) => {
      expect([...$tasks].map((task) => task.textContent.trim())).to.deep.equal([
        'Today high', 'Today low', 'Tomorrow high', 'No date',
      ]);
    });
  });
});
