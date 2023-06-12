import { NextResponse } from 'next/server';
import { prisma } from '../../../prisma/client';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '../auth/[...nextauth]/route';

export async function GET() {
  const session = await getServerSession(authOptions);

  if (!session) {
    return NextResponse.json({ error: 'You need to log in' }, { status: 401 });
  }

  try {
    const data = await prisma.user.findUnique({
      where: {
        email: session?.user?.email as string,
      },
      include: {
        posts: {
          include: {
            author: true,
            likes: {
              include: {
                user: true,
              },
            },
          },
          orderBy: {
            createdAt: 'desc',
          },
        },
      },
    });

    if (!data) {
      return NextResponse.json(
        { error: 'You need to log in' },
        { status: 401 }
      );
    }

    return NextResponse.json(data, { status: 200 });
  } catch (error) {
    return NextResponse.json({ error: 'An error occurred' }, { status: 500 });
  }
}
