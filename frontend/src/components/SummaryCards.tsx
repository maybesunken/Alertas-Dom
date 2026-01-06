import { CreditCard, AlertTriangle, ShieldAlert, Bell } from 'lucide-react';

export function SummaryCards() {
  const cards = [
    {
      title: 'Total Transactions',
      value: '12,458',
      change: '+12.5%',
      icon: CreditCard,
      color: 'blue',
    },
    {
      title: 'Detected Frauds',
      value: '47',
      change: '-8.2%',
      icon: AlertTriangle,
      color: 'red',
    },
    {
      title: 'Blocked Cards',
      value: '23',
      change: '+3.1%',
      icon: ShieldAlert,
      color: 'orange',
    },
    {
      title: 'Active Alerts',
      value: '8',
      change: '+2',
      icon: Bell,
      color: 'purple',
    },
  ];

  const colorClasses = {
    blue: 'bg-blue-50 text-blue-600',
    red: 'bg-red-50 text-red-600',
    orange: 'bg-orange-50 text-orange-600',
    purple: 'bg-purple-50 text-purple-600',
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      {cards.map((card) => {
        const Icon = card.icon;
        const colorClass = colorClasses[card.color as keyof typeof colorClasses];
        
        return (
          <div
            key={card.title}
            className="bg-white rounded-lg p-6 border border-gray-200 hover:shadow-md transition-shadow"
          >
            <div className="flex items-center justify-between mb-4">
              <div className={`p-3 rounded-lg ${colorClass}`}>
                <Icon className="w-6 h-6" />
              </div>
            </div>
            
            <h3 className="text-gray-600 mb-1">{card.title}</h3>
            <div className="flex items-end justify-between">
              <p className="text-gray-900">{card.value}</p>
              <span className={`text-sm ${
                card.change.startsWith('+') && card.title !== 'Detected Frauds' && card.title !== 'Blocked Cards'
                  ? 'text-green-600'
                  : card.change.startsWith('-')
                  ? 'text-red-600'
                  : 'text-gray-600'
              }`}>
                {card.change}
              </span>
            </div>
          </div>
        );
      })}
    </div>
  );
}
