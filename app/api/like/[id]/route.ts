import { NextResponse } from 'next/server';
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
    //find the user
    const user = await prisma.user.findUnique({
      where: {
        email: session?.user?.email ?? '',
      },
    });

    //find the post
    const data = await prisma.post.findUnique({
      where: {
        id: postId,
      },
      include: {
        likes: true,
      },
    });

    if (!data) {
      return NextResponse.json({ error: 'Post not found' }, { status: 404 });
    }

    //check if the user has already liked the post
    if (data.likes.some(like => like.userId === user?.id)) {
      await prisma.like.deleteMany({
        where: {
          postId: postId,
          userId: user?.id,
        },
      });
      return NextResponse.json({ status: 400 });
    } else {
      //and if the user not liked the post
      await prisma.like.create({
        data: {
          postId: postId,
          userId: user?.id ?? '',
        },
      });
      return NextResponse.json({ status: 201 });
    }
  } catch (error) {
    return NextResponse.json({ error: 'An error occurred' }, { status: 500 });
  }
}
