"use client";
import React from "react";
import { render, screen } from '@testing-library/react';
import Team from '../components/Team';
import userEvent from '@testing-library/user-event';
import '@testing-library/jest-dom';


jest.mock('next/router', () => ({
  useRouter: jest.fn(),
}));


jest.mock('next/link', () => {
  return ({ children }) => {
    return children; 
  };
});

describe('Team Component', () => {
  test('navigates to evaluate page when student link is clicked', async () => {
    const team = { name: 'Team A', students: ['Alice', 'Bob'] };
    const role = 'student';
    const instructor = 'Instructor1';

    render(<Team team={team} role={role} instructor={instructor} />);

    const studentLink = screen.getByText('Alice');
    expect(studentLink).toBeInTheDocument();

    await userEvent.click(studentLink);

   
  });
});
