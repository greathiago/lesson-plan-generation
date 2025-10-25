"use client";

import { createClient } from "../utils/supabase/client";
import { useEffect, useState } from "react";
import type { User } from "@supabase/supabase-js";
import { useRouter } from "next/navigation";

type FormData = {
  disciplina: string;
  ano_escolar: string;
  tema_aula: string;
  duracao_minutos: string;
  detalhes_adicionais: string;
};

type PlanoDeAula = {
  id: string;
  introducao_ludica: string;
  objetivo_bncc: string;
  passo_a_passo: { etapa: string; descricao: string }[];
  rubrica_avaliacao: { criterio: string; descricao: string }[];
};

export default function HomePage() {
  const [user, setUser] = useState<User | null>(null);
  const router = useRouter();

  useEffect(() => {
    const checkUser = async () => {
      const supabase = createClient();
      const {
        data: { user },
      } = await supabase.auth.getUser();
      if (!user) {
        router.push("/login");
      } else {
        setUser(user);
      }
    };
    checkUser();
  }, [router]);

  const [formData, setFormData] = useState<FormData>({
    disciplina: "",
    ano_escolar: "",
    tema_aula: "",
    duracao_minutos: "50",
    detalhes_adicionais: "",
  });
  const [planoDeAula, setPlanoDeAula] = useState<PlanoDeAula | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);
    setPlanoDeAula(null);

    try {
      const response = await fetch("/api/generate", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          ...formData,
          duracao_minutos: parseInt(formData.duracao_minutos, 10),
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Ocorreu um erro.");
      }

      setPlanoDeAula(data);
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (err: any) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  if (!user) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-gray-900 text-white">
        Verificando autorização...
      </div>
    );
  }

  return (
    <div className="relative min-h-screen w-full overflow-x-hidden">
      {/* Divs para o background de estrelas */}
      <div id="stars"></div>
      <div id="stars2"></div>
      <div id="stars3"></div>

      <main className="flex min-h-screen flex-col items-center justify-center bg-gray-900 text-white p-8 font-sans">
        <div className="w-full max-w-4xl bg-gray-800 rounded-2xl shadow-2xl shadow-blue-500/20 overflow-hidden">
          <div className="p-8 md:p-12">
            <h1 className="text-4xl md:text-5xl font-bold text-center mb-2 bg-linear-to-r from-blue-400 to-purple-500 text-transparent bg-clip-text">
              Gerador de Planos de Aula com IA
            </h1>
            <p className="text-center text-gray-400 mb-8">
              Preencha os campos abaixo e deixe a galáxia da criatividade
              conspirar a seu favor.
            </p>

            <form
              onSubmit={handleSubmit}
              className="grid grid-cols-1 md:grid-cols-2 gap-6"
            >
              {/* Campos do formulário com estilo */}
              <div className="col-span-1">
                <label
                  htmlFor="disciplina"
                  className="block text-sm font-medium text-gray-300 mb-1"
                >
                  Disciplina
                </label>
                <input
                  type="text"
                  name="disciplina"
                  value={formData.disciplina}
                  onChange={handleChange}
                  required
                  className="w-full bg-gray-700 border-gray-600 rounded-md p-2 focus:ring-2 focus:ring-blue-500 focus:outline-none"
                />
              </div>
              <div className="col-span-1">
                <label
                  htmlFor="ano_escolar"
                  className="block text-sm font-medium text-gray-300 mb-1"
                >
                  Ano Escolar
                </label>
                <input
                  type="text"
                  name="ano_escolar"
                  value={formData.ano_escolar}
                  onChange={handleChange}
                  required
                  className="w-full bg-gray-700 border-gray-600 rounded-md p-2 focus:ring-2 focus:ring-blue-500 focus:outline-none"
                />
              </div>
              <div className="col-span-2">
                <label
                  htmlFor="tema_aula"
                  className="block text-sm font-medium text-gray-300 mb-1"
                >
                  Tema da Aula
                </label>
                <input
                  type="text"
                  name="tema_aula"
                  value={formData.tema_aula}
                  onChange={handleChange}
                  required
                  className="w-full bg-gray-700 border-gray-600 rounded-md p-2 focus:ring-2 focus:ring-blue-500 focus:outline-none"
                />
              </div>
              <div className="col-span-2">
                <label
                  htmlFor="detalhes_adicionais"
                  className="block text-sm font-medium text-gray-300 mb-1"
                >
                  Detalhes Adicionais (Opcional)
                </label>
                <textarea
                  name="detalhes_adicionais"
                  value={formData.detalhes_adicionais}
                  onChange={handleChange}
                  rows={3}
                  className="w-full bg-gray-700 border-gray-600 rounded-md p-2 focus:ring-2 focus:ring-blue-500 focus:outline-none"
                ></textarea>
              </div>
              <div className="col-span-2">
                <label
                  htmlFor="duracao_minutos"
                  className="block text-sm font-medium text-gray-300 mb-1"
                >
                  Duração (minutos)
                </label>
                <input
                  type="range"
                  min="30"
                  max="120"
                  step="10"
                  name="duracao_minutos"
                  value={formData.duracao_minutos}
                  onChange={handleChange}
                  className="w-full h-2 bg-gray-700 rounded-lg appearance-none cursor-pointer accent-blue-500"
                />
                <div className="text-center font-mono mt-1">
                  {formData.duracao_minutos} min
                </div>
              </div>
              <div className="col-span-2 text-center">
                <button
                  type="submit"
                  disabled={isLoading}
                  className="bg-blue-600 hover:bg-blue-700 disabled:bg-gray-500 text-white font-bold py-3 px-8 rounded-full transition-all duration-300 w-full md:w-auto"
                >
                  {isLoading ? "Gerando..." : "Gerar Plano de Aula"}
                </button>
              </div>
            </form>
          </div>

          {/* Seção de Resultados */}
          {isLoading && (
            <div className="text-center p-8 border-t border-gray-700">
              Gerando plano de aula...
            </div>
          )}
          {error && (
            <div className="p-8 border-t border-gray-700 text-red-400 bg-red-900/20">
              <h3 className="font-bold mb-2">Ocorreu um erro</h3>
              <p>{error}</p>
            </div>
          )}
          {planoDeAula && (
            <div className="p-8 md:p-12 border-t border-gray-700 space-y-8">
              <h2 className="text-3xl font-bold text-center mb-6">
                Seu Plano de Aula está pronto!
              </h2>
              {/* Introdução */}
              <div>
                <h3 className="text-xl font-semibold text-blue-400 mb-2">
                  Introdução
                </h3>
                <p className="text-gray-300">{planoDeAula.introducao_ludica}</p>
              </div>
              {/* Objetivo */}
              <div>
                <h3 className="text-xl font-semibold text-blue-400 mb-2">
                  Objetivo de Aprendizagem (BNCC)
                </h3>
                <p className="text-gray-300">{planoDeAula.objetivo_bncc}</p>
              </div>
              {/* Passo a Passo */}
              <div>
                <h3 className="text-xl font-semibold text-blue-400 mb-2">
                  Passo a Passo da Aula
                </h3>
                <ul className="space-y-4">
                  {planoDeAula.passo_a_passo.map((passo, index) => (
                    <li key={index} className="flex">
                      <div className="bg-blue-500/20 text-blue-300 font-bold rounded-full h-8 w-8 flex items-center justify-center mr-4 shrink-0">
                        {index + 1}
                      </div>
                      <div>
                        <h4 className="font-bold">{passo.etapa}</h4>
                        <p className="text-gray-400">{passo.descricao}</p>
                      </div>
                    </li>
                  ))}
                </ul>
              </div>
              {/* Rubrica */}
              <div>
                <h3 className="text-xl font-semibold text-blue-400 mb-2">
                  Rubrica de Avaliação
                </h3>
                <div className="bg-gray-700/50 rounded-lg p-4 space-y-3">
                  {planoDeAula.rubrica_avaliacao.map((rubrica, index) => (
                    <div key={index}>
                      <h4 className="font-semibold text-gray-200">
                        {rubrica.criterio}
                      </h4>
                      <p className="text-gray-400 text-sm">
                        {rubrica.descricao}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
