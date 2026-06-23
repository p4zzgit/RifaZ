<?php
// Script para garantir que servidores PHP redirecionem para o index.html do React
// Isso permite que o sistema funcione em hospedagens PHP comuns como HostGator, Bluehost, etc.
header("Location: index.html");
exit;
?>
