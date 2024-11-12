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
        if ($endpoint == 'task') {
            getAllTasks();
        } elseif ($endpoint == 'user' && isset($_GET['id'])) {
            getTask($_GET['id']);
        } elseif ($endpoint == 'list'){
            getAllLists();
        }
        break;
    case 'POST':
        if ($endpoint == 'task') {
            createTask($input);
        }elseif ($endpoint == 'list'){
            createList($input);
        }
        break;
    case 'PUT':
        if ($endpoint == 'task' && isset($_GET['id'])) {
            updateTask($_GET['id'], $input);
        } elseif ($endpoint == 'list' && isset($_GET['id'])) {
            updateList($_GET['id'], $input);
        }
        break;
    case 'DELETE':
        if ($endpoint == 'task' && isset($_GET['id'])) {
            deleteTask($_GET['id']);
        } elseif ($endpoint == 'list' && isset($_GET['id'])) {
            deleteList($_GET['id']);
        }
        break;
    default:
        echo json_encode(["message" => "Método não suportado"]);
        break;
}

//TAREFAS

function getAllTasks() {
    global $pdo;
    $stmt = $pdo->prepare("SELECT * FROM tarefa");
    $stmt->execute();
    $tasks = $stmt->fetchAll(PDO::FETCH_ASSOC);
    echo json_encode($tasks);
}

function getTask($id) {
    global $pdo;
    $stmt = $pdo->prepare("SELECT * FROM tarefa WHERE id = :id");
    $stmt->bindParam(':id', $id);
    $stmt->execute();
    $task = $stmt->fetch(PDO::FETCH_ASSOC);
    echo json_encode($task);
}

function createTask($data) {
    global $pdo;
    $stmt = $pdo->prepare("INSERT INTO tarefa (nome, descricao, lista) VALUES (:nome, :descricao, :lista)");
    $stmt->bindParam(':nome', $data['nome']);
    $stmt->bindParam(':descricao', $data['descricao']);
    $stmt->bindParam(':lista', $data['lista']);
    $stmt->execute();
    echo json_encode(["message" => "Tarefa criada com sucesso"]);
}

function updateTask($id, $data) {
    global $pdo;
    $stmt = $pdo->prepare("UPDATE tarefa SET nome = :nome, descricao = :descricao, lista = :lista WHERE id = :id");
    $stmt->bindParam(':id', $id);
    $stmt->bindParam(':nome', $data['nome']);
    $stmt->bindParam(':descricao', $data['descricao']);
    $stmt->bindParam(':lista', $data['lista']);
    $stmt->execute();
    echo json_encode(["message" => "Tarefa atualizada com sucesso"]);
}

function deleteTask($id) {
    global $pdo;
    $stmt = $pdo->prepare("DELETE FROM tarefa WHERE id = :id");
    $stmt->bindParam(':id', $id);
    $stmt->execute();
    echo json_encode(["message" => "Tarefa excluída com sucesso"]);
}

//LISTAS

function getAllLists() {
    global $pdo;
    $stmt = $pdo->prepare("SELECT * FROM lista");
    $stmt->execute();
    $lists = $stmt->fetchAll(PDO::FETCH_ASSOC);
    echo json_encode($lists);
}

function createList($data) {
    global $pdo;
    $stmt = $pdo->prepare("INSERT INTO lista (nome) VALUES (:nome)");
    $stmt->bindParam(':nome', $data['nome']);
    $stmt->execute();
    echo json_encode(["message" => "Lista criada com sucesso"]);
}

function updateList($id, $data) {
    global $pdo;
    $stmt = $pdo->prepare("UPDATE lista SET nome = :nome WHERE id = :id");
    $stmt->bindParam(':id', $id);
    $stmt->bindParam(':nome', $data['nome']);
    $stmt->execute();
    echo json_encode(["message" => "Lista atualizada com sucesso"]);
}

function deleteList($id) {
    global $pdo;
    $stmt = $pdo->prepare("DELETE FROM lista WHERE id = :id");
    $stmt->bindParam(':id', $id);
    $stmt->execute();
    echo json_encode(["message" => "Lista excluída com sucesso"]);
}