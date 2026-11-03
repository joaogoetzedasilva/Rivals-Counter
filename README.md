# Rivals Counter

## 1. Problema atual identificado
Jogadores de Marvel Rivals, especialmente os iniciantes, perdem tempo valioso durante as partidas alternando entre o jogo e sites externos para lembrar quais personagens são eficazes contra o time inimigo. Isso quebra o ritmo do jogo e prejudica a experiência.

## 2. Contexto e público afetado
* **Contexto:** Jogos de tiro em equipe exigem troca constante de personagens para anular as forças do time adversário.
* **Público:** Jogadores de Marvel Rivals (casuais e iniciantes) que buscam melhorar seu desempenho.

## 3. Justificativa
A informação existe, mas está fragmentada em vários sites. Um aplicativo mobile centraliza os dados de forma rápida e acessível, permitindo consultas ágeis e melhorando a performance nas partidas.

## 4. Proposta de solução
Um aplicativo mobile de consulta rápida que lista todos os heróis do jogo. Ao selecionar um herói, o usuário vê uma lista de "counters" (personagens fortes contra ele) com uma breve descrição tática.

## 5. Nome da aplicação
**Rivals Counter**

## 6. Tipos de usuário
1. **Jogador (Usuário Comum):** Pode visualizar a lista de heróis e seus counters.
2. **Administrador:** Pode adicionar, editar ou remover heróis e counters.

## 7. Permissões iniciais
* **Jogador:** Acesso à consulta (GET).
* **Administrador:** Acesso à consulta e cadastro (GET e POST).

## 8. Principais funcionalidades
* Listagem de heróis dividida por funções (Vanguard, Duelist, Strategist).
* Tela de detalhes com a lista de counters e descrições táticas.
* Cadastro de novos heróis (apenas Admin).

## 9. Telas previstas
* **Tela 1:** Login.
* **Tela 2:** Lista de Heróis.
* **Tela 3:** Detalhes do Herói (counters).
* **Tela 4:** Cadastro de Herói (Admin).

## 10. Fluxo inicial de navegação
`Tela de Login` ➔ `Tela de Lista de Heróis` ➔ `Tela de Detalhes (Counters)`

---
## Como rodar o projeto
1. Crie o banco de dados executando o script `database.sql`.
2. Na pasta `backend`, crie um arquivo `.env` com as credenciais do seu MySQL.
3. Rode `npm install` na raiz e na pasta `backend`.
4. Inicie a API: `cd backend` e `node server.js`.
5. Inicie o app: `npx expo start`.