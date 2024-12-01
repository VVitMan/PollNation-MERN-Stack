// SignIn.test.jsx
/* eslint-env node, jest */
/* global afterEach, global */
import { describe, it, expect, beforeEach, vi } from 'vitest';
import { render, screen, fireEvent, act } from '@testing-library/react';
import { Provider } from 'react-redux';
import { BrowserRouter as Router } from 'react-router-dom';
import { store } from '../redux/store';
import SignIn from './SignIn';
import '@testing-library/jest-dom';

vi.mock('../components/OAuth', () => ({
  __esModule: true,
  default: () => <div>OAuth Component</div>,
}));

describe('SignIn Component', () => {
  beforeEach(() => {
    window.alert = vi.fn(); // Mock window.alert to remove act() warnings
    global.fetch = vi.fn(); // Mock fetch API
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  const renderSignIn = async () => {
    await act(async () => {
      render(
        <Provider store={store}>
          <Router>
            <SignIn />
          </Router>
        </Provider>
      );
    });
  };

  it('renders Sign In form', async () => {
    await renderSignIn();
    expect(screen.getByPlaceholderText(/Email/i)).toBeInTheDocument();
    expect(screen.getByPlaceholderText(/Password/i)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /Sign in/i })).toBeInTheDocument();
  });

  it('shows error when email is missing', async () => {
    await renderSignIn();
    await act(async () => {
      fireEvent.click(screen.getByRole('button', { name: /Sign in/i }));
    });
    expect(window.alert).toHaveBeenCalledWith('📧 Please enter your email address.');
  });

  it('shows error for invalid email', async () => {
    await renderSignIn();
    await act(async () => {
      fireEvent.change(screen.getByPlaceholderText(/Email/i), {
        target: { value: 'invalidEmail' },
      });
      fireEvent.change(screen.getByPlaceholderText(/Password/i), {
        target: { value: 'ValidPassword1!' },
      });
      fireEvent.click(screen.getByRole('button', { name: /Sign in/i }));
    });

    expect(window.alert).toHaveBeenCalledWith('📧 Please enter a valid email address. Example: user@example.com');
  });

  it('shows error when password is missing', async () => {
    await renderSignIn();
    await act(async () => {
      fireEvent.change(screen.getByPlaceholderText(/Email/i), {
        target: { value: 'user@example.com' },
      });
      fireEvent.click(screen.getByRole('button', { name: /Sign in/i }));
    });

    expect(window.alert).toHaveBeenCalledWith('🔒 Please enter your password.');
  });

  it('displays loading state while submitting', async () => {
    // Mock fetch to simulate a delay in network response
    global.fetch.mockImplementation(() =>
      new Promise((resolve) =>
        setTimeout(() => {
          resolve({
            ok: true,
            json: () => Promise.resolve({ success: true }),
          });
        }, 100)
      )
    );

    await renderSignIn();
    await act(async () => {
      fireEvent.change(screen.getByPlaceholderText(/Email/i), {
        target: { value: 'user@example.com' },
      });
      fireEvent.change(screen.getByPlaceholderText(/Password/i), {
        target: { value: 'ValidPassword1!' },
      });
      fireEvent.click(screen.getByRole('button', { name: /Sign in/i }));

      // Wait briefly to allow the loading state to be applied
      await new Promise((r) => setTimeout(r, 50));
    });

    expect(screen.getByRole('button', { name: /Loading.../i })).toBeInTheDocument();
  });

  it('navigates to sign up page when clicking the link', async () => {
    await renderSignIn();
    const signUpLink = screen.getByText(/Sign up/i);
    expect(signUpLink).toBeInTheDocument();
    expect(signUpLink.closest('a')).toHaveAttribute('href', '/sign-up');
  });
});
