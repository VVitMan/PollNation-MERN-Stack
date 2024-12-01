import React from "react";
import { render, screen, waitFor, fireEvent } from "@testing-library/react";
import { vi } from "vitest";
import UserReports from "./UserReports";

// Mocking fetch API
global.fetch = vi.fn();

describe("UserReports Component", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("renders loading state initially", () => {
    render(<UserReports userId="testUserId" setShowReports={vi.fn()} />);

    // Check if loading text is rendered
    expect(screen.getByText(/Loading.../i)).toBeInTheDocument();
  });

  it("displays reports for a user", async () => {
    // Mock fetch response for user reports
    fetch.mockResolvedValueOnce({
      ok: true,
      json: () =>
        Promise.resolve([
          {
            _id: "report1",
            reporterUserId: { username: "reporter1" },
            reason: "Inappropriate content",
            createdAt: "2023-12-01T10:00:00Z",
          },
        ]),
    });

    render(<UserReports userId="testUserId" setShowReports={vi.fn()} />);

    // Wait for reports to load
    await waitFor(() => screen.getByText(/Reported by: reporter1/i));

    // Check if the report details are displayed
    expect(screen.getByText(/Reported by: reporter1/i)).toBeInTheDocument();
    expect(screen.getByText(/Reason: Inappropriate content/i)).toBeInTheDocument();
    expect(screen.getByText(/Date: 12\/1\/2023/i)).toBeInTheDocument(); // Adjust date format as per locale
  });

  it("displays a message when no reports are found", async () => {
    // Mock fetch response with empty reports
    fetch.mockResolvedValueOnce({
      ok: true,
      json: () => Promise.resolve([]),
    });

    render(<UserReports userId="testUserId" setShowReports={vi.fn()} />);

    // Wait for reports to load
    await waitFor(() => screen.getByText(/No reports found for this user/i));

    // Check if the no reports message is displayed
    expect(screen.getByText(/No reports found for this user/i)).toBeInTheDocument();
  });

  it("handles fetch errors gracefully", async () => {
    // Mock fetch response with an error
    fetch.mockResolvedValueOnce({
      ok: false,
    });

    render(<UserReports userId="testUserId" setShowReports={vi.fn()} />);

    // Wait for the error to be handled
    await waitFor(() => screen.getByText(/No reports found for this user/i));

    // Check if the no reports message is displayed after an error
    expect(screen.getByText(/No reports found for this user/i)).toBeInTheDocument();
  });

  it("calls setShowReports when 'Back to Dashboard' is clicked", () => {
    const mockSetShowReports = vi.fn();

    render(<UserReports userId="testUserId" setShowReports={mockSetShowReports} />);

    const backButton = screen.getByText(/Back to Dashboard/i);
    fireEvent.click(backButton);

    // Check if the setShowReports function is called
    expect(mockSetShowReports).toHaveBeenCalledWith(false);
  });
});
