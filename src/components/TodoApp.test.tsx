import TodoApp from '@/components/TodoApp';
import '@testing-library/jest-dom';
import { fireEvent, render, screen } from '@testing-library/react';

describe('TodoApp', () => {
  it('renders todo list and adds a new todo', async () => {
    render(<TodoApp />);
    const input = screen.getByPlaceholderText('New Todo');
    fireEvent.change(input, { target: { value: 'Test Todo' } });
    fireEvent.click(screen.getByText('Add Todo'));
    expect(await screen.findByText('Test Todo')).toBeInTheDocument();
  });
});
