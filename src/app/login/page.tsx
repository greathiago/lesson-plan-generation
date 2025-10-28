import { login, signup } from "./actions";

export default function LoginPage() {
  return (
    <div className="relative min-h-screen w-full overflow-x-hidden">
      <div id="stars"></div>
      <div id="stars2"></div>
      <div id="stars3"></div>

      <div className="flex min-h-screen flex-col items-center justify-center bg-gray-900 text-white p-8">
        <div className="w-full max-w-sm bg-gray-800 rounded-2xl shadow-2xl p-8">
          <h1 className="text-3xl font-bold text-center mb-4 bg-linear-to-r from-blue-400 to-purple-500 text-transparent bg-clip-text">
            Bem-vindo!
          </h1>
          <p className="text-center text-gray-400 mb-6">
            Acesse sua conta ou cadastre-se para começar.
          </p>
          <form className="space-y-4">
            <label
              className="block text-sm font-medium text-gray-300"
              htmlFor="email"
            >
              Email
            </label>
            <input
              id="email"
              name="email"
              type="email"
              required
              className="w-full bg-gray-700 border-gray-600 rounded-md p-2 focus:ring-2 focus:ring-blue-500 focus:outline-none"
            />

            <label
              className="block text-sm font-medium text-gray-300"
              htmlFor="password"
            >
              Senha
            </label>
            <input
              id="password"
              name="password"
              type="password"
              required
              className="w-full bg-gray-700 border-gray-600 rounded-md p-2 focus:ring-2 focus:ring-blue-500 focus:outline-none"
            />

            <div className="flex flex-col space-y-2 pt-2">
              <button
                formAction={login}
                className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-full transition-all duration-300"
              >
                Entrar
              </button>
              <button
                formAction={signup}
                className="border border-gray-600 hover:bg-gray-700 text-gray-300 font-bold py-2 px-4 rounded-full transition-all duration-300"
              >
                Cadastrar
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
