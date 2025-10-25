-- Tabela para armazenar os planos de aula gerados
CREATE TABLE public.planos_aula (
  id uuid NOT NULL PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  created_at timestamptz NOT NULL DEFAULT now(),

  -- Inputs fornecidos pelo usuário
  disciplina text NOT NULL,
  ano_escolar text NOT NULL,
  tema_aula text NOT NULL,
  duracao_minutos int NOT NULL,
  detalhes_adicionais text,

  -- Outputs gerados pela IA
  introducao_ludica text,
  objetivo_bncc text,
  passo_a_passo jsonb, -- Usar JSONB para armazenar o roteiro detalhado
  rubrica_avaliacao jsonb -- Usar JSONB para armazenar os critérios de avaliação
);

-- Habilitar Row-Level Security
ALTER TABLE public.planos_aula ENABLE ROW LEVEL SECURITY;

-- Política de RLS: Usuários podem criar planos de aula para si mesmos.
CREATE POLICY "Usuários podem criar seus próprios planos de aula"
ON public.planos_aula FOR INSERT
WITH CHECK (auth.uid() = user_id);

-- Política de RLS: Usuários podem ver apenas os seus próprios planos de aula.
CREATE POLICY "Usuários podem ver seus próprios planos de aula"
ON public.planos_aula FOR SELECT
USING (auth.uid() = user_id);