import { createServerClient, type CookieOptions } from '@supabase/ssr';
import { cookies } from 'next/headers';
import { NextRequest, NextResponse } from 'next/server';

export const dynamic = 'force-dynamic';

export async function POST(req: NextRequest) {
    const cookieStore = await cookies();

    const supabase = createServerClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL!,
        process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
        {
            cookies: {
                get(name: string) {
                    return cookieStore.get(name)?.value;
                },
                set(name: string, value: string, options: CookieOptions) {
                    
                    cookieStore.set({ name, value, ...options });
                },
                remove(name: string, options: CookieOptions) {
                    
                    cookieStore.set({ name, value: '', ...options });
                },
            },
        }
    );

    
    const { data: { session } } = await supabase.auth.getSession();
    if (!session) {
        return NextResponse.json({ error: 'Não autorizado' }, { status: 401 });
    }

    const { disciplina, ano_escolar, tema_aula, duracao_minutos, detalhes_adicionais } = await req.json();
    if (!disciplina || !ano_escolar || !tema_aula || !duracao_minutos) {
        return NextResponse.json({ error: 'Todos os campos obrigatórios devem ser preenchidos' }, { status: 400 });
    }

    const prompt = `
    Você é um assistente pedagógico especializado na criação de planos de aula inovadores e alinhados à BNCC.
    Sua tarefa é criar um plano de aula para o seguinte contexto:
    - Disciplina: ${disciplina}
    - Ano Escolar: ${ano_escolar}
    - Tema da Aula: ${tema_aula}
    - Duração da Aula: ${duracao_minutos} minutos
    - Detalhes Adicionais: ${detalhes_adicionais || 'Nenhum'}

    Por favor, gere o plano de aula no seguinte formato JSON, sem incluir markdown (apenas o objeto JSON puro):
    {
      "introducao_ludica": "Uma descrição criativa e engajadora para iniciar a aula e capturar a atenção dos alunos.",
      "objetivo_bncc": "Liste o principal objetivo de aprendizagem, mencionando o código da habilidade da BNCC correspondente, se possível.",
      "passo_a_passo": [
        { "etapa": "Introdução (10 min)", "descricao": "Descrição da atividade inicial." },
        { "etapa": "Desenvolvimento (30 min)", "descricao": "Descrição da atividade principal." },
        { "etapa": "Conclusão (10 min)", "descricao": "Descrição da atividade de fechamento e revisão." }
      ],
      "rubrica_avaliacao": [
        { "criterio": "Participação", "descricao": "Avalia o engajamento do aluno nas atividades." },
        { "criterio": "Compreensão do Conceito", "descricao": "Avalia a capacidade do aluno de explicar o tema com suas próprias palavras." },
        { "criterio": "Aplicação Prática", "descricao": "Avalia a performance do aluno na atividade principal." }
      ]
    }
  `;

    try {
        const geminiResponse = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash-latest:generateContent?key=${process.env.GEMINI_API_KEY}`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                contents: [{ parts: [{ text: prompt }] }],
                generationConfig: {
                    responseMimeType: "application/json",
                }
            }),
        });

        if (!geminiResponse.ok) {
            console.error('Erro da API Gemini:', await geminiResponse.text());
            throw new Error('Falha ao comunicar com a IA.');
        }

        const geminiData = await geminiResponse.json();
        const planoDeAulaTexto = geminiData.candidates[0].content.parts[0].text;
        const planoDeAulaJSON = JSON.parse(planoDeAulaTexto);

        const { data: novoPlano, error: insertError } = await supabase
            .from('planos_aula')
            .insert({
                user_id: session.user.id,
                disciplina,
                ano_escolar,
                tema_aula,
                duracao_minutos,
                detalhes_adicionais,
                introducao_ludica: planoDeAulaJSON.introducao_ludica,
                objetivo_bncc: planoDeAulaJSON.objetivo_bncc,
                passo_a_passo: planoDeAulaJSON.passo_a_passo,
                rubrica_avaliacao: planoDeAulaJSON.rubrica_avaliacao,
            })
            .select()
            .single();

        if (insertError) {
            console.error('Erro ao salvar no Supabase:', insertError);
            throw new Error('Falha ao salvar o plano de aula no banco de dados.');
        }

        return NextResponse.json(novoPlano);

        // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (error: any) {
        console.error('Erro no processo de geração:', error);
        return NextResponse.json({ error: error?.message || 'Ocorreu um erro inesperado.' }, { status: 500 });
    }
}