import { useState } from 'react';
import { motion } from 'motion/react';
import { Shield, Mail, Lock, ArrowRight } from 'lucide-react';
import { useGoogleReCaptcha, GoogleReCaptchaProvider } from 'react-google-recaptcha-v3';
import { useAuth } from '../context/AuthContext';

export function LoginFormContent() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { login } = useAuth();
  const { executeRecaptcha } = useGoogleReCaptcha();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    console.log('🔵 [Login] Form submitted');
    console.log('📧 Email:', email);
    console.log('🔒 Password:', password ? '***' : 'empty');
    
    setError(null);

    if (!executeRecaptcha) {
      console.log('❌ [Login] reCAPTCHA not ready');
      setError('Sistema de segurança não está pronto. Aguarde...');
      return;
    }

    console.log('🤖 [Login] Executing reCAPTCHA...');
    setIsLoading(true);
    
    try {
      const token = await executeRecaptcha("login");
      console.log('✅ [Login] reCAPTCHA Token:', token ? `${token.substring(0, 20)}...` : 'null');
      
      console.log('📤 [Login] Calling login function...');
      const result = await login(email, password, token);
      console.log('✅ [Login] Success:', result);
    } catch (err: any) {
      console.error('❌ [Login] Error:', err);
      console.error('❌ [Login] Error response:', err?.response);
      console.error('❌ [Login] Error status:', err?.response?.status);
      const status = err?.response?.status;
      if (status === 401) {
        setError('Credenciais inválidas');
      } else if (status === 400) {
        setError('Dados inválidos. Verifique o formulário.');
      } else {
        setError('Erro ao fazer login. Tente novamente.');
      }
    } finally {
      setIsLoading(false);
      console.log('🏁 [Login] Request completed');
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#0A1628] via-[#1a2744] to-[#0A1628] flex items-center justify-center p-4 relative overflow-hidden">
      {/* Animated background elements */}
      <div className="absolute inset-0 overflow-hidden">
        <motion.div
          className="absolute -top-40 -right-40 w-80 h-80 bg-blue-500/10 rounded-full blur-3xl"
          animate={{
            scale: [1, 1.2, 1],
            opacity: [0.3, 0.5, 0.3],
          }}
          transition={{
            duration: 8,
            repeat: Infinity,
            ease: 'easeInOut',
          }}
        />
        <motion.div
          className="absolute -bottom-40 -left-40 w-80 h-80 bg-purple-500/10 rounded-full blur-3xl"
          animate={{
            scale: [1.2, 1, 1.2],
            opacity: [0.5, 0.3, 0.5],
          }}
          transition={{
            duration: 8,
            repeat: Infinity,
            ease: 'easeInOut',
          }}
        />
      </div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, ease: [0.4, 0, 0.2, 1] }}
        className="w-full max-w-md relative z-10"
      >
        {/* Logo and Title */}
        <div className="text-center mb-8">
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.2, type: 'spring', stiffness: 200 }}
            className="w-16 h-16 bg-gradient-to-br from-blue-500 to-blue-600 rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-2xl shadow-blue-500/50"
          >
            <Shield className="w-8 h-8 text-white" />
          </motion.div>
          <motion.h1
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3 }}
            className="text-white mb-2"
          >
            Dom Pagamentos
          </motion.h1>
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4 }}
            className="text-gray-400"
          >
            Sistema de Detecção de Fraudes
          </motion.p>
        </div>

        {/* Login Card */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="bg-white/10 backdrop-blur-xl rounded-3xl p-8 border border-white/20 shadow-2xl"
        >
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Email Field */}
            <div>
              <label className="block text-white mb-2 text-sm">Email</label>
              <div className="relative">
                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="seu@email.com"
                  required
                  className="w-full pl-12 pr-4 py-4 bg-white/10 border border-white/20 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                />
              </div>
            </div>

            {/* Password Field */}
            <div>
              <label className="block text-white mb-2 text-sm">Senha</label>
              <div className="relative">
                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  required
                  className="w-full pl-12 pr-4 py-4 bg-white/10 border border-white/20 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                />
              </div>
            </div>

            {/* Remember & Forgot */}
            <div className="flex items-center justify-between text-sm">
              <label className="flex items-center gap-2 text-gray-300 cursor-pointer">
                <input type="checkbox" className="w-4 h-4 rounded border-gray-600 bg-white/10" />
                Lembrar-me
              </label>
              <a href="#" className="text-blue-400 hover:text-blue-300 transition-colors">
                Esqueceu a senha?
              </a>
            </div>

            {/* Error Message */}
            {error && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                className="p-3 bg-red-500/20 border border-red-500/50 rounded-lg text-red-200 text-sm text-center"
              >
                {error}
              </motion.div>
            )}

            {/* Submit Button */}
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              type="submit"
              disabled={isLoading || !executeRecaptcha}
              className="w-full py-4 bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-xl shadow-lg shadow-blue-500/50 flex items-center justify-center gap-2 transition-all hover:shadow-xl hover:shadow-blue-500/60 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isLoading ? (
                <motion.div
                  animate={{ rotate: 360 }}
                  transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
                  className="w-6 h-6 border-2 border-white border-t-transparent rounded-full"
                />
              ) : (
                <>
                  <span>Entrar</span>
                  <ArrowRight className="w-5 h-5" />
                </>
              )}
            </motion.button>
          </form>

          {/* Divider */}
          <div className="relative my-6">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-white/10"></div>
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="px-4 bg-transparent text-gray-400">ou continue com</span>
            </div>
          </div>

          {/* Social Login */}
          <div className="grid grid-cols-2 gap-3">
            <button className="py-3 bg-white/10 hover:bg-white/20 border border-white/20 rounded-xl text-white transition-all flex items-center justify-center gap-2">
              <div className="w-5 h-5 bg-white rounded-full"></div>
              Google
            </button>
            <button className="py-3 bg-white/10 hover:bg-white/20 border border-white/20 rounded-xl text-white transition-all flex items-center justify-center gap-2">
              <div className="w-5 h-5 bg-blue-500 rounded-full"></div>
              Microsoft
            </button>
          </div>
        </motion.div>

        {/* Footer */}
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.6 }}
          className="text-center text-gray-400 text-sm mt-6"
        >
          © 2024 Dom Pagamentos. Todos os direitos reservados.
        </motion.p>
      </motion.div>
    </div>
  );
}
const Login = () => {
  return (
    <GoogleReCaptchaProvider reCaptchaKey="6Le7tW0pAAAAAMFRmxZyomtBk2QzsnVI2_7QuysD">
      <LoginFormContent />
    </GoogleReCaptchaProvider>
  );
};

export default Login;