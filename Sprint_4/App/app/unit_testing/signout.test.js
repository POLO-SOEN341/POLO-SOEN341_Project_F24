import React from 'react';  
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import SignOutButton from '../components/Disconnect.js';
import { signOut } from 'next-auth/react/index.js';

jest.mock('next-auth/react');

describe('SignOutButton', () => {
  test('renders the sign out button and triggers signOut when clicked', () => {
    signOut.mockImplementation(() => {});

    render(<SignOutButton />);
    const button = screen.getByText('Sign Out');
    expect(button).toBeInTheDocument();

    button.click();
    expect(signOut).toHaveBeenCalledTimes(1);
  });
});
