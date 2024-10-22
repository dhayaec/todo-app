'use client';
import { useEffect, useRef, useState } from 'react';

interface Todo {
  id: number;
  title: string;
  completed: boolean;
}

const TodoApp = () => {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [filter, setFilter] = useState<'all' | 'completed' | 'pending'>('all');
  const [newTodo, setNewTodo] = useState('');
  const [editingTodoId, setEditingTodoId] = useState<number | null>(null);
  const [editedTitle, setEditedTitle] = useState('');

  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    fetchTodos();
  }, []);

  const fetchTodos = async () => {
    const res = await fetch('/api/todos');
    const data: Todo[] = await res.json();
    setTodos(data);
  };

  const addTodo = async () => {
    if (!newTodo) return;
    const res = await fetch('/api/todos', {
      method: 'POST',
      body: JSON.stringify({ title: newTodo }),
    });
    const data = await res.json();
    setTodos([data, ...todos]);
    setNewTodo('');
    if (inputRef.current) {
      inputRef.current.focus();
    }
  };

  const toggleTodo = async (id: number, completed: boolean) => {
    await fetch('/api/todos', {
      method: 'PUT',
      body: JSON.stringify({ id, completed }),
    });
    setTodos(
      todos.map((todo) => (todo.id === id ? { ...todo, completed } : todo))
    );
  };

  const startEditing = (id: number, currentTitle: string) => {
    setEditingTodoId(id);
    setEditedTitle(currentTitle);
  };

  const saveEdit = async (id: number) => {
    await fetch('/api/todos', {
      method: 'PUT',
      body: JSON.stringify({ id, title: editedTitle }),
    });
    setTodos(
      todos.map((todo) =>
        todo.id === id ? { ...todo, title: editedTitle } : todo
      )
    );
    setEditingTodoId(null);
    setEditedTitle('');
  };

  const cancelEdit = () => {
    setEditingTodoId(null);
    setEditedTitle('');
  };

  const deleteTodo = async (id: number) => {
    await fetch('/api/todos', {
      method: 'DELETE',
      body: JSON.stringify({ id }),
    });
    setTodos(todos.filter((todo) => todo.id !== id));
  };

  const filteredTodos = todos.filter((todo) =>
    filter === 'all'
      ? true
      : filter === 'completed'
      ? todo.completed
      : !todo.completed
  );

  return (
    <div className="max-w-lg mx-auto p-4">
      <div className="flex gap-2">
        <button onClick={() => setFilter('all')}>All</button>
        <button onClick={() => setFilter('completed')}>Completed</button>
        <button onClick={() => setFilter('pending')}>Pending</button>
      </div>

      <div className="my-4">
        <input
          className="border p-2 w-full"
          value={newTodo}
          onChange={(e) => setNewTodo(e.target.value)}
          placeholder="New Todo"
          autoFocus
          ref={inputRef}
        />
        <button
          onClick={addTodo}
          className="bg-blue-500 text-white p-2 mt-2 w-full"
        >
          Add Todo
        </button>
      </div>

      <ul className="list-none">
        {filteredTodos.map((todo) => (
          <li
            key={todo.id}
            className="flex justify-between items-center my-2 cursor-pointer"
          >
            {editingTodoId === todo.id ? (
              <div className="flex items-center">
                <input
                  className="border p-2"
                  value={editedTitle}
                  onChange={(e) => setEditedTitle(e.target.value)}
                />
                <button
                  className="bg-green-500 text-white p-2 ml-2"
                  onClick={() => saveEdit(todo.id)}
                >
                  Save
                </button>
                <button
                  className="bg-gray-500 text-white p-2 ml-2"
                  onClick={cancelEdit}
                >
                  Cancel
                </button>
              </div>
            ) : (
              <div className="flex items-center justify-between w-full">
                <div className="flex items-center">
                  <input
                    type="checkbox"
                    checked={todo.completed}
                    onChange={() => toggleTodo(todo.id, !todo.completed)}
                  />
                  <span
                    className={`ml-2 ${todo.completed ? 'line-through' : ''}`}
                    onClick={() => toggleTodo(todo.id, !todo.completed)}
                  >
                    {todo.title}
                  </span>
                </div>
                <div className="flex items-center">
                  <button
                    className="bg-yellow-500 text-white p-2 ml-2"
                    onClick={() => startEditing(todo.id, todo.title)}
                  >
                    Edit
                  </button>
                  <button
                    className="bg-red-500 text-white p-2 ml-2"
                    onClick={() => deleteTodo(todo.id)}
                  >
                    Delete
                  </button>
                </div>
              </div>
            )}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default TodoApp;
