import TodoApp from '@/components/TodoApp';

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center">
      <h1 className="text-4xl font-bold">Todo App</h1>
      <TodoApp />
    </main>
  );
}
