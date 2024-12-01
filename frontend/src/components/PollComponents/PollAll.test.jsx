import React from "react";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { Provider, useSelector } from "react-redux";
import { MemoryRouter } from "react-router-dom";
import { vi } from "vitest";
import { store } from "../../redux/store";
import PollAll from "./PollAll";

vi.mock("react-redux", async () => {
  const actual = await vi.importActual("react-redux");
  return {
    ...actual,
    useSelector: vi.fn(),
  };
});

// Mock fetch
global.fetch = vi.fn();

describe("PollAll Component", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    useSelector.mockImplementation((callback) =>
      callback({ user: { currentUser: { _id: "user1", token: "test-token" } } })
    );
  });

  it("renders polls and quizzes fetched from API", async () => {
    fetch.mockResolvedValueOnce({
      ok: true,
      text: () =>
        Promise.resolve(
          JSON.stringify([
            {
              _id: "poll1",
              type: "Poll",
              question: "What is your favorite color?",
              options: [
                { _id: "option1", text: "Red" },
                { _id: "option2", text: "Blue" },
              ],
              userId: { username: "User1" },
            },
          ])
        ),
    });

    render(
      <Provider store={store}>
        <MemoryRouter>
          <PollAll />
        </MemoryRouter>
      </Provider>
    );

    await waitFor(() => screen.getByText(/What is your favorite color?/i));

    expect(screen.getByText(/What is your favorite color?/i)).toBeInTheDocument();
    expect(screen.getByText(/Red/i)).toBeInTheDocument();
    expect(screen.getByText(/Blue/i)).toBeInTheDocument();
  });

  it("handles option selection for polls", async () => {
    fetch
      .mockResolvedValueOnce({
        ok: true,
        text: () =>
          Promise.resolve(
            JSON.stringify([
              {
                _id: "poll1",
                type: "Poll",
                question: "What is your favorite color?",
                options: [
                  { _id: "option1", text: "Red" },
                  { _id: "option2", text: "Blue" },
                ],
                userId: { username: "User1" },
              },
            ])
          ),
      })
      .mockResolvedValueOnce({
        ok: true,
      });

    render(
      <Provider store={store}>
        <MemoryRouter>
          <PollAll />
        </MemoryRouter>
      </Provider>
    );

    await waitFor(() => screen.getByText(/What is your favorite color?/i));
    const redOption = screen.getByText(/Red/i);

    fireEvent.click(redOption);

    expect(fetch).toHaveBeenCalledWith(
      "/api/vote/voting",
      expect.objectContaining({
        method: "POST",
      })
    );
  });

  it("toggles comments visibility", async () => {
    fetch
      .mockResolvedValueOnce({
        ok: true,
        text: () =>
          Promise.resolve(
            JSON.stringify([
              {
                _id: "poll1",
                type: "Poll",
                question: "What is your favorite color?",
                options: [
                  { _id: "option1", text: "Red" },
                  { _id: "option2", text: "Blue" },
                ],
                userId: { username: "User1" },
              },
            ])
          ),
      })
      .mockResolvedValueOnce({
        ok: true,
        json: () =>
          Promise.resolve([
            { _id: "comment1", content: "Great poll!", userId: { username: "Commenter1" } },
          ]),
      });

    render(
      <Provider store={store}>
        <MemoryRouter>
          <PollAll />
        </MemoryRouter>
      </Provider>
    );

    await waitFor(() => screen.getByText(/What is your favorite color?/i));
    const viewCommentsButton = screen.getByText(/View Comments/i);

    fireEvent.click(viewCommentsButton);

    await waitFor(() => screen.getByText(/Great poll!/i));

    expect(screen.getByText(/Great poll!/i)).toBeInTheDocument();
  });

  it("adds a new comment", async () => {
    fetch
      .mockResolvedValueOnce({
        ok: true,
        text: () =>
          Promise.resolve(
            JSON.stringify([
              {
                _id: "poll1",
                type: "Poll",
                question: "What is your favorite color?",
                options: [
                  { _id: "option1", text: "Red" },
                  { _id: "option2", text: "Blue" },
                ],
                userId: { username: "User1" },
              },
            ])
          ),
      })
      .mockResolvedValueOnce({
        ok: true,
        json: () => Promise.resolve([]),
      })
      .mockResolvedValueOnce({
        ok: true,
        json: () => Promise.resolve({ _id: "newComment", content: "Nice poll!" }),
      });

    render(
      <Provider store={store}>
        <MemoryRouter>
          <PollAll />
        </MemoryRouter>
      </Provider>
    );

    await waitFor(() => screen.getByText(/What is your favorite color?/i));

    const commentInput = screen.getByPlaceholderText(/Write your comment.../i);
    const postButton = screen.getByText(/Post/i);

    fireEvent.change(commentInput, { target: { value: "Nice poll!" } });
    fireEvent.click(postButton);

    await waitFor(() => screen.getByText(/Nice poll!/i));

    expect(screen.getByText(/Nice poll!/i)).toBeInTheDocument();
  });
});
