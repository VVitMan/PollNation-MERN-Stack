import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import Navbar from './Navbar';
import '@testing-library/jest-dom';
import * as reactRedux from 'react-redux';
import { signOut } from '../redux/user/userSlice';

vi.mock('react-router-dom', async () => {
  const actual = await vi.importActual('react-router-dom');
  return {
    ...actual,
    useNavigate: vi.fn(),
  };
});

describe('Navbar Component', () => {
  let mockDispatch;
  let mockNavigate;

  beforeEach(() => {
    mockDispatch = vi.fn();
    mockNavigate = vi.mocked(require('react-router-dom').useNavigate);

    // Mock implementations for Redux hooks
    vi.mocked(reactRedux.useDispatch).mockReturnValue(mockDispatch);
    vi.mocked(reactRedux.useSelector).mockImplementation((selector) =>
      selector({
        user: {
          currentUser: { username: 'testUser', profilePicture: '/test.jpg', isAdmin: false },
          loading: false,
        },
      })
    );

    mockNavigate.mockImplementation(() => {});
  });

  afterEach(() => {
    vi.restoreAllMocks(); // Reset all mocks after each test
  });

  const renderNavbar = () => {
    render(
      <MemoryRouter>
        <Navbar />
      </MemoryRouter>
    );
  };

  it('renders Navbar with default links', () => {
    renderNavbar();
    expect(screen.getByText(/PollNation/i)).toBeInTheDocument();
    expect(screen.getByText(/Home/i)).toBeInTheDocument();
    expect(screen.getByText(/testUser/i)).toBeInTheDocument();
  });

  it('toggles mobile menu when hamburger is clicked', () => {
    renderNavbar();
    const hamburger = screen.getByRole('button', { expanded: false });
    fireEvent.click(hamburger);
    expect(hamburger).toHaveAttribute('aria-expanded', 'true');
    fireEvent.click(hamburger);
    expect(hamburger).toHaveAttribute('aria-expanded', 'false');
  });

  it('toggles user dropdown when profile is clicked', () => {
    renderNavbar();
    const profileToggle = screen.getByText(/testUser/i);
    fireEvent.click(profileToggle);
    expect(screen.getByText(/Profile/i)).toBeInTheDocument();
    fireEvent.click(profileToggle);
    expect(screen.queryByText(/Profile/i)).not.toBeInTheDocument();
  });

  it('redirects to profile page when Profile is clicked', () => {
    renderNavbar();
    const profileToggle = screen.getByText(/testUser/i);
    fireEvent.click(profileToggle);
    const profileLink = screen.getByText(/Profile/i);
    fireEvent.click(profileLink);
    expect(mockNavigate).not.toHaveBeenCalled(); // Profile links are handled by `Link`, not `navigate`
  });

  it('dispatches signOut and navigates home on logout', () => {
    renderNavbar();
    const profileToggle = screen.getByText(/testUser/i);
    fireEvent.click(profileToggle);
    const logoutButton = screen.getByText(/Logout/i);
    fireEvent.click(logoutButton);
    expect(mockDispatch).toHaveBeenCalledWith(signOut());
    expect(mockNavigate).toHaveBeenCalledWith('/');
  });

  it('shows Sign In link when user is not logged in', () => {
    vi.mocked(reactRedux.useSelector).mockImplementation((selector) =>
      selector({
        user: {
          currentUser: null,
          loading: false,
        },
      })
    );
    renderNavbar();
    expect(screen.getByText(/Sign In/i)).toBeInTheDocument();
    expect(screen.queryByText(/testUser/i)).not.toBeInTheDocument();
  });

  it('shows loading state when user state is loading', () => {
    vi.mocked(reactRedux.useSelector).mockImplementation((selector) =>
      selector({
        user: {
          currentUser: null,
          loading: true,
        },
      })
    );
    renderNavbar();
    expect(screen.getByText(/Loading.../i)).toBeInTheDocument();
    expect(screen.queryByText(/Sign In/i)).not.toBeInTheDocument();
  });

  it('shows Admin link for admin users', () => {
    vi.mocked(reactRedux.useSelector).mockImplementation((selector) =>
      selector({
        user: {
          currentUser: { username: 'adminUser', profilePicture: '', isAdmin: true },
          loading: false,
        },
      })
    );
    renderNavbar();
    expect(screen.getByText(/Admin/i)).toBeInTheDocument();
  });
});
