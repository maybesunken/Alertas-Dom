import { AlertTriangle, CheckCircle } from 'lucide-react';

export function TransactionList() {
  const transactions = [
    {
      id: 'TXN-8923',
      merchant: 'Electronics Store Online',
      amount: 2499.99,
      location: 'Shanghai, China',
      time: '2 minutes ago',
      status: 'suspicious',
      cardLast4: '4532',
    },
    {
      id: 'TXN-8922',
      merchant: 'Coffee Shop',
      amount: 12.50,
      location: 'São Paulo, Brazil',
      time: '15 minutes ago',
      status: 'verified',
      cardLast4: '4532',
    },
    {
      id: 'TXN-8921',
      merchant: 'Supermarket',
      amount: 145.30,
      location: 'Rio de Janeiro, Brazil',
      time: '1 hour ago',
      status: 'verified',
      cardLast4: '8901',
    },
    {
      id: 'TXN-8920',
      merchant: 'Online Gaming Platform',
      amount: 899.00,
      location: 'Lagos, Nigeria',
      time: '2 hours ago',
      status: 'suspicious',
      cardLast4: '2345',
    },
    {
      id: 'TXN-8919',
      merchant: 'Gas Station',
      amount: 85.00,
      location: 'São Paulo, Brazil',
      time: '3 hours ago',
      status: 'verified',
      cardLast4: '4532',
    },
    {
      id: 'TXN-8918',
      merchant: 'Restaurant',
      amount: 156.80,
      location: 'Brasília, Brazil',
      time: '5 hours ago',
      status: 'verified',
      cardLast4: '8901',
    },
  ];

  return (
    <div className="bg-white rounded-lg border border-gray-200">
      <div className="p-6 border-b border-gray-200">
        <h3 className="text-gray-900 mb-1">Recent Transactions</h3>
        <p className="text-gray-600">Latest payment activities across all accounts</p>
      </div>
      
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className="bg-gray-50 border-b border-gray-200">
            <tr>
              <th className="px-6 py-3 text-left text-gray-700">Transaction ID</th>
              <th className="px-6 py-3 text-left text-gray-700">Merchant</th>
              <th className="px-6 py-3 text-left text-gray-700">Amount</th>
              <th className="px-6 py-3 text-left text-gray-700">Location</th>
              <th className="px-6 py-3 text-left text-gray-700">Time</th>
              <th className="px-6 py-3 text-left text-gray-700">Card</th>
              <th className="px-6 py-3 text-left text-gray-700">Status</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {transactions.map((transaction) => (
              <tr
                key={transaction.id}
                className={`${
                  transaction.status === 'suspicious'
                    ? 'bg-red-50 hover:bg-red-100'
                    : 'hover:bg-gray-50'
                } transition-colors`}
              >
                <td className="px-6 py-4 text-gray-900">{transaction.id}</td>
                <td className="px-6 py-4 text-gray-900">{transaction.merchant}</td>
                <td className="px-6 py-4 text-gray-900">
                  ${transaction.amount.toFixed(2)}
                </td>
                <td className="px-6 py-4 text-gray-600">{transaction.location}</td>
                <td className="px-6 py-4 text-gray-600">{transaction.time}</td>
                <td className="px-6 py-4 text-gray-600">****{transaction.cardLast4}</td>
                <td className="px-6 py-4">
                  {transaction.status === 'suspicious' ? (
                    <span className="inline-flex items-center gap-1 px-3 py-1 bg-red-100 text-red-700 rounded-full">
                      <AlertTriangle className="w-4 h-4" />
                      <span>Suspicious</span>
                    </span>
                  ) : (
                    <span className="inline-flex items-center gap-1 px-3 py-1 bg-green-100 text-green-700 rounded-full">
                      <CheckCircle className="w-4 h-4" />
                      <span>Verified</span>
                    </span>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
