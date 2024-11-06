export interface Api {
  id: string;
  name: string;
  description?: string;
  endpoint: string;
  method: string;
  status: 'normal' | 'error';
  totalCalls: number;
  todayCalls: number;
}

export interface ApiCallStats {
  date: string;
  count: number;
} 