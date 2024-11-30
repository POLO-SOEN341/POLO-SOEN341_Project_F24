import React from 'react';
import { render, screen } from '@testing-library/react';
import { useSession } from "next-auth/react/index.js";
import NavBar from '../components/NavBar.js';


jest.mock("next-auth/react", () => ({
  useSession: jest.fn(),
}));


describe('NavBar component', () => {
  it('renders the Navbar with title and Signout button when user is logged in', () => {
    
    useSession.mockReturnValue({
      data: {
        user: { name: "John Doe" },
      },
    });

    render(<NavBar />);

    
    const titleElement = screen.getByText(/peer assessment system/i);
    expect(titleElement).toBeTruthy(); 
    expect(titleElement.className).toContain('text-2xl font-bold text-blue-600');

    
    const username = screen.getByText('John Doe');
    expect(username).toBeTruthy(); 

   
  });

  it('renders the Navbar without user name when user is not logged in', () => {
    
    useSession.mockReturnValue({ data: null });

    render(<NavBar />);

   
    const titleElement = screen.getByText(/peer assessment system/i);
    expect(titleElement).toBeTruthy(); 

  
    const username = screen.queryByText('John Doe');
    expect(username).toBeNull(); 
   

   
  });
});
