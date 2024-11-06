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
    <div className="py-8">
      {/* 统计概览 */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <h1 className="text-2xl font-bold text-gray-900 mb-8">API 服务概览</h1>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
          <div className="bg-white rounded-lg shadow p-6">
            <h3 className="text-lg font-medium text-gray-900">总接口数</h3>
            <p className="mt-2 text-3xl font-semibold text-primary-600">{apis.length}</p>
          </div>
          <div className="bg-white rounded-lg shadow p-6">
            <h3 className="text-lg font-medium text-gray-900">总调用次数</h3>
            <p className="mt-2 text-3xl font-semibold text-primary-600">
              {apis.reduce((acc, api) => acc + api.totalCalls, 0)}
            </p>
          </div>
          <div className="bg-white rounded-lg shadow p-6">
            <h3 className="text-lg font-medium text-gray-900">今日调用次数</h3>
            <p className="mt-2 text-3xl font-semibold text-primary-600">
              {apis.reduce((acc, api) => acc + api.todayCalls, 0)}
            </p>
          </div>
        </div>

        {/* API 列表 */}
        <h2 className="text-xl font-bold text-gray-900 mb-6">可用接口</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
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
  );
}