// ProfilePage.test.jsx
/* eslint-env node, jest */
/* global afterEach, global */
import { describe, it, expect, beforeEach, vi } from 'vitest';
import { render, screen, fireEvent, act } from '@testing-library/react';
import { Provider } from 'react-redux';
import { MemoryRouter, Route, Routes } from 'react-router-dom';
import { store } from '../redux/store';
import ProfilePage from './ProfilePage';
import '@testing-library/jest-dom';

vi.mock('react-icons/fa', () => ({
  FaPencilAlt: () => <div>Edit Icon</div>,
  FaPlus: () => <div>Plus Icon</div>,
  FaTrashAlt: () => <div>Delete Icon</div>,
}));

// Mock global fetch
global.fetch = vi.fn();

describe('ProfilePage Component', () => {
  beforeEach(() => {
    window.alert = vi.fn(); // Mock window.alert
    window.confirm = vi.fn(() => true); // Mock window.confirm with default as true

    // Mock fetch response
    fetch.mockImplementation((url) => {
      if (url.includes('/api/poll-and-quiz/')) {
        return Promise.resolve({
          ok: true,
          json: () =>
            Promise.resolve({
              user: { username: 'testuser', profilePicture: '', description: 'User bio' },
              data: [{ _id: '123', type: 'Poll', question: 'Sample Question', options: [] }],
            }),
        });
      }
      if (url.includes('/api/user/id/')) {
        return Promise.resolve({
          ok: true,
          json: () => Promise.resolve({ userId: '123' }),
        });
      }
      return Promise.resolve({ ok: false });
    });
  });

  afterEach(() => {
    vi.clearAllMocks();
  });

  const renderProfilePage = async (username) => {
    await act(async () => {
      render(
        <Provider store={store}>
          <MemoryRouter initialEntries={[`/profile/${username}`]}>
            <Routes>
              <Route path="/profile/:username" element={<ProfilePage />} />
            </Routes>
          </MemoryRouter>
        </Provider>
      );
    });
  };

  it('renders ProfilePage and shows loading state initially', async () => {
    await renderProfilePage('testuser');
    expect(screen.getByText(/Loading.../i)).toBeInTheDocument();
  });

  it('shows error message if profile data fails to load', async () => {
    fetch.mockImplementationOnce(() => Promise.reject(new Error('Failed to fetch')));
    await renderProfilePage('invaliduser');
    expect(await screen.findByText(/Something went wrong/i)).toBeInTheDocument();
  });

  it('renders profile data when successfully fetched', async () => {
    await renderProfilePage('testuser');
    expect(await screen.findByText(/testuser/i)).toBeInTheDocument();
  });

  it('shows the edit button when user is viewing their own profile', async () => {
    await renderProfilePage('testuser');
    expect(await screen.findByText(/Edit Icon/i)).toBeInTheDocument();
  });

  it('renders all tabs and switches between them', async () => {
    await renderProfilePage('testuser');
    expect(await screen.findByText(/All/i)).toBeInTheDocument();
    fireEvent.click(screen.getByText(/Poll/i));
    expect(screen.getByText(/Poll/i)).toHaveClass('_tab_71459c _activeTab_71459c');
    fireEvent.click(screen.getByText(/Quiz/i));
    expect(screen.getByText(/Quiz/i)).toHaveClass('_tab_71459c _activeTab_71459c');
  });

  it('handles deleting a poll or quiz item', async () => {
    await renderProfilePage('testuser');
    fireEvent.click(await screen.findByText(/Delete Icon/i));
    expect(window.confirm).toHaveBeenCalledWith('Are you sure you want to delete this item?');
    expect(window.alert).toHaveBeenCalledWith('Item deleted successfully!');
  });

  it('toggles the report user form and submits a report', async () => {
    await renderProfilePage('otheruser');
    fireEvent.click(await screen.findByText(/Report User/i));
    fireEvent.change(screen.getByPlaceholderText(/Reason for reporting/i), {
      target: { value: 'Inappropriate behavior' },
    });
    fireEvent.click(screen.getByText(/Submit Report/i));
    expect(await screen.findByText(/Report submitted successfully!/i)).toBeInTheDocument();
  });

  it('navigates to create poll and quiz page when clicking the floating button', async () => {
    await renderProfilePage('testuser');
    fireEvent.click(await screen.findByText(/Plus Icon/i));
    expect(window.location.pathname).toBe('/create/poll-and-quiz');
  });
});
