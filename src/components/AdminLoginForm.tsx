import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { adminApi } from "@/services/api";
import { useToast } from "@/hooks/use-toast";

const AdminLoginForm = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();
  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setIsLoading(true);

    try {
      const response = await adminApi.login(email, password);

      if (response.success) {
        localStorage.setItem("isAuthenticated", "true");

        toast({
          title: "Connexion réussie",
          description: `Bienvenue ${response.user.name}`,
        });

        navigate("/dashboard");
      } else {
        setError(response.message || "Erreur de connexion");
      }
    } catch (error) {
      console.error("Erreur de connexion:", error);

      if (error instanceof Error) {
        if (error.message.includes("Backend non disponible")) {
          setError("Serveur indisponible. Vérifiez que le backend est démarré.");
        } else if (error.message.includes("401") || error.message.includes("incorrect")) {
          setError("Email ou mot de passe incorrect");
        } else {
          setError(error.message);
        }
      } else {
        setError("Erreur de connexion. Veuillez réessayer.");
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      {/* Background fixe en plein écran */}
      <div className="fixed inset-0 bg-gradient-to-br from-black via-gray-900 to-orange-600 -z-10"></div>

      {/* Contenu principal */}
      <div className="min-h-screen w-full flex items-center justify-center p-4 relative">
        <div className="w-full max-w-sm">
          {/* Logo et titre */}
          <div className="text-center mb-4 animate-fadeInDown">
            <div className="inline-flex items-center justify-center w-30 h-30 bg-gradient-to-br from-orange- to-orange-4 rounded-full mb-4 shadow-xl shadow-orange-500/40 ring-2 ring-orange-300">
              <img
                src="./src/assets/aria-logo.png"
                alt="Logo Aria"
                className="w-28 h-28 object-contain"
              />
            </div>

            <h1 className="text-2xl font-extrabold text-white mb-1 tracking-tight">
              <span className="text-orange-400 drop-shadow-md">Admin</span>
            </h1>
          </div>

          {/* Formulaire */}
          <div className="bg-gray-900/50 backdrop-blur-sm rounded-xl shadow-xl overflow-hidden border border-gray-800 animate-fadeInUp">
            <div className="bg-gradient-to-r from-orange-500 to-orange-400 py-4 px-6">
              <h2 className="text-lg font-bold text-black">Administration</h2>
              <p className="text-black/80 text-xs">Accès sécurisé</p>
            </div>

            <div className="p-6">
              {error && (
                <div className="mb-4 p-3 bg-red-500/10 border border-red-500/30 text-red-400 text-xs rounded-lg animate-slideIn">
                  <div className="flex items-center gap-2">
                    <span>⚠️</span>
                    <span>{error}</span>
                  </div>
                </div>
              )}

              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label
                    htmlFor="email"
                    className="block text-xs font-medium text-orange-300 mb-1"
                  >
                    Email administrateur
                  </label>
                  <input
                    id="email"
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full px-3 py-2 text-sm bg-black/50 text-white border border-gray-600 rounded-md focus:outline-none focus:ring-1 focus:ring-orange-500 focus:border-orange-500 transition duration-300 hover:border-gray-500"
                    placeholder="admin@examlpe.com"
                    required
                  />
                </div>

                <div>
                  <label
                    htmlFor="password"
                    className="block text-xs font-medium text-orange-300 mb-1"
                  >
                    Mot de passe
                  </label>
                  <div className="relative">
                    <input
                      id="password"
                      type={showPassword ? "text" : "password"}
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      className="w-full px-3 py-2 text-sm bg-black/50 text-white border border-gray-600 rounded-md focus:outline-none focus:ring-1 focus:ring-orange-500 focus:border-orange-500 transition duration-300 hover:border-gray-500 pr-10"
                      placeholder="••••••••"
                      required
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-2 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-orange-400 transition duration-200 text-sm"
                    >
                      {showPassword ? "👁️" : "🙈"}
                    </button>
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={isLoading}
                  className="w-full bg-gradient-to-r from-orange-500 to-orange-400 hover:from-orange-400 hover:to-orange-300 text-black font-bold py-2 px-4 rounded-md transition duration-300 transform hover:-translate-y-0.5 shadow-md hover:shadow-orange-500/30 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none text-sm"
                >
                  {isLoading ? (
                    <div className="flex items-center justify-center gap-2">
                      <div className="w-3 h-3 border-2 border-black/30 border-t-black rounded-full animate-spin"></div>
                      <span>Connexion en cours...</span>
                    </div>
                  ) : (
                    <>🔑 Se connecter</>
                  )}
                </button>
              </form>
            </div>
          </div>
        </div>
      </div>

      <style>{`
        @keyframes fadeInDown {
          from { opacity: 0; transform: translateY(-20px); }
          to { opacity: 1; transform: translateY(0); }
        }
        @keyframes fadeInUp {
          from { opacity: 0; transform: translateY(20px); }
          to { opacity: 1; transform: translateY(0); }
        }
        @keyframes slideIn {
          from { opacity: 0; transform: translateX(-10px); }
          to { opacity: 1; transform: translateX(0); }
        }
        .animate-fadeInDown {
          animation: fadeInDown 0.6s ease-out forwards;
        }
        .animate-fadeInUp {
          animation: fadeInUp 0.6s ease-out 0.2s both;
        }
        .animate-slideIn {
          animation: slideIn 0.3s ease-out forwards;
        }
      `}</style>
    </>
  );
};

export default AdminLoginForm;