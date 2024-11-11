async function recuperarListas() {
    try {
        const response = await fetch("http://localhost/Kanban/BackEnd/Controller.php?endpoint=list");
        const lists = await response.json();
        return lists;
        //console.log(lists);
    } catch (error) {
        console.error(error);
    }
}

async function recuperarTarefas() {
    try {
        const response = await fetch("http://localhost/Kanban/BackEnd/Controller.php?endpoint=tasks");
        const tasks = await response.json();
        return tasks;
        //console.log(tasks);
        //console.log(tasks[0].lista);
    } catch (error) {
        console.error(error);
    }
}

/*function renderTarefas(tasks) {

    const board = document.querySelector('.kanban-board');
    lists.forEach(list => {
        const column = document.createElement("div");
        column.innerHTML = `<div class="column-header">${list.name}</div>`;
        console.log(lists);
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
        board.appendChild(column); // Adicione essa linha
    });
}*/

async function renderTarefas() {
    const board = document.getElementById("kanban-board");
    const lists = await recuperarListas();
    const tasks = await recuperarTarefas();
    lists.forEach(list => {
        const column = document.createElement("div");
        column.classList.add("kanban-column");
        column.innerHTML = `<div class="column-header">${list.nome}</div>`;
        tasks.forEach(task => {
            if (task.lista === list.id) {
                const card = document.createElement("div");
                card.classList.add("card");
                card.textContent = task.nome;
                column.appendChild(card);
                console.log(`List: ${list.nome}, Task: ${task.nome}`);
            }
        });
        board.appendChild(column);
    });

}

window.onload = renderTarefas;
document.addEventListener("DOMContentLoaded", recuperarTarefas);
document.addEventListener("DOMContentLoaded", recuperarListas);
//document.addEventListener("DOMContentLoaded", renderTarefas);