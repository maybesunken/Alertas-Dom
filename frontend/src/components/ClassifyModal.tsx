import { useState } from 'react';
import { motion } from 'motion/react';
import { X, Check, MessageSquare, AlertTriangle } from 'lucide-react';

interface ClassifyModalProps {
  alert: any;
  onClose: () => void;
}

export function ClassifyModal({ alert, onClose }: ClassifyModalProps) {
  const [selectedClassification, setSelectedClassification] = useState('');
  const [comments, setComments] = useState('');
  const [showSuccess, setShowSuccess] = useState(false);

  const classifications = [
    {
      id: 'chargeback_after',
      label: 'Chargeback received after alert',
      description: 'Cliente solicitou estorno após o alerta ser gerado',
      color: 'from-red-500 to-red-600',
    },
    {
      id: 'chargeback_before',
      label: 'Chargeback received before alert',
      description: 'Estorno solicitado antes da detecção do alerta',
      color: 'from-orange-500 to-orange-600',
    },
    {
      id: 'previously_cancelled',
      label: 'Previously Cancelled (including failed auths)',
      description: 'Transação previamente cancelada ou autenticação falhou',
      color: 'from-yellow-500 to-yellow-600',
    },
    {
      id: 'other',
      label: 'Other - please provide comments',
      description: 'Outra situação - adicione comentários',
      color: 'from-purple-500 to-purple-600',
    },
  ];

  const handleSubmit = () => {
    setShowSuccess(true);
    setTimeout(() => {
      onClose();
    }, 1500);
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 bg-black/50 flex items-end sm:items-center justify-center z-50 p-0 sm:p-4"
    >
      <motion.div
        initial={{ y: '100%' }}
        animate={{ y: 0 }}
        exit={{ y: '100%' }}
        transition={{ type: 'spring', damping: 25 }}
        className="bg-white rounded-t-3xl sm:rounded-3xl w-full max-w-lg max-h-[90vh] overflow-y-auto"
      >
        {showSuccess ? (
          <div className="p-8 text-center">
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4"
            >
              <Check className="w-10 h-10 text-green-600" />
            </motion.div>
            <h3 className="text-gray-900 mb-2">Classificado com Sucesso!</h3>
            <p className="text-gray-600">O alerta foi classificado e salvo.</p>
          </div>
        ) : (
          <>
            {/* Header */}
            <div className="sticky top-0 bg-white border-b border-gray-200 p-4 flex items-center justify-between rounded-t-3xl">
              <div>
                <h2 className="text-gray-900">Classificar Alerta</h2>
                <p className="text-gray-600 text-sm">{alert.id}</p>
              </div>
              <motion.button
                whileTap={{ scale: 0.9 }}
                onClick={onClose}
                className="w-8 h-8 bg-gray-100 rounded-full flex items-center justify-center"
              >
                <X className="w-5 h-5 text-gray-600" />
              </motion.button>
            </div>

            {/* Alert Info */}
            <div className="p-4 bg-gradient-to-br from-blue-50 to-purple-50 border-b border-gray-200">
              <div className="flex items-start gap-3">
                <div className="w-12 h-12 bg-gradient-to-br from-red-500 to-red-600 rounded-xl flex items-center justify-center">
                  <AlertTriangle className="w-6 h-6 text-white" />
                </div>
                <div className="flex-1">
                  <p className="text-gray-900 mb-1">{alert.merchant}</p>
                  <p className="text-gray-600 text-sm">R$ {alert.amount.toFixed(2)}</p>
                  <p className="text-gray-500 text-sm">{alert.location}</p>
                </div>
              </div>
            </div>

            {/* Classifications */}
            <div className="p-4 space-y-3">
              <h3 className="text-gray-900 mb-3">Selecione a classificação:</h3>

              {classifications.map((classification) => (
                <motion.button
                  key={classification.id}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => setSelectedClassification(classification.id)}
                  className={`w-full text-left p-4 rounded-xl border-2 transition-all ${
                    selectedClassification === classification.id
                      ? 'border-blue-500 bg-blue-50'
                      : 'border-gray-200 bg-white hover:border-gray-300'
                  }`}
                >
                  <div className="flex items-start gap-3">
                    <div className={`w-10 h-10 rounded-lg bg-gradient-to-br ${classification.color} flex items-center justify-center flex-shrink-0`}>
                      {selectedClassification === classification.id ? (
                        <Check className="w-5 h-5 text-white" />
                      ) : (
                        <div className="w-3 h-3 bg-white rounded-full" />
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-gray-900 mb-1">{classification.label}</p>
                      <p className="text-gray-600 text-sm">{classification.description}</p>
                    </div>
                  </div>
                </motion.button>
              ))}
            </div>

            {/* Comments Section */}
            {selectedClassification === 'other' && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                className="px-4 pb-4"
              >
                <label className="flex items-center gap-2 text-gray-900 mb-2">
                  <MessageSquare className="w-4 h-4" />
                  Comentários (obrigatório)
                </label>
                <textarea
                  value={comments}
                  onChange={(e) => setComments(e.target.value)}
                  placeholder="Descreva a situação do alerta..."
                  rows={4}
                  className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
                />
              </motion.div>
            )}

            {/* Action Buttons */}
            <div className="p-4 border-t border-gray-200 space-y-2">
              <motion.button
                whileTap={{ scale: 0.98 }}
                onClick={handleSubmit}
                disabled={!selectedClassification || (selectedClassification === 'other' && !comments.trim())}
                className={`w-full py-3 rounded-xl transition-all ${
                  selectedClassification && (selectedClassification !== 'other' || comments.trim())
                    ? 'bg-gradient-to-r from-blue-500 to-purple-600 text-white shadow-lg'
                    : 'bg-gray-200 text-gray-400 cursor-not-allowed'
                }`}
              >
                Confirmar Classificação
              </motion.button>
              <button
                onClick={onClose}
                className="w-full py-3 text-gray-600 hover:bg-gray-50 rounded-xl transition-colors"
              >
                Cancelar
              </button>
            </div>
          </>
        )}
      </motion.div>
    </motion.div>
  );
}