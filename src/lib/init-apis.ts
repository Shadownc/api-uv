const { PrismaClient } = require('@prisma/client')
const prisma = new PrismaClient()

const DEFAULT_APIS = [
  {
    name: '每日一言',
    description: '随机返回一句名言名句，数据来源: hitokoto.cn',
    endpoint: '/api/hitokoto',
    method: 'GET',
    status: 'normal',
    returnType: 'json',
  },
  {
    name: '天气查询',
    description: '根据城市名称查询实时天气信息，支持全国主要城市',
    endpoint: '/api/weather',
    method: 'GET',
    status: 'normal',
    returnType: 'json',
    parameters: [
      {
        name: 'dq',
        description: '城市名称，如：金华市',
        required: true,
      }
    ]
  }
]

async function main() {
  try {
    console.log('开始初始化数据...')

    // 初始化 APIs
    for (const apiData of DEFAULT_APIS) {
      const { parameters, ...apiInfo } = apiData
      
      console.log(`创建 API: ${apiInfo.name}`)
      const api = await prisma.api.create({
        data: apiInfo
      })
      
      // 创建参数
      if (parameters) {
        for (const param of parameters) {
          console.log(`为 ${apiInfo.name} 创建参数: ${param.name}`)
          await prisma.parameter.create({
            data: {
              ...param,
              apiId: api.id
            }
          })
        }
      }
    }

    console.log('数据初始化完成！')
  } catch (error) {
    console.error('初始化失败:', error)
    process.exit(1)
  } finally {
    await prisma.$disconnect()
  }
}

main() 