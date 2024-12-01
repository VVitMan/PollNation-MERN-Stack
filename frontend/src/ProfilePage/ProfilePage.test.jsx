import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import { render, screen, fireEvent, act } from '@testing-library/react';
import { Provider } from 'react-redux';
import { BrowserRouter as Router, MemoryRouter } from 'react-router-dom';
import { store } from '../redux/store';
import ProfilePage from './ProfilePage';
import '@testing-library/jest-dom';

vi.mock('react-router-dom', async () => {
  const actual = await vi.importActual('react-router-dom');
  return {
    ...actual,
    useParams: () => ({ username: 'testUser' }),
  };
});

describe('ProfilePage Component', () => {
  beforeEach(() => {
    vi.spyOn(console, 'error').mockImplementation(() => {}); // Suppress console errors
    global.fetch = vi.fn(); // Mock global fetch
  });

  afterEach(() => {
    vi.restoreAllMocks(); // Restore mocks after each test
  });

  const renderProfilePage = async () => {
    await act(async () => {
      render(
        <Provider store={store}>
          <MemoryRouter>
            <ProfilePage />
          </MemoryRouter>
        </Provider>
      );
    });
  };

  it('displays loading state initially', async () => {
    global.fetch.mockImplementation(() =>
      new Promise((resolve) => setTimeout(resolve, 100))
    );
    await renderProfilePage();
    expect(screen.getByText(/Loading.../i)).toBeInTheDocument();
  });

  it('displays error state when data fetch fails', async () => {
    global.fetch.mockImplementation(() =>
      Promise.reject(new Error('Failed to load profile data.'))
    );
    await renderProfilePage();
    expect(screen.getByText(/Something went wrong/i)).toBeInTheDocument();
  });

  it('fetches and displays user profile data', async () => {
    global.fetch.mockImplementation((url) => {
      if (url.includes('/api/poll-and-quiz/testUser')) {
        return Promise.resolve({
          ok: true,
          json: () =>
            Promise.resolve({
              user: {
                username: 'testUser',
                description: 'Test User Bio',
                profilePicture: '/test-profile.jpg',
              },
              data: [
                {
                  _id: '1',
                  type: 'Poll',
                  question: 'Test Poll Question?',
                  options: [{ _id: 'opt1', text: 'Option 1', votes: 5 }],
                },
                {
                  _id: '2',
                  type: 'Quiz',
                  question: 'Test Quiz Question?',
                  options: [{ _id: 'opt2', text: 'Option A' }],
                },
              ],
            }),
        });
      }
      return Promise.resolve({
        ok: true,
        json: () => Promise.resolve({}),
      });
    });

    await renderProfilePage();

    expect(screen.getByText('testUser')).toBeInTheDocument();
    expect(screen.getByText('Test User Bio')).toBeInTheDocument();
    expect(screen.getByText(/Test Poll Question\?/i)).toBeInTheDocument();
    expect(screen.getByText(/Option 1/i)).toBeInTheDocument();
    expect(screen.getByText(/Votes/i)).toBeInTheDocument();
  });

  it('filters data based on the active tab', async () => {
    global.fetch.mockImplementation((url) => {
      if (url.includes('/api/poll-and-quiz/testUser')) {
        return Promise.resolve({
          ok: true,
          json: () =>
            Promise.resolve({
              user: { username: 'testUser', description: '', profilePicture: '' },
              data: [
                { _id: '1', type: 'Poll', question: 'Poll 1', options: [] },
                { _id: '2', type: 'Quiz', question: 'Quiz 1', options: [] },
              ],
            }),
        });
      }
      return Promise.resolve({
        ok: true,
        json: () => Promise.resolve({}),
      });
    });

    await renderProfilePage();

    // Initially shows all data
    expect(screen.getByText(/Poll 1/i)).toBeInTheDocument();
    expect(screen.getByText(/Quiz 1/i)).toBeInTheDocument();

    // Filter to Poll
    fireEvent.click(screen.getByText(/Poll/i));
    expect(screen.getByText(/Poll 1/i)).toBeInTheDocument();
    expect(screen.queryByText(/Quiz 1/i)).not.toBeInTheDocument();

    // Filter to Quiz
    fireEvent.click(screen.getByText(/Quiz/i));
    expect(screen.getByText(/Quiz 1/i)).toBeInTheDocument();
    expect(screen.queryByText(/Poll 1/i)).not.toBeInTheDocument();
  });

  it('handles report user functionality', async () => {
    global.fetch.mockImplementation((url) => {
      if (url.includes('/api/user/id/testUser')) {
        return Promise.resolve({
          ok: true,
          json: () => Promise.resolve({ userId: '12345' }),
        });
      }
      if (url.includes('/api/user/reports')) {
        return Promise.resolve({
          ok: true,
          json: () => Promise.resolve({ success: true }),
        });
      }
      return Promise.resolve({
        ok: true,
        json: () => Promise.resolve({}),
      });
    });

    await renderProfilePage();

    fireEvent.click(screen.getByText(/Report User/i));
    fireEvent.change(screen.getByPlaceholderText(/Reason for reporting/i), {
      target: { value: 'Inappropriate behavior' },
    });
    fireEvent.click(screen.getByText(/Submit Report/i));

    expect(await screen.findByText(/Report submitted successfully!/i)).toBeInTheDocument();
  });

  it('handles item deletion functionality', async () => {
    global.fetch.mockImplementation((url) => {
      if (url.includes('/api/poll-and-quiz/testUser')) {
        return Promise.resolve({
          ok: true,
          json: () =>
            Promise.resolve({
              user: { username: 'testUser', description: '', profilePicture: '' },
              data: [{ _id: '1', type: 'Poll', question: 'Poll 1', options: [] }],
            }),
        });
      }
      if (url.includes('/api/poll-and-quiz/delete/1')) {
        return Promise.resolve({ ok: true });
      }
      return Promise.resolve({
        ok: true,
        json: () => Promise.resolve({}),
      });
    });

    await renderProfilePage();

    // Ensure item is initially displayed
    expect(screen.getByText(/Poll 1/i)).toBeInTheDocument();

    // Trigger delete action
    fireEvent.click(screen.getByText(/Delete/i));
    expect(global.fetch).toHaveBeenCalledWith(
      '/api/poll-and-quiz/delete/1',
      expect.objectContaining({ method: 'DELETE' })
    );

    // Ensure item is removed
    expect(screen.queryByText(/Poll 1/i)).not.toBeInTheDocument();
  });
});
