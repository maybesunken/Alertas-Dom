import { AlertTriangle, X, MapPin, CreditCard, DollarSign, Clock } from 'lucide-react';

interface Transaction {
  id: string;
  merchant: string;
  amount: number;
  location: string;
  time: string;
  cardLast4: string;
}

interface AlertModalProps {
  transaction: Transaction;
  onClose: () => void;
}

export function AlertModal({ transaction, onClose }: AlertModalProps) {
  const handleResponse = (isUser: boolean) => {
    // In a real app, this would send the response to the backend
    console.log(`User confirmed: ${isUser ? 'Yes' : 'No'}`);
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg max-w-md w-full shadow-xl">
        {/* Header */}
        <div className="bg-red-500 text-white p-6 rounded-t-lg relative">
          <button
            onClick={onClose}
            className="absolute top-4 right-4 text-white hover:bg-red-600 rounded-lg p-1 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
          
          <div className="flex items-center gap-3 mb-2">
            <div className="bg-white bg-opacity-20 p-2 rounded-lg">
              <AlertTriangle className="w-8 h-8" />
            </div>
            <div>
              <h2 className="text-white">Suspicious Activity Detected</h2>
              <p className="text-red-100 text-sm">Immediate action required</p>
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="p-6">
          <div className="mb-6">
            <h3 className="text-gray-900 mb-4">Transaction Details</h3>
            
            <div className="space-y-3">
              <div className="flex items-start gap-3">
                <div className="bg-gray-100 p-2 rounded-lg">
                  <DollarSign className="w-5 h-5 text-gray-600" />
                </div>
                <div>
                  <p className="text-gray-600">Amount</p>
                  <p className="text-gray-900">${transaction.amount.toFixed(2)}</p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <div className="bg-gray-100 p-2 rounded-lg">
                  <MapPin className="w-5 h-5 text-gray-600" />
                </div>
                <div>
                  <p className="text-gray-600">Location</p>
                  <p className="text-gray-900">{transaction.location}</p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <div className="bg-gray-100 p-2 rounded-lg">
                  <CreditCard className="w-5 h-5 text-gray-600" />
                </div>
                <div>
                  <p className="text-gray-600">Merchant</p>
                  <p className="text-gray-900">{transaction.merchant}</p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <div className="bg-gray-100 p-2 rounded-lg">
                  <Clock className="w-5 h-5 text-gray-600" />
                </div>
                <div>
                  <p className="text-gray-600">Time</p>
                  <p className="text-gray-900">{transaction.time}</p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <div className="bg-gray-100 p-2 rounded-lg">
                  <CreditCard className="w-5 h-5 text-gray-600" />
                </div>
                <div>
                  <p className="text-gray-600">Card</p>
                  <p className="text-gray-900">**** **** **** {transaction.cardLast4}</p>
                </div>
              </div>
            </div>
          </div>

          {/* Question */}
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
            <h3 className="text-blue-900 mb-2 text-center">Is this you?</h3>
            <p className="text-blue-700 text-sm text-center">
              Did you authorize this transaction?
            </p>
          </div>

          {/* Action Buttons */}
          <div className="grid grid-cols-2 gap-3">
            <button
              onClick={() => handleResponse(true)}
              className="px-6 py-3 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors"
            >
              Yes, it's me
            </button>
            <button
              onClick={() => handleResponse(false)}
              className="px-6 py-3 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors"
            >
              No, block card
            </button>
          </div>

          <p className="text-gray-500 text-sm text-center mt-4">
            If you did not make this transaction, your card will be blocked immediately.
          </p>
        </div>
      </div>
    </div>
  );
}
