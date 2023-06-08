import { NextResponse, NextRequest } from 'next/server';
import { prisma } from '../../../../prisma/client';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '../../auth/[...nextauth]/route';

export async function POST(
  request: Request,
  {
    params,
  }: {
    params: { id: string };
  }
) {
  const postId = params.id;

  // Check if the user is logged in
  const session = await getServerSession(authOptions);
  if (!session) {
    return NextResponse.json({ error: 'You need to log in' }, { status: 401 });
  }

  try {
    // Get the user's email address
    const userEmail = session?.user?.email;

    if (userEmail) {
      const user = await prisma.user.findUnique({
        where: {
          email: userEmail,
        },
        include: {
          likes: true,
        },
      });
      //check if he already liked this post
      if (user?.likes.find(like => like.postId === postId)) {
        return NextResponse.json(
          { error: 'You already liked this post' },
          { status: 401 }
        );
      }

      // Create a new post
      if (user) {
        const data = await prisma.like.create({
          data: {
            postId,
            userId: user.id,
          },
        });
        // Return the new post
        return NextResponse.json(data, { status: 201 });
      }
    }
  } catch (error) {}
}

export async function DELETE(
  request: Request,
  {
    params,
  }: {
    params: { id: string };
  }
) {
  const postId = params.id;

  // Check if the user is logged in
  const session = await getServerSession(authOptions);
  if (!session) {
    return NextResponse.json({ error: 'You need to log in' }, { status: 401 });
  }

  try {
    // Get the user's email address
    const userEmail = session?.user?.email;

    if (userEmail) {
      const user = await prisma.user.findUnique({
        where: {
          email: userEmail,
        },
        include: {
          likes: true,
        },
      });

      // Create a new post
      if (user) {
        const data = await prisma.like.deleteMany({
          where: {
            userId: user.id,
          },
        });

        // Return the new post
        return NextResponse.json({ status: 204 });
      }
    }
  } catch (error) {}
}
