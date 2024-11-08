import { Suspense } from 'react';
import ApiSearch from '@/components/ApiSearch';
import { prisma } from '@/lib/prisma';
import ApiCard from '@/components/ApiCard';

async function getApis(searchQuery?: string | null) {
  const where = searchQuery
    ? {
        OR: [
          { name: { contains: searchQuery } },
          { description: { contains: searchQuery } },
          { endpoint: { contains: searchQuery } },
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

// 添加加载状态组件
function LoadingSkeleton() {
  return (
    <div className="animate-pulse">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
        {[1, 2, 3].map((i) => (
          <div key={i} className="bg-white rounded-lg shadow p-6">
            <div className="h-6 bg-gray-200 rounded w-1/2 mb-4"></div>
            <div className="h-8 bg-gray-200 rounded w-1/3"></div>
          </div>
        ))}
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {[1, 2, 3, 4, 5, 6].map((i) => (
          <div key={i} className="bg-white rounded-lg shadow p-6">
            <div className="h-6 bg-gray-200 rounded w-3/4 mb-4"></div>
            <div className="h-4 bg-gray-200 rounded w-full mb-2"></div>
            <div className="h-4 bg-gray-200 rounded w-2/3"></div>
          </div>
        ))}
      </div>
    </div>
  );
}

async function SearchResults({ query }: { query?: string | null }) {
  const apis = await getApis(query);

  return (
    <div className="animate-fadeIn">
      {/* 统计概览 */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
        <div className="bg-white rounded-lg shadow p-6 hover:shadow-lg transition-shadow duration-300 transform hover:-translate-y-1">
          <h3 className="text-lg font-medium text-gray-900 flex items-center">
            <span className="w-2 h-2 bg-primary-500 rounded-full mr-2"></span>
            总接口数
          </h3>
          <p className="mt-2 text-3xl font-semibold text-primary-600">{apis.length}</p>
        </div>
        <div className="bg-white rounded-lg shadow p-6 hover:shadow-lg transition-shadow duration-300 transform hover:-translate-y-1">
          <h3 className="text-lg font-medium text-gray-900 flex items-center">
            <span className="w-2 h-2 bg-primary-500 rounded-full mr-2"></span>
            总调用次数
          </h3>
          <p className="mt-2 text-3xl font-semibold text-primary-600">
            {apis.reduce((acc, api) => acc + api.totalCalls, 0)}
          </p>
        </div>
        <div className="bg-white rounded-lg shadow p-6 hover:shadow-lg transition-shadow duration-300 transform hover:-translate-y-1">
          <h3 className="text-lg font-medium text-gray-900 flex items-center">
            <span className="w-2 h-2 bg-primary-500 rounded-full mr-2"></span>
            今日调用次数
          </h3>
          <p className="mt-2 text-3xl font-semibold text-primary-600">
            {apis.reduce((acc, api) => acc + api.todayCalls, 0)}
          </p>
        </div>
      </div>

      {/* API 列表 */}
      <div>
        <h2 className="text-xl font-bold text-gray-900 mb-6 flex items-center">
          <span className="w-1 h-6 bg-primary-500 rounded mr-3"></span>
          可用接口 {query ? `(搜索: ${query})` : ''}
        </h2>
        {apis.length === 0 ? (
          <div className="text-center py-12">
            <div className="inline-block p-4 rounded-full bg-gray-50 mb-4">
              <svg className="w-8 h-8 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </div>
            <p className="text-gray-500">没有找到匹配的 API</p>
            <p className="text-sm text-gray-400 mt-2">试试其他搜索关键词</p>
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
    </div>
  );
}

export default async function Home({
  searchParams,
}: {
  searchParams: { [key: string]: string | string[] | undefined }
}) {
  // 使用 await 来访问 searchParams
  const params = await searchParams
  const q = typeof params.q === 'string' ? params.q : undefined;

  return (
    <div className="py-8 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-2xl font-bold text-gray-900 relative">
            API 服务概览
            <span className="absolute bottom-0 left-0 w-1/3 h-1 bg-primary-500 rounded-full"></span>
          </h1>
          <ApiSearch />
        </div>

        <Suspense fallback={<LoadingSkeleton />}>
          {/* @ts-expect-error Async Server Component */}
          <SearchResults query={q} />
        </Suspense>
      </div>
    </div>
  );
}