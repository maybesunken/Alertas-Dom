import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

export function FraudTrendChart() {
  const data = [
    { month: 'Jan', frauds: 32, transactions: 8500 },
    { month: 'Feb', frauds: 28, transactions: 9200 },
    { month: 'Mar', frauds: 45, transactions: 10100 },
    { month: 'Apr', frauds: 38, transactions: 9800 },
    { month: 'May', frauds: 52, transactions: 11200 },
    { month: 'Jun', frauds: 41, transactions: 10500 },
    { month: 'Jul', frauds: 47, transactions: 12458 },
  ];

  return (
    <div className="bg-white rounded-lg p-6 border border-gray-200">
      <div className="mb-6">
        <h3 className="text-gray-900 mb-1">Fraud Detection Trends</h3>
        <p className="text-gray-600">Monthly overview of detected fraudulent activities</p>
      </div>
      
      <ResponsiveContainer width="100%" height={300}>
        <LineChart data={data}>
          <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
          <XAxis dataKey="month" stroke="#6b7280" />
          <YAxis stroke="#6b7280" />
          <Tooltip
            contentStyle={{
              backgroundColor: 'white',
              border: '1px solid #e5e7eb',
              borderRadius: '8px',
            }}
          />
          <Legend />
          <Line
            type="monotone"
            dataKey="frauds"
            stroke="#ef4444"
            strokeWidth={2}
            name="Detected Frauds"
            dot={{ fill: '#ef4444', r: 4 }}
          />
          <Line
            type="monotone"
            dataKey="transactions"
            stroke="#3b82f6"
            strokeWidth={2}
            name="Total Transactions"
            dot={{ fill: '#3b82f6', r: 4 }}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}
