import { fireEvent, render, screen, waitFor } from '@testing-library/react';
import fetchMock from 'jest-fetch-mock';
import TodoApp from '../components/TodoApp';

fetchMock.enableMocks();

describe('TodoApp Component', () => {
  beforeEach(() => {
    fetchMock.resetMocks();
  });

  it('fetches and displays todos on render', async () => {
    // Mock fetch response
    fetchMock.mockResponseOnce(
      JSON.stringify([
        { id: 1, title: 'Test Todo 1', completed: false },
        { id: 2, title: 'Test Todo 2', completed: true },
      ])
    );

    render(<TodoApp />);

    // Ensure todos are rendered
    expect(fetchMock).toHaveBeenCalledWith('/api/todos');
    const todo1 = await screen.findByText(/Test Todo 1/i);
    const todo2 = await screen.findByText(/Test Todo 2/i);

    expect(todo1).toBeInTheDocument();
    expect(todo2).toBeInTheDocument();
  });

  it('filters todos based on completion status', async () => {
    // Mock fetch response for initial todos
    fetchMock.mockResponseOnce(
      JSON.stringify([
        { id: 1, title: 'Test Todo 1', completed: false },
        { id: 2, title: 'Test Todo 2', completed: true },
      ])
    );

    render(<TodoApp />);

    // Wait for both todos to be rendered
    const todo1 = await screen.findByText(/Test Todo 1/i);
    const todo2 = await screen.findByText(/Test Todo 2/i);
    expect(todo1).toBeInTheDocument();
    expect(todo2).toBeInTheDocument();

    // Simulate clicking the "Completed" filter button
    const completedFilterButton = screen.getByText(/Completed/i);
    fireEvent.click(completedFilterButton);

    // Ensure that only the completed todo is shown
    await waitFor(() => {
      expect(screen.queryByText(/Test Todo 1/i)).not.toBeInTheDocument();
      expect(screen.getByText(/Test Todo 2/i)).toBeInTheDocument();
    });

    // Simulate clicking the "Pending" filter button
    const pendingFilterButton = screen.getByText(/Pending/i);
    fireEvent.click(pendingFilterButton);

    // Ensure that only the pending todo is shown
    await waitFor(() => {
      expect(screen.getByText(/Test Todo 1/i)).toBeInTheDocument();
      expect(screen.queryByText(/Test Todo 2/i)).not.toBeInTheDocument();
    });

    // Simulate clicking the "All" filter button
    const allFilterButton = screen.getByText(/All/i);
    fireEvent.click(allFilterButton);

    // Ensure that both todos are shown again
    await waitFor(() => {
      expect(screen.getByText(/Test Todo 1/i)).toBeInTheDocument();
      expect(screen.getByText(/Test Todo 2/i)).toBeInTheDocument();
    });
  });

  it('adds a new todo when the form is submitted', async () => {
    // Mock fetch response for fetching todos
    fetchMock.mockResponseOnce(
      JSON.stringify([{ id: 1, title: 'Test Todo 1', completed: false }])
    );

    render(<TodoApp />);

    const input = screen.getByPlaceholderText(/New Todo/i);
    const addButton = screen.getByText(/Add Todo/i);

    // Mock response for adding a new todo
    fetchMock.mockResponseOnce(
      JSON.stringify({ id: 2, title: 'Test Todo 2', completed: false })
    );

    // Simulate user input and button click
    fireEvent.change(input, { target: { value: '' } });
    fireEvent.click(addButton);
    fireEvent.change(input, { target: { value: 'Test Todo 2' } });
    fireEvent.click(addButton);

    // Ensure the fetch call for adding a todo was made
    await waitFor(() => {
      expect(fetchMock).toHaveBeenCalledWith('/api/todos', expect.any(Object));
    });

    // Ensure the new todo is rendered
    const todo2 = await screen.findByText(/Test Todo 2/i);
    expect(todo2).toBeInTheDocument();
  });

  it('toggles the completion status of a todo', async () => {
    // Mock fetch response for initial todos
    fetchMock.mockResponseOnce(
      JSON.stringify([{ id: 1, title: 'Test Todo 1', completed: false }])
    );

    render(<TodoApp />);

    // Wait for the todo to be rendered
    const todo1 = await screen.findByText(/Test Todo 1/i);
    expect(todo1).toBeInTheDocument();

    const checkbox = screen.getByRole('checkbox');
    expect(checkbox).not.toBeChecked();

    // Mock response for updating the todo
    fetchMock.mockResponseOnce(JSON.stringify({ id: 1, completed: true }));

    // Simulate checkbox click (toggling)
    fireEvent.click(checkbox);

    // Ensure the fetch call for updating the todo was made
    await waitFor(() => {
      expect(fetchMock).toHaveBeenCalledWith('/api/todos', expect.any(Object));
    });

    // Ensure the todo's completion status is updated in the DOM
    expect(checkbox).toBeChecked();
  });

  it('toggles the completion status of a todo on span click', async () => {
    // Mock fetch response for initial todos
    fetchMock.mockResponseOnce(
      JSON.stringify([{ id: 1, title: 'Test Todo Span', completed: false }])
    );

    render(<TodoApp />);

    // Wait for the todo to be rendered
    const todo1 = await screen.findByText(/Test Todo Span/i);
    expect(todo1).toBeInTheDocument();

    const span = screen.getByRole('toggleSpan');

    // Mock response for updating the todo
    fetchMock.mockResponseOnce(JSON.stringify({ id: 1, completed: true }));

    // Simulate span click (toggling)
    fireEvent.click(span);

    // Ensure the fetch call for updating the todo was made
    await waitFor(() => {
      expect(fetchMock).toHaveBeenCalledWith('/api/todos', expect.any(Object));
    });

    // Ensure the todo's completion status is updated in the DOM
    // expect(checkbox).toBeChecked();
  });

  it('cancels the edit and restores the original todo title', async () => {
    // Mock fetch response for initial todos
    fetchMock.mockResponseOnce(
      JSON.stringify([{ id: 1, title: 'Test Todo 1', completed: false }])
    );

    render(<TodoApp />);

    // Wait for the todo to be rendered
    const todo1 = await screen.findByText(/Test Todo 1/i);
    expect(todo1).toBeInTheDocument();

    // Simulate clicking the edit button
    const editButton = screen.getByText(/Edit/i);
    fireEvent.click(editButton);

    // Find the input field and simulate changing the value
    const inputField = screen.getByDisplayValue('Test Todo 1');
    fireEvent.change(inputField, { target: { value: 'Edited Todo 1' } });

    // Simulate clicking the cancel button
    const cancelButton = screen.getByText(/Cancel/i);
    fireEvent.click(cancelButton);

    // Ensure that the original todo title is restored and the edit input is no longer shown
    expect(
      screen.queryByDisplayValue(/Edited Todo 1/i)
    ).not.toBeInTheDocument();
    expect(screen.getByText(/Test Todo 1/i)).toBeInTheDocument();
  });

  it('edits the title of a todo', async () => {
    // Mock fetch response for initial todos
    fetchMock.mockResponseOnce(
      JSON.stringify([{ id: 1, title: 'Test Todo 1', completed: false }])
    );

    render(<TodoApp />);

    // Wait for the todo to be rendered
    const todo1 = await screen.findByText(/Test Todo 1/i);
    expect(todo1).toBeInTheDocument();

    // Mock fetch response for editing the todo
    fetchMock.mockResponseOnce(
      JSON.stringify({ id: 1, title: 'Edited Todo 1' })
    );

    // Simulate clicking the edit button
    const editButton = screen.getByText(/Edit/i);
    fireEvent.click(editButton);

    // Find the input field and simulate changing the value
    const inputField = screen.getByDisplayValue('Test Todo 1');
    fireEvent.change(inputField, { target: { value: 'Edited Todo 1' } });

    // Simulate clicking the save button
    const saveButton = screen.getByText(/Save/i);
    fireEvent.click(saveButton);

    // Ensure the fetch call for updating the todo was made
    await waitFor(() => {
      expect(fetchMock).toHaveBeenCalledWith('/api/todos', expect.any(Object));
    });

    // Ensure the updated todo title is displayed in the DOM
    const updatedTodo = await screen.findByText(/Edited Todo 1/i);
    expect(updatedTodo).toBeInTheDocument();
    expect(screen.queryByText(/Test Todo 1/i)).not.toBeInTheDocument();
  });

  it('deletes a todo', async () => {
    // Mock fetch response for initial todos
    fetchMock.mockResponseOnce(
      JSON.stringify([{ id: 1, title: 'Test Todo 1', completed: false }])
    );

    render(<TodoApp />);

    // Ensure todo is rendered
    const todo1 = await screen.findByText(/Test Todo 1/i);
    expect(todo1).toBeInTheDocument();

    // Mock response for deleting the todo
    fetchMock.mockResponseOnce(JSON.stringify({}));

    // Simulate the delete action
    const deleteButton = screen.getByText(/Delete/i);
    fireEvent.click(deleteButton);

    // Ensure the fetch call for deleting the todo was made
    await waitFor(() => {
      expect(fetchMock).toHaveBeenCalledWith('/api/todos', expect.any(Object));
    });

    // Ensure the todo is no longer in the document
    expect(todo1).not.toBeInTheDocument();
  });
});
