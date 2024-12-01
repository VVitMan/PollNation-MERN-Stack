import { describe, it, expect, beforeEach, vi, afterEach } from 'vitest';
import { render, screen, fireEvent, act } from '@testing-library/react';
import { Provider } from 'react-redux';
import { BrowserRouter as Router } from 'react-router-dom';
import { store } from '../redux/store';
import SignUp from './SignUp';
import '@testing-library/jest-dom';

vi.mock('../components/OAuth', () => ({
  __esModule: true,
  default: () => <div>OAuth Component</div>,
}));

describe('SignUp Component', () => {
  beforeEach(() => {
    // Mock browser alert to avoid act warnings during testing
    window.alert = vi.fn();

    // Mock global fetch API
    global.fetch = vi.fn();
  });

  afterEach(() => {
    // Restore all mocks
    vi.restoreAllMocks();
  });

  const renderSignUp = async () => {
    await act(async () => {
      render(
        <Provider store={store}>
          <Router>
            <SignUp />
          </Router>
        </Provider>
      );
    });
  };

  it('renders Sign Up form correctly', async () => {
    await renderSignUp();
    expect(screen.getByPlaceholderText(/Username/i)).toBeInTheDocument();
    expect(screen.getByPlaceholderText(/Email/i)).toBeInTheDocument();
    expect(screen.getByPlaceholderText(/Password/i)).toBeInTheDocument();
    expect(screen.getByPlaceholderText(/Confirm Password/i)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /Sign up/i })).toBeInTheDocument();
  });

  it('shows error when username is missing', async () => {
    await renderSignUp();
    await act(async () => {
      fireEvent.click(screen.getByRole('button', { name: /Sign up/i }));
    });
    expect(window.alert).toHaveBeenCalledWith('⚠️ Please enter a username.');
  });

  it('shows error for invalid username', async () => {
    await renderSignUp();
    await act(async () => {
      fireEvent.change(screen.getByPlaceholderText(/Username/i), {
        target: { value: 'u' },
      });
      fireEvent.click(screen.getByRole('button', { name: /Sign up/i }));
    });
    expect(window.alert).toHaveBeenCalledWith(
      '⚠️ Username must be between 3 and 15 characters and can only contain letters, numbers, underscores, or hyphens.\n\nExample: user_name123'
    );
  });

  it('shows error when email is missing', async () => {
    await renderSignUp();
    await act(async () => {
      fireEvent.change(screen.getByPlaceholderText(/Username/i), {
        target: { value: 'valid_username' },
      });
      fireEvent.click(screen.getByRole('button', { name: /Sign up/i }));
    });
    expect(window.alert).toHaveBeenCalledWith('📧 Please enter your email address.');
  });

  it('shows error for invalid email', async () => {
    await renderSignUp();
    await act(async () => {
      fireEvent.change(screen.getByPlaceholderText(/Username/i), {
        target: { value: 'valid_username' },
      });
      fireEvent.change(screen.getByPlaceholderText(/Email/i), {
        target: { value: 'invalidEmail' },
      });
      fireEvent.click(screen.getByRole('button', { name: /Sign up/i }));
    });
    expect(window.alert).toHaveBeenCalledWith('📧 Please enter a valid email address. Example: user@example.com');
  });

  it('shows error when password is missing', async () => {
    await renderSignUp();
    await act(async () => {
      fireEvent.change(screen.getByPlaceholderText(/Username/i), {
        target: { value: 'valid_username' },
      });
      fireEvent.change(screen.getByPlaceholderText(/Email/i), {
        target: { value: 'user@example.com' },
      });
      fireEvent.click(screen.getByRole('button', { name: /Sign up/i }));
    });
    expect(window.alert).toHaveBeenCalledWith('🔒 Please enter your password.');
  });

  it('shows error for weak password', async () => {
    await renderSignUp();
    await act(async () => {
      fireEvent.change(screen.getByPlaceholderText(/Username/i), {
        target: { value: 'valid_username' },
      });
      fireEvent.change(screen.getByPlaceholderText(/Email/i), {
        target: { value: 'user@example.com' },
      });
      fireEvent.change(screen.getByPlaceholderText(/Password/i), {
        target: { value: 'weakpass' },
      });
      fireEvent.click(screen.getByRole('button', { name: /Sign up/i }));
    });
    expect(window.alert).toHaveBeenCalledWith(
      '🔒 Your password must meet the following criteria:\n\n' +
        '• At least 8 characters long\n' +
        '• Include at least one uppercase letter (e.g., A, B, C)\n' +
        '• Include at least one lowercase letter (e.g., a, b, c)\n' +
        '• Include at least one number (e.g., 1, 2, 3)\n' +
        '• Include at least one special character (e.g., !, @, #, $)\n\n' +
        'Example: MyPassword123!'
    );
  });

  it('shows error when passwords do not match', async () => {
    await renderSignUp();
    await act(async () => {
      fireEvent.change(screen.getByPlaceholderText(/Username/i), {
        target: { value: 'valid_username' },
      });
      fireEvent.change(screen.getByPlaceholderText(/Email/i), {
        target: { value: 'user@example.com' },
      });
      fireEvent.change(screen.getByPlaceholderText(/Password/i), {
        target: { value: 'ValidPassword1!' },
      });
      fireEvent.change(screen.getByPlaceholderText(/Confirm Password/i), {
        target: { value: 'MismatchPassword1!' },
      });
      fireEvent.click(screen.getByRole('button', { name: /Sign up/i }));
    });
    expect(window.alert).toHaveBeenCalledWith('🔒 Passwords do not match. Please confirm your password correctly.');
  });

  it('shows error message when server returns error', async () => {
    // Mock fetch to simulate server error response
    global.fetch.mockImplementation(() =>
      Promise.resolve({
        ok: false,
        json: () => Promise.resolve({ success: false, message: 'User already exists' }),
      })
    );

    await renderSignUp();
    await act(async () => {
      fireEvent.change(screen.getByPlaceholderText(/Username/i), {
        target: { value: 'valid_username' },
      });
      fireEvent.change(screen.getByPlaceholderText(/Email/i), {
        target: { value: 'user@example.com' },
      });
      fireEvent.change(screen.getByPlaceholderText(/Password/i), {
        target: { value: 'ValidPassword1!' },
      });
      fireEvent.change(screen.getByPlaceholderText(/Confirm Password/i), {
        target: { value: 'ValidPassword1!' },
      });
      fireEvent.click(screen.getByRole('button', { name: /Sign up/i }));
    });

    expect(screen.getByText(/User already exists/i)).toBeInTheDocument();
  });

  it('navigates to sign in page when clicking the link', async () => {
    await renderSignUp();
    const signInLink = screen.getByText(/Sign in/i);
    expect(signInLink).toBeInTheDocument();
    expect(signInLink.closest('a')).toHaveAttribute('href', '/sign-in');
  });
});
