import { NextRequest } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function GET(request: NextRequest) {
  try {
    // 检查API是否存在
    let api = await prisma.api.findFirst({
      where: {
        endpoint: '/api/weather'
      }
    })

    // 如果API不存在，创建它
    if (!api) {
      // 先创建 API
      api = await prisma.api.create({
        data: {
          name: '天气查询',
          description: '根据城市名称查询实时天气信息，支持全国主要城市',
          endpoint: '/api/weather',
          method: 'GET',
          status: 'normal',
          returnType: 'json',
        }
      })

      // 再创建参数
      await prisma.parameter.create({
        data: {
          name: 'dq',
          description: '城市名称，如：金华市',
          required: true,
          apiId: api.id
        }
      })
    }

    const searchParams = request.nextUrl.searchParams
    const dq = searchParams.get('dq')

    if (!dq) {
      return Response.json({ error: '请提供地区参数 dq' }, { status: 400 })
    }

    const apiKey = process.env.WEATHER_API_KEY
    if (!apiKey) {
      return Response.json({ error: '未配置 WEATHER_API_KEY' }, { status: 500 })
    }

    const encodedDq = encodeURIComponent(dq)
    const url = `https://api.weatherapi.com/v1/current.json?key=${apiKey}&q=${encodedDq}&aqi=yes`

    const response = await fetch(url)
    if (!response.ok) {
      return Response.json({ error: '天气 API 请求失败' }, { status: response.status })
    }

    const data = await response.json()

    // 只记录 API ID
    await prisma.apiCall.create({
      data: {
        apiId: api.id,
      }
    })

    return Response.json(data)
  } catch (error) {
    console.error('Weather API Error:', error)
    return Response.json({ error: '服务器内部错误' }, { status: 500 })
  }
}