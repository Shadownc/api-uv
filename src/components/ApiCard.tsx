import Link from 'next/link';

interface ApiCardProps {
  id: string;
  title: string;
  status: 'normal' | 'error';
  totalCalls: number;
  description?: string;
}

export default function ApiCard({ id, title, status, totalCalls, description }: ApiCardProps) {
  return (
    <Link href={`/api/${id}`} className="block">
      <div className="bg-white rounded-xl shadow-sm hover:shadow-md transition-all duration-200 p-6">
        <div className="flex justify-between items-start">
          <h3 className="text-lg font-semibold text-gray-900">{title}</h3>
          <span className={`px-2 py-1 text-xs rounded-full ${
            status === 'normal' 
              ? 'bg-success-50 text-success' 
              : 'bg-red-50 text-red-600'
          }`}>
            {status === 'normal' ? '正常' : '异常'}
          </span>
        </div>
        <div className="mt-2 space-y-2">
          <p className="text-sm text-gray-600">调用次数: {totalCalls.toLocaleString()}</p>
          {description && (
            <p className="text-sm text-gray-500 line-clamp-2">{description}</p>
          )}
        </div>
        <div className="mt-4 flex items-center text-sm text-primary-600 hover:text-primary-700">
          <span>查看详情</span>
          <svg 
            className="ml-1 w-4 h-4" 
            fill="none" 
            stroke="currentColor" 
            viewBox="0 0 24 24"
          >
            <path 
              strokeLinecap="round" 
              strokeLinejoin="round" 
              strokeWidth={2} 
              d="M9 5l7 7-7 7" 
            />
          </svg>
        </div>
      </div>
    </Link>
  );
}