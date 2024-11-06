import { prisma } from '@/lib/prisma';
import { notFound } from 'next/navigation';
import LineChart from '@/components/LineChart';
import CopyButton from '@/components/CopyButton';

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
  const api = await getApiDetails(params.id);
  
  if (!api) {
    notFound();
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* 面包屑导航 */}
      <nav className="mb-8">
        <ol className="flex items-center space-x-2 text-sm text-gray-500">
          <li><a href="/" className="hover:text-primary-600">首页</a></li>
          <li>/</li>
          <li><a href="/api" className="hover:text-primary-600">API</a></li>
          <li>/</li>
          <li className="text-gray-900">详情</li>
        </ol>
      </nav>

      <div className="bg-white rounded-lg shadow-sm overflow-hidden">
        {/* API 基本信息 */}
        <div className="px-6 py-8 border-b border-gray-200">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">{api.name}</h1>
          <p className="text-gray-600 mb-6">{api.description}</p>
          <div className="flex items-center space-x-4">
            <span className={`px-3 py-1 rounded-full text-xs font-medium ${
              api.status === 'normal' 
                ? 'bg-green-100 text-green-800' 
                : 'bg-red-100 text-red-800'
            }`}>
              {api.status === 'normal' ? '正常运行' : '异常'}
            </span>
            <span className="text-sm text-gray-500">
              更新时间：{new Date(api.updatedAt).toLocaleDateString()}
            </span>
          </div>
        </div>

        {/* API 详细信息 */}
        <div className="px-6 py-8 space-y-8">
          {/* 接口地址 */}
          <div>
            <h3 className="text-lg font-medium text-gray-900 mb-4">接口地址</h3>
            <div className="flex items-center bg-gray-50 rounded-lg p-4">
              <code className="text-sm text-gray-600 flex-1">
                {api.endpoint}
              </code>
              <CopyButton text={`https://api.example.com/api/${params.id}`} />
            </div>
          </div>

          {/* 请求参数 */}
          <div>
            <h3 className="text-lg font-medium text-gray-900 mb-4">请求参数</h3>
            <div className="bg-gray-50 rounded-lg overflow-hidden">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-100">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">参数名</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">必填</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">说明</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {api.parameters.map(param => (
                    <tr key={param.id}>
                      <td className="px-6 py-4 text-sm text-gray-900">{param.name}</td>
                      <td className="px-6 py-4 text-sm text-gray-600">{param.required ? '是' : '否'}</td>
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
                      id: params.id,
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
                    id: params.id,
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