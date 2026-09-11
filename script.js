// ==========================================
// STATE MANAGEMENT
// ==========================================
let todos = JSON.parse(localStorage.getItem('app_todos')) || [];
let notes = JSON.parse(localStorage.getItem('app_notes')) || [];

// ==========================================
// DOM ELEMENTS
// ==========================================
const todoForm = document.getElementById('todo-form');
const todoInput = document.getElementById('todo-input');
const todoList = document.getElementById('todo-list');
const noteForm = document.getElementById('note-form');
const noteInput = document.getElementById('note-input');
const notesList = document.getElementById('notes-list');
const completedCountEl = document.getElementById('completed-count');
const totalCountEl = document.getElementById('total-count');

// ==========================================
// INITIALIZATION
// ==========================================
document.addEventListener('DOMContentLoaded', () => {
    renderTodos();
    renderNotes();
    updateStats();
});

// ==========================================
// TODO FUNCTIONS
// ==========================================
todoForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const text = todoInput.value.trim();
    if (text === '') return;

    const newTodo = {
        id: Date.now(),
        text: text,
        completed: false
    };

    todos.push(newTodo);
    saveAndRenderTodos();
    todoInput.value = '';
});

function toggleTodo(id) {
    todos = todos.map(todo => {
        if (todo.id === id) {
            return { ...todo, completed: !todo.completed };
        }
        return todo;
    });
    saveAndRenderTodos();
}

function deleteTodo(id) {
    todos = todos.filter(todo => todo.id !== id);
    saveAndRenderTodos();
}

function saveAndRenderTodos() {
    localStorage.setItem('app_todos', JSON.stringify(todos));
    renderTodos();
    updateStats();
}

function renderTodos() {
    todoList.innerHTML = '';

    if (todos.length === 0) {
        todoList.innerHTML = '<li class="empty-state">Belum ada tugas saat ini.</li>';
        return;
    }

    todos.forEach(todo => {
        const li = document.createElement('li');
        li.className = `todo-item ${todo.completed ? 'completed' : ''}`;
        
        li.innerHTML = `
            <div class="todo-item-content">
                <input type="checkbox" ${todo.completed ? 'checked' : ''} onchange="toggleTodo(${todo.id})">
                <span>${escapeHtml(todo.text)}</span>
            </div>
            <button class="btn-danger" onclick="deleteTodo(${todo.id})">Hapus</button>
        `;
        
        todoList.appendChild(li);
    });
}

// ==========================================
// NOTES FUNCTIONS
// ==========================================
noteForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const text = noteInput.value.trim();
    if (text === '') return;

    const newNote = {
        id: Date.now(),
        text: text,
        date: new Date().toLocaleDateString('id-ID', { hour: '2-digit', minute: '2-digit' })
    };

    notes.unshift(newNote); // Tambah ke awal array
    saveAndRenderNotes();
    noteInput.value = '';
});

function deleteNote(id) {
    notes = notes.filter(note => note.id !== id);
    saveAndRenderNotes();
}

function saveAndRenderNotes() {
    localStorage.setItem('app_notes', JSON.stringify(notes));
    renderNotes();
}

function renderNotes() {
    notesList.innerHTML = '';

    if (notes.length === 0) {
        notesList.innerHTML = '<div class="empty-state">Belum ada catatan tersimpan.</div>';
        return;
    }

    notes.forEach(note => {
        const div = document.createElement('div');
        div.className = 'note-item';
        
        div.innerHTML = `
            <p>${escapeHtml(note.text)}</p>
            <div class="note-footer">
                <span>${note.date}</span>
                <button class="btn-danger" onclick="deleteNote(${note.id})">Hapus</button>
            </div>
        `;
        
        notesList.appendChild(div);
    });
}

// ==========================================
// HELPER / STATS FUNCTIONS
// ==========================================
function updateStats() {
    const completed = todos.filter(t => t.completed).length;
    const total = todos.length;
    
    completedCountEl.textContent = completed;
    totalCountEl.textContent = total;
}

function escapeHtml(text) {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
}