const btnAdd = document.getElementById('btnTask');
const formTask = document.querySelector('form');
const input = document.getElementById('noteInput');
const list = document.getElementById('taskList');
const btnDeleteLast = document.getElementById('deletebtn'); 
const showAll = document.getElementById('showAll');
const showPending = document.getElementById('showPending');
const showCompleted = document.getElementById('showCompleted');
const themeBtn = document.getElementById('themeBtn');
const taskStats = document.getElementById('taskStats');

let tasks = JSON.parse(localStorage.getItem('tasks')) || [];

if (localStorage.getItem('theme') === 'dark') {
  document.body.classList.add('dark-mode');
}

let currentFilter = sessionStorage.getItem('currentFilter') || 'all';

let draftInput = sessionStorage.getItem('draftInput');
if (draftInput) {
  input.value = draftInput;
}

input.addEventListener('input', () => {
  sessionStorage.setItem('draftInput', input.value);
});

function renderTask() {
  list.innerHTML = '';
  
  const completedCount = tasks.filter(t => t.completed).length;
  const pendingCount = tasks.length - completedCount;
  taskStats.innerText = `Pending: ${pendingCount} | Completed: ${completedCount}`;

  const filteredTasks = tasks.filter(task => {
    if (currentFilter === 'all') return true;
    if (currentFilter === 'pending') return !task.completed;
    if (currentFilter === 'completed') return task.completed;
  });

  filteredTasks.forEach(task => {
    const li = document.createElement('li');
    if (task.completed) li.classList.add('completed-task');

    li.innerHTML = `
      <span class="task-text" ondblclick="editTask(${task.id})">${task.text}</span>
      <div class="buttons">
        <button class="btn-complete" onclick="toggleComplete(${task.id})">
          ${task.completed ? '↺' : '✓'}
        </button>
        <!-- Botón de Edición (Bonus) -->
        <button class="btn-edit" onclick="editTask(${task.id})">✎</button>
        <button class="btn-delete" onclick="deleteOne(${task.id})">🗑</button>
      </div>
    `;
    list.appendChild(li);
  });
  
  if (filteredTasks.length === 0) {
    list.innerHTML = '<li class="empty-message">No tasks to show</li>';
  }
}

function addTask() {
  if (input.value.trim() !== '') {
    const newTask = {
      id: Date.now(), 
      text: input.value,
      completed: false
    };
    tasks.push(newTask); 
    localStorage.setItem('tasks', JSON.stringify(tasks));
    
    input.value = '';
    sessionStorage.removeItem('draftInput');
    renderTask();
  } else {
    alert('The input is empty');
  }
}

function toggleComplete(id) {
  const taskIndex = tasks.findIndex(t => t.id === id);
  if (taskIndex !== -1) {
    tasks[taskIndex].completed = !tasks[taskIndex].completed;
    localStorage.setItem('tasks', JSON.stringify(tasks));
    renderTask();
  }
}

function deleteOne(id) {
  tasks = tasks.filter(t => t.id !== id);
  localStorage.setItem('tasks', JSON.stringify(tasks));
  renderTask();
}

window.editTask = function(id) {
  const taskIndex = tasks.findIndex(t => t.id === id);
  if (taskIndex !== -1) {
    const newText = prompt("Edit your task:", tasks[taskIndex].text);
    if (newText !== null && newText.trim() !== "") {
      tasks[taskIndex].text = newText;
      localStorage.setItem('tasks', JSON.stringify(tasks));
      renderTask();
    }
  }
};

function deleteLast() {
  if (tasks.length > 0) {
    const lastTask = tasks[tasks.length - 1];
    deleteOne(lastTask.id);
  }
}

function toggleTheme() {
  document.body.classList.toggle('dark-mode');
  const isDark = document.body.classList.contains('dark-mode');
  localStorage.setItem('theme', isDark ? 'dark' : 'light');
}

function updateFilterButtons() {
  [showAll, showPending, showCompleted].forEach(btn => btn.classList.remove('active'));
  if (currentFilter === 'all') showAll.classList.add('active');
  if (currentFilter === 'pending') showPending.classList.add('active');
  if (currentFilter === 'completed') showCompleted.classList.add('active');
}

formTask.addEventListener('submit', (event) => {
  event.preventDefault();
  addTask();
});

btnDeleteLast.addEventListener('click', deleteLast);
themeBtn.addEventListener('click', toggleTheme);

showAll.addEventListener('click', () => {
  currentFilter = 'all';
  sessionStorage.setItem('currentFilter', 'all');
  updateFilterButtons();
  renderTask();
});

showPending.addEventListener('click', () => {
  currentFilter = 'pending';
  sessionStorage.setItem('currentFilter', 'pending');
  updateFilterButtons();
  renderTask();
});

showCompleted.addEventListener('click', () => {
  currentFilter = 'completed';
  sessionStorage.setItem('currentFilter', 'completed');
  updateFilterButtons();
  renderTask();
});

renderTask();
updateFilterButtons();