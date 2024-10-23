import RootLayout from '@/app/layout'; // Adjust the import path accordingly
import { render, screen } from '@testing-library/react';

describe('RootLayout Component', () => {
  it('should render children within the body', () => {
    render(
      <RootLayout>
        <div>Test Child</div>
      </RootLayout>
    );

    // Check if the child component is rendered
    expect(screen.getByText('Test Child')).toBeInTheDocument();
  });

  it('should have the correct HTML structure', () => {
    const { container } = render(
      <RootLayout>
        <div>Another Child</div>
      </RootLayout>
    );

    // Check for the <html> and <body> elements
    const htmlElement = container.querySelector('html');
    const bodyElement = container.querySelector('body');

    expect(htmlElement).toBeInTheDocument();
    expect(bodyElement).toBeInTheDocument();
  });
});
