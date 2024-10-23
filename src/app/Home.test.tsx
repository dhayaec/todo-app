import '@testing-library/jest-dom'; // Provides custom matchers like 'toBeInTheDocument'
import { render, screen } from '@testing-library/react';
import Home from './page';

// Mock the TodoApp component since it's imported into the Home component
jest.mock('@/components/TodoApp', () => () => (
  <div data-testid="todo-app">Mocked TodoApp</div>
));

describe('Home Page', () => {
  it('renders the title and the TodoApp component', () => {
    // Render the Home component
    render(<Home />);

    // Check if the title is rendered
    const title = screen.getByText('Todo App');
    expect(title).toBeInTheDocument();
    expect(title).toHaveClass('text-4xl');

    // Check if the mocked TodoApp component is rendered
    const todoApp = screen.getByTestId('todo-app');
    expect(todoApp).toBeInTheDocument();
  });
});
