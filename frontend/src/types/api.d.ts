export interface User {
    id: string;
    name: string;
    email?: string;
    roles?: string[];
}

export interface AuthMeResponse {
    user: User | null;
}

// Transactions
export interface Transaction {
  id: string;
  kountId?: string;
  merchant?: string;
  amount?: number;
  location?: string;
  time?: string;
  date?: string;
  status?: 'verified' | 'suspicious' | string;
  cardNumber?: string;
  authCode?: string;
}

export interface TransactionsResponse {
  data: Transaction[];
  total?: number;
  page?: number;
}

// Alerts / Dashboard
export interface Alert {
  id: string | number;
  kountId?: string;
  type?: 'high' | 'medium' | 'low' | string;
  title?: string;
  description?: string;
  time?: string;
  cardNumber?: string;
}

export interface AlertsResponse {
  data: Alert[];
}

export interface DashboardStats {
  transactionsToday?: number;
  fraudCount?: number;
  blockedCards?: number;
  fraudRate?: string;
}