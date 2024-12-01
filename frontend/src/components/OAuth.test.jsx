import { render, screen, fireEvent } from "@testing-library/react";
import { Provider } from "react-redux";
import { store } from "../redux/store";
import OAuth from "./OAuth";
import { MemoryRouter } from "react-router-dom";
import { GoogleAuthProvider, signInWithPopup } from "firebase/auth";
import { describe, it, vi, expect } from "vitest";

// Mock Firebase and Redux
vi.mock("firebase/auth", () => ({
  GoogleAuthProvider: vi.fn(),
  signInWithPopup: vi.fn(),
  getAuth: vi.fn(() => ({
    app: {},
  })),
}));

vi.mock("../firebase", () => ({
  app: {},
}));

vi.mock("react-redux", () => ({
  useDispatch: () => vi.fn(),
}));

vi.mock("react-router-dom", () => ({
  useNavigate: () => vi.fn(),
}));

describe("OAuth Component", () => {
  const mockDispatch = vi.fn();
  const mockNavigate = vi.fn();

  beforeEach(() => {
    vi.mocked(signInWithPopup).mockReset();
    vi.mocked(mockDispatch).mockReset();
    vi.mocked(mockNavigate).mockReset();
  });

  it("renders the Google sign-in button", () => {
    render(
      <Provider store={store}>
        <MemoryRouter>
          <OAuth />
        </MemoryRouter>
      </Provider>
    );

    // Check for the button text
    expect(screen.getByText(/continue with google/i)).toBeInTheDocument();
  });

  it("handles successful Google authentication and user dispatch", async () => {
    const mockUser = {
      user: {
        displayName: "Test User",
        email: "testuser@example.com",
        photoURL: "http://example.com/photo.jpg",
      },
    };
    const mockResponse = {
      success: true,
      user: { name: "Test User", email: "testuser@example.com", token: "abc123" },
    };

    vi.mocked(signInWithPopup).mockResolvedValue(mockUser);

    global.fetch = vi.fn(() =>
      Promise.resolve({
        json: () => Promise.resolve(mockResponse),
      })
    );

    render(
      <Provider store={store}>
        <MemoryRouter>
          <OAuth />
        </MemoryRouter>
      </Provider>
    );

    const button = screen.getByText(/continue with google/i);
    fireEvent.click(button);

    // Wait for the fetch and dispatch
    expect(signInWithPopup).toHaveBeenCalledWith(expect.anything(), expect.any(GoogleAuthProvider));
    expect(global.fetch).toHaveBeenCalledWith("api/auth/google", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        name: "Test User",
        email: "testuser@example.com",
        photo: "http://example.com/photo.jpg",
      }),
    });
  });

  it("logs an error when Google authentication fails", async () => {
    const mockError = new Error("Google authentication failed");
    vi.mocked(signInWithPopup).mockRejectedValue(mockError);

    console.error = vi.fn(); // Mock console.error

    render(
      <Provider store={store}>
        <MemoryRouter>
          <OAuth />
        </MemoryRouter>
      </Provider>
    );

    const button = screen.getByText(/continue with google/i);
    fireEvent.click(button);

    expect(signInWithPopup).toHaveBeenCalled();
    expect(console.error).toHaveBeenCalledWith("couldn't login to Google", mockError);
  });
});
