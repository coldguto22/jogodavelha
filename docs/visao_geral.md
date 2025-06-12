# Visão Geral

Este projeto implementa o "Jogo da Velha 2.0":

- O tabuleiro principal (macro) é um jogo da velha 3x3.
- Cada célula do tabuleiro macro é um jogo da velha 3x3 independente (micro).
- Todos os micros estão ativos simultaneamente: o jogador pode jogar em qualquer micro ainda em andamento.
- O vencedor de cada micro define o valor da célula macro correspondente.
- O objetivo é vencer o tabuleiro macro, conquistando três células macro em linha, coluna ou diagonal.
- O sistema mantém a separação entre lógica, interface e estilos, e está estruturado para fácil expansão.
- Inicialmente, a IA é básica, mas o sistema permite evolução para IA mais sofisticada ou personalizada.
