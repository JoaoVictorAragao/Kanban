<?php

header("Content-Type: application/json");
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: GET, POST, PUT, DELETE");
header("Access-Control-Allow-Headers: Content-Type");

require_once("connect.php");

$method = $_SERVER['REQUEST_METHOD'];
$input = json_decode(file_get_contents("php://input"), true);
$endpoint = $_GET['endpoint'] ?? '';

switch ($method) {
    case 'GET':
        if ($endpoint == 'task' && isset($_GET['id'])) {
            getTask($_GET['id']);
        } elseif ($endpoint == 'task') {
            getAllTasks();
        } elseif ($endpoint == 'list' && isset($_GET['id'])) {
            getList($_GET['id']);
        } elseif ($endpoint == 'list') {
            getAllLists();
        }
        break;
    case 'POST':
        if ($endpoint == 'task') {
            createTask($input);
        } elseif ($endpoint == 'list') {
            createList($input);
        }
        break;
    case 'PUT':
        if ($endpoint == 'task' && isset($input['id'])) {
            updateTask($input['id'], $input);
        } elseif ($endpoint == 'list' && isset($input['id'])) {
            updateList($input['id'], $input);
        } elseif ($endpoint == 'listOrder'){
            updateListOrder($input);
        } elseif ($endpoint == 'taskOrder'){
            updateTaskOrder($input);
        }
        break;
    case 'DELETE':
        if ($endpoint == 'task' && $input['id']) {
            deleteTask($input['id']);
        } elseif ($endpoint == 'list' && $input['id']) {
            deleteList($input['id']);
        }
        break;
    default:
        echo json_encode(["message" => "Método não suportado"]);
        break;
}

//TAREFAS

function getAllTasks()
{
    global $pdo;
    $stmt = $pdo->prepare("SELECT * FROM tarefa");
    $stmt->execute();
    $tasks = $stmt->fetchAll(PDO::FETCH_ASSOC);
    echo json_encode($tasks);
}

function getTask($id)
{
    global $pdo;
    $stmt = $pdo->prepare("SELECT * FROM tarefa WHERE id = :id");
    $stmt->bindParam(':id', $id);
    $stmt->execute();
    $task = $stmt->fetch(PDO::FETCH_ASSOC);
    echo json_encode($task);
}

function createTask($data)
{
    global $pdo;
    $stmt = $pdo->prepare("INSERT INTO tarefa (nome, descricao, lista) VALUES (:nome, :descricao, :lista)");
    $stmt->bindParam(':nome', $data['nome']);
    $stmt->bindParam(':descricao', $data['descricao']);
    $stmt->bindParam(':lista', $data['lista']);
    $stmt->execute();
    $id = $pdo->lastInsertId();
    echo json_encode(["id" => $id]);
}

function updateTask($id, $data)
{
    global $pdo;
    $stmt = $pdo->prepare("UPDATE tarefa SET nome = :nome, descricao = :descricao, lista = :lista WHERE id = :id");
    $stmt->bindParam(':id', $id);
    $stmt->bindParam(':nome', $data['nome']);
    $stmt->bindParam(':descricao', $data['descricao']);
    $stmt->bindParam(':lista', $data['lista']);
    $stmt->execute();
    echo json_encode(["message" => "Tarefa atualizada com sucesso"]);
}

function deleteTask($id)
{
    global $pdo;
    $stmt = $pdo->prepare("DELETE FROM tarefa WHERE id = :id");
    $stmt->bindParam(':id', $id);
    $stmt->execute();
    echo json_encode(["message" => "Tarefa excluída com sucesso"]);
}

//LISTAS

function getAllLists()
{
    global $pdo;
    $stmt = $pdo->prepare("SELECT * FROM lista");
    $stmt->execute();
    $lists = $stmt->fetchAll(PDO::FETCH_ASSOC);
    echo json_encode($lists);
}

function getList($id)
{
    global $pdo;
    $stmt = $pdo->prepare("SELECT * FROM lista WHERE id = :id");
    $stmt->bindParam(':id', $id);
    $stmt->execute();
    $list = $stmt->fetch(PDO::FETCH_ASSOC);
    echo json_encode($list);
}

function createList($data)
{
    global $pdo;
    $stmt = $pdo->prepare("INSERT INTO lista (nome, urgencia) VALUES (:nome, :urgencia)");
    $stmt->bindParam(':nome', $data['nome']);
    $stmt->bindParam(':urgencia', $data['urgencia']);
    $stmt->execute();
    $id = $pdo->lastInsertId();
    echo json_encode(['id' => $id]);
}

function updateList($id, $data)
{
    global $pdo;
    $stmt = $pdo->prepare("UPDATE lista SET nome = :nome, urgencia = :urgencia WHERE id = :id");
    $stmt->bindParam(':id', $id);
    $stmt->bindParam(':nome', $data['nome']);
    $stmt->bindParam(':urgencia', $data['urgencia']);
    $stmt->execute();
    echo json_encode(["message" => "Lista atualizada com sucesso"]);
}

function deleteList($id)
{
    global $pdo;
    $pdo->beginTransaction();
    try {
        $stmt = $pdo->prepare("DELETE FROM tarefa WHERE lista = :id");
        $stmt->bindParam(':id', $id);
        $stmt->execute();

        $stmt = $pdo->prepare("DELETE FROM lista WHERE id = :id");
        $stmt->bindParam(':id', $id);
        $stmt->execute();

        $pdo->commit();
        echo json_encode(["message" => "Lista e suas tarefas associadas foram excluídas com sucesso"]);
    } catch (Exception $e) {
        $pdo->rollBack();
        echo json_encode(["message" => "Erro ao excluir lista e suas tarefas: " . $e->getMessage()]);
    }
}

function updateListOrder($lists)
{
    global $pdo;
    $pdo->beginTransaction();
    try {
        foreach ($lists as $list) {
            $stmt = $pdo->prepare("UPDATE lista SET posicao = :posicao WHERE id = :id");
            $stmt->bindParam(':posicao', $list['posicao']);
            $stmt->bindParam(':id', $list['id']);
            $stmt->execute();
        }
        $pdo->commit();
        echo json_encode(["message" => "Ordem da lista atualizada com sucesso"]);
    } catch (Exception $e) {
        $pdo->rollBack();
        echo json_encode(["message" => "Erro ao atualizar a ordem da lista: " . $e->getMessage()]);
    }
}

function updateTaskOrder($tasks)
{
    global $pdo;
    $pdo->beginTransaction();
    try {
        foreach ($tasks as $task) {
            $stmt = $pdo->prepare("UPDATE tarefa SET posicao = :posicao WHERE id = :id AND lista = :lista");
            $stmt->bindParam(':posicao', $task['posicao']);
            $stmt->bindParam(':id', $task['id']);
            $stmt->bindParam(':lista', $task['lista']);
            $stmt->execute();
        }
        $pdo->commit();
        echo json_encode(["message" => "Ordem das tarefas atualizada com sucesso"]);
    } catch (Exception $e) {
        $pdo->rollBack();
        echo json_encode(["message" => "Erro ao atualizar a ordem das tarefas: " . $e->getMessage()]);
    }
}
