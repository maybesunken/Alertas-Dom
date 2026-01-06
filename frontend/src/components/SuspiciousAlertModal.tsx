import { motion } from 'motion/react';
import { AlertTriangle, X, MapPin, CreditCard, DollarSign, Clock } from 'lucide-react';
import { useState } from 'react';

interface SuspiciousAlertModalProps {
  onClose: () => void;
}

export function SuspiciousAlertModal({ onClose }: SuspiciousAlertModalProps) {
  const [isResponding, setIsResponding] = useState(false);

  const transaction = {
    id: 'TXN-8923',
    kountId: 'KNT-8X9Y2Z',
    merchant: 'Electronics Store Online',
    amount: 2499.99,
    location: 'Xangai, China',
    time: '2 minutos atrás',
    date: '29/12/2024 14:35',
    cardNumber: '453210',
    authCode: 'AUTH-892374',
  };

  const handleResponse = (isUser: boolean) => {
    setIsResponding(true);
    setTimeout(() => {
      onClose();
    }, 1000);
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 bg-black/50 flex items-end sm:items-center justify-center z-50 p-0 sm:p-4"
    >
      <motion.div
        initial={{ y: '100%', scale: 0.9 }}
        animate={{ y: 0, scale: 1 }}
        exit={{ y: '100%', scale: 0.9 }}
        transition={{ type: 'spring', damping: 25 }}
        className="bg-white rounded-t-3xl sm:rounded-3xl w-full max-w-lg overflow-hidden"
      >
        {/* Animated Header */}
        <motion.div 
          className="bg-gradient-to-br from-red-500 to-red-600 p-6 relative overflow-hidden"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
        >
          {/* Animated background circles */}
          <motion.div
            className="absolute -top-10 -right-10 w-40 h-40 bg-white/10 rounded-full"
            animate={{
              scale: [1, 1.2, 1],
              opacity: [0.3, 0.5, 0.3],
            }}
            transition={{
              duration: 3,
              repeat: Infinity,
            }}
          />
          <motion.div
            className="absolute -bottom-10 -left-10 w-40 h-40 bg-white/10 rounded-full"
            animate={{
              scale: [1.2, 1, 1.2],
              opacity: [0.5, 0.3, 0.5],
            }}
            transition={{
              duration: 3,
              repeat: Infinity,
            }}
          />

          <motion.button
            whileTap={{ scale: 0.9 }}
            onClick={onClose}
            className="absolute top-4 right-4 w-8 h-8 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center z-10"
          >
            <X className="w-5 h-5 text-white" />
          </motion.button>

          <div className="relative z-10">
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.2, type: 'spring' }}
              className="w-16 h-16 bg-white/20 backdrop-blur-sm rounded-2xl flex items-center justify-center mb-4"
            >
              <AlertTriangle className="w-8 h-8 text-white" />
            </motion.div>
            <motion.h2
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="text-white mb-2"
            >
              Atividade Suspeita Detectada!
            </motion.h2>
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
              className="text-red-100"
            >
              Identificamos uma transação incomum
            </motion.p>
          </div>
        </motion.div>

        {/* Content */}
        <div className="p-6">
          <h3 className="text-gray-900 mb-4">Detalhes da Transação</h3>

          <div className="space-y-4 mb-6">
            {[
              { icon: DollarSign, label: 'Valor', value: `R$ ${transaction.amount.toFixed(2)}`, delay: 0.5 },
              { icon: MapPin, label: 'Localização', value: transaction.location, delay: 0.6 },
              { icon: CreditCard, label: 'Estabelecimento', value: transaction.merchant, delay: 0.7 },
              { icon: Clock, label: 'Data e Hora', value: transaction.date, delay: 0.8 },
              { icon: CreditCard, label: 'Cartão', value: `**** **** **** ${transaction.cardNumber.slice(-4)}`, delay: 0.9 },
            ].map((item, index) => {
              const Icon = item.icon;
              return (
                <motion.div
                  key={item.label}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: item.delay }}
                  className="flex items-start gap-3"
                >
                  <div className="w-10 h-10 bg-gradient-to-br from-blue-50 to-purple-50 rounded-lg flex items-center justify-center flex-shrink-0">
                    <Icon className="w-5 h-5 text-blue-600" />
                  </div>
                  <div className="flex-1">
                    <p className="text-gray-500 text-sm">{item.label}</p>
                    <p className="text-gray-900">{item.value}</p>
                  </div>
                </motion.div>
              );
            })}
          </div>

          {/* Question Card */}
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ delay: 1 }}
            className="bg-gradient-to-br from-blue-50 to-purple-50 border-2 border-blue-200 rounded-2xl p-5 mb-6 text-center"
          >
            <motion.div
              animate={{ scale: [1, 1.05, 1] }}
              transition={{ duration: 2, repeat: Infinity }}
            >
              <h3 className="text-blue-900 mb-2">Esta transação foi você?</h3>
              <p className="text-blue-700 text-sm">Você autorizou esta compra?</p>
            </motion.div>
          </motion.div>

          {/* Action Buttons */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1.1 }}
            className="space-y-3"
          >
            <motion.button
              whileTap={{ scale: 0.95 }}
              whileHover={{ scale: 1.02 }}
              onClick={() => handleResponse(true)}
              disabled={isResponding}
              className="w-full py-4 bg-gradient-to-r from-green-500 to-green-600 text-white rounded-xl shadow-lg flex items-center justify-center gap-2 transition-all"
            >
              {isResponding ? (
                <motion.div
                  animate={{ rotate: 360 }}
                  transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
                  className="w-5 h-5 border-2 border-white border-t-transparent rounded-full"
                />
              ) : (
                <>
                  <span>✓ Sim, fui eu</span>
                </>
              )}
            </motion.button>

            <motion.button
              whileTap={{ scale: 0.95 }}
              whileHover={{ scale: 1.02 }}
              onClick={() => handleResponse(false)}
              disabled={isResponding}
              className="w-full py-4 bg-gradient-to-r from-red-500 to-red-600 text-white rounded-xl shadow-lg flex items-center justify-center gap-2 transition-all"
            >
              {isResponding ? (
                <motion.div
                  animate={{ rotate: 360 }}
                  transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
                  className="w-5 h-5 border-2 border-white border-t-transparent rounded-full"
                />
              ) : (
                <>
                  <span>✗ Não, bloquear cartão</span>
                </>
              )}
            </motion.button>
          </motion.div>

          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1.2 }}
            className="text-gray-500 text-sm text-center mt-4"
          >
            Se você não reconhecer esta transação, seu cartão será bloqueado imediatamente.
          </motion.p>
        </div>
      </motion.div>
    </motion.div>
  );
}