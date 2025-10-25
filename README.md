# Gerador de Planos de Aula com IA

Este projeto trata-se de uma aplicação web full-stack que utiliza o Gemini AI para gerar planos de aula personalizados, com backend e autenticação gerenciados pelo Supabase e frontend construído com Next.js e Tailwind CSS.

## Stack Tecnológica

- **Frontend:** Next.js (App Router), React, Tailwind CSS
- **Backend:** Supabase (PostgreSQL, Auth, RLS)
- **IA:** Google Gemini API (via Google AI Studio)

## Instalação e Execução do Projeto

Siga os passos abaixo para configurar e rodar o projeto em seu ambiente local.

### Pré-requisitos

- Node.js (v18 ou superior)
- Docker Desktop (precisa estar rodando)
- Supabase CLI (instalada e configurada)

### Passos

1.  **Clonar o Repositório**

    ```bash
    git clone https://github.com/seu-usuario/seu-repositorio.git
    cd seu-repositorio
    ```

2.  **Instalar Dependências**

    ```bash
    npm install
    ```

3.  **Configurar o Supabase Local**
    Inicie o ambiente de desenvolvimento local do Supabase.

    ```bash
    supabase start
    ```

    Este comando aplicará as migrações SQL localizadas na pasta `supabase/migrations`.

4.  **Configurar Variáveis de Ambiente**
    Crie um arquivo `.env.local` na raiz do projeto, copiando o exemplo de `.env.local.example` (se houver) ou usando o modelo abaixo.

    ```env
    # Adicione as credenciais do seu projeto Supabase local (fornecidas pelo comando 'supabase start')
    NEXT_PUBLIC_SUPABASE_URL=http://localhost:54321
    NEXT_PUBLIC_SUPABASE_ANON_KEY=SUA_ANON_KEY_LOCAL

    # Crie e adicione sua chave da API do Google Gemini
    # Disponível em: https://aistudio.google.com/
    GEMINI_API_KEY=SUA_CHAVE_API_DO_GEMINI
    ```

5.  **Executar a Aplicação**
    ```bash
    npm run dev
    ```
    Acesse `http://localhost:3000` em seu navegador para ver a aplicação funcionando.

## Decisões Técnicas Tomadas

### 1. Escolha do Modelo de IA

O modelo escolhido foi o **`gemini-1.5-flash-latest`**. A decisão foi baseada em:

- **Velocidade e Custo-Benefício:** É um modelo rápido e eficiente, ideal para uma aplicação interativa.
- **Capacidade de Saída Estruturada:** O modelo demonstrou alta capacidade de seguir instruções complexas e retornar respostas em formato JSON puro, o que foi um requisito crucial para o parsing e salvamento dos dados no banco.

### 2. Modelagem de Dados no Supabase

Foi criada uma única tabela, `planos_aula`, para armazenar tanto os inputs do usuário quanto os dados gerados pela IA.

- **Uso de `jsonb`:** Os campos `passo_a_passo` e `rubrica_avaliacao` foram definidos como `jsonb`. Esta decisão foi tomada para armazenar de forma flexível e estruturada as listas de etapas e critérios, que podem variar em quantidade, facilitando a renderização no frontend.
- **Segurança com RLS:** Foram implementadas políticas de Row-Level Security para garantir que cada usuário só possa criar e visualizar seus próprios planos de aula, aplicando a segurança diretamente na camada de dados.

### 3. Arquitetura com Next.js

A utilização do App Router do Next.js permitiu manter a lógica de backend (API Routes para a chamada do Gemini) e frontend no mesmo projeto, simplificando o desenvolvimento e o deploy. A renderização do lado do cliente (`'use client'`) foi escolhida para a página principal devido à alta interatividade do formulário e dos estados de carregamento.

## Desafios Encontrados e Soluções

1.  **Prompt Engineering para Saída Consistente:**

    - **Desafio:** Garantir que a API do Gemini retornasse sempre um JSON válido, sem formatação extra (como markdown ` ```json `).
    - **Solução:** O prompt foi cuidadosamente estruturado, fornecendo um exemplo claro do formato JSON desejado e incluindo a instrução explícita "gere o plano de aula no seguinte formato JSON, sem incluir markdown". Além disso, foi utilizada a propriedade `responseMimeType: "application/json"` na chamada da API para reforçar essa exigência.

2.  **Experiência do Usuário Durante a Geração:**
    - **Desafio:** A geração do plano de aula pela IA é uma operação assíncrona que pode levar alguns segundos. Era necessário fornecer feedback claro ao usuário para evitar cliques múltiplos e ansiedade.
    - **Solução:** Foi implementado um estado de `isLoading` no frontend. Quando ativo, o botão de submissão é desabilitado, seu texto é alterado para "Gerando...", e um indicador de carregamento é exibido, melhorando significativamente a experiência do usuário.

## Entregáveis

- **Scripts SQL:** Localizados na pasta `supabase/migrations/`.
- **Descrição da Estrutura de Dados:** Detalhada na seção "Modelagem de Dados" acima.
