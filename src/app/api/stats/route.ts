import { prisma } from '@/lib/prisma';
import { NextResponse } from 'next/server';

export async function GET() {
  try {
    const totalCalls = await prisma.apiCall.count();
    
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    const todayCalls = await prisma.apiCall.count({
      where: {
        timestamp: {
          gte: today
        }
      }
    });

    return NextResponse.json({ totalCalls, todayCalls });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch stats' }, { status: 500 });
  }
} 