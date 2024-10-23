const saveBtn = document.querySelector('#saveBtn');
const toDoCards = document.querySelector('#todo-cards');
let title = document.querySelector('#title');
let date = document.querySelector('#date');
let description = document.querySelector('#description');

// Function to generate a unique task id
function generateTaskId() {
    return 'card-' + Math.floor((1 + Math.random()) * 0x10000).toString(16).substring(1);
}

// Function to create a task card
function createTaskCard() {
    const taskId = generateTaskId();

    let tasks = JSON.parse(localStorage.getItem('tasks')) || [];
    let taskInfo = { id: taskId, title: title.value, date: date.value, description: description.value };

    tasks.push(taskInfo);
    localStorage.setItem('tasks', JSON.stringify(tasks));
}

// Function to render the task list and make cards draggable
function renderTaskList() {
    let tasks = JSON.parse(localStorage.getItem('tasks')) || [];
    const now = dayjs();

    toDoCards.innerHTML = tasks.map(task => {
        const isPastDue = dayjs(task.date).isBefore(now, 'day');
        return `
            <section id="${task.id}" draggable="true" class="todocards ${isPastDue ? 'past-due' : ''}">
                <h2>${task.title}</h2>
                <p>${task.date}</p>
                <button>Delete</button>
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

// Function to set up drag-and-drop event listeners

let draggedCard = null;

function setUpDragAndDrop() {
    document.querySelectorAll('.todocards').forEach(card => {
        card.addEventListener('dragstart', (e) => {
            draggedCard = card;
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

        card.addEventListener('dragover', (e) => {
            e.preventDefault();
        });

        card.addEventListener('drop', (e) => {
            e.preventDefault();
            if (draggedCard) {
                const cardsArray = Array.from(document.querySelectorAll('.todocards'));
                const currentIndex = cardsArray.indexOf(card);
                const draggedIndex = cardsArray.indexOf(draggedCard);

                if (currentIndex > draggedIndex) {
                    card.parentNode.insertBefore(draggedCard, card.nextSibling);
                } else {
                    card.parentNode.insertBefore(draggedCard, card);
                }
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
    renderTaskList();
    setUpDragAndDrop();
});