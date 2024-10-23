const saveBtn = document.querySelector('#saveBtn');
const toDoCards = document.querySelector('#todo-cards');
let title = document.querySelector('#title');
let date = document.querySelector('#date');
let description = document.querySelector('#description');


function generateTaskId() {
    return 'card-' + Math.floor((1 + Math.random()) * 0x10000).toString(16).substring(1);
}


function createTaskCard() {
    const taskId = generateTaskId();

    let tasks = JSON.parse(localStorage.getItem('tasks')) || [];
    let taskInfo = { id: taskId, title: title.value, date: date.value, description: description.value };

    tasks.push(taskInfo);
    localStorage.setItem('tasks', JSON.stringify(tasks));

    addTaskToDOM(taskInfo);
}

function addTaskToDOM(task) {
    const now = dayjs();
    const isPastDue = dayjs(task.date).isBefore(now, 'day');
    
    const taskHTML = `
        <section id="${task.id}" draggable="true" class="todocards ${isPastDue ? 'past-due' : ''}">
            <h2>${task.title}</h2>
            <p>${task.date}</p>
            <p>${task.description}</p>
            <button class="delete-btn" data-id="${task.id}">Delete</button>
        </section>
    `;
    
    toDoCards.insertAdjacentHTML('beforeend', taskHTML);
    
    const newTaskElement = document.getElementById(task.id);
    newTaskElement.querySelector('.delete-btn').addEventListener('click', function() {
        deleteTask(task.id);
    });

    setUpDragAndDrop();
}

function renderTaskList() {
    let tasks = JSON.parse(localStorage.getItem('tasks')) || [];
    const now = dayjs();
    toDoCards.innerHTML = ''; 

    tasks.forEach(task => {
        addTaskToDOM(task); 
    });

    toDoCards.innerHTML = tasks.map(task => {
        const isPastDue = dayjs(task.date).isBefore(now, 'day');
        return `
            <section id="${task.id}" draggable="true" class="todocards ${isPastDue ? 'past-due' : ''}">
                <h2>${task.title}</h2>
                <p>${task.date}</p>
                <p>${task.description}</p>
                <button class="delete-btn" data-id="${task.id}">Delete</button>
            </section>
        `;
    }).join('');

    setUpDragAndDrop();


    document.querySelectorAll('.delete-btn').forEach(button => {
        button.addEventListener('click', function() {
            const taskId = this.getAttribute('data-id');
            deleteTask(taskId);
        });
    });
}

function deleteTask(taskId) {
    let tasks = JSON.parse(localStorage.getItem('tasks')) || [];
    tasks = tasks.filter(task => task.id !== taskId);
    localStorage.setItem('tasks', JSON.stringify(tasks));
    document.getElementById(taskId).remove();
}





let draggedCard = null;

function setUpDragAndDrop() {
    document.querySelectorAll('.todocards').forEach(card => {
        card.addEventListener('dragstart', (e) => {
            draggedCard = card;
            e.dataTransfer.setData("text/plain", card.id); 
            setTimeout(() => {
                if (draggedCard) {
                    draggedCard.style.display = 'none';
                }
            }, 0);
        });

        card.addEventListener('dragend', () => {
            setTimeout(() => {
                if (draggedCard) {
                    draggedCard.style.display = 'block';
                    draggedCard = null;
                }
            }, 0);
        });
    });

    document.querySelectorAll('.lane').forEach(lane => {
        lane.addEventListener('dragover', (e) => {
            e.preventDefault();
        });

        lane.addEventListener('drop', (e) => {
            e.preventDefault();
            const cardId = e.dataTransfer.getData("text/plain");
            const card = document.getElementById(cardId);
            if (card) {
                const dropTarget = e.target.closest('.lane');
                if (dropTarget) {
                    dropTarget.querySelector('.card-body').appendChild(card);
                } else {
                    console.error("Drop target not found.");
                }
            } else {
                console.error("Card not found:", cardId);
            }
        });
    });
}

function allowDrop(ev) {
    ev.preventDefault();
}

function drag(ev) {
    ev.dataTransfer.setData("text", ev.target.id);
    console.log("Dragging card with id:", ev.target.id);  
}

function drop(ev) {
    ev.preventDefault();
    var data = ev.dataTransfer.getData("text");
    console.log("Dropping card with id:", data);  
    var card = document.getElementById(data);
    if (card) {
        let dropTarget = ev.target.closest('.lane')?.querySelector('.card-body');
        if (!dropTarget) {
            if (ev.target.id === 'in-progress-cards' || ev.target.id === 'done-cards') {
                dropTarget = ev.target;
            }
        }
        if (dropTarget) {
            dropTarget.appendChild(card);
        } else {
            console.error("Drop target not found.");
        }
    } else {
        console.error("Card not found:", data);
    }
}

$(document).ready(function () {
    renderTaskList();
    setUpDragAndDrop();
});

saveBtn.addEventListener('click', function() {
    createTaskCard();
    title.value = '';
    date.value = '';
    description.value = '';
});