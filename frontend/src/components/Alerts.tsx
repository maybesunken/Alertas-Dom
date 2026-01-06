import { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { AlertTriangle, Filter, Search, ChevronRight, Clock, MessageSquare, X } from 'lucide-react';
import { ClassifyModal } from './ClassifyModal';

export function Alerts() {
  const [selectedFilter, setSelectedFilter] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedAlert, setSelectedAlert] = useState<any>(null);

  const filters = [
    { id: 'all', label: 'Todos', count: 47 },
    { id: 'pending', label: 'Pendentes', count: 23 },
    { id: 'classified', label: 'Classificados', count: 18 },
    { id: 'duplicate', label: 'Duplicados', count: 6 },
  ];

  const alerts = [
    {
      id: 'ALT-2024-001',
      kountId: 'KNT-8X9Y2Z',
      merchant: 'Electronics Store Online',
      amount: 2499.99,
      location: 'Xangai, China',
      time: '2 min atrás',
      date: '29/12/2024 14:35',
      status: 'pending',
      risk: 'high',
      cardNumber: '453210',
      authCode: 'AUTH-892374',
      duplicate: false,
    },
    {
      id: 'ALT-2024-002',
      kountId: 'KNT-7A8B3C',
      merchant: 'Gaming Platform',
      amount: 899.00,
      location: 'Lagos, Nigéria',
      time: '1 hora atrás',
      date: '29/12/2024 13:20',
      status: 'pending',
      risk: 'high',
      cardNumber: '234567',
      authCode: 'AUTH-734821',
      duplicate: false,
    },
    {
      id: 'ALT-2024-003',
      kountId: 'KNT-6M7N8P',
      merchant: 'Loja de Eletrônicos',
      amount: 1599.50,
      location: 'São Paulo, Brasil',
      time: '2 horas atrás',
      date: '29/12/2024 12:15',
      status: 'classified',
      classification: 'Chargeback received after alert',
      risk: 'medium',
      cardNumber: '789012',
      authCode: 'AUTH-456789',
      duplicate: false,
    },
    {
      id: 'ALT-2024-004',
      kountId: 'KNT-4Q5R6S',
      merchant: 'Supermercado Central',
      amount: 350.00,
      location: 'Rio de Janeiro, Brasil',
      time: '3 horas atrás',
      date: '29/12/2024 11:40',
      status: 'classified',
      classification: 'Chargeback received before alert',
      risk: 'low',
      cardNumber: '123456',
      authCode: 'AUTH-234567',
      duplicate: false,
    },
    {
      id: 'ALT-2024-005',
      kountId: 'KNT-2T3U4V',
      merchant: 'Online Fashion Store',
      amount: 450.00,
      location: 'Curitiba, Brasil',
      time: '4 horas atrás',
      date: '29/12/2024 10:30',
      status: 'classified',
      classification: 'Previously Cancelled (including failed auths)',
      risk: 'medium',
      cardNumber: '567890',
      authCode: 'AUTH-678901',
      duplicate: false,
    },
    {
      id: 'ALT-2024-006',
      kountId: 'KNT-8X9Y2Z',
      merchant: 'Electronics Store Online',
      amount: 2499.99,
      location: 'Xangai, China',
      time: '5 horas atrás',
      date: '29/12/2024 09:35',
      status: 'classified',
      classification: 'Other - please provide comments',
      comments: 'Cliente confirmou transação por telefone',
      risk: 'low',
      cardNumber: '453210',
      authCode: 'AUTH-892374',
      duplicate: true,
      refundNote: 'Reembolsado anteriormente (parcelado)',
    },
    {
      id: 'ALT-2024-007',
      kountId: 'KNT-9W0X1Y',
      merchant: 'Restaurante Premium',
      amount: 780.00,
      location: 'Brasília, Brasil',
      time: '6 horas atrás',
      date: '29/12/2024 08:20',
      status: 'pending',
      risk: 'medium',
      cardNumber: '901234',
      authCode: 'AUTH-901234',
      duplicate: false,
    },
  ];

  const filteredAlerts = alerts.filter(alert => {
    if (selectedFilter === 'all') return true;
    if (selectedFilter === 'pending') return alert.status === 'pending';
    if (selectedFilter === 'classified') return alert.status === 'classified';
    if (selectedFilter === 'duplicate') return alert.duplicate;
    return true;
  }).filter(alert => {
    if (!searchQuery) return true;
    return alert.merchant.toLowerCase().includes(searchQuery.toLowerCase()) ||
           alert.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
           alert.kountId.toLowerCase().includes(searchQuery.toLowerCase());
  });

  const getRiskColor = (risk: string) => {
    switch (risk) {
      case 'high': return 'text-red-600';
      case 'medium': return 'text-orange-600';
      case 'low': return 'text-yellow-600';
      default: return 'text-gray-600';
    }
  };

  const getRiskBg = (risk: string) => {
    switch (risk) {
      case 'high': return 'bg-red-50 border-red-200';
      case 'medium': return 'bg-orange-50 border-orange-200';
      case 'low': return 'bg-yellow-50 border-yellow-200';
      default: return 'bg-gray-50 border-gray-200';
    }
  };

  return (
    <div className="p-4 lg:p-8 max-w-7xl mx-auto">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-6"
      >
        <h1 className="text-gray-900 mb-2">Alertas de Fraude</h1>
        <p className="text-gray-600">Classifique e gerencie alertas detectados</p>
      </motion.div>

      {/* Search */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="relative mb-4"
      >
        <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
        <input
          type="text"
          placeholder="Buscar por comerciante, ID de alerta ou Kount ID..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="w-full pl-12 pr-4 py-3 bg-white border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
        {searchQuery && (
          <button
            onClick={() => setSearchQuery('')}
            className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
          >
            <X className="w-5 h-5" />
          </button>
        )}
      </motion.div>

      {/* Filters */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="flex gap-2 overflow-x-auto pb-2 mb-6"
      >
        {filters.map((filter) => (
          <motion.button
            key={filter.id}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => setSelectedFilter(filter.id)}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg whitespace-nowrap transition-all ${
              selectedFilter === filter.id
                ? 'bg-[#0A1628] text-white shadow-lg'
                : 'bg-white text-gray-700 border border-gray-200 hover:border-gray-300'
            }`}
          >
            <span>{filter.label}</span>
            <span className={`px-2 py-0.5 rounded-full text-xs ${
              selectedFilter === filter.id
                ? 'bg-white/20'
                : 'bg-gray-100'
            }`}>
              {filter.count}
            </span>
          </motion.button>
        ))}
      </motion.div>

      {/* Alerts List */}
      <div className="space-y-3">
        <AnimatePresence>
          {filteredAlerts.map((alert, index) => (
            <motion.div
              key={alert.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95 }}
              transition={{ delay: index * 0.05, ease: [0.4, 0, 0.2, 1] }}
              whileHover={{ scale: 1.01 }}
              onClick={() => alert.status === 'pending' && setSelectedAlert(alert)}
              className={`bg-white rounded-xl p-5 border shadow-sm transition-all ${
                alert.status === 'pending' ? 'cursor-pointer hover:shadow-md' : ''
              } ${alert.duplicate ? 'ring-2 ring-purple-200' : ''}`}
            >
              {/* Alert Header */}
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-start gap-3 flex-1">
                  <div className={`w-10 h-10 rounded-xl ${getRiskBg(alert.risk)} flex items-center justify-center flex-shrink-0`}>
                    <AlertTriangle className={`w-5 h-5 ${getRiskColor(alert.risk)}`} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1 flex-wrap">
                      <p className="text-gray-900">{alert.merchant}</p>
                      {alert.duplicate && (
                        <span className="px-2 py-0.5 bg-purple-100 text-purple-700 text-xs rounded-full">
                          Duplicado
                        </span>
                      )}
                      <span className={`px-2 py-0.5 rounded-full text-xs ${
                        alert.risk === 'high'
                          ? 'bg-red-100 text-red-700'
                          : alert.risk === 'medium'
                          ? 'bg-orange-100 text-orange-700'
                          : 'bg-yellow-100 text-yellow-700'
                      }`}>
                        {alert.risk === 'high' ? 'Alto Risco' : alert.risk === 'medium' ? 'Médio Risco' : 'Baixo Risco'}
                      </span>
                    </div>
                    <p className="text-gray-600 text-sm">{alert.id}</p>
                  </div>
                  {alert.status === 'pending' && (
                    <ChevronRight className="w-5 h-5 text-gray-400 flex-shrink-0" />
                  )}
                </div>
              </div>

              {/* Alert Details Grid */}
              <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-4">
                <div>
                  <p className="text-gray-500 text-xs mb-1">Kount ID</p>
                  <p className="text-gray-900 text-sm font-mono">{alert.kountId}</p>
                </div>
                <div>
                  <p className="text-gray-500 text-xs mb-1">Valor</p>
                  <p className="text-gray-900 text-sm">R$ {alert.amount.toFixed(2)}</p>
                </div>
                <div>
                  <p className="text-gray-500 text-xs mb-1">Cartão</p>
                  <p className="text-gray-900 text-sm font-mono">{alert.cardNumber}••••••</p>
                </div>
                <div>
                  <p className="text-gray-500 text-xs mb-1">Auth Code</p>
                  <p className="text-gray-900 text-sm font-mono">{alert.authCode}</p>
                </div>
                <div className="col-span-2">
                  <p className="text-gray-500 text-xs mb-1">Localização</p>
                  <p className="text-gray-900 text-sm">{alert.location}</p>
                </div>
                <div className="col-span-2">
                  <p className="text-gray-500 text-xs mb-1">Data/Hora</p>
                  <p className="text-gray-900 text-sm">{alert.date}</p>
                </div>
              </div>

              {/* Classification Status */}
              {alert.status === 'classified' ? (
                <div className="bg-gray-50 rounded-lg p-4 border border-gray-200">
                  <div className="flex items-start gap-2">
                    <MessageSquare className="w-4 h-4 text-green-600 mt-0.5 flex-shrink-0" />
                    <div className="flex-1 min-w-0">
                      <p className="text-green-700 text-sm mb-1">✓ Classificado</p>
                      <p className="text-gray-900 text-sm">{alert.classification}</p>
                      {alert.comments && (
                        <p className="text-gray-600 text-sm mt-2 italic">"{alert.comments}"</p>
                      )}
                      {alert.duplicate && alert.refundNote && (
                        <div className="mt-3 pt-3 border-t border-gray-200">
                          <p className="text-purple-700 text-sm">⚠️ {alert.refundNote}</p>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              ) : (
                <div className="flex items-center gap-2 text-orange-600 bg-orange-50 px-4 py-3 rounded-lg">
                  <Clock className="w-4 h-4" />
                  <p className="text-sm">Aguardando classificação - Clique para classificar</p>
                </div>
              )}
            </motion.div>
          ))}
        </AnimatePresence>

        {filteredAlerts.length === 0 && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center py-12"
          >
            <p className="text-gray-500">Nenhum alerta encontrado</p>
          </motion.div>
        )}
      </div>

      {/* Classify Modal */}
      <AnimatePresence>
        {selectedAlert && (
          <ClassifyModal
            alert={selectedAlert}
            onClose={() => setSelectedAlert(null)}
          />
        )}
      </AnimatePresence>
    </div>
  );
}
