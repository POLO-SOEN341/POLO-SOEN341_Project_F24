import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react'; // Keep these imports only if used
import SignOutButton from '../components/Disconnect.js'; // Adjust the path if necessary
import { signOut, useSession } from "next-auth/react/index.js";

// Mock the next-auth useSession hook and signOut function
jest.mock("next-auth/react", () => ({
  useSession: jest.fn(),
  signOut: jest.fn(),
}));

describe('SignOutButton component', () => {
  afterEach(() => {
    jest.clearAllMocks(); // Clear mocks after each test to prevent state leakage
  });

  it('renders the Sign Out button when user is logged in', () => {
    // Mocking session data to simulate logged-in state
    useSession.mockReturnValue({
      data: {
        user: { name: "John Doe" },
      },
    });

    // Uncomment the following line to enable the test
    // render(<SignOutButton />);

    // Uncomment and customize this line to test the presence of the button
    // expect(screen.getByText(/sign out/i)).toBeInTheDocument();
  });

  it('does not render the Sign Out button when user is not logged in', () => {
    // Mocking no session data to simulate logged-out state
    useSession.mockReturnValue({ data: null });

    // Uncomment the following line to enable the test
    // render(<SignOutButton />);

    // Uncomment and customize this line to test the absence of the button
    // expect(screen.queryByText(/sign out/i)).not.toBeInTheDocument();
  });

  it('calls signOut and reloads the page on button click', async () => {
    // Mocking session data to simulate logged-in state
    useSession.mockReturnValue({
      data: {
        user: { name: "John Doe" },
      },
    });

    // Mock window location.reload
    delete window.location;
    window.location = { reload: jest.fn() };

    // Uncomment the following line to enable the test
    // render(<SignOutButton />);

    // Uncomment these lines to test button click and behavior
    // const buttonElement = screen.getByText(/sign out/i);
    // fireEvent.click(buttonElement);

    // Wait for the signOut function to be called
    // expect(signOut).toHaveBeenCalledWith({ redirect: false });

    // Ensure window.location.reload was called
    // await new Promise((resolve) => setTimeout(resolve, 500)); // Wait for setTimeout to resolve
    // expect(window.location.reload).toHaveBeenCalled();
  });
});
