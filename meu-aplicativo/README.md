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
1. **Jogador (Usuário Comum):** Pode criar uma conta, fazer login e visualizar a lista de heróis e seus counters.
2. **Administrador:** Pode adicionar, editar ou remover heróis e counters, além de ter as permissões do jogador comum.

## 7. Funcionalidades Implementadas (Atualizado)
*   **Autenticação JWT:** Cadastro e login de usuários com senhas criptografadas (hash com bcrypt) e geração de Token JWT.
*   **Níveis de Acesso:** Rotas protegidas no backend que diferenciam usuários comuns de administradores.
*   **CRUD de Heróis:** Listagem, cadastro, edição e exclusão de heróis (apenas admins podem modificar).
*   **CRUD de Counters:** Associação de um herói como "counter" de outro, com dicas táticas. Edição e exclusão disponíveis para admins.
*   **Melhorias de UX:** Seleção de heróis via lista (modal) em vez de digitar IDs, e confirmações customizadas que funcionam na versão Web.

## 8. Telas do Aplicativo
*   **Tela 1:** Login.
*   **Tela 2:** Cadastro de Novo Usuário.
*   **Tela 3:** Lista de Heróis.
*   **Tela 4:** Detalhes do Herói (lista de counters).
*   **Tela 5:** Cadastro de Herói (Admin).
*   **Tela 6:** Edição de Herói (Admin).
*   **Tela 7:** Cadastro de Counter (Admin).
*   **Tela 8:** Edição de Counter (Admin).

## 9. Fluxo de Navegação
`Tela de Login` ➔ `Tela de Cadastro (Opcional)` ➔ `Tela de Lista de Heróis` ➔ `Tela de Detalhes (Counters)` ➔ `Ações de Admin (se aplicável)`

## 10. Tecnologias Utilizadas
*   **Frontend:** React Native com Expo, React Navigation, AsyncStorage.
*   **Backend:** Node.js, Express, JWT (jsonwebtoken), BcryptJS.
*   **Banco de Dados:** MySQL (mysql2).

---

## Como rodar o projeto

### Pré-requisitos
*   Node.js instalado.
*   MySQL instalado e rodando.
*   Expo Go instalado no celular (ou emulador).

### Passo a Passo

**1. Configurar o Banco de Dados**
*   Abra o seu gerenciador do MySQL (Workbench, phpMyAdmin, etc).
*   Execute o script `database.sql` que está na raiz do projeto para criar o banco e as tabelas.
*   **Nota:** O script já inclui as chaves estrangeiras com `ON DELETE CASCADE` para que a exclusão de heróis funcione corretamente.

**2. Configurar o Backend**
*   Abra a pasta `backend` no terminal.
*   Crie um arquivo chamado `.env` e adicione as variáveis de ambiente (veja o exemplo `.env.example` abaixo):
    ```env
    DB_HOST=localhost
    DB_PORT=3306
    DB_USER=root
    DB_PASSWORD=sua_senha_aqui
    DB_NAME=rivals_counter
    JWT_SECRET=sua_chave_secreta_jwt_aqui