import { Bell, User, Search } from 'lucide-react';
import { motion } from 'motion/react';
import { useState } from 'react';

export function Navbar() {
  const [notifications] = useState(3);

  return (
    <motion.nav 
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      className="bg-white border-b border-gray-200 fixed top-0 left-0 right-0 z-50 shadow-sm"
    >
      <div className="px-4 lg:px-6 py-3 flex items-center justify-between">
        <div className="flex items-center gap-3 lg:gap-6">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 bg-gradient-to-br from-[#0A1628] to-[#1a2744] rounded-lg flex items-center justify-center">
              <span className="text-white text-sm">D</span>
            </div>
            <h2 className="text-gray-900 hidden sm:block">Dom Pagamentos</h2>
          </div>
          
          {/* Search - Desktop */}
          <div className="hidden lg:block">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
              <input
                type="text"
                placeholder="Buscar transações, alertas..."
                className="w-64 xl:w-96 pl-10 pr-4 py-2 bg-gray-50 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
          </div>
        </div>
        
        <div className="flex items-center gap-2">
          <motion.button 
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="relative p-2 text-gray-600 hover:bg-gray-50 rounded-lg transition-colors"
          >
            <Bell className="w-5 h-5" />
            {notifications > 0 && (
              <motion.span 
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                className="absolute -top-1 -right-1 w-5 h-5 bg-blue-500 text-white text-xs rounded-full flex items-center justify-center"
              >
                {notifications}
              </motion.span>
            )}
          </motion.button>
          
          <motion.button 
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="flex items-center gap-2 p-2 hover:bg-gray-50 rounded-lg transition-colors"
          >
            <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-blue-600 rounded-full flex items-center justify-center">
              <User className="w-4 h-4 text-white" />
            </div>
            <span className="text-sm text-gray-700 hidden sm:block">Admin</span>
          </motion.button>
        </div>
      </div>
    </motion.nav>
  );
}
