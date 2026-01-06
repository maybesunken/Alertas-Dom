import { motion } from 'motion/react';
import { Bell, Shield, Lock, User, ChevronRight, Globe, Moon, LogOut } from 'lucide-react';

export function Settings() {
  const settings = [
    {
      icon: User,
      label: 'Perfil',
      description: 'Editar informações pessoais',
    },
    {
      icon: Bell,
      label: 'Notificações',
      description: 'Configurar alertas e avisos',
    },
    {
      icon: Shield,
      label: 'Segurança',
      description: 'Autenticação e privacidade',
    },
    {
      icon: Lock,
      label: 'Senha',
      description: 'Alterar senha de acesso',
    },
    {
      icon: Globe,
      label: 'Idioma',
      description: 'Português (Brasil)',
    },
    {
      icon: Moon,
      label: 'Aparência',
      description: 'Modo claro',
    },
  ];

  return (
    <div className="p-4 lg:p-8 max-w-4xl mx-auto">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-6"
      >
        <h1 className="text-gray-900 mb-2">Configurações</h1>
        <p className="text-gray-600">Gerencie suas preferências e configurações</p>
      </motion.div>

      {/* Profile Card */}
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 0.1 }}
        className="bg-gradient-to-br from-[#0A1628] to-[#1a2744] rounded-2xl p-6 text-white mb-6"
      >
        <div className="flex items-center gap-4">
          <div className="w-16 h-16 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center">
            <User className="w-8 h-8 text-white" />
          </div>
          <div className="flex-1">
            <h3 className="text-white mb-1">Administrador</h3>
            <p className="text-gray-300 text-sm">admin@dompagamentos.com</p>
          </div>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="px-4 py-2 bg-white/20 hover:bg-white/30 backdrop-blur-sm rounded-lg text-sm transition-all"
          >
            Editar
          </motion.button>
        </div>
      </motion.div>

      {/* Settings List */}
      <div className="space-y-3 mb-6">
        {settings.map((setting, index) => {
          const Icon = setting.icon;
          return (
            <motion.button
              key={setting.label}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.2 + index * 0.05 }}
              whileHover={{ x: 4 }}
              whileTap={{ scale: 0.98 }}
              className="w-full bg-white rounded-xl p-5 border border-gray-200 shadow-sm hover:shadow-md transition-all flex items-center gap-4"
            >
              <div className="w-12 h-12 rounded-xl bg-gray-50 flex items-center justify-center flex-shrink-0">
                <Icon className="w-5 h-5 text-gray-700" />
              </div>
              <div className="flex-1 text-left">
                <p className="text-gray-900">{setting.label}</p>
                <p className="text-gray-600 text-sm">{setting.description}</p>
              </div>
              <ChevronRight className="w-5 h-5 text-gray-400 flex-shrink-0" />
            </motion.button>
          );
        })}
      </div>

      {/* Logout Button */}
      <motion.button
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.6 }}
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
        className="w-full py-4 bg-red-50 hover:bg-red-100 text-red-600 rounded-xl border border-red-200 transition-all flex items-center justify-center gap-2"
      >
        <LogOut className="w-5 h-5" />
        Sair da Conta
      </motion.button>

      {/* Version */}
      <motion.p
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.7 }}
        className="text-center text-gray-500 text-sm mt-6"
      >
        Dom Pagamentos v2.1.0 • © 2024
      </motion.p>
    </div>
  );
}
