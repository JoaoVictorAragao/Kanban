

async function recuperarListas() {
    try {
        const response = await fetch("http://localhost/Kanban/BackEnd/Controller.php?endpoint=list");
        const lists = await response.json();
        return lists;
    } catch (error) {
        console.error(error);
    }
}

async function recuperarTarefas() {
    try {
        const response = await fetch("http://localhost/Kanban/BackEnd/Controller.php?endpoint=task");
        const tasks = await response.json();
        return tasks;
    } catch (error) {
        console.error(error);
    }
}

async function recuperarTarefa(id) {
    try {
        const response = await fetch("http://localhost/Kanban/BackEnd/Controller.php?endpoint=task&id=" + id);
        const task = await response.json();
        return task;
    } catch (error) {
        console.error(error);
    }
}

//AJUSTAR PARA FAZER COM QUE ATUALIZE SEMPRE QUE UMA NOVA TAREFA FOR CRIADA
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
                card.setAttribute("id", task.id);
                card.textContent = task.nome;
                column.appendChild(card);
                //console.log(`List: ${list.nome}, Task: ${task.nome}`);
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

/*JQUERY*/
//Adiciona um card no layout e depois o adiciona no banco
$('.kanban-board').on('click', '.add-card', function (e) {
    const cardInput = document.createElement("input");
    cardInput.type = "text";
    cardInput.placeholder = "Digite o texto do cartão";
    cardInput.classList.add("card-input");
    cardInput.setAttribute("id", this.id);
    this.parentElement.appendChild(cardInput);

    const listId = this.id;

    const addButton = document.createElement("button");
    addButton.textContent = "Adicionar";
    addButton.classList.add("add-card-button");
    this.parentElement.appendChild(addButton);
    this.remove();

    addButton.addEventListener("click", function () {
        const cardText = cardInput.value;
        const card = document.createElement("div");
        const addCardButton = document.createElement("button");
        addCardButton.classList.add("add-card");
        addCardButton.textContent = "+ Adicionar um cartão";
        card.classList.add("card");
        card.textContent = cardText;

        this.parentElement.appendChild(card);
        this.parentElement.appendChild(addCardButton);
        console.log(this.id);
        cardInput.remove();
        addButton.remove();


        const data = {
            nome: cardText,
            descricao: cardText,
            lista: listId
        };
        console.log(data);
        if (cardText == null || cardText.trim() === "") {
            console.error("Erro ao criar cartão: o nome do cartão está vazio.");
            return;
        }

        fetch(`http://localhost/Kanban/BackEnd/Controller.php?endpoint=task`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(data),
        })
            .then(response => response.json())
            .then(data => {
                console.log('Success:', data);

            })
            .catch((error) => {
                console.error('Error:', error);
                card.remove();
            });
    });

})

//Cria o botão para editar o card
$(document).ready(function () {
    $(document).on('mouseenter', 'div.card', function () {
        const editCardButton = document.createElement("button");
        editCardButton.classList.add("edit-card");
        editCardButton.setAttribute("id", "modal")
        const editCardImage = document.createElement("img");
        editCardImage.src = "Assets/Images/pencil.png";
        editCardButton.appendChild(editCardImage);
        $(this).append(editCardButton);
    }).on('mouseleave', '.card', function () {
        $('.edit-card').remove();
    });
});

//Aciona o botão para editar o card
$(document).ready(function () {
    $(document).on('click', '.edit-card', async function () {
        $('.modal-overlay, .modal').fadeIn();
        try {
            const task = await recuperarTarefa($(this).parent().attr("id"));
            const editCardInput = document.createElement("input");
            const editDescInput = document.createElement("input")
            editCardInput.type = "text";
            editCardInput.value = task.nome;
            editCardInput.classList.add("card-input");
            editCardInput.setAttribute("id", task.id);
            editDescInput.type = "text";
            editDescInput.value = task.descricao;
            editDescInput.classList.add("card-descricao")

            //Botão para atualizar

            const updateButton = document.createElement("button");
            updateButton.classList.add("updateButton");
            updateButton.textContent = "Atualizar";

            
            $('.modal-content').append(editCardInput);
            $('.modal-content').append(editDescInput);
            $('.modal-content').append(updateButton);
        } catch (error) {
            console.error('Error retrieving task:', error);
        }
    });

    $('.modal-close, .modal-overlay').click(function () {
        $('.modal-overlay, .modal').fadeOut();
    });
});


