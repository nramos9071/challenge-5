// Retrieve tasks and nextId from localStorage
const saveBtn = document.querySelector('#saveBtn');
const toDoCards = document.querySelector('#todo-cards');
let title = document.querySelector('#title');
let date = document.querySelector('#date');
let description = document.querySelector('#description');
const cards = document.querySelector('#card');
// const cards = document.querySelectorAll('.card');
// const container = document.getElementById('cardContainer');
// let taskList = JSON.parse(localStorage.getItem("tasks"));
// let nextId = JSON.parse(localStorage.getItem("nextId"));

// Todo: create a function to generate a unique task id
function generateTaskId() {
    const taskId = generateTaskId();
    console.log(title.value);

    let taskInfo = [{ id: taskId, title: title.value, date: date.value, description: description.value }];

    localStorage.setItem('tasks', JSON.stringify(taskInfo));
}



// Todo: create a function to create a task card
function createTaskCard() { 
    console.log(title.value)

    let taskInfo = [ {title: title.value, date: date.value, description: description.value} ]



    localStorage.setItem('tasks', JSON.stringify(taskInfo));
    

}



// Todo: create a function to render the task list and make cards draggable
function renderTaskList() {

    let tasks = JSON.parse(localStorage.getItem('tasks'));
    console.log(tasks[0].title);

    tasks.push({ id: generateTaskId(), title: title.value, date: date.value, description: description.value });
    localStorage.setItem('tasks', JSON.stringify(tasks));

    toDoCards.innerHTML = tasks.map(task => `
        <section id="${task.id}" draggable="true" ondragstart="drag(event)" class="todocards">
            <h2>${task.title}</h2>
            <p>${task.date}</p>
            <button>Delete</button>
        </section>
    `).join('');

}

// Todo: create a function to handle adding a new task
// function handleAddTask(){
//     let tasks = JSON.parse(localStorage.getItem('tasks'));

//     for (let i = 0; i <= tasks.length; i++) {

//         tasks.push({title: title.value, date: date.value, description: description.value});
//         localStorage.setItem('tasks', JSON.stringify(tasks));
//         toDoCards.append(card).innerHTML = `
//         <section id=card draggable="true" ondragstart="drag(event)" class="todocards">
//             <h2>${tasks[i].title}</h2>
//             <p>${tasks[i].date}</p>
//             <button>Delete</button>
    
//         </section>
        
//         `;
    

//     };
    
    // if ( card.length < 0) {
    
    // }
// }

    

    



// Todo: create a function to handle deleting a task
function handleDeleteTask(event){

}

// Todo: create a function to handle dropping a task into a new status lane

// function allowDrop(ev) {
//     ev.preventDefault();
//     }
    
//     function drag(ev) {
//     ev.dataTransfer.setData("text", ev.target.id);
//     }
    
//     function drop(ev) {
//     ev.preventDefault();
//     var data = ev.dataTransfer.getData("text");
//     ev.target.appendChild(document.getElementById(data));
//     }


let draggedCard = null;

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

function allowDrop(ev) {
    ev.preventDefault();
}

function drag(ev) {
    ev.dataTransfer.setData("text", ev.target.id);
}

function drop(ev) {
    ev.preventDefault();
    var data = ev.dataTransfer.getData("text");
    ev.target.appendChild(document.getElementById(data));
}


// Todo: when the page loads, render the task list, add event listeners, make lanes droppable, and make the due date field a date picker
$(document).ready(function () {

});


saveBtn.addEventListener('click', function() {

    createTaskCard();
    renderTaskList();

    
    

    

    // toDoCards.innerHTML = `
    // <
    // `

})


