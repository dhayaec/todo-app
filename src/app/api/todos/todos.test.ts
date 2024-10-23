import { createMocks } from 'node-mocks-http';
import prismaMock from '../../../../__mocks__/db'; // Mock Prisma client
import todosHandler from './route'; // API route handler

// Mock Prisma client
jest.mock('@/lib/db', () => ({
  __esModule: true,
  default: prismaMock,
}));

describe('API Route /api/todos', () => {
  afterEach(() => {
    jest.clearAllMocks(); // Clear mocks after each test
  });

  it('should fetch all todos', async () => {
    prismaMock.todo.findMany.mockResolvedValue([
      { id: 1, title: 'Test Todo 1', completed: false },
      { id: 2, title: 'Test Todo 2', completed: true },
    ]);

    const { req, res } = createMocks({
      method: 'GET',
    });

    await todosHandler(req, res);

    expect(prismaMock.todo.findMany).toHaveBeenCalledTimes(1);
    expect(res._getStatusCode()).toBe(200);
    expect(JSON.parse(res._getData())).toEqual([
      { id: 1, title: 'Test Todo 1', completed: false },
      { id: 2, title: 'Test Todo 2', completed: true },
    ]);
  });

  it('should handle errors when fetching todos', async () => {
    prismaMock.todo.findMany.mockRejectedValue(new Error('Database error'));

    const { req, res } = createMocks({
      method: 'GET',
    });

    await todosHandler(req, res);

    expect(prismaMock.todo.findMany).toHaveBeenCalledTimes(1);
    expect(res._getStatusCode()).toBe(500);
    expect(JSON.parse(res._getData()).error).toBe('Failed to fetch todos');
  });

  it('should create a new todo', async () => {
    prismaMock.todo.create.mockResolvedValue({
      id: 3,
      title: 'New Todo',
      completed: false,
    });

    const { req, res } = createMocks({
      method: 'POST',
      body: { title: 'New Todo' },
    });

    await todosHandler(req, res);

    expect(prismaMock.todo.create).toHaveBeenCalledWith({
      data: { title: 'New Todo', completed: false },
    });
    expect(res._getStatusCode()).toBe(201);
    expect(JSON.parse(res._getData())).toEqual({
      id: 3,
      title: 'New Todo',
      completed: false,
    });
  });

  it('should return error when creating a todo with no title', async () => {
    const { req, res } = createMocks({
      method: 'POST',
      body: {},
    });

    await todosHandler(req, res);

    expect(res._getStatusCode()).toBe(400);
    expect(JSON.parse(res._getData()).error).toBe('Please enter a text');
  });

  it('should update a todo', async () => {
    prismaMock.todo.update.mockResolvedValue({
      id: 1,
      title: 'Updated Todo',
      completed: true,
    });

    const { req, res } = createMocks({
      method: 'PUT',
      body: { id: 1, completed: true, title: 'Updated Todo' },
    });

    await todosHandler(req, res);

    expect(prismaMock.todo.update).toHaveBeenCalledWith({
      where: { id: 1 },
      data: { completed: true, title: 'Updated Todo' },
    });
    expect(res._getStatusCode()).toBe(200);
    expect(JSON.parse(res._getData())).toEqual({
      id: 1,
      title: 'Updated Todo',
      completed: true,
    });
  });

  it('should return error when updating a todo with no id', async () => {
    const { req, res } = createMocks({
      method: 'PUT',
      body: {},
    });

    await todosHandler(req, res);

    expect(res._getStatusCode()).toBe(400);
    expect(JSON.parse(res._getData()).error).toBe('ID is required');
  });

  it('should delete a todo', async () => {
    const { req, res } = createMocks({
      method: 'DELETE',
      body: { id: 1 },
    });

    await todosHandler(req, res);

    expect(prismaMock.todo.delete).toHaveBeenCalledWith({ where: { id: 1 } });
    expect(res._getStatusCode()).toBe(200);
    expect(JSON.parse(res._getData())).toEqual({ success: true });
  });

  it('should return error when deleting a todo with no id', async () => {
    const { req, res } = createMocks({
      method: 'DELETE',
      body: {},
    });

    await todosHandler(req, res);

    expect(res._getStatusCode()).toBe(400);
    expect(JSON.parse(res._getData()).error).toBe('ID is required');
  });

  it('should handle errors when deleting a todo', async () => {
    prismaMock.todo.delete.mockRejectedValue(new Error('Database error'));

    const { req, res } = createMocks({
      method: 'DELETE',
      body: { id: 1 },
    });

    await todosHandler(req, res);

    expect(res._getStatusCode()).toBe(500);
    expect(JSON.parse(res._getData()).error).toBe('Failed to delete todo');
  });
});
