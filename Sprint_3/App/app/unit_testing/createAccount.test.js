import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import Signup from '../signup/page';
import '@testing-library/jest-dom';
import { act } from 'react-dom/test-utils';


// Mocking the fetch API for availability check and signup submission
global.fetch = jest.fn(() =>
  Promise.resolve({
    json: () => Promise.resolve({ usernameAvailable: true, idAvailable: true, message: 'User created successfully!' }),
    ok: true,
  })
);


describe('Signup Page', () => {
  beforeEach(() => {
    render(<Signup />);
  });


  it('should render the signup form', () => {
    expect(screen.getByLabelText(/username/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/student id/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/password/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/full name/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/select role/i)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /sign up/i })).toBeInTheDocument();
  });


  it('should check the availability of username and id on input change', async () => {
    fireEvent.change(screen.getByLabelText(/username/i), { target: { value: 'newuser' } });
    fireEvent.change(screen.getByLabelText(/student id/i), { target: { value: '12345' } });


    // Check for "Checking availability..." messages using findAllByText
    const checkingMessages = await screen.findAllByText(/checking availability/i);
    expect(checkingMessages.length).toBe(2);


    // Wait for "username is available" and "id is available" messages
    await waitFor(() => expect(screen.getByText(/username is available/i)).toBeInTheDocument());
    await waitFor(() => expect(screen.getByText(/id is available/i)).toBeInTheDocument());
  });


  it('should prevent form submission if username or id is taken', async () => {
    global.fetch.mockResolvedValueOnce({
      json: () => Promise.resolve({ usernameAvailable: false, idAvailable: true }),
      ok: true,
    });


    fireEvent.change(screen.getByLabelText(/username/i), { target: { value: 'takenusername' } });
    fireEvent.change(screen.getByLabelText(/student id/i), { target: { value: '12345' } });


    // Wait for "username is taken" message with an increased timeout
    await waitFor(() => expect(screen.getByText(/username is taken/i)).toBeInTheDocument(), { timeout: 3000 });


    // Ensure the submit button remains disabled
    const submitButton = screen.getByRole('button', { name: /sign up/i });
    expect(submitButton).toBeDisabled();
  });


  it('should submit the form when all fields are valid', async () => {
    global.fetch.mockResolvedValueOnce({
      json: () => Promise.resolve({ usernameAvailable: true, idAvailable: true, message: 'User created successfully!' }),
      ok: true,
    });


    fireEvent.change(screen.getByLabelText(/username/i), { target: { value: 'newuser' } });
    fireEvent.change(screen.getByLabelText(/student id/i), { target: { value: '12345' } });
    fireEvent.change(screen.getByLabelText(/password/i), { target: { value: 'password123' } });
    fireEvent.change(screen.getByLabelText(/full name/i), { target: { value: 'John Doe' } });


    fireEvent.click(screen.getByRole('button', { name: /sign up/i }));


    await waitFor(() => {
      expect(screen.getByText(/User created successfully!/i)).toBeInTheDocument();
    });
  });


  it('should display an error message if there is an issue during form submission', async () => {
    global.fetch.mockResolvedValueOnce({
      json: () => Promise.resolve({ message: 'Error occurred during signup' }),
      ok: false,
    });


    fireEvent.change(screen.getByLabelText(/username/i), { target: { value: 'newuser' } });
    fireEvent.change(screen.getByLabelText(/student id/i), { target: { value: '12345' } });
    fireEvent.change(screen.getByLabelText(/password/i), { target: { value: 'password123' } });
    fireEvent.change(screen.getByLabelText(/full name/i), { target: { value: 'John Doe' } });


    fireEvent.click(screen.getByRole('button', { name: /sign up/i }));


    await waitFor(() => {
      expect(screen.getByText(/Error occurred during signup/i)).toBeInTheDocument();
    });
  });
});
