# Visão Geral

Este projeto evoluirá para o "Jogo da Velha 2.0":

- O tabuleiro principal é um jogo da velha 3x3.
- Cada célula do tabuleiro principal é, na verdade, um novo jogo da velha 3x3 (chamado de célula micro).
- O vencedor de cada célula micro define o valor da célula macro correspondente.
- O objetivo é vencer o tabuleiro macro, conquistando três células macro em linha, coluna ou diagonal.
- O sistema mantém a separação entre lógica, interface e estilos, e está estruturado para fácil expansão.
