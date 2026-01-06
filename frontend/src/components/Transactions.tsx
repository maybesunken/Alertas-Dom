import { motion } from 'motion/react';
import { Search, CheckCircle, AlertTriangle, X, Download } from 'lucide-react';
import { useState, useEffect } from 'react';
import api from '../services/api';
import type { Transaction } from '../types/api';

export function Transactions() {
  const [filter, setFilter] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');

  const MOCK_TRANSACTIONS: Transaction[] = [
    {
      id: 'TXN-8923',
      kountId: 'KNT-8X9Y2Z',
      merchant: 'Electronics Store Online',
      amount: 2499.99,
      location: 'Xangai, China',
      time: '2 min atrás',
      date: '29/12/2024 14:35',
      status: 'suspicious',
      cardNumber: '453210',
      authCode: 'AUTH-892374',
    },
    {
      id: 'TXN-8922',
      kountId: 'KNT-7B8C9D',
      merchant: 'Cafeteria Premium',
      amount: 12.5,
      location: 'São Paulo, Brasil',
      time: '15 min atrás',
      date: '29/12/2024 14:20',
      status: 'verified',
      cardNumber: '453210',
      authCode: 'AUTH-123456',
    },
    {
      id: 'TXN-8921',
      kountId: 'KNT-5E6F7G',
      merchant: 'Supermercado Central',
      amount: 145.3,
      location: 'Rio de Janeiro, Brasil',
      time: '1 hora atrás',
      date: '29/12/2024 13:35',
      status: 'verified',
      cardNumber: '890123',
      authCode: 'AUTH-789012',
    },
    {
      id: 'TXN-8920',
      kountId: 'KNT-3H4I5J',
      merchant: 'Plataforma de Games',
      amount: 899.0,
      location: 'Lagos, Nigéria',
      time: '2 horas atrás',
      date: '29/12/2024 12:35',
      status: 'suspicious',
      cardNumber: '234567',
      authCode: 'AUTH-234567',
    },
    {
      id: 'TXN-8919',
      kountId: 'KNT-1K2L3M',
      merchant: 'Posto de Gasolina',
      amount: 85.0,
      location: 'São Paulo, Brasil',
      time: '3 horas atrás',
      date: '29/12/2024 11:35',
      status: 'verified',
      cardNumber: '453210',
      authCode: 'AUTH-345678',
    },
  ];

  const paramsKey = `transactions:${filter}:${searchQuery}`;
  const { data: transactions = MOCK_TRANSACTIONS, loading, error, refetch } = useApiQuery<Transaction[]>(
    paramsKey,
    async () => {
      const params: any = {};
      if (filter && filter !== 'all') params.status = filter;
      if (searchQuery) params.search = searchQuery;
      const res = await api.get('/transactions', { params } as any);
      return (res?.data?.data ?? res?.data) as Transaction[];
    },
    { staleTime: 1000 * 30 }
  );

  const filteredTransactions = (transactions || MOCK_TRANSACTIONS).filter(t => {
    if (filter === 'all') return true;
    return t.status === filter;
  }).filter(t => {
    if (!searchQuery) return true;
    return (t.merchant || '').toLowerCase().includes(searchQuery.toLowerCase()) ||
           (t.id || '').toLowerCase().includes(searchQuery.toLowerCase()) ||
           (t.kountId || '').toLowerCase().includes(searchQuery.toLowerCase());
  });

  return (
    <div className="p-4 lg:p-8 max-w-7xl mx-auto">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-6"
      >
        <div className="flex items-center justify-between mb-2">
          <h1 className="text-gray-900">Transações</h1>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="flex items-center gap-2 px-4 py-2 bg-white border border-gray-200 rounded-lg text-sm text-gray-700 hover:bg-gray-50"
          >
            <Download className="w-4 h-4" />
            Exportar
          </motion.button>
        </div>
        <p className="text-gray-600">Histórico completo de pagamentos</p>
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
          placeholder="Buscar por comerciante, ID de transação ou Kount ID..."
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
      <div className="flex gap-2 mb-6">
        {[
          { id: 'all', label: 'Todas' },
          { id: 'verified', label: 'Verificadas' },
          { id: 'suspicious', label: 'Suspeitas' },
        ].map((f) => (
          <motion.button
            key={f.id}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => setFilter(f.id)}
            className={`px-4 py-2 rounded-lg transition-all ${
              filter === f.id
                ? 'bg-[#0A1628] text-white'
                : 'bg-white text-gray-700 border border-gray-200 hover:border-gray-300'
            }`}
          >
            {f.label}
          </motion.button>
        ))}
      </div>

      {/* Transactions List */}
      <div className="space-y-3">
        {filteredTransactions.map((transaction, index) => (
          <motion.div
            key={transaction.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.05 }}
            whileHover={{ scale: 1.01 }}
            className={`bg-white rounded-xl p-5 border shadow-sm transition-all ${
              transaction.status === 'suspicious'
                ? 'border-red-200 bg-red-50'
                : 'border-gray-200'
            }`}
          >
            <div className="flex items-start gap-3 mb-4">
              <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${
                transaction.status === 'suspicious'
                  ? 'bg-red-100'
                  : 'bg-green-100'
              }`}>
                {transaction.status === 'suspicious' ? (
                  <AlertTriangle className="w-5 h-5 text-red-600" />
                ) : (
                  <CheckCircle className="w-5 h-5 text-green-600" />
                )}
              </div>
              <div className="flex-1">
                <div className="flex items-start justify-between gap-2 mb-1">
                  <p className="text-gray-900">{transaction.merchant}</p>
                  <span className="text-gray-900 whitespace-nowrap">R$ {transaction.amount.toFixed(2)}</span>
                </div>
                <p className="text-gray-600 text-sm">{transaction.id}</p>
              </div>
            </div>

            <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
              <div>
                <p className="text-gray-500 text-xs mb-1">Kount ID</p>
                <p className="text-gray-900 text-sm font-mono">{transaction.kountId}</p>
              </div>
              <div>
                <p className="text-gray-500 text-xs mb-1">Localização</p>
                <p className="text-gray-900 text-sm">{transaction.location}</p>
              </div>
              <div>
                <p className="text-gray-500 text-xs mb-1">Cartão</p>
                <p className="text-gray-900 text-sm font-mono">{transaction.cardNumber}••••••</p>
              </div>
              <div>
                <p className="text-gray-500 text-xs mb-1">Auth Code</p>
                <p className="text-gray-900 text-sm font-mono">{transaction.authCode}</p>
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      {filteredTransactions.length === 0 && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="text-center py-12"
        >
          <p className="text-gray-500">Nenhuma transação encontrada</p>
        </motion.div>
      )}
    </div>
  );
}
