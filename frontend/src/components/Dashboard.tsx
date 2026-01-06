import { motion } from "framer-motion";
import {
  CreditCard,
  AlertTriangle,
  ShieldAlert,
  TrendingDown,
  ArrowRight,
  Activity,
} from "lucide-react";
import { useState, useEffect } from "react";
import api from "../services/api";
import type { DashboardStats, Alert as AlertType } from "../types/api";
import { SuspiciousAlertModal } from "./SuspiciousAlertModal";

export function Dashboard() {
  const [showModal, setShowModal] = useState(false);

  const MOCK_STATS = [
    {
      icon: CreditCard,
      label: "Transações Hoje",
      value: "1.247",
      change: "+12.5%",
      trend: "up",
    },
    {
      icon: AlertTriangle,
      label: "Fraudes Detectadas",
      value: "23",
      change: "-8.2%",
      trend: "down",
    },
    {
      icon: ShieldAlert,
      label: "Cartões Bloqueados",
      value: "15",
      change: "+3",
      trend: "neutral",
    },
    {
      icon: TrendingDown,
      label: "Taxa de Fraude",
      value: "1.8%",
      change: "-0.3%",
      trend: "down",
    },
  ];

  const MOCK_ALERTS: AlertType[] = [
    {
      id: 1,
      kountId: "KNT-8X9Y2Z",
      type: "high",
      title: "Compra Internacional Suspeita",
      description: "R$ 2.499,99 - Xangai, China",
      time: "2 min atrás",
      cardNumber: "453210",
    },
    {
      id: 2,
      kountId: "KNT-7A8B3C",
      type: "medium",
      title: "Localização Incomum",
      description: "R$ 899,00 - Lagos, Nigéria",
      time: "1 hora atrás",
      cardNumber: "234567",
    },
    {
      id: 3,
      kountId: "KNT-5D6E4F",
      type: "low",
      title: "Múltiplas Tentativas",
      description: "3 tentativas falhadas",
      time: "3 horas atrás",
      cardNumber: "567890",
    },
  ];

  const { data: stats = MOCK_STATS, loading: loadingStats, error: statsError } = useApiQuery(
    'dashboard:stats',
    async () => {
      const res = await api.get('/dashboard/stats');
      const data = res?.data ?? {};
      return [
        { icon: CreditCard, label: 'Transações Hoje', value: String(data.transactionsToday ?? 1247), change: '+12.5%', trend: 'up' },
        { icon: AlertTriangle, label: 'Fraudes Detectadas', value: String(data.fraudCount ?? 23), change: '-8.2%', trend: 'down' },
        { icon: ShieldAlert, label: 'Cartões Bloqueados', value: String(data.blockedCards ?? 15), change: '+3', trend: 'neutral' },
        { icon: TrendingDown, label: 'Taxa de Fraude', value: data.fraudRate ?? '1.8%', change: '-0.3%', trend: 'down' },
      ];
    },
    { staleTime: 1000 * 30 }
  );

  const { data: recentAlerts = MOCK_ALERTS, loading: loadingAlerts, error: alertsError } = useApiQuery(
    'alerts:recent',
    async () => {
      const res = await api.get('/alerts', { params: { limit: 5 } });
      return (res?.data?.data ?? res?.data) as AlertType[];
    },
    { staleTime: 1000 * 30 }
  );

  return (
    <div className="p-4 lg:p-8 max-w-7xl mx-auto">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-8"
      >
        <h1 className="text-gray-900 mb-2">Dashboard</h1>
        <p className="text-gray-600">
          Visão geral do sistema de detecção de fraudes
        </p>
      </motion.div>

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 lg:gap-6 mb-8">
        {stats.map((stat, index) => {
          const Icon = stat.icon;
          return (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              whileHover={{ y: -4 }}
              className="bg-white rounded-2xl p-6 border border-gray-200 shadow-sm hover:shadow-md transition-all"
            >
              <div className="flex items-start justify-between mb-4">
                <div className="w-12 h-12 rounded-xl bg-gray-50 flex items-center justify-center">
                  <Icon className="w-6 h-6 text-gray-700" />
                </div>
                <span
                  className={`text-sm px-2 py-1 rounded-lg ${
                    stat.trend === "up"
                      ? "bg-green-50 text-green-700"
                      : stat.trend === "down"
                      ? "bg-red-50 text-red-700"
                      : "bg-gray-50 text-gray-700"
                  }`}
                >
                  {stat.change}
                </span>
              </div>
              <p className="text-gray-600 text-sm mb-1">{stat.label}</p>
              <h2 className="text-gray-900">{stat.value}</h2>
            </motion.div>
          );
        })}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Alertas Recentes */}
        <div className="lg:col-span-2">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-gray-900">Alertas Recentes</h3>
            <button className="text-blue-600 text-sm flex items-center gap-1 hover:gap-2 transition-all">
              Ver todos
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>

          <div className="space-y-3">
            {recentAlerts.map((alert, index) => (
              <motion.div
                key={alert.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.4 + index * 0.1 }}
                whileHover={{ x: 4 }}
                className="bg-white rounded-xl p-4 border border-gray-200 hover:border-gray-300 transition-all cursor-pointer"
              >
                <div className="flex items-start gap-3">
                  <div
                    className={`w-10 h-10 rounded-lg flex items-center justify-center flex-shrink-0 ${
                      alert.type === "high"
                        ? "bg-red-50"
                        : alert.type === "medium"
                        ? "bg-orange-50"
                        : "bg-yellow-50"
                    }`}
                  >
                    <AlertTriangle
                      className={`w-5 h-5 ${
                        alert.type === "high"
                          ? "text-red-600"
                          : alert.type === "medium"
                          ? "text-orange-600"
                          : "text-yellow-600"
                      }`}
                    />
                  </div>

                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-2 mb-1">
                      <p className="text-gray-900 text-sm">{alert.title}</p>
                      <span className="text-xs text-gray-500 whitespace-nowrap">
                        {alert.time}
                      </span>
                    </div>

                    <p className="text-gray-600 text-sm mb-2">
                      {alert.description}
                    </p>

                    <div className="flex items-center gap-3 text-xs text-gray-500">
                      <span>ID: {alert.kountId}</span>
                      <span>•</span>
                      <span>{alert.cardNumber}••••••</span>
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>

        {/* Atividade */}
        <div>
          <h3 className="text-gray-900 mb-4">Atividade em Tempo Real</h3>

          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.6 }}
            className="bg-gradient-to-br from-[#0A1628] to-[#1a2744] rounded-2xl p-6 text-white mb-4"
          >
            <div className="flex items-center gap-3 mb-4">
              <div className="w-12 h-12 bg-white/10 rounded-xl flex items-center justify-center">
                <Activity className="w-6 h-6" />
              </div>
              <div>
                <p className="text-sm">Sistema Ativo</p>
                <p className="text-xs text-gray-300">Monitorando 24/7</p>
              </div>
            </div>

            <div className="space-y-3">
              <div>
                <div className="flex justify-between text-sm mb-1">
                  <span className="text-gray-300">Taxa de Precisão</span>
                  <span>94.5%</span>
                </div>
                <div className="h-2 bg-white/10 rounded-full overflow-hidden">
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: "94.5%" }}
                    transition={{ delay: 0.8, duration: 1 }}
                    className="h-full bg-gradient-to-r from-blue-400 to-blue-500"
                  />
                </div>
              </div>

              <div>
                <div className="flex justify-between text-sm mb-1">
                  <span className="text-gray-300">Processamento</span>
                  <span>87%</span>
                </div>
                <div className="h-2 bg-white/10 rounded-full overflow-hidden">
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: "87%" }}
                    transition={{ delay: 1, duration: 1 }}
                    className="h-full bg-gradient-to-r from-green-400 to-green-500"
                  />
                </div>
              </div>
            </div>
          </motion.div>

          <motion.button
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.7 }}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => setShowModal(true)}
            className="w-full py-3 bg-blue-50 hover:bg-blue-100 text-blue-600 rounded-xl transition-all border border-blue-200"
          >
            Simular Alerta Suspeito
          </motion.button>
        </div>
      </div>

      {/* Modal */}
      {showModal && (
        <SuspiciousAlertModal onClose={() => setShowModal(false)} />
      )}
    </div>
  );
}
