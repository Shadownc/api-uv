import { prisma } from '@/lib/prisma';
import ApiCard from '@/components/ApiCard';
import { Api } from '@/types/api';

async function getApis(): Promise<Api[]> {
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const apis = await prisma.api.findMany({
    include: {
      _count: {
        select: { ApiCall: true }
      },
      ApiCall: {
        where: {
          timestamp: {
            gte: today
          }
        }
      }
    }
  });

  return apis.map(api => ({
    id: api.id,
    name: api.name,
    description: api.description,
    endpoint: api.endpoint,
    method: api.method,
    status: api.status as 'normal' | 'error',
    totalCalls: api._count.ApiCall,
    todayCalls: api.ApiCall.length
  }));
}

export default async function Home() {
  const apis = await getApis();

  return (
    <div className="py-12 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* 页面标题 */}
        <div className="text-center mb-12">
          <h1 className="text-3xl font-bold text-gray-900 mb-4">API 开放平台</h1>
          <p className="text-lg text-gray-600">简单、快速、安全的 API 调用服务</p>
        </div>

        {/* 统计概览 */}
        <div className="mb-16">
          <h2 className="text-2xl font-bold text-gray-900 mb-8">服务概览</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-white rounded-xl shadow-sm p-8 border border-gray-100">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-medium text-gray-900">总接口数</h3>
                <span className="p-2 bg-primary-50 rounded-lg">
                  <svg className="w-6 h-6 text-primary-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
                  </svg>
                </span>
              </div>
              <p className="text-4xl font-bold text-gray-900">{apis.length}</p>
              <p className="mt-2 text-sm text-gray-600">可用接口总数</p>
            </div>

            <div className="bg-white rounded-xl shadow-sm p-8 border border-gray-100">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-medium text-gray-900">总调用次数</h3>
                <span className="p-2 bg-green-50 rounded-lg">
                  <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </span>
              </div>
              <p className="text-4xl font-bold text-gray-900">
                {apis.reduce((acc, api) => acc + api.totalCalls, 0).toLocaleString()}
              </p>
              <p className="mt-2 text-sm text-gray-600">累计调用次数</p>
            </div>

            <div className="bg-white rounded-xl shadow-sm p-8 border border-gray-100">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-medium text-gray-900">今日调用</h3>
                <span className="p-2 bg-blue-50 rounded-lg">
                  <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </span>
              </div>
              <p className="text-4xl font-bold text-gray-900">
                {apis.reduce((acc, api) => acc + api.todayCalls, 0).toLocaleString()}
              </p>
              <p className="mt-2 text-sm text-gray-600">今日调用次数</p>
            </div>
          </div>
        </div>

        {/* API 列表 */}
        <div>
          <div className="flex justify-between items-center mb-8">
            <h2 className="text-2xl font-bold text-gray-900">可用接口</h2>
            <div className="relative">
              <input
                type="text"
                placeholder="搜索接口..."
                className="w-64 px-4 py-2 pr-10 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
              />
              <svg
                className="absolute right-3 top-2.5 h-5 w-5 text-gray-400"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                />
              </svg>
            </div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {apis.map((api) => (
              <ApiCard
                key={api.id}
                id={api.id}
                title={api.name}
                status={api.status}
                totalCalls={api.totalCalls}
                description={api.description}
              />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}