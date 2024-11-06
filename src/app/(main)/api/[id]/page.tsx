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
    <div className="py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* API 基本信息卡片 */}
        <div className="bg-white rounded-xl shadow-sm overflow-hidden">
          {/* 头部信息 */}
          <div className="p-6 border-b border-gray-100">
            <div className="flex justify-between items-start">
              <div>
                <h1 className="text-2xl font-bold text-gray-900">{api.name}</h1>
                <p className="mt-2 text-gray-600">{api.description}</p>
              </div>
              <span className={`px-3 py-1 text-sm rounded-full ${
                api.status === 'normal' 
                  ? 'bg-success-50 text-success' 
                  : 'bg-red-50 text-red-600'
              }`}>
                {api.status === 'normal' ? '正常' : '异常'}
              </span>
            </div>
          </div>

          {/* 接口信息 */}
          <div className="p-6 bg-gray-50">
            <div className="grid grid-cols-3 gap-6">
              <div>
                <h3 className="text-sm font-medium text-gray-500">请求方式</h3>
                <p className="mt-2 text-sm font-mono bg-white px-3 py-2 rounded border border-gray-200">
                  {api.method}
                </p>
              </div>
              <div>
                <h3 className="text-sm font-medium text-gray-500">返回格式</h3>
                <p className="mt-2 text-sm font-mono bg-white px-3 py-2 rounded border border-gray-200">
                  IMG/JSON
                </p>
              </div>
              <div>
                <h3 className="text-sm font-medium text-gray-500">调用次数</h3>
                <p className="mt-2 text-sm font-semibold text-primary-600">
                  {api.totalCalls.toLocaleString()}
                </p>
              </div>
            </div>
          </div>

          {/* 接口地址 */}
          <div className="p-6 border-t border-gray-100">
            <h2 className="text-lg font-semibold mb-4">接口地址</h2>
            <div className="space-y-4">
              <div>
                <h3 className="text-sm font-medium text-gray-500 mb-2">基础地址</h3>
                <div className="flex items-center bg-gray-50 p-3 rounded-lg">
                  <code className="text-sm font-mono text-gray-800 flex-1">
                    {api.endpoint}
                  </code>
                  <CopyButton text={`https://api.example.com/api/${params.id}`} />
                </div>
              </div>

              <div>
                <h3 className="text-sm font-medium text-gray-500 mb-2">示例地址</h3>
                <div className="flex items-center bg-gray-50 p-3 rounded-lg">
                  <code className="text-sm font-mono text-gray-800 flex-1">
                    {`${api.endpoint}?type=json&rand=sj`}
                  </code>
                  <CopyButton 
                    text={`fetch('https://api.example.com/api/${params.id}')
  .then(response => response.json())
  .then(data => console.log(data));`} 
                  />
                </div>
              </div>
            </div>
          </div>

          {/* 请求参数 */}
          <div className="p-6 border-t border-gray-100">
            <h2 className="text-lg font-semibold mb-4">请求参数</h2>
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      参数名
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      必填
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      说明
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {api.parameters.map(param => (
                    <tr key={param.id}>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-mono text-gray-900">
                        {param.name}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {param.required ? '是' : '否'}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {param.description}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* 返回状态 */}
          <div className="p-6 border-t border-gray-100">
            <h2 className="text-lg font-semibold mb-4">返回状态</h2>
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      参数名
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      必含
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      说明
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  <tr>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-mono text-gray-900">
                      success
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      是
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      成功: true, 失败: false
                    </td>
                  </tr>
                  <tr>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-mono text-gray-900">
                      message
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      是
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      返回状态描述信息
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>

          {/* 调用统计图表 */}
          <div className="p-6 border-t border-gray-100">
            <h2 className="text-lg font-semibold mb-6">调用统计</h2>
            <div className="h-[300px]">
              <LineChart data={api.statsData} />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
} 