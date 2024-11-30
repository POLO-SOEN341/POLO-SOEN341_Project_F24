import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import Login from '../login/page.js';
import { useRouter } from 'next/navigation.js';
import { signIn } from 'next-auth/react/index.js';

jest.mock('next/navigation', () => ({
  useRouter: jest.fn(),
}));

jest.mock('next-auth/react', () => ({
  signIn: jest.fn(),
}));

describe('Login Component', () => {
  const mockPush = jest.fn();

  beforeEach(() => {
    useRouter.mockReturnValue({ push: mockPush });
    jest.clearAllMocks();
  });

  it('renders login form correctly', () => {
    render(<Login />);

    expect(screen.getByRole('heading', { name: /Login/i })).toBeInTheDocument();
    expect(screen.getByLabelText(/Username/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Password/i)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /Login/i })).toBeInTheDocument();
  });

  it('updates username and password fields', () => {
    render(<Login />);

    const usernameInput = screen.getByLabelText(/Username/i);
    const passwordInput = screen.getByLabelText(/Password/i);

    fireEvent.change(usernameInput, { target: { value: 'testuser' } });
    fireEvent.change(passwordInput, { target: { value: 'password' } });

    expect(usernameInput.value).toBe('testuser');
    expect(passwordInput.value).toBe('password');
  });

  it('displays error message on invalid credentials', async () => {
    signIn.mockResolvedValueOnce({ ok: false });
    render(<Login />);

    const usernameInput = screen.getByLabelText(/Username/i);
    const passwordInput = screen.getByLabelText(/Password/i);
    const loginButton = screen.getByRole('button', { name: /Login/i });

    fireEvent.change(usernameInput, { target: { value: 'wronguser' } });
    fireEvent.change(passwordInput, { target: { value: 'wrongpassword' } });
    fireEvent.click(loginButton);

    const errorMessage = await screen.findByText(/Invalid credentials/i);
    expect(errorMessage).toBeInTheDocument();
  });

  it('redirects to dashboard on successful login', async () => {
    signIn.mockResolvedValueOnce({ ok: true });
    render(<Login />);

    const usernameInput = screen.getByLabelText(/Username/i);
    const passwordInput = screen.getByLabelText(/Password/i);
    const loginButton = screen.getByRole('button', { name: /Login/i });

    fireEvent.change(usernameInput, { target: { value: 'correctuser' } });
    fireEvent.change(passwordInput, { target: { value: 'correctpassword' } });
    fireEvent.click(loginButton);

    await screen.findByRole('button', { name: /Login/i });

    expect(mockPush).toHaveBeenCalledWith('/dashboard');
    expect(mockPush).toHaveBeenCalledTimes(1);
  });
});
