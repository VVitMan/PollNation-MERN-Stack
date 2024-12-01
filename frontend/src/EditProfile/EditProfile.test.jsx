import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import { render, screen, fireEvent, act } from '@testing-library/react';
import { Provider } from 'react-redux';
import { MemoryRouter } from 'react-router-dom';
import EditProfile from './EditProfile';
import { store } from '../redux/store';
import '@testing-library/jest-dom';

vi.mock('../firebase', () => ({
  app: {},
}));

vi.mock('firebase/storage', () => ({
  getStorage: vi.fn(),
  ref: vi.fn(),
  uploadBytesResumable: vi.fn(() => ({
    on: vi.fn((event, progressCallback, errorCallback, successCallback) => {
      if (event === 'state_changed') {
        progressCallback({
          bytesTransferred: 50,
          totalBytes: 100,
        });
        successCallback();
      }
    }),
    snapshot: { ref: { fullPath: 'test/path' } },
  })),
  getDownloadURL: vi.fn(() => Promise.resolve('http://example.com/profile.jpg')),
}));

describe('EditProfile Component', () => {
  let fetchMock;

  beforeEach(() => {
    vi.spyOn(console, 'error').mockImplementation(() => {}); // Suppress console errors
    fetchMock = vi.fn();
    global.fetch = fetchMock;
  });

  afterEach(() => {
    vi.restoreAllMocks(); // Restore mocks after each test
  });

  const renderEditProfile = async () => {
    await act(async () => {
      render(
        <Provider store={store}>
          <MemoryRouter>
            <EditProfile />
          </MemoryRouter>
        </Provider>
      );
    });
  };

  it('renders EditProfile component', async () => {
    await renderEditProfile();
    expect(screen.getByText(/Edit Profile/i)).toBeInTheDocument();
    expect(screen.getByText(/Username/i)).toBeInTheDocument();
    expect(screen.getByText(/Email/i)).toBeInTheDocument();
  });

  it('handles profile picture upload', async () => {
    await renderEditProfile();
    const file = new File(['(⌐□_□)'], 'profile.png', { type: 'image/png' });

    const fileInput = screen.getByAltText(/Profile/i).closest('input');
    await act(async () => {
      fireEvent.change(fileInput, { target: { files: [file] } });
    });

    expect(screen.getByText(/Uploading: 50 %/i)).toBeInTheDocument();
    expect(screen.getByText(/Image uploaded successfully/i)).toBeInTheDocument();
  });

  it('validates form inputs', async () => {
    await renderEditProfile();

    const saveButton = screen.getByText(/Save/i);

    await act(async () => {
      fireEvent.click(saveButton);
    });

    expect(screen.getByText(/⚠️ Username cannot be empty./i)).toBeInTheDocument();
    expect(screen.getByText(/📧 Email cannot be empty./i)).toBeInTheDocument();
  });

  it('handles successful profile update', async () => {
    fetchMock.mockResolvedValueOnce({
      ok: true,
      json: () => Promise.resolve({ success: true }),
    });

    await renderEditProfile();

    const usernameInput = screen.getByLabelText(/Username/i);
    const emailInput = screen.getByLabelText(/Email/i);
    const saveButton = screen.getByText(/Save/i);

    await act(async () => {
      fireEvent.change(usernameInput, { target: { value: 'newUsername' } });
      fireEvent.change(emailInput, { target: { value: 'test@example.com' } });
      fireEvent.click(saveButton);
    });

    expect(screen.getByText(/User is Updated successfully/i)).toBeInTheDocument();
  });

  it('handles failed profile update', async () => {
    fetchMock.mockResolvedValueOnce({
      ok: false,
      json: () => Promise.resolve({ success: false, message: 'Failed to update profile' }),
    });

    await renderEditProfile();

    const usernameInput = screen.getByLabelText(/Username/i);
    const saveButton = screen.getByText(/Save/i);

    await act(async () => {
      fireEvent.change(usernameInput, { target: { value: 'newUsername' } });
      fireEvent.click(saveButton);
    });

    expect(screen.getByText(/Failed to update profile/i)).toBeInTheDocument();
  });

  it('handles password verification', async () => {
    fetchMock.mockResolvedValueOnce({
      ok: true,
      json: () => Promise.resolve({ success: true }),
    });

    await renderEditProfile();

    const currentPasswordInput = screen.getByPlaceholderText(/Current Password/i);
    const verifyButton = screen.getByText(/Verify Password/i);

    await act(async () => {
      fireEvent.change(currentPasswordInput, { target: { value: 'password123' } });
      fireEvent.click(verifyButton);
    });

    expect(screen.getByText(/Password verified successfully/i)).toBeInTheDocument();
  });

  it('handles account deletion', async () => {
    fetchMock.mockResolvedValueOnce({
      ok: true,
      json: () => Promise.resolve({ success: true }),
    });

    vi.spyOn(window, 'confirm').mockReturnValueOnce(true);

    await renderEditProfile();
    const deleteAccountButton = screen.getByText(/Delete Account/i);

    await act(async () => {
      fireEvent.click(deleteAccountButton);
    });

    expect(window.alert).toHaveBeenCalledWith('Account deleted successfully.');
  });

  it('handles failed account deletion', async () => {
    fetchMock.mockResolvedValueOnce({
      ok: false,
      json: () => Promise.resolve({ success: false, message: 'Failed to delete account' }),
    });

    vi.spyOn(window, 'confirm').mockReturnValueOnce(true);

    await renderEditProfile();
    const deleteAccountButton = screen.getByText(/Delete Account/i);

    await act(async () => {
      fireEvent.click(deleteAccountButton);
    });

    expect(screen.getByText(/Failed to delete account/i)).toBeInTheDocument();
  });
});
