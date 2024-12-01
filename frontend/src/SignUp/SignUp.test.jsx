// SignUp.test.jsx

import { describe, it, expect, beforeEach, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
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
    window.alert = vi.fn(); // Mock window.alert
  });

  const renderSignUp = () =>
    render(
      <Provider store={store}>
        <Router>
          <SignUp />
        </Router>
      </Provider>
    );

  it('renders Sign Up form', () => {
    renderSignUp();
    expect(screen.getByPlaceholderText(/Username/i)).toBeInTheDocument();
    expect(screen.getByPlaceholderText(/Email/i)).toBeInTheDocument();
    expect(screen.getByPlaceholderText(/Password/i)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /Sign up/i })).toBeInTheDocument();
  });

  it('shows error when username is missing', () => {
    renderSignUp();
    fireEvent.click(screen.getByRole('button', { name: /Sign up/i }));
    expect(window.alert).toHaveBeenCalledWith('⚠️ Please enter a username.');
  });

  it('shows error for invalid email', () => {
    renderSignUp();
    fireEvent.change(screen.getByPlaceholderText(/Username/i), {
      target: { value: 'ValidUsername' },
    });
    fireEvent.change(screen.getByPlaceholderText(/Email/i), {
      target: { value: 'invalidEmail' },
    });
    fireEvent.change(screen.getByPlaceholderText(/Password/i), {
      target: { value: 'ValidPassword1!' },
    });
    fireEvent.click(screen.getByRole('button', { name: /Sign up/i }));

    expect(window.alert).toHaveBeenCalledWith('📧 Please enter a valid email address. Example: user@example.com');
  });

  it('shows error for invalid password', () => {
    renderSignUp();
    fireEvent.change(screen.getByPlaceholderText(/Username/i), {
      target: { value: 'ValidUsername' },
    });
    fireEvent.change(screen.getByPlaceholderText(/Email/i), {
      target: { value: 'user@example.com' },
    });
    fireEvent.change(screen.getByPlaceholderText(/Password/i), {
      target: { value: 'weak' },
    });
    fireEvent.click(screen.getByRole('button', { name: /Sign up/i }));

    expect(window.alert).toHaveBeenCalledWith(
      "🔒 Your password must meet the following criteria:\n\n" +
      "• At least 8 characters long\n" +
      "• Include at least one uppercase letter (e.g., A, B, C)\n" +
      "• Include at least one lowercase letter (e.g., a, b, c)\n" +
      "• Include at least one number (e.g., 1, 2, 3)\n" +
      "• Include at least one special character (e.g., !, @, #, $)\n\n" +
      "Example: MyPassword123!"
    );
  });

  it('displays loading state while submitting', () => {
    renderSignUp();
    fireEvent.change(screen.getByPlaceholderText(/Username/i), {
      target: { value: 'ValidUsername' },
    });
    fireEvent.change(screen.getByPlaceholderText(/Email/i), {
      target: { value: 'user@example.com' },
    });
    fireEvent.change(screen.getByPlaceholderText(/Password/i), {
      target: { value: 'ValidPassword1!' },
    });
    fireEvent.click(screen.getByRole('button', { name: /Sign up/i }));

    expect(screen.getByRole('button', { name: /Loading.../i })).toBeInTheDocument();
  });

  it('navigates to sign in page when clicking the link', () => {
    renderSignUp();
    const signInLink = screen.getByText(/Sign in/i);
    expect(signInLink).toBeInTheDocument();
    expect(signInLink.closest('a')).toHaveAttribute('href', '/sign-in');
  });
});
