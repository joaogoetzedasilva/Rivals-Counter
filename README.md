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
2. **Administrador:** Pode adicionar, editar ou remover heróis e counters (funcionalidade futura com JWT).

## 7. Permissões iniciais
* **Jogador:** Acesso à consulta (GET).
* **Administrador:** Acesso à consulta e cadastro (GET e POST).

## 8. Principais funcionalidades
* Listagem de heróis dividida por funções (Vanguard, Duelist, Strategist).
* Tela de detalhes com a lista de counters e descrições táticas.
* Cadastro de novos heróis (apenas Admin).

## 9. Telas previstas
* **Tela 1:** Login.
* **Tela 2:** Home / Lista de Heróis.
* **Tela 3:** Detalhes do Herói (counters).

## 10. Fluxo inicial de navegação
`Tela de Login` ➔ `Tela de Lista de Heróis` ➔ `Tela de Detalhes (Counters)`

---
## Como rodar o projeto
1. Crie o banco de dados executando o script `database.sql`.
2. Na pasta `backend`, rode `node server.js`.
3. Na raiz do projeto, rode `npx expo start`.

## 5. Modelagem e Planejamento Técnico (Entrega 2)

### Entidades e Campos (Banco de Dados)
*   **Usuarios:** id, nome, email, senha (hash), role (admin/jogador).
*   **Herois:** id, nome, funcao (Vanguard, Duelist, Strategist), descricao.
*   **Counters:** id, hero_id (quem está sendo counterado), counter_hero_id (quem é o counter), dica_tatica.

### Principais Rotas da API
*   `GET /herois`: Lista todos os heróis.
*   `GET /herois/:id`: Busca os detalhes de um herói e seus counters.
*   `POST /usuarios`: Cadastro de novos usuários.

### Requisitos Funcionais Atualizados
*   O aplicativo deve consumir os dados da API em vez de usar dados fixos no código.
*   O sistema deve permitir a listagem de heróis e a visualização de seus counters detalhados.

## 🚀 Como rodar o projeto (Entrega 2)

1. **Banco de Dados (MySQL):**
   - Abra o MySQL Workbench.
   - Execute o script `database.sql` para criar o banco `rivals_counter` e as tabelas.

2. **API (Node.js):**
   - Abra um terminal na pasta `backend`.
   - Rode `npm install` (se ainda não instalou).
   - Rode `node server.js`.
   - A API estará rodando em `http://localhost:3000`.

3. **Aplicativo (React Native):**
   - Abra outro terminal na raiz do projeto.
   - Rode `npx expo start`.
   - Aperte `w` para abrir no navegador ou escaneie o QR Code com o Expo Go.

**Rotas da API:**
- `GET /herois` (Lista todos os heróis)
- `POST /herois` (Cadastra um novo herói)
- `GET /herois/:id/counters` (Lista os counters de um herói)