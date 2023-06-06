import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '../../../prisma/client';

export async function GET(request: Request) {
  return response.status(200).json('hello');
}

export async function POST(request: Request) {
  const { name } = await request.json();

  try {
    const data = await prisma.post.create({
      data: {
        body: name,
        authorId: '',
      },
    });

    return NextResponse.json(data);
  } catch (error) {
    console.log(error);
    return NextResponse.json({});
  }
}
