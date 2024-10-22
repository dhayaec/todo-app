import prisma from '@/lib/db';
import { NextResponse } from 'next/server';

export async function GET() {
  const todos = await prisma.todo.findMany({
    orderBy: {
      createdAt: 'desc',
    },
  });
  return NextResponse.json(todos);
}

export async function POST(request: Request) {
  const { title } = await request.json();
  if (!title) return NextResponse.json({ error: 'Please enter a text' });

  const todo = await prisma.todo.create({
    data: { title, completed: false },
  });
  return NextResponse.json(todo);
}

export async function PUT(request: Request) {
  const { id, completed, title } = await request.json();

  const updateData: { completed?: boolean; title?: string } = {};
  if (completed !== undefined) updateData.completed = completed;
  if (title !== undefined) updateData.title = title;

  const todo = await prisma.todo.update({
    where: { id },
    data: updateData,
  });

  return NextResponse.json(todo);
}

export async function DELETE(request: Request) {
  const { id } = await request.json();
  await prisma.todo.delete({ where: { id } });
  return NextResponse.json({ success: true });
}
