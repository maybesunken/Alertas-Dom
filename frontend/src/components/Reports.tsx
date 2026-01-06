import { motion } from 'motion/react';
import { TrendingUp, TrendingDown, BarChart3, Activity, Zap, Target } from 'lucide-react';

export function Reports() {
  const stats = [
    { label: 'Taxa de Detecção', value: '94.5%', change: '+2.3%', trend: 'up', icon: Target },
    { label: 'Falsos Positivos', value: '5.2%', change: '-1.1%', trend: 'down', icon: Activity },
    { label: 'Economia Total', value: 'R$ 45.2K', change: '+18.5%', trend: 'up', icon: TrendingUp },
    { label: 'Tempo Médio Resposta', value: '2.3 min', change: '-0.5 min', trend: 'down', icon: Zap },
  ];

  const monthlyData = [
    { month: 'Jan', frauds: 32, prevented: 28 },
    { month: 'Fev', frauds: 28, prevented: 26 },
    { month: 'Mar', frauds: 45, prevented: 41 },
    { month: 'Abr', frauds: 38, prevented: 35 },
    { month: 'Mai', frauds: 52, prevented: 48 },
    { month: 'Jun', frauds: 41, prevented: 39 },
    { month: 'Jul', frauds: 47, prevented: 44 },
  ];

  return (
    <div className="p-4 lg:p-8 max-w-7xl mx-auto">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-6"
      >
        <h1 className="text-gray-900 mb-2">Relatórios AI</h1>
        <p className="text-gray-600">Análise inteligente de detecção de fraudes</p>
      </motion.div>

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
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
                <div className={`flex items-center gap-1 text-sm ${
                  stat.trend === 'up' && !stat.label.includes('Falsos')
                    ? 'text-green-600'
                    : stat.trend === 'down'
                    ? 'text-red-600'
                    : 'text-gray-600'
                }`}>
                  {stat.trend === 'up' ? (
                    <TrendingUp className="w-4 h-4" />
                  ) : (
                    <TrendingDown className="w-4 h-4" />
                  )}
                  <span>{stat.change}</span>
                </div>
              </div>
              <p className="text-gray-600 text-sm mb-1">{stat.label}</p>
              <h2 className="text-gray-900">{stat.value}</h2>
            </motion.div>
          );
        })}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Chart 1 */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="bg-white rounded-2xl p-6 border border-gray-200"
        >
          <div className="flex items-center gap-2 mb-6">
            <BarChart3 className="w-5 h-5 text-gray-700" />
            <h3 className="text-gray-900">Tendência Mensal de Fraudes</h3>
          </div>
          
          <div className="space-y-4">
            {monthlyData.map((data, index) => (
              <div key={data.month}>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm text-gray-600">{data.month}</span>
                  <div className="flex items-center gap-4 text-sm">
                    <span className="text-red-600">{data.frauds} detectadas</span>
                    <span className="text-green-600">{data.prevented} prevenidas</span>
                  </div>
                </div>
                <div className="flex gap-1 h-2">
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${(data.prevented / data.frauds) * 100}%` }}
                    transition={{ delay: 0.5 + index * 0.1, duration: 0.5 }}
                    className="bg-green-500 rounded-full"
                  />
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${((data.frauds - data.prevented) / data.frauds) * 100}%` }}
                    transition={{ delay: 0.5 + index * 0.1, duration: 0.5 }}
                    className="bg-red-500 rounded-full"
                  />
                </div>
              </div>
            ))}
          </div>
        </motion.div>

        {/* AI Insights */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="bg-white rounded-2xl p-6 border border-gray-200"
        >
          <h3 className="text-gray-900 mb-6">Insights do Sistema AI</h3>
          
          <div className="space-y-4">
            <div className="p-4 bg-blue-50 rounded-xl border border-blue-200">
              <div className="flex items-start gap-3">
                <div className="w-8 h-8 bg-blue-500 rounded-lg flex items-center justify-center flex-shrink-0">
                  <TrendingUp className="w-4 h-4 text-white" />
                </div>
                <div>
                  <p className="text-blue-900 mb-1">Melhoria na Precisão</p>
                  <p className="text-blue-700 text-sm">O sistema melhorou 12% na última semana através do aprendizado contínuo.</p>
                </div>
              </div>
            </div>

            <div className="p-4 bg-green-50 rounded-xl border border-green-200">
              <div className="flex items-start gap-3">
                <div className="w-8 h-8 bg-green-500 rounded-lg flex items-center justify-center flex-shrink-0">
                  <Target className="w-4 h-4 text-white" />
                </div>
                <div>
                  <p className="text-green-900 mb-1">Novos Padrões Identificados</p>
                  <p className="text-green-700 text-sm">3 novos padrões de fraude foram detectados e adicionados ao modelo.</p>
                </div>
              </div>
            </div>

            <div className="p-4 bg-orange-50 rounded-xl border border-orange-200">
              <div className="flex items-start gap-3">
                <div className="w-8 h-8 bg-orange-500 rounded-lg flex items-center justify-center flex-shrink-0">
                  <Activity className="w-4 h-4 text-white" />
                </div>
                <div>
                  <p className="text-orange-900 mb-1">Atenção Necessária</p>
                  <p className="text-orange-700 text-sm">Aumento de 15% em tentativas de fraude de origem internacional.</p>
                </div>
              </div>
            </div>

            <div className="p-4 bg-purple-50 rounded-xl border border-purple-200">
              <div className="flex items-start gap-3">
                <div className="w-8 h-8 bg-purple-500 rounded-lg flex items-center justify-center flex-shrink-0">
                  <Zap className="w-4 h-4 text-white" />
                </div>
                <div>
                  <p className="text-purple-900 mb-1">Tempo de Resposta</p>
                  <p className="text-purple-700 text-sm">Redução de 30% no tempo médio de detecção de alertas.</p>
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      </div>

      {/* Bottom Card */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.6 }}
        className="mt-6 bg-gradient-to-br from-[#0A1628] to-[#1a2744] rounded-2xl p-8 text-white"
      >
        <div className="flex flex-col lg:flex-row items-center justify-between gap-6">
          <div>
            <h3 className="text-white mb-2">Economia Total em 2024</h3>
            <p className="text-gray-300 mb-4">Valor estimado de fraudes prevenidas pelo sistema</p>
            <div className="flex items-baseline gap-2">
              <span className="text-white">R$ 487.350,00</span>
              <span className="text-green-400 text-sm">+28% vs 2023</span>
            </div>
          </div>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="px-6 py-3 bg-white/20 hover:bg-white/30 backdrop-blur-sm rounded-xl text-white transition-all"
          >
            Baixar Relatório Completo
          </motion.button>
        </div>
      </motion.div>
    </div>
  );
}
