const tasksContainer = document.getElementById('task-list');
const taskForm = document.getElementById('task-form');
const taskInput = document.getElementById('task-input');

let draggingTask = null;
let tasks = [];

function init() {
  bindEvents();
  loadTasks();
}

function bindEvents() {
  taskForm.addEventListener('submit', addTask);

  tasksContainer.addEventListener('dragstart', dragStart);
  tasksContainer.addEventListener('dragover', dragOver);
  tasksContainer.addEventListener('dragenter', dragEnter);
  tasksContainer.addEventListener('dragleave', dragLeave);
  tasksContainer.addEventListener('drop', dragDrop);

  tasksContainer.addEventListener('click', handleTaskActions);
}

function addTask(e) {
  e.preventDefault();

  const taskTitle = taskInput.value.trim();
  if (taskTitle !== '') {
    const task = createTaskElement(taskTitle);
    tasks.push(task);
    tasksContainer.appendChild(task);
    taskInput.value = '';

    saveTasks();
  }
}

function createTaskElement(title) {
  const task = document.createElement('li');
  task.className = 'task';
  task.draggable = true;
  task.innerHTML = `
    <span class="task-title">${title}</span>
    <div class="task-actions">
      <button class="task-complete">Concluída</button>
      <button class="task-delete">Excluir</button>
    </div>
  `;

  return task;
}

function dragStart(e) {
  draggingTask = this;
  e.dataTransfer.effectAllowed = 'move';
  e.dataTransfer.setData('text/html', '');
  this.classList.add('dragging');
}

function dragOver(e) {
  e.preventDefault();
  e.dataTransfer.dropEffect = 'move';
}

function dragEnter() {
  this.classList.add('over');
}

function dragLeave() {
  this.classList.remove('over');
}

function dragDrop() {
  if (draggingTask && draggingTask !== this) {
    const draggingIndex = Array.from(tasksContainer.children).indexOf(draggingTask);
    const dropIndex = Array.from(tasksContainer.children).indexOf(this);

    if (draggingIndex < dropIndex) {
      tasksContainer.insertBefore(draggingTask, this.nextSibling);
    } else {
      tasksContainer.insertBefore(draggingTask, this);
    }

    tasks = Array.from(tasksContainer.querySelectorAll('.task'));
    saveTasks();
  }

  this.classList.remove('over');
  draggingTask.classList.remove('dragging');
}

function handleTaskActions(e) {
  if (e.target.classList.contains('task-complete')) {
    const task = e.target.closest('.task');
    task.classList.toggle('completed');
    saveTasks();
  } else if (e.target.classList.contains('task-delete')) {
    const task = e.target.closest('.task');
    tasksContainer.removeChild(task);
    tasks = tasks.filter(item => item !== task);
    saveTasks();
  }
}

function saveTasks() {
  const taskTitles = tasks.map(task => task.querySelector('.task-title').textContent);
  localStorage.setItem('tasks', JSON.stringify(taskTitles));
}

function loadTasks() {
  const savedTasks = localStorage.getItem('tasks');
  if (savedTasks) {
    const taskTitles = JSON.parse(savedTasks);
    taskTitles.forEach(title => {
      const task = createTaskElement(title);
      tasks.push(task);
      tasksContainer.appendChild(task);
    });
  }
}

init();

