import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";

function Recuperar() {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [errors, setErrors] = useState({});
  const [sucesso, setSucesso] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    let newErrors = {};

    // Validar email
    if (!email) {
      newErrors.email = "Digite o seu email para continuar";
    } else {
      // Validação simples de email
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(email)) {
        newErrors.email = "Digite um email válido";
      }
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }
    // Chamar API de recuperação
    (async () => {
      try {
        const res = await fetch('http://localhost:3000/auth/recover', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ email })
        });
        const body = await res.json();
        if (!res.ok) {
          setErrors({ geral: body.error || 'Conta não encontrada' });
          return;
        }
        setSucesso(body.message || 'Enviamos um código de confirmação para o seu email.');
        console.log('Recuperação iniciada para o email:', email);
        setTimeout(() => navigate('/'), 2000);
      } catch (err) {
        setErrors({ geral: 'Erro ao processar recuperação. Tente novamente.' });
      }
    })();
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.4 }}
      className="w-full h-screen grid grid-cols-1 md:grid-cols-2 bg-white text-black"
    >
      {/* LEFT IMAGE SECTION */}
      <motion.div
        initial={{ opacity: 0, x: -40 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.6 }}
        className="hidden md:flex items-center justify-center bg-blue-600"
      >
        <img
          src="/comaes-preview.png"
          alt="Comaes Recuperação Preview"
          className="w-4/5 h-auto rounded-2xl shadow-2xl"
        />
      </motion.div>

      {/* RIGHT SECTION (FORM) */}
      <div className="flex items-center justify-center p-8">
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="w-full max-w-md bg-white p-8 rounded-2xl shadow-xl border border-gray-200"
        >
          {/* TITLE */}
          <motion.h1
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="text-4xl font-bold text-blue-600 text-center mb-4"
          >
            Recuperar Conta
          </motion.h1>

          {/* SUBTEXT */}
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3 }}
            className="text-center text-gray-700 mb-6"
          >
            Digite o seu <b>Email</b> para receber o código de confirmação.
          </motion.p>

          {/* FORM */}
          <form className="flex flex-col gap-4" onSubmit={handleSubmit}>
            {/* EMAIL INPUT */}
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.35 }}
            >
              <input
                type="email"
                name="email"
                placeholder="Seu Email"
                value={email}
                onChange={(e) => {
                  setEmail(e.target.value);
                  setErrors({});
                  setSucesso("");
                }}
                className="w-full p-3 border rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
              />
              {errors.email && (
                <p className="text-red-600 text-sm mt-1">{errors.email}</p>
              )}
            </motion.div>

            {/* SUCCESS MESSAGE */}
            {sucesso && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="text-green-600 text-sm text-center p-3 bg-green-50 rounded-lg border border-green-200"
              >
                {sucesso}
                <br />
                <span className="text-gray-600">Redirecionando para a página inicial...</span>
              </motion.div>
            )}

            {/* BUTTON */}
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.97 }}
              type="submit"
              className="w-full mt-2 p-3 bg-blue-600 text-white rounded-xl text-lg font-semibold hover:bg-blue-700 transition disabled:opacity-50 disabled:cursor-not-allowed"
              disabled={sucesso}
            >
              {sucesso ? "Enviado ✓" : "Enviar Código"}
            </motion.button>
          </form>

          {/* BACK TO LOGIN */}
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.55 }}
            className="mt-4 text-center text-sm"
          >
            Lembrou a sua palavra passe?{" "}
            <Link to="/login" className="text-blue-600 font-semibold hover:underline">
              Entrar
            </Link>
          </motion.p>
        </motion.div>
      </div>
    </motion.div>
  );
}

export default Recuperar;