import { describe, it, expect, vi, beforeEach, afterEach, act } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import { MemoryRouter, Route, Routes } from "react-router-dom";
import EditPollQuiz from "./EditPollQuiz";
import "@testing-library/jest-dom";

vi.mock("react-router-dom", async () => {
  const actual = await vi.importActual("react-router-dom");
  return {
    ...actual,
    useParams: () => ({ postId: "123" }),
    useNavigate: vi.fn(),
  };
});

describe("EditPollQuiz Component", () => {
  const mockFetch = vi.fn();

  beforeEach(() => {
    vi.spyOn(global, "fetch").mockImplementation(mockFetch);
    mockFetch.mockResolvedValueOnce({
      ok: true,
      json: () =>
        Promise.resolve({
          __t: "Quiz",
          question: "Sample Question",
          options: [
            { text: "Option 1", correct: true, explanation: "Explanation 1" },
            { text: "Option 2", correct: false, explanation: "Explanation 2" },
          ],
        }),
    });
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  const renderComponent = async () => {
    await act(async () => {
      render(
        <MemoryRouter>
          <Routes>
            <Route path="/" element={<div>Home</div>} />
            <Route path="/edit/:postId" element={<EditPollQuiz />} />
          </Routes>
        </MemoryRouter>
      );
    });
  };

  it("renders EditPollQuiz and fetches data", async () => {
    await renderComponent();

    expect(screen.getByText("Edit Quiz")).toBeInTheDocument();
    expect(screen.getByLabelText("Question:")).toBeInTheDocument();
    expect(screen.getByDisplayValue("Sample Question")).toBeInTheDocument();
    expect(screen.getAllByRole("textbox").length).toBe(4); // Question + 2 Options + 1 Explanation
  });

  it("allows editing the question", async () => {
    await renderComponent();

    const questionInput = screen.getByLabelText("Question:");
    fireEvent.change(questionInput, { target: { value: "Updated Question" } });

    expect(questionInput.value).toBe("Updated Question");
  });

  it("allows editing options", async () => {
    await renderComponent();

    const optionInputs = screen.getAllByRole("textbox", { name: "" });

    fireEvent.change(optionInputs[0], { target: { value: "Updated Option 1" } });
    fireEvent.change(optionInputs[1], { target: { value: "Updated Option 2" } });

    expect(optionInputs[0].value).toBe("Updated Option 1");
    expect(optionInputs[1].value).toBe("Updated Option 2");
  });

  it("adds a new option", async () => {
    await renderComponent();

    const addOptionButton = screen.getByText("Add Option");
    fireEvent.click(addOptionButton);

    const optionInputs = screen.getAllByRole("textbox");
    expect(optionInputs.length).toBe(5); // 2 Existing Options + 1 New Option
    expect(optionInputs[2].value).toBe(""); // New option is empty
  });

  it("removes an option", async () => {
    await renderComponent();

    const removeButtons = screen.getAllByText("Remove");
    fireEvent.click(removeButtons[0]);

    const optionInputs = screen.getAllByRole("textbox");
    expect(optionInputs.length).toBe(3); // 1 Option Removed
    expect(screen.queryByDisplayValue("Option 1")).not.toBeInTheDocument();
  });

  it("submits the form with updated data", async () => {
    mockFetch.mockResolvedValueOnce({
      ok: true,
      json: () => Promise.resolve({ success: true }),
    });

    await renderComponent();

    const questionInput = screen.getByLabelText("Question:");
    const submitButton = screen.getByText("Update Quiz");

    fireEvent.change(questionInput, { target: { value: "Updated Question" } });
    fireEvent.click(submitButton);

    expect(mockFetch).toHaveBeenCalledWith(
      "/api/poll-and-quiz/update/123",
      expect.objectContaining({
        method: "PUT",
        body: JSON.stringify({
          question: "Updated Question",
          options: [
            { text: "Option 1", correct: true, explanation: "Explanation 1" },
            { text: "Option 2", correct: false, explanation: "Explanation 2" },
          ],
        }),
      })
    );
    expect(await screen.findByText("Poll/Quiz updated successfully!")).toBeInTheDocument();
  });

  it("shows an error message when the form submission fails", async () => {
    mockFetch.mockResolvedValueOnce({
      ok: false,
      json: () => Promise.resolve({ message: "Update failed" }),
    });

    await renderComponent();

    const submitButton = screen.getByText("Update Quiz");
    fireEvent.click(submitButton);

    expect(await screen.findByText("Error: Update failed")).toBeInTheDocument();
  });

  it("shows an error message if fetch fails during initialization", async () => {
    mockFetch.mockRejectedValueOnce(new Error("Failed to fetch"));

    await renderComponent();

    expect(await screen.findByText("Error: Failed to fetch")).toBeInTheDocument();
  });
});
