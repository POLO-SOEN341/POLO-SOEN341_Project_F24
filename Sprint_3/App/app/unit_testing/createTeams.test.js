import React from 'react';
import { render, fireEvent, screen, waitFor } from '@testing-library/react';
import { SessionProvider } from 'next-auth/react';
import createMockRouter from 'next-router-mock';
import App from '../create_teams/page.js';
import { RouterContext } from 'next/dist/shared/lib/router-context'; // Correct import for Next.js router context


const mockRouter = createMockRouter();
const mockSession = { user: { name: 'Test User', email: 'test@example.com' }, expires: '2024-11-10T12:00:00.000Z' };


describe('Create Team Flow', () => {
  test('should show error if team name is invalid', async () => {
    render(
      <SessionProvider session={mockSession}>
        <RouterContext.Provider value={mockRouter}>
          <App />
        </RouterContext.Provider>
      </SessionProvider>
    );


    // Wait for student list to load
    await waitFor(() => screen.getByText('All Students'));


    // Simulate selecting students
    fireEvent.click(screen.getByText('Student One'));
    fireEvent.click(screen.getByText('Student Two'));


    // Simulate entering an invalid team name
    const teamNameInput = screen.getByPlaceholderText('Write Team Name (URL-safe)...');
    fireEvent.change(teamNameInput, { target: { value: 'invalid team name!' } });


    // Ensure the 'Create Team' button is disabled due to invalid team name
    const createButton = screen.getByText('Create Team');
    expect(createButton).toBeDisabled();
  });


  test('should show error if not enough students are selected', async () => {
    render(
      <SessionProvider session={mockSession}>
        <RouterContext.Provider value={mockRouter}>
          <App />
        </RouterContext.Provider>
      </SessionProvider>
    );


    // Wait for student list to load
    await waitFor(() => screen.getByText('All Students'));


    // Simulate entering a team name without selecting enough students
    const teamNameInput = screen.getByPlaceholderText('Write Team Name (URL-safe)...');
    fireEvent.change(teamNameInput, { target: { value: 'team-123' } });


    // Ensure the 'Create Team' button is disabled due to not enough students selected
    const createButton = screen.getByText('Create Team');
    expect(createButton).toBeDisabled();
  });
});
