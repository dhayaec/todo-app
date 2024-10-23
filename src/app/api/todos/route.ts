import prisma from '@/lib/db'; // Adjust based on your Prisma client path
import { NextApiRequest, NextApiResponse } from 'next';

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  switch (req.method) {
    case 'GET':
      return getTodos(req, res);
    case 'POST':
      return createTodo(req, res);
    case 'PUT':
      return updateTodo(req, res);
    case 'DELETE':
      return deleteTodo(req, res);
    default:
      res.setHeader('Allow', ['GET', 'POST', 'PUT', 'DELETE']);
      return res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}

const getTodos = async (req: NextApiRequest, res: NextApiResponse) => {
  try {
    const todos = await prisma.todo.findMany({
      orderBy: {
        createdAt: 'desc',
      },
    });
    return res.status(200).json(todos);
  } catch (error) {
    return res.status(500).json({ error: 'Failed to fetch todos' });
  }
};

const createTodo = async (req: NextApiRequest, res: NextApiResponse) => {
  try {
    const { title } = req.body;
    if (!title) {
      return res.status(400).json({ error: 'Please enter a text' });
    }

    const todo = await prisma.todo.create({
      data: { title, completed: false },
    });
    return res.status(201).json(todo);
  } catch (error) {
    return res.status(500).json({ error: 'Failed to create todo' });
  }
};

const updateTodo = async (req: NextApiRequest, res: NextApiResponse) => {
  try {
    const { id, completed, title } = req.body;

    if (!id) {
      return res.status(400).json({ error: 'ID is required' });
    }

    const updateData: { completed?: boolean; title?: string } = {};
    if (completed !== undefined) updateData.completed = completed;
    if (title !== undefined) updateData.title = title;

    const todo = await prisma.todo.update({
      where: { id },
      data: updateData,
    });

    return res.status(200).json(todo);
  } catch (error) {
    return res.status(500).json({ error: 'Failed to update todo' });
  }
};

const deleteTodo = async (req: NextApiRequest, res: NextApiResponse) => {
  try {
    const { id } = req.body;

    if (!id) {
      return res.status(400).json({ error: 'ID is required' });
    }

    await prisma.todo.delete({ where: { id } });
    return res.status(200).json({ success: true });
  } catch (error) {
    return res.status(500).json({ error: 'Failed to delete todo' });
  }
};
