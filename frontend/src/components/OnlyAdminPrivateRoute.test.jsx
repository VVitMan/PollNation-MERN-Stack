import { render } from "@testing-library/react";
import { Provider } from "react-redux";
import { store } from "../redux/store";
import OnlyAdminPrivateRoute from "./OnlyAdminPrivateRoute";
import { MemoryRouter, Routes, Route } from "react-router-dom";
import { vi } from "vitest";

// Mocking Redux state for testing
vi.mock("react-redux", async (importOriginal) => {
  const actual = await importOriginal();
  return {
    ...actual,
    useSelector: vi.fn((selector) =>
      selector({
        user: {
          currentUser: { isAdmin: true }, // Mock admin user
        },
      })
    ),
    useDispatch: () => vi.fn(),
  };
});

describe("OnlyAdminPrivateRoute Component", () => {
  it("renders the Outlet component when the user is an admin", () => {
    const { getByText } = render(
      <Provider store={store}>
        <MemoryRouter initialEntries={["/admin"]}>
          <Routes>
            <Route
              path="/admin"
              element={<OnlyAdminPrivateRoute />}
            >
              <Route path="" element={<div>Admin Content</div>} />
            </Route>
          </Routes>
        </MemoryRouter>
      </Provider>
    );

    // Assert the Outlet renders admin content
    expect(getByText(/Admin Content/i)).toBeInTheDocument();
  });

  it("redirects to /sign-in when the user is not an admin", () => {
    vi.mock("react-redux", async (importOriginal) => {
      const actual = await importOriginal();
      return {
        ...actual,
        useSelector: vi.fn((selector) =>
          selector({
            user: {
              currentUser: { isAdmin: false }, // Mock non-admin user
            },
          })
        ),
      };
    });

    const { getByText } = render(
      <Provider store={store}>
        <MemoryRouter initialEntries={["/admin"]}>
          <Routes>
            <Route
              path="/admin"
              element={<OnlyAdminPrivateRoute />}
            />
            <Route path="/sign-in" element={<div>Sign In Page</div>} />
          </Routes>
        </MemoryRouter>
      </Provider>
    );

    // Assert the redirect happens
    expect(getByText(/Sign In Page/i)).toBeInTheDocument();
  });

  it("redirects to /sign-in when there is no user", () => {
    vi.mock("react-redux", async (importOriginal) => {
      const actual = await importOriginal();
      return {
        ...actual,
        useSelector: vi.fn((selector) =>
          selector({
            user: {
              currentUser: null, // Mock no user
            },
          })
        ),
      };
    });

    const { getByText } = render(
      <Provider store={store}>
        <MemoryRouter initialEntries={["/admin"]}>
          <Routes>
            <Route
              path="/admin"
              element={<OnlyAdminPrivateRoute />}
            />
            <Route path="/sign-in" element={<div>Sign In Page</div>} />
          </Routes>
        </MemoryRouter>
      </Provider>
    );

    // Assert the redirect happens
    expect(getByText(/Sign In Page/i)).toBeInTheDocument();
  });
});
