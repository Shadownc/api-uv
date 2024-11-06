import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function main() {
  // 清除现有数据
  await prisma.apiCall.deleteMany()
  await prisma.parameter.deleteMany()
  await prisma.response.deleteMany()
  await prisma.example.deleteMany()
  await prisma.api.deleteMany()

  // 创建测试 API
  const bingApi = await prisma.api.create({
    data: {
      name: 'Bing每日图片API',
      description: '获取必应每日壁纸',
      endpoint: 'https://api.example.com/api/bing',
      method: 'GET',
      status: 'normal',
      returnType: 'IMG/JSON',
      
      // 创建请求参数
      parameters: {
        create: [
          {
            name: 'type',
            required: false,
            description: 'JSON输出:json'
          },
          {
            name: 'rand',
            required: false,
            description: '随机输出:sj'
          },
          {
            name: 'size',
            required: false,
            description: '图片尺寸'
          }
        ]
      },
      
      // 创建返回参数
      responses: {
        create: [
          {
            name: 'success',
            required: true,
            description: '成功: true, 失败: false'
          },
          {
            name: 'message',
            required: true,
            description: '返回状态描述信息'
          }
        ]
      },
      
      // 创建示例
      examples: {
        create: [
          {
            type: 'base_url',
            content: 'https://api.example.com/api/bing'
          },
          {
            type: 'json_url',
            content: 'https://api.example.com/api/bing?type=json'
          },
          {
            type: 'random_url',
            content: 'https://api.example.com/api/bing?type=json&rand=sj'
          }
        ]
      }
    }
  })

  // 创建调用记录
  const now = new Date()
  const calls = []
  
  // 创建过去 30 天的随机调用记录
  for (let i = 0; i < 30; i++) {
    const date = new Date(now)
    date.setDate(date.getDate() - i)
    
    const randomCalls = Math.floor(Math.random() * 20) + 1
    
    for (let j = 0; j < randomCalls; j++) {
      calls.push({
        apiId: bingApi.id,
        timestamp: new Date(
          date.getTime() + Math.floor(Math.random() * 24 * 60 * 60 * 1000)
        )
      })
    }
  }

  await prisma.apiCall.createMany({
    data: calls
  })

  console.log({
    message: '测试数据添加成功',
    api: bingApi.id,
    callsCount: calls.length
  })
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })