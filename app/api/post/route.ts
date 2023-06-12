import { NextResponse } from 'next/server';
import { prisma } from '../../../prisma/client';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '../auth/[...nextauth]/route';

export async function GET() {
  const data = await prisma.post.findMany({
    orderBy: {
      createdAt: 'desc',
    },
    include: {
      author: true,
      likes: {
        include: {
          post: true,
          user: true,
        },
      },
    },
  });

  return NextResponse.json(data, { status: 200 });
}

export async function POST(request: Request) {
  const { body } = await request.json();

  // Check if the user is logged in
  const session = await getServerSession(authOptions);
  if (!session) {
    return NextResponse.json({ error: 'You need to log in' }, { status: 401 });
  }

  // Check if the message body is empty
  if (!body) {
    return NextResponse.json(
      { error: 'Missing message body ' },
      { status: 400 }
    );
  }

  try {
    // Get the user's email address
    const userEmail = session?.user?.email;
    // Find the user by email address
    if (userEmail) {
      const user = await prisma.user.findUnique({
        where: {
          email: userEmail,
        },
      });
      // Create a new post
      if (user) {
        const data = await prisma.post.create({
          data: {
            body,
            authorId: user?.id,
          },
        });
        // Return the new post
        return NextResponse.json(data, { status: 201 });
      }
    }
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to create post' },
      { status: 400 }
    );
  }
}
