import { render, screen, fireEvent } from '@testing-library/react';
import MyForm from './MyForm';

test('renders MyForm and submits data', () => {
  render(<MyForm />);

  const nameInput = screen.getByPlaceholderText('Name');
  const emailInput = screen.getByPlaceholderText('Email');
  const submitButton = screen.getByText('Submit');

  fireEvent.change(nameInput, { target: { value: 'John Doe' } });
  fireEvent.change(emailInput, { target: { value: 'john@example.com' } });
  fireEvent.click(submitButton);

  expect(nameInput).toHaveValue('John Doe');
  expect(emailInput).toHaveValue('john@example.com');
});
