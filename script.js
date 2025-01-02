let todoList = [];

document.addEventListener('DOMContentLoaded', () => {
    const savedTodos = localStorage.getItem('todos');
    if (savedTodos) {
        todoList = JSON.parse(savedTodos);
        displayTodos();
    }
    if (!('Notification' in window)) {
        alert('This browser does not support notifications.');
        return;
    }

    if (Notification.permission === 'default') {
        Notification.requestPermission().then((permission) => {
            if (permission !== 'granted') {
                alert('Please enable notifications to receive reminders.');
            }
        });
    } else if (Notification.permission === 'denied') {
        alert('Notifications are blocked. Please enable them in your browser settings.');
    }
});

document.getElementById('add-todo').addEventListener('click', () => {
    const text = document.getElementById('todo-text').value;
    const due = document.getElementById('todo-due').value;

    if (text.trim() === '') return alert('Task cannot be empty.');

    const todo = { id: Date.now(), text, due, completed: false };
    todoList.push(todo);
    saveTodos();
    displayTodos();
    scheduleNotification(todo);
});

function displayTodos() {
    const list = document.getElementById('todo-list');
    list.innerHTML = '';
    todoList.forEach((todo) => {
        const li = document.createElement('li');
        li.className = 'todo-item';
        li.innerHTML = `
            <span>${todo.text} (Due: ${todo.due})</span>
            <div class="actions">
                <button class="edit" onclick="editTodo(${todo.id})">Edit</button>
                <button onclick="deleteTodo(${todo.id})">Delete</button>
            </div>
        `;
        list.appendChild(li);
    });
}

function editTodo(id) {
    const todo = todoList.find((t) => t.id === id);
    const newText = prompt('Edit task:', todo.text);
    if (newText !== null) {
        todo.text = newText.trim() || todo.text;
        saveTodos();
        displayTodos();
    }
}

function deleteTodo(id) {
    todoList = todoList.filter((t) => t.id !== id);
    saveTodos();
    displayTodos();
}

function scheduleNotification(todo) {
    if (Notification.permission === 'granted') {
        const dueTime = new Date(todo.due).getTime();
        const now = Date.now();

        if (dueTime > now) {
            setTimeout(() => {
                new Notification('Todo Reminder', {
                    body: todo.text,
                    icon: 'icon.png', // Add an optional icon for the notification
                });
            }, dueTime - now);
        }
    } else {
        alert('Notifications are not enabled. Please enable them for reminders.');
    }
}

function saveTodos() {
    localStorage.setItem('todos', JSON.stringify(todoList));
}

if ('serviceWorker' in navigator) {
    navigator.serviceWorker.register('service-worker.js').then(() => {
        console.log('Service Worker registered.');
    });
}

if (Notification.permission !== 'granted') {
    Notification.requestPermission().then((permission) => {
        if (permission !== 'granted') {
            alert('Notifications are disabled. Enable them for reminders.');
        }
    });
}