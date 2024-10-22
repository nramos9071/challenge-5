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

    toDoCards.innerHTML = tasks.map(task => `
        <section id="${task.id}" draggable="true" class="todocards">
            <h2>${task.title}</h2>
            <p>${task.date}</p>
            <button>Delete</button>
        </section>
    `).join('');

    setUpDragAndDrop();
}

// Function to set up drag-and-drop event listeners
function setUpDragAndDrop() {
    document.querySelectorAll('.todocards').forEach(card => {
        card.addEventListener('dragstart', (e) => {
            draggedCard = card;
            setTimeout(() => {
                card.style.display = 'none';
            }, 0);
        });

        card.addEventListener('dragend', () => {
            setTimeout(() => {
                draggedCard.style.display = 'block';
                draggedCard = null;
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
}

function drop(ev) {
    ev.preventDefault();
    var data = ev.dataTransfer.getData("text");
    var card = document.getElementById(data);
    if (card) {
        ev.target.closest('.lane').querySelector('.card-body').appendChild(card);
    }
}

// When the page loads, render the task list, add event listeners, make lanes droppable, and make the due date field a date picker
$(document).ready(function () {
    renderTaskList();
});

saveBtn.addEventListener('click', function() {
    createTaskCard();
    renderTaskList();
})


