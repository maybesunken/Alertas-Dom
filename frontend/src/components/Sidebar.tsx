import { LayoutDashboard, CreditCard, AlertTriangle, FileText, Settings } from 'lucide-react';
import { motion } from 'motion/react';

interface SidebarProps {
  currentPage: string;
  onPageChange: (page: string) => void;
}

export function Sidebar({ currentPage, onPageChange }: SidebarProps) {
  const menuItems = [
    { id: 'dashboard', name: 'Dashboard', icon: LayoutDashboard },
    { id: 'transactions', name: 'Transações', icon: CreditCard },
    { id: 'alerts', name: 'Alertas', icon: AlertTriangle },
    { id: 'reports', name: 'Relatórios AI', icon: FileText },
    { id: 'settings', name: 'Configurações', icon: Settings },
  ];

  return (
    <aside className="w-64 bg-white border-r border-gray-200 fixed left-0 top-16 bottom-0 hidden lg:block">
      <nav className="p-3">
        <ul className="space-y-1">
          {menuItems.map((item) => {
            const Icon = item.icon;
            const isActive = currentPage === item.id;
            
            return (
              <li key={item.id}>
                <motion.button
                  whileHover={{ x: 4 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => onPageChange(item.id)}
                  className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-all ${
                    isActive
                      ? 'bg-gradient-to-r from-blue-50 to-blue-100 text-blue-600 shadow-sm'
                      : 'text-gray-700 hover:bg-gray-50'
                  }`}
                >
                  <Icon className={`w-5 h-5 ${isActive ? 'text-blue-600' : 'text-gray-500'}`} />
                  <span className="text-sm">{item.name}</span>
                  {isActive && (
                    <motion.div
                      layoutId="activeIndicator"
                      className="ml-auto w-1.5 h-1.5 bg-blue-600 rounded-full"
                    />
                  )}
                </motion.button>
              </li>
            );
          })}
        </ul>
      </nav>

      {/* Bottom Card */}
      <div className="absolute bottom-4 left-3 right-3">
        <div className="bg-gradient-to-br from-[#0A1628] to-[#1a2744] rounded-xl p-4 text-white">
          <p className="text-sm mb-2">Upgrade para Pro</p>
          <p className="text-xs text-gray-300 mb-3">Desbloqueie recursos avançados de IA</p>
          <button className="w-full py-2 bg-white/20 hover:bg-white/30 rounded-lg text-xs transition-all backdrop-blur-sm">
            Saiba Mais
          </button>
        </div>
      </div>
    </aside>
  );
}
