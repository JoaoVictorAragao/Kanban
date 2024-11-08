<?php

//Configurando a conexão com o banco de dados

$host = "localhost";
$username = "root";
$password = "";
$dbname = "Kanban";

//Criando a conexão com o BD

try {
    $pdo = new PDO("mysql:host=$host;dbname=$dbname;charset=utf8", $username, $password);
    $pdo->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
} catch(PDOException $e) {
    echo "Connection failed: " . $e->getMessage();
}

?>