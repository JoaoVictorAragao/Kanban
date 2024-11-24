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

function atualizarTarefas(id, taskName, taskDesc, taskList) {
    const data = {
        id: id,
        nome: taskName,
        descricao: taskDesc,
        lista: taskList
    };
    fetch("http://localhost/Kanban/BackEnd/Controller.php?endpoint=task", {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
    }).
        then(response => response.json())
        .then(data => {
            console.log('Success:', data);

        })
        .catch((error) => {
            console.error('Error:', error);
        });
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
            }
        });
        const addCardButton = document.createElement("button");
        addCardButton.classList.add("add-card");
        addCardButton.setAttribute("id", list.id);
        addCardButton.textContent = "+ Adicionar um cartão";
        column.appendChild(addCardButton);
        board.appendChild(column);
    });

    const addBoard = document.createElement("div");
    addBoard.classList.add("kanban-column-add");
    addBoard.textContent = "+ Adicionar uma lista";
    board.appendChild(addBoard);

}

function deletarTarefa(id) {
    fetch("http://localhost/Kanban/BackEnd/Controller.php?endpoint=task", {
        method: 'DELETE',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ id: id }),
    }).
        then(response => response.json())
        .then(data => {
            console.log('Success:', data);
        })
        .catch((error) => {
            console.error('Error:', error);
        });
}

function criarLista(listaNome, prioridade) {
    fetch("http://localhost/Kanban/BackEnd/Controller.php?endpoint=list", {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ nome: listaNome, urgencia: prioridade }),
    }).
        then(response => response.json())
        .then(data => {
            console.log('Success:', data);
        })
        .catch((error) => {
            console.error('Error:', error);
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
        editCardButton.setAttribute("data-modal", "modal-1")
        editCardButton.textContent = "Editar";
        $(this).append(editCardButton);
    }).on('mouseleave', '.card', function () {
        $('.edit-card').remove();
    });
});

//Aciona o botão para editar o card
$(document).ready(function () {
    // Abre o modal ao clicar no botão
    $(document).on('click', '.edit-card', async function () {
        try {
            const task = await recuperarTarefa($(this).parent().attr("id"));
            const list = await recuperarListas();

            // Verifica se o modal já existe, caso contrário, cria um
            if ($('#modal-1').length === 0) {

                const modalHTML = `
                    <dialog id="modal-1">
                        <form>
                            <input type="hidden" id="taskId" name="taskId" value="${task.id}">
                            <input type="hidden" id="taskCurrent" name="taskCurrent" value="${task.lista}">
                            <input type="hidden" id="taskListId" name="taskListId" value="${task.lista}">
                            <div class="modal-header">
                                <h1 class="modal-title">${task.nome}</h1>
                                <button class="close-modal" type="button">
                                    <i class="fa-solid fa-xmark"></i>
                                </button>
                            </div>
                            <div class="modal-body">
                                <div class="input-group">
                                    <label for="taskName">Nome da Tarefa</label>
                                    <input type="text" id="taskName" name="taskName" value="${task.nome}">
                                </div>
                                <div class="input-group">
                                    <label for="taskDesc">Descrição</label>
                                    <input type="text" id="taskDescricao" value="${task.descricao}">
                                </div>
                                <div class="input-group">
                                    <label for="taskList">Lista pertencente:</label>
                                    <select id="taskList" name="taskListDropdown" class="dropdown-lista">
                                        
                                    </select>
                                </div>
                                <button id="updateButton" class="updateButton" type="button">Salvar</button>
                                <button id="deleteButton" class="deleteButton" type="button">Excluir</button>
                            </div>
                        </form>
                    </dialog>
                `;
                $('body').append(modalHTML);

                // Popular o dropdown com as listas
                const selectedList = list.find(item => item.id == task.lista);
                const otherLists = list.filter(item => item.id != task.lista);
                const selectedListItem = document.createElement("option");
                selectedListItem.classList.add("selected");
                selectedListItem.textContent = selectedList.nome;
                selectedListItem.setAttribute("id", selectedList.id);
                $('.dropdown-lista').append(selectedListItem);
                otherLists.forEach(item => {
                    const listItem = document.createElement("option");
                    listItem.textContent = item.nome;
                    listItem.setAttribute("id", item.id);
                    $('.dropdown-lista').append(listItem);
                });
                // Selecionar a lista correta
                $('.dropdown-lista').on('change', function () {
                    var selectedList = $(this).find('option:selected').val();
                    var selectedListId = $(this).find('option:selected').attr('id');
                    $(this).find('option').removeClass('selected');
                    $(`#modal-1 #taskListId`).val(selectedListId);
                });

            }

            // Exibe o modal
            $('.modal-overlay').fadeIn();
            $('#modal-1').fadeIn();
        } catch (error) {
            console.error('Error retrieving task:', error);
        }
    });

    // Fecha o modal ao clicar no botão de fechar
    $(document).on('click', '.close-modal', function () {
        $('#modal-1').fadeOut();
        $('.modal-overlay').fadeOut();
        $('#modal-1').remove();
    });

    // Fecha o modal ao clicar fora dele
    $(document).on('click', function (e) {
        const dialog = $('#modal-1');
        if (dialog.is(':visible') && !dialog.find(e.target).length && !$(e.target).closest('.edit-card').length) {
            dialog.fadeOut();
            $('.modal-overlay').fadeOut();
            $('#modal-1').remove();
        }
    });
});

//Atualiza a tarefa

$(document).ready(function () {
    $(document).on('click', '#updateButton', async function () {
        try {
            const task = $('#taskId').val();
            const taskName = $('#taskName').val();
            const taskDescricao = $('#taskDescricao').val();
            const taskLista = $('#taskListId').val();
            const taskCurrent = $('#taskCurrent').val();

            if (taskName == null || taskName.trim() === "") {
                console.error("Erro ao atualizar cartão: o nome do cartão está vazio.");
                return;
            }

            await atualizarTarefas(task, taskName, taskDescricao, taskLista)

            if (taskCurrent != taskLista) {
                const taskElement = $(`#kanban-board .card[id="${task}"]`).detach(); // Remove sem destruir o elemento
                $(`#kanban-board .kanban-column[id="${taskLista}"]`).append(taskElement);

            } else $(`#kanban-board .card[id="${task}"]`).text(taskName);

            $('#modal-1').fadeOut();
            $('.modal-overlay').fadeOut();
            $('#modal-1').remove();

        } catch (error) {
            console.error('Error:', error);
        }
    });
});

//Deletar tarefa
$(document).ready(function () {
    $(document).on('click', '#deleteButton', async function () {
        try {
            const task = $('#taskId').val();
            deletarTarefa(task);
            $(`#kanban-board .card[id="${task}"]`).remove();
            $('#modal-1').fadeOut();
            $('.modal-overlay').fadeOut();
            $('#modal-1').remove();
        } catch (error) {
            console.error('Error:', error);
        }
    });
});

//Criar a lista
$(document).ready(function () {
    $(document).on('click', '.kanban-column-add', function () {
        $('.kanban-column-add').remove();

        const listaHTML = `
            <div id="adiciona-coluna" class="kanban-column">
                <div class="column-header nova">
                    <label> Cadastrar lista</label>
                </div>
                <label>Nome da Coluna</label>
                </br>
                <input class="kanban-column-input"></input>
                </br>
                <label>Urgência</label>
                <form>
                    <label><input type="radio" name="prioridade" value="baixa">Baixa</label>
                    <label><input type="radio" name="prioridade" value="media">Média</label>
                    <label><input type="radio" name="prioridade" value="alta">Alta</label>
                </form>
                </br>
                <button class="add-list-button">Adicionar</button>
            </div>`;
        $('#kanban-board').append(listaHTML);
    });
},

    $(document).on('click', function (e) {
        const dialog = $('#adiciona-coluna');
        if (dialog.is(':visible') && !dialog.find(e.target).length && !$(e.target).closest('.kanban-column-add').length) {
            $('#adiciona-coluna').remove();
            const board = document.getElementById("kanban-board");
            const addBoard = document.createElement("div");
            addBoard.classList.add("kanban-column-add");
            addBoard.textContent = "+ Adicionar uma lista";
            board.appendChild(addBoard);

        }
    })

);

$(document).on('click', '.add-list-button', async function () {
    try {
        const listName = $('.kanban-column-input').val();
        const priority = $('input[name="prioridade"]:checked').val();
        $('#adiciona-coluna').remove();
        criarLista(listName, priority);
        const board = document.getElementById("kanban-board");
        const column = document.createElement("div");
        const header = document.createElement("div");
        const addBoard = document.createElement("div");
        column.classList.add("kanban-column");
        header.classList.add("column-header");
        header.classList.add(priority);
        addBoard.classList.add("kanban-column-add");
        addBoard.textContent = "+ Adicionar uma lista";
        header.textContent = listName;
        column.appendChild(header);
        board.appendChild(column);
        board.appendChild(addBoard);

    } catch (error) {
        console.error('Error:', error);
    }
});

