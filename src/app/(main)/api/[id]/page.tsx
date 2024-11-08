import { prisma } from '@/lib/prisma';
import { notFound } from 'next/navigation';
import LineChart from '@/components/LineChart';
import CopyButton from '@/components/CopyButton';
import Link from 'next/link';

interface Props {
  params: { id: string }
}

async function getApiDetails(id: string) {
  const api = await prisma.api.findUnique({
    where: { id },
    include: {
      parameters: true,
      responses: true,
      examples: true,
      _count: {
        select: { ApiCall: true }
      },
      ApiCall: {
        orderBy: {
          timestamp: 'desc'
        },
        take: 30
      }
    }
  });

  if (!api) return null;

  // 处理调用统计数据
  const callStats = api.ApiCall.reduce((acc, call) => {
    const date = call.timestamp.toISOString().split('T')[0];
    acc[date] = (acc[date] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  const statsData = Object.entries(callStats)
    .sort(([a], [b]) => a.localeCompare(b))
    .map(([date, count]) => ({
      date,
      count
    }));

  return {
    ...api,
    totalCalls: api._count.ApiCall,
    statsData
  };
}

export default async function ApiDetailPage({ params }: Props) {
  // 正确处理异步 params
  const { id } = await params;
  const api = await getApiDetails(id);
  
  if (!api) {
    notFound();
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* 面包屑导航 */}
      <nav className="mb-8">
        <ol className="flex items-center space-x-2 text-sm text-gray-500">
          <li>
            <Link href="/" className="hover:text-primary-600 transition-colors">
              API
            </Link>
          </li>
          <li>/</li>
          <li className="text-gray-900 font-medium">{api.name}</li>
        </ol>
      </nav>

      <div className="bg-white rounded-xl shadow-md overflow-hidden border border-gray-100">
        {/* API 基本信息 */}
        <div className="px-8 py-10 border-b border-gray-100 bg-gradient-to-r from-gray-50 to-white">
          <div className="flex items-center justify-between mb-4">
            <h1 className="text-3xl font-bold text-gray-900">{api.name}</h1>
            <span className={`px-4 py-1.5 rounded-full text-sm font-medium flex items-center ${
              api.status === 'normal' 
                ? 'bg-green-50 text-green-700 border border-green-200' 
                : 'bg-red-50 text-red-700 border border-red-200'
            }`}>
              <span className={`w-2 h-2 rounded-full mr-2 ${
                api.status === 'normal' ? 'bg-green-500' : 'bg-red-500'
              }`}></span>
              {api.status === 'normal' ? '正常运行' : '异常'}
            </span>
          </div>
          <p className="text-gray-600 text-lg mb-6">{api.description}</p>
          <div className="text-sm text-gray-500">
            最后更新：{new Date(api.updatedAt).toLocaleDateString()}
          </div>
        </div>

        {/* API 详细信息 */}
        <div className="px-8 py-10 space-y-10">
          {/* 接口地址 */}
          <div className="bg-gray-50 rounded-xl p-6 border border-gray-100">
            <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
              <svg className="w-5 h-5 mr-2 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
              </svg>
              接口地址
            </h3>
            <div className="flex items-center bg-white rounded-lg p-4 border border-gray-200">
              <code className="text-sm text-gray-700 font-mono flex-1">
                {`${process.env.NEXT_PUBLIC_API_URL || ''}${api.endpoint}`}
              </code>
              <CopyButton text={`${process.env.NEXT_PUBLIC_API_URL || ''}${api.endpoint}`} />
            </div>
          </div>

          {/* 请求参数 */}
          <div>
            <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
              <svg className="w-5 h-5 mr-2 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 7v10c0 2.21 3.582 4 8 4s8-1.79 8-4V7M4 7c0 2.21 3.582 4 8 4s8-1.79 8-4M4 7c0-2.21 3.582-4 8-4s8 1.79 8 4" />
              </svg>
              请求参数
            </h3>
            <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
              <table className="min-w-full divide-y divide-gray-200">
                <thead>
                  <tr className="bg-gray-50">
                    <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">参数名</th>
                    <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">必填</th>
                    <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">说明</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200 bg-white">
                  {api.parameters.map(param => (
                    <tr key={param.id} className="hover:bg-gray-50 transition-colors">
                      <td className="px-6 py-4 text-sm font-medium text-gray-900">{param.name}</td>
                      <td className="px-6 py-4">
                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                          param.required 
                            ? 'bg-blue-100 text-blue-800'
                            : 'bg-gray-100 text-gray-800'
                        }`}>
                          {param.required ? '必填' : '选填'}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-600">{param.description}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* 返回示例 */}
          <div>
            <h3 className="text-lg font-medium text-gray-900 mb-4">返回示例</h3>
            <div className="relative bg-gray-50 rounded-lg p-4">
              <pre className="text-sm text-gray-600 overflow-x-auto">
                <code>
                  {JSON.stringify({
                    code: 0,
                    message: "success",
                    data: {
                      id,
                      name: api.name,
                      description: api.description
                    }
                  }, null, 2)}
                </code>
              </pre>
              <CopyButton 
                text={JSON.stringify({
                  code: 0,
                  message: "success",
                  data: {
                    id,
                    name: api.name,
                    description: api.description
                  }
                }, null, 2)}
                className="absolute top-4 right-4"
              />
            </div>
          </div>

          {/* 调用统计图表 */}
          <div>
            <h3 className="text-lg font-medium text-gray-900 mb-4">调用统计</h3>
            <div className="h-[300px]">
              <LineChart data={api.statsData} />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
} 