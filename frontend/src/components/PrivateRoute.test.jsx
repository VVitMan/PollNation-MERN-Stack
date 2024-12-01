import { render, screen } from "@testing-library/react";
import { MemoryRouter, Route, Routes } from "react-router-dom";
import { Provider } from "react-redux";
import { store } from "../redux/store"; // Import your actual store
import PrivateRoute from "./PrivateRoute";
import { describe, it, expect } from "vitest";

describe("PrivateRoute Component", () => {
  it("renders the Outlet component when the user is logged in", () => {
    // Mock a logged-in user in the store
    store.dispatch({
      type: "user/signInSuccess",
      payload: { username: "testUser" }, // Mock a user
    });

    render(
      <Provider store={store}>
        <MemoryRouter initialEntries={["/private"]}>
          <Routes>
            <Route element={<PrivateRoute />}>
              <Route path="/private" element={<div>Private Content</div>} />
            </Route>
            <Route path="/sign-in" element={<div>Sign In Page</div>} />
          </Routes>
        </MemoryRouter>
      </Provider>
    );

    // Assert that the private content is rendered
    expect(screen.getByText("Private Content")).toBeInTheDocument();
  });

  it("navigates to /sign-in when the user is not logged in", () => {
    // Ensure no user is logged in
    store.dispatch({
      type: "user/signOut",
    });

    render(
      <Provider store={store}>
        <MemoryRouter initialEntries={["/private"]}>
          <Routes>
            <Route element={<PrivateRoute />}>
              <Route path="/private" element={<div>Private Content</div>} />
            </Route>
            <Route path="/sign-in" element={<div>Sign In Page</div>} />
          </Routes>
        </MemoryRouter>
      </Provider>
    );

    // Assert that the user is redirected to the sign-in page
    expect(screen.getByText("Sign In Page")).toBeInTheDocument();
  });
});
