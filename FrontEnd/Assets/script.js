//ADICIONAR O SORTABLE SEMPRE QUE FOR CRIADO UM NOVO ITEM

async function recuperarListas() {
    try {
        const response = await fetch("http://localhost/Kanban/BackEnd/Controller.php?endpoint=list");
        const lists = await response.json();
        return lists;
    } catch (error) {
        console.error(error);
    }
}

async function recuperarLista(id) {
    try {
        const response = await fetch("http://localhost/Kanban/BackEnd/Controller.php?endpoint=list&id=" + id);
        const list = await response.json();
        return list;
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


async function renderTarefas() {
    const board = $("#kanban-board");
    const lists = await recuperarListas();
    const tasks = await recuperarTarefas();
    
    //Listas e tarefas ordenas de forma crescente pela coluna de posicao, atualizando sempre que movimentado
    lists.sort((a, b) => a.posicao - b.posicao);
    
    lists.forEach(list => {
        const column = $("<div></div>")
            .addClass("kanban-column")
            .attr("id", list.id)
            .html(`<div class="column-header ${list.urgencia}">${list.nome}</div>`);
        
        tasks
            .filter(task => task.lista === list.id)
            .sort((a, b) => a.posicao - b.posicao)
            .forEach(task => {
                const card = $("<div></div>")
                    .addClass("card")
                    .attr("id", task.id)
                    .text(task.nome);
                column.append(card);
            });
        
        const addCardButton = $("<button></button>")
            .addClass("add-card")
            .attr("id", list.id)
            .text("+ Adicionar um cartão");

        column.append(addCardButton);
        board.append(column);
    });

    const addBoard = $("<div></div>")
        .addClass("kanban-column-add")
        .text("+ Adicionar uma lista");
    board.append(addBoard);

    $(".kanban-column").sortable({
        items: ".card",
        connectWith: ".kanban-column",
        containment: "#kanban-board",
        receive: function (event, ui) {
            $(this).children(".add-card").insertAfter(ui.item);
        },
        update: function (event, ui) {
            const column = ui.item.closest(".kanban-column");
            const newColumnId = column.attr("id");
            const tasks = column.find(".card").get().map((card, index) => ({
                id: card.id,
                posicao: index,
                lista: newColumnId
            }));
            console.log(tasks);
            fetch("http://localhost/Kanban/BackEnd/Controller.php?endpoint=taskOrder", {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(tasks.map(task => ({
                    id: task.id,
                    posicao: task.posicao,
                    lista: task.lista
                }))),
            }).then(response => response.json())
              .then(data => {
                  console.log('Success:', data);
              })
              .catch(error => {
                  console.error('Error:', error);
              });
        }
    }).disableSelection();

    $("#kanban-board").sortable({
        items: ".kanban-column",
        axis: "x",
        update: function (event, ui) {
            const lists = ui.item.closest("#kanban-board").find(".kanban-column").get().map((column, index) => ({
                id: column.id,
                posicao: index,
            }));
            fetch("http://localhost/Kanban/BackEnd/Controller.php?endpoint=listOrder", {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(lists),
            }).then(response => response.json())
            .then(data => {
                console.log('Success:', data);
            })
            .catch(error => {
                console.error('Error:', error);
            });
        }
    }).disableSelection();

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

async function criarLista(listaNome, prioridade, posicao) {
    if (!listaNome || !prioridade) {
        console.error('Error: listaNome or prioridade is null or undefined.');
        return;
    }

    try {
        const response = await fetch("http://localhost/Kanban/BackEnd/Controller.php?endpoint=list", {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ nome: listaNome, urgencia: prioridade, posicao: posicao }),
        });

        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }

        const data = await response.json();
        return data['id'];

    } catch (error) {
        console.error('Error:', error);
    }
}

async function criarTarefa(taskName, taskDesc, taskList) {
    if (!taskName || !taskDesc || !taskList) {
        console.error('Error: taskName or taskDesc or taskList is null or undefined.');
        return;
    }

    try {
        const response = await fetch("http://localhost/Kanban/BackEnd/Controller.php?endpoint=task", {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ nome: taskName, descricao: taskDesc, lista: taskList }),
        });

        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }

        const data = await response.json();
        return data['id'];

    } catch (error) {
        console.error('Error:', error);
    }
}

async function deletarLista(id) {
    fetch("http://localhost/Kanban/BackEnd/Controller.php?endpoint=list", {
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

async function editarLista(id, listaNome, prioridade) {
    fetch("http://localhost/Kanban/BackEnd/Controller.php?endpoint=list", {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ id: id, nome: listaNome, urgencia: prioridade }),
    }).
        then(response => response.json())
        .then(data => {
            console.log('Success:', data);
        })
        .catch((error) => {
            console.error('Error:', error);
        });
}

async function deletarLista(id) {
    fetch("http://localhost/Kanban/BackEnd/Controller.php?endpoint=list", {
        method: 'DELETE',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ id: id }),
    }).then(response => response.json())
        .then(data => {
            console.log('Success:', data);
        })
        .catch((error) => {
            console.error('Error:', error);
        })
}

document.addEventListener("DOMContentLoaded", recuperarTarefas);
document.addEventListener("DOMContentLoaded", recuperarListas);
document.addEventListener("DOMContentLoaded", renderTarefas);

/*JQUERY*/
//Adiciona um card no layout e depois o adiciona no banco
$(document).ready(function () {
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

        addButton.addEventListener("click", async function () {
            const listElement = $(`.kanban-column[id="${listId}"]`);
            const cardTextInput = cardInput.value;
            const taskId = await criarTarefa(cardTextInput, cardTextInput, listId);
            const cardElement = document.createElement("div");
            const addCardButtonElement = document.createElement("button");
            addCardButtonElement.classList.add("add-card");
            addCardButtonElement.textContent = "+ Adicionar um cartão";
            addCardButtonElement.setAttribute("id", listId);

            cardElement.classList.add("card");
            cardElement.textContent = cardTextInput;
            cardElement.setAttribute("id", taskId);

            listElement.append(cardElement);
            listElement.append(addCardButtonElement);
            cardInput.remove();
            addButton.remove();
            $('.kanban-column').sortable('refresh');
        });

    })
},
    $(document).on('click', function (e) {
        const dialog = $('.card-input');
        if (dialog.is(':visible') && !dialog.is(e.target) && !$(e.target).closest('.add-card').length) {
            const column = dialog.closest('.kanban-column');
            const header = column.children('.column-header');
            const lastCard = column.children('.card').last();
            $('.card-input').remove();
            $('.add-card-button').remove();
            const addCard = document.createElement("button");
            addCard.classList.add("add-card");
            addCard.textContent = "+ Adicionar um cartão";
            addCard.setAttribute("id", "QUI");
    
        }
    })

);


//Cria o botão para editar o card
$(document).ready(function () {
    $(document).on('mouseenter', 'div.card', function () {
        const editCardButton = document.createElement("button");
        editCardButton.classList.add("edit-card");
        editCardButton.classList.add("fa-solid");
        editCardButton.classList.add("fa-pencil");
        editCardButton.setAttribute("data-modal", "modal-1")
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
                                <div class="input-group">
                                    <label for="taskPos">Posição:</label>
                                    <input type="number" id="taskPos" name="taskPos" value="${task.posicao}">
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
            //Movimenta a tarefa
            if (taskCurrent != taskLista) {
                const taskElement = $(`#kanban-board .card[id="${task}"]`).detach();
                $(`#kanban-board .kanban-column[id="${taskLista}"]`).children('.card').last().after(taskElement);

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
        //$('.kanban-column').sortable('refresh');

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

//Cria a lista
$(document).on('click', '.add-list-button', async function () {
    try {
        const listName = $('.kanban-column-input').val();
        const priority = $('input[name="prioridade"]:checked').val();
        const position = $('.kanban-column').length + 1;

        $('#adiciona-coluna').remove();
        const response = await criarLista(listName, priority, position);

        const board = document.getElementById("kanban-board");
        const column = document.createElement("div");
        const header = document.createElement("div");
        const addBoard = document.createElement("div");
        const addCard = document.createElement("button");

        if (!$(`#kanban-board #${response}`).hasClass('add-card')) {
            addCard.classList.add("add-card");
            addCard.textContent = "+ Adicionar um cartão";
            addCard.setAttribute("id", response);
            column.classList.add("kanban-column");

            column.setAttribute("id", response);
            header.classList.add("column-header");
            header.classList.add(priority);
            addBoard.classList.add("kanban-column-add");
            addBoard.textContent = "+ Adicionar uma lista";
            header.textContent = listName;
        }
        
        column.appendChild(header);
        column.appendChild(addCard);
        board.appendChild(column);
        board.appendChild(addBoard);
        
        
    } catch (error) {
        console.error('Error:', error);
    }
    $('.kanban-column').sortable('refresh');

});

//Hover para aparecer o botão de editar lista
$(document).ready(function () {
    $(document).on('mouseenter', 'div.column-header', function () {
        const editListButton = document.createElement("button");
        editListButton.classList.add("edit-list");
        editListButton.classList.add("fa-solid");
        editListButton.classList.add("fa-pencil");
        editListButton.setAttribute("data-modal", "modal-2")
        $(this).append(editListButton);
    }).on('mouseleave', '.column-header', function () {
        $('.edit-list').remove();
    });
});

//Modal para editar a lista
$(document).ready(function () {
    // Abre o modal ao clicar no botão
    $(document).on('click', '.edit-list', async function () {
        try {
            const listId = $(this).closest('.kanban-column').attr('id');
            const list = await recuperarLista(listId);

            // Verifica se o modal já existe, caso contrário, cria um
            if ($('#modal-2').length === 0) {

                const modalHTML = `
                    <dialog id="modal-2">
                        <form>
                            <input type="hidden" id="listId" name="taskId" value="${list.id}">
                            <div class="modal-header">
                                <h1 class="modal-title">${list.nome}</h1>
                                <button class="close-modal" type="button">
                                    <i class="fa-solid fa-xmark"></i>
                                </button>
                            </div>
                            <div class="modal-body">
                                <div class="input-group">
                                    <label for="taskName">Nome da Lista</label>
                                    <input type="text" id="listName" name="listName" value="${list.nome}">
                                </div>
                                <label>Prioridade</label>
                                <form>
                                    <label><input type="radio" name="prioridade" value="baixa" ${list.urgencia == 'baixa' ? 'checked' : ''}>Baixa</label>
                                    <label><input type="radio" name="prioridade" value="media" ${list.urgencia == 'media' ? 'checked' : ''}>Média</label>
                                    <label><input type="radio" name="prioridade" value="alta" ${list.urgencia == 'alta' ? 'checked' : ''}>Alta</label>
                                </form>
                                <button id="updateListButton" class="updateButton" type="button">Salvar</button>
                                <button id="deleteListButton" class="deleteButton" type="button">Excluir</button>
                            </div>
                        </form>
                    </dialog>
                `;
                $('body').append(modalHTML);

            }
            $('.modal-overlay').fadeIn();
            $('#modal-2').fadeIn();
        } catch (error) {
            console.error('Error:', error);
        }

        // Fecha o modal ao clicar no botão de fechar
        $(document).on('click', '.close-modal', function () {
            $('#modal-2').fadeOut();
            $('.modal-overlay').fadeOut();
            $('#modal-1').remove();
        });

        // Fecha o modal ao clicar fora dele
        $(document).on('click', function (e) {
            const dialog = $('#modal-2');
            if (dialog.is(':visible') && !dialog.find(e.target).length && !$(e.target).closest('.edit-card').length) {
                dialog.fadeOut();
                $('.modal-overlay').fadeOut();
                $('#modal-2').remove();
            }
        });
    });
});

//Atualiza a lista com as informações do modal
$(document).ready(function () {
    $(document).on('click', '#updateListButton', async function () {
        try {
            const listId = $('#listId').val();
            const listName = $('#listName').val();
            const priority = $('input[name="prioridade"]:checked').val();

            await editarLista(listId, listName, priority);
            $(`.kanban-column[id="${listId}"] .column-header`).text(listName);
            $(`.kanban-column[id="${listId}"] .column-header`).removeClass('baixa media alta').addClass(priority);
            $('#modal-2').fadeOut();
            $('.modal-overlay').fadeOut();
            $('#modal-2').remove();
        } catch (error) {
            console.error('Error:', error);
        }
    });
});

//Deletar a tarefa no banco de dados
$(document).ready(function () {
    $(document).on('click', '#deleteListButton', async function () {
        const listId = $('#listId').val();
        const confirmacao = confirm(`Excluir a lista irá excluir todas as tarefas associadas a ela. Tem certeza que deseja excluir?`);
        if (confirmacao) {
            try {
                await deletarLista(listId);
                $(`.kanban-column[id="${listId}"]`).remove();
                $('#modal-2').fadeOut();
                $('.modal-overlay').fadeOut();
                $('#modal-2').remove();
            } catch (error) {
                console.error('Error:', error);
            }
        }
    });
});
