import { NextResponse } from 'next/server';
import { prisma } from '@/prisma/client';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';

export async function PATCH(
  request: Request,
  { params: { id } }: { params: { id: string } } // this is where i get the id
) {
  const session = await getServerSession(authOptions);
  const { postBody } = await request.json();

  if (!session) {
    return NextResponse.json({ error: 'You need to log in' }, { status: 401 });
  }

  try {
    await prisma.post.update({
      where: {
        id: id, // Specify the ID of the post you want to update
      },
      data: {
        body: postBody, // Update the body field with the new post body
        // Add other fields you want to update as needed
      },
    });
    return NextResponse.json({ status: 200 });
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to create post' },
      { status: 400 }
    );
  }
}

export async function DELETE(
  request: Request,
  { params: { id } }: { params: { id: string } } // this is where i get the id
) {
  const session = await getServerSession(authOptions);

  if (!session) {
    return NextResponse.json({ error: 'You need to log in' }, { status: 401 });
  }
  try {
    await prisma.post.delete({
      where: {
        id: id,
      },
    });
    return NextResponse.json({ status: 200 });
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to create post' },
      { status: 400 }
    );
  }
}
