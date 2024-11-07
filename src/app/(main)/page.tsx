import ApiCard from '@/components/ApiCard';
import ApiSearch from '@/components/ApiSearch';
import { prisma } from '@/lib/prisma';
import { Api } from '@/types/api';
import { Suspense } from 'react';

// 添加 Searchparams 类型
interface SearchParams {
  q?: string;
}

// 修改搜索逻辑，移除 insensitive 模式
async function getApis(search?: string) {
  const where = search
    ? {
        OR: [
          { name: { contains: search } },
          { description: { contains: search } },
          { endpoint: { contains: search } },
        ],
      }
    : {};

  const apis = await prisma.api.findMany({
    where,
    include: {
      _count: {
        select: { ApiCall: true }
      },
      ApiCall: {
        where: {
          timestamp: {
            gte: new Date(new Date().setHours(0, 0, 0, 0))
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

export default async function Home({
  searchParams,
}: {
  searchParams: SearchParams;
}) {
  // 使用 Suspense 包裹异步内容
  return (
    <div className="py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-2xl font-bold text-gray-900">API 服务概览</h1>
          <ApiSearch />
        </div>

        <Suspense fallback={<div>加载中...</div>}>
          <ApiList searchQuery={searchParams.q} />
        </Suspense>
      </div>
    </div>
  );
}

// 创建一个新组件处理 API 列表
async function ApiList({ searchQuery }: { searchQuery?: string }) {
  const apis = await getApis(searchQuery);

  return (
    <>
      {/* 统计概览 */}
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
      <div>
        <h2 className="text-xl font-bold text-gray-900 mb-6">
          可用接口 {searchQuery && `(搜索: ${searchQuery})`}
        </h2>
        {apis.length === 0 ? (
          <div className="text-center py-12 text-gray-500">
            没有找到匹配的 API
          </div>
        ) : (
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
        )}
      </div>
    </>
  );
}