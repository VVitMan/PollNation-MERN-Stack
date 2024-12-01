import React from "react";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { vi } from "vitest";
import AdminDashboard from "./AdminDashboard";

// Mocking fetch API
global.fetch = vi.fn();

describe("AdminDashboard Component", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("renders the admin dashboard and fetches users", async () => {
    fetch.mockResolvedValueOnce({
      ok: true,
      json: () =>
        Promise.resolve([
          {
            _id: "user1",
            username: "testuser",
            email: "testuser@example.com",
            reportCount: 2,
            isBanned: false,
          },
        ]),
    });

    render(<AdminDashboard />);

    // Wait until username is displayed
    await waitFor(() => screen.getByText(/testuser/i));

    expect(screen.getByText(/testuser/i)).toBeInTheDocument();
    expect(screen.getByText(/testuser@example.com/i)).toBeInTheDocument();
    expect(screen.getByText(/2/i)).toBeInTheDocument();
  });

  it("sorts users by report count", async () => {
    fetch.mockResolvedValueOnce({
      ok: true,
      json: () =>
        Promise.resolve([
          { _id: "user1", username: "user1", reportCount: 1, isBanned: false },
          { _id: "user2", username: "user2", reportCount: 3, isBanned: false },
        ]),
    });

    render(<AdminDashboard />);

    await waitFor(() => screen.getByText(/user1/i));

    const sortButton = screen.getByText(/Report Count/i);

    fireEvent.click(sortButton);

    // Test sorting
    const sortedUsers = screen.getAllByText(/user/i).map((el) => el.textContent);
    expect(sortedUsers).toEqual(["user2", "user1"]);

    fireEvent.click(sortButton);

    const reverseSortedUsers = screen
      .getAllByText(/user/i)
      .map((el) => el.textContent);
    expect(reverseSortedUsers).toEqual(["user1", "user2"]);
  });

  it("handles banning a user", async () => {
    fetch
      .mockResolvedValueOnce({
        ok: true,
        json: () =>
          Promise.resolve([
            {
              _id: "user1",
              username: "testuser",
              email: "testuser@example.com",
              reportCount: 2,
              isBanned: false,
            },
          ]),
      })
      .mockResolvedValueOnce({ ok: true });

    render(<AdminDashboard />);

    await waitFor(() => screen.getByText(/testuser/i));

    const banButton = screen.getByText(/Ban/i);
    fireEvent.click(banButton);

    await waitFor(() =>
      expect(fetch).toHaveBeenCalledWith(
        "/api/admin/users/user1/ban",
        expect.objectContaining({ method: "PATCH" })
      )
    );

    expect(fetch).toHaveBeenCalledTimes(2);
  });

  it("handles unbanning a user", async () => {
    fetch
      .mockResolvedValueOnce({
        ok: true,
        json: () =>
          Promise.resolve([
            {
              _id: "user1",
              username: "testuser",
              email: "testuser@example.com",
              reportCount: 2,
              isBanned: true,
            },
          ]),
      })
      .mockResolvedValueOnce({ ok: true });

    render(<AdminDashboard />);

    await waitFor(() => screen.getByText(/testuser/i));

    const unbanButton = screen.getByText(/Unlock Ban/i);
    fireEvent.click(unbanButton);

    await waitFor(() =>
      expect(fetch).toHaveBeenCalledWith(
        "/api/admin/users/user1/unban",
        expect.objectContaining({ method: "PATCH" })
      )
    );

    expect(fetch).toHaveBeenCalledTimes(2);
  });

  it("handles deleting a user", async () => {
    fetch
      .mockResolvedValueOnce({
        ok: true,
        json: () =>
          Promise.resolve([
            {
              _id: "user1",
              username: "testuser",
              email: "testuser@example.com",
              reportCount: 2,
              isBanned: false,
            },
          ]),
      })
      .mockResolvedValueOnce({ ok: true });

    render(<AdminDashboard />);

    await waitFor(() => screen.getByText(/testuser/i));

    const deleteButton = screen.getByText(/Delete/i);
    fireEvent.click(deleteButton);

    await waitFor(() =>
      expect(fetch).toHaveBeenCalledWith(
        "/api/admin/users/user1",
        expect.objectContaining({ method: "DELETE" })
      )
    );

    expect(fetch).toHaveBeenCalledTimes(2);
  });

  it("toggles to view user reports", async () => {
    fetch.mockResolvedValueOnce({
      ok: true,
      json: () =>
        Promise.resolve([
          {
            _id: "user1",
            username: "testuser",
            email: "testuser@example.com",
            reportCount: 2,
            isBanned: false,
          },
        ]),
    });

    render(<AdminDashboard />);

    await waitFor(() => screen.getByText(/testuser/i));

    const viewReportsButton = screen.getByText(/View Reports/i);
    fireEvent.click(viewReportsButton);

    await waitFor(() => {
      expect(screen.getByText(/User Reports/i)).toBeInTheDocument();
    });
  });
});
