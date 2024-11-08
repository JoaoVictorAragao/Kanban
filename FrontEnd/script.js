async function recuperarListas() {
    try {
        const response = await fetch("http://localhost/Kanban/BackEnd/Controller.php?endpoint=list");
        const lists = await response.json();
        //console.log(lists);
    } catch (error) {
        console.error(error);
    }
}

function renderTarefas(tasks) {

    lists.forEach(list => {
        const column = document.querySelector(`.kanban-column[data-list-id='${list.id}']`);
        tasks.forEach(task => {
            console.log(task);
            if (task.list === list.id) {
                const card = document.createElement("div");
                card.classList.add("card");
                card.textContent = task.name;
                column.appendChild(card);
                console.log(`List: ${list.name}, Task: ${task.name}`);
            }
        });
    });
}

async function recuperarTarefas() {
    try {
        const response = await fetch("http://localhost/Kanban/BackEnd/Controller.php?endpoint=tasks");
        const tasks = await response.json();
        //console.log(tasks);
    } catch (error) {
        console.error(error);
    }
}

document.addEventListener("DOMContentLoaded", recuperarTarefas);
document.addEventListener("DOMContentLoaded", recuperarListas);