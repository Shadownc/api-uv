import { prisma } from '@/lib/prisma';
import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  try {
    const data = await request.json();
    
    const api = await prisma.api.create({
      data: {
        name: data.name,
        description: data.description,
        endpoint: data.endpoint,
        method: data.method,
        returnType: data.returnType,
        parameters: {
          create: data.parameters
        },
        responses: {
          create: data.responses
        },
        examples: {
          create: data.examples
        }
      }
    });

    return NextResponse.json(api);
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to create API' },
      { status: 500 }
    );
  }
}

export async function PUT(request: Request) {
  try {
    const data = await request.json();
    
    const api = await prisma.api.update({
      where: { id: data.id },
      data: {
        name: data.name,
        description: data.description,
        endpoint: data.endpoint,
        method: data.method,
        returnType: data.returnType,
        parameters: {
          deleteMany: {},
          create: data.parameters
        },
        responses: {
          deleteMany: {},
          create: data.responses
        },
        examples: {
          deleteMany: {},
          create: data.examples
        }
      }
    });

    return NextResponse.json(api);
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to update API' },
      { status: 500 }
    );
  }
}

export async function DELETE(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');
    
    if (!id) {
      return NextResponse.json(
        { error: 'API ID is required' },
        { status: 400 }
      );
    }

    await prisma.api.delete({
      where: { id }
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to delete API' },
      { status: 500 }
    );
  }
} 