

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

//FAZER COM QUE ATUALIZE SEMPRE QUE UMA NOVA TAREFA FOR CRIADA
async function renderTarefas() {
    const board = document.getElementById("kanban-board");
    const lists = await recuperarListas();
    const tasks = await recuperarTarefas();
    lists.forEach(list => {
        const column = document.createElement("div");
        column.classList.add("kanban-column");
        column.innerHTML = `<div class="column-header ${list.urgencia}">${list.nome}</div>`;
        column.setAttribute("id", list.id);
        tasks.forEach(task => {
            if (task.lista === list.id) {
                const card = document.createElement("div");
                card.classList.add("card");
                card.textContent = task.nome;
                column.appendChild(card);
                console.log(`List: ${list.nome}, Task: ${task.nome}`);
            }
        });
        const addCardButton = document.createElement("button");
        addCardButton.classList.add("add-card");
        addCardButton.setAttribute("id", list.id);
        addCardButton.textContent = "+ Adicionar um cartão";
        column.appendChild(addCardButton);
        board.appendChild(column);
    });

}

//window.onload = renderTarefas;
document.addEventListener("DOMContentLoaded", recuperarTarefas);
document.addEventListener("DOMContentLoaded", recuperarListas);
document.addEventListener("DOMContentLoaded", renderTarefas);


const addCardButton = document.querySelectorAll("button.add-card");
//console.log(addCardButton); 
for (let i = 0; i < addCardButton.length; i++) {
    addCardButton[i].addEventListener("click", function () {
        console.log("Adicionar cartão");
        const cardInput = document.createElement("input");
        cardInput.type = "text";
        cardInput.placeholder = "Digite o texto do cartão";
        cardInput.classList.add("card-input");
        this.parentElement.appendChild(cardInput);
        
        const addButton = document.createElement("button");
        addButton.textContent = "Adicionar";
        addButton.classList.add("add-card-button");
        this.parentElement.appendChild(addButton);

        addButton.addEventListener("click", function() {
            if (cardInput.value.trim() !== "") {
                const newCard = document.createElement("div");
                newCard.classList.add("card");
                newCard.textContent = cardInput.value;
                cardInput.parentElement.insertBefore(newCard, cardInput);
                cardInput.value = "";
            }
        });
        
    });
}


