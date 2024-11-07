import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET(request: Request) {
  try {
    // 查找或创建 API 记录
    let api = await prisma.api.findFirst({
      where: {
        endpoint: '/api/hitokoto'
      }
    });

    // 如果 API 不存在，自动创建
    if (!api) {
      api = await prisma.api.create({
        data: {
          name: "每日一言",
          description: "随机返回一句名言名句",
          endpoint: "/api/hitokoto",
          method: "GET",
          status: "normal",
          returnType: "JSON"
        }
      });
      console.log('Created new API:', api.name);
    }

    // 调用外部接口
    const response = await fetch('https://v1.hitokoto.cn/');
    const data = await response.json();

    // 记录调用日志
    await prisma.apiCall.create({
      data: {
        apiId: api.id,
        timestamp: new Date()
      }
    });

    // 格式化返回数据
    return NextResponse.json({
      code: 0,
      message: 'success',
      data: {
        content: data.hitokoto,
        from: data.from,
        author: data.from_who,
        type: data.type
      }
    });
  } catch (error) {
    console.error('Error in hitokoto API:', error);
    return NextResponse.json(
      { error: 'Internal Server Error' },
      { status: 500 }
    );
  }
} 