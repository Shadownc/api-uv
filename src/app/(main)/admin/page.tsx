import { prisma } from '@/lib/prisma';
import Link from 'next/link';

export default function AdminPage() {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* 页面标题 */}
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900">管理后台</h1>
        <p className="mt-2 text-sm text-gray-600">管理和监控所有 API</p>
      </div>

      {/* 统计卡片 */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        {[
          { title: 'API 总数', value: '12', change: '+2', up: true },
          { title: '调用次数', value: '1,234', change: '+15%', up: true },
          { title: '成功率', value: '99.9%', change: '-0.1%', up: false },
          { title: '平均响应时间', value: '123ms', change: '-5ms', up: true },
        ].map((stat) => (
          <div key={stat.title} className="bg-white rounded-lg shadow-sm p-6">
            <p className="text-sm font-medium text-gray-600">{stat.title}</p>
            <p className="mt-2 flex items-baseline">
              <span className="text-2xl font-semibold text-gray-900">{stat.value}</span>
              <span className={`ml-2 text-sm font-medium ${stat.up ? 'text-green-600' : 'text-red-600'}`}>
                {stat.change}
              </span>
            </p>
          </div>
        ))}
      </div>

      {/* API 列表 */}
      <div className="bg-white rounded-lg shadow-sm overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-200">
          <h2 className="text-lg font-medium text-gray-900">API 列表</h2>
        </div>
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">名称</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">状态</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">调用次数</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">操作</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {/* API 列表项 */}
          </tbody>
        </table>
      </div>
    </div>
  );
} 