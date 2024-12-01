import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import { Provider } from "react-redux";
import CreatePollQuiz from "./CreatePollQuiz";
import { store } from "../redux/store";
import "@testing-library/jest-dom";

vi.mock("react-router-dom", async () => {
  const actual = await vi.importActual("react-router-dom");
  return {
    ...actual,
    useNavigate: vi.fn(),
  };
});

describe("CreatePollQuiz Component", () => {
  const mockNavigate = vi.fn();

  beforeEach(() => {
    vi.mocked(mockNavigate).mockClear();
    vi.spyOn(global, "fetch").mockImplementation(vi.fn());
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  const renderComponent = () => {
    render(
      <Provider store={store}>
        <MemoryRouter>
          <CreatePollQuiz />
        </MemoryRouter>
      </Provider>
    );
  };

  it("renders CreatePollQuiz component", () => {
    renderComponent();

    expect(screen.getByText(/Create a Poll or Quiz/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Type:/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Question:/i)).toBeInTheDocument();
    expect(screen.getByText(/Options:/i)).toBeInTheDocument();
    expect(screen.getByText(/Create Poll/i)).toBeInTheDocument();
  });

  it("allows changing the type from Poll to Quiz", () => {
    renderComponent();

    const typeSelect = screen.getByLabelText(/Type:/i);
    fireEvent.change(typeSelect, { target: { value: "Quiz" } });

    expect(typeSelect.value).toBe("Quiz");
  });

  it("allows adding and removing options", () => {
    renderComponent();

    const addOptionButton = screen.getByText(/Add Option/i);
    fireEvent.click(addOptionButton);

    const optionInputs = screen.getAllByRole("textbox");
    expect(optionInputs.length).toBe(2); // One default + one added

    const removeButtons = screen.getAllByText(/Remove/i);
    fireEvent.click(removeButtons[1]);

    expect(screen.getAllByRole("textbox").length).toBe(1); // Back to default
  });

  it("submits the form with Poll data", async () => {
    vi.mocked(global.fetch).mockResolvedValueOnce({
      ok: true,
      json: async () => ({}),
    });

    renderComponent();

    const questionInput = screen.getByLabelText(/Question:/i);
    const submitButton = screen.getByText(/Create Poll/i);

    fireEvent.change(questionInput, { target: { value: "Sample Poll Question" } });
    fireEvent.click(submitButton);

    expect(global.fetch).toHaveBeenCalledWith(
      "/api/poll-and-quiz/create",
      expect.objectContaining({
        method: "POST",
        body: JSON.stringify({
          question: "Sample Poll Question",
          type: "Poll",
          options: [{ text: "", correct: false, explanation: "" }],
        }),
      })
    );
    expect(await screen.findByText(/Poll\/Quiz created successfully!/i)).toBeInTheDocument();
  });

  it("submits the form with Quiz data", async () => {
    vi.mocked(global.fetch).mockResolvedValueOnce({
      ok: true,
      json: async () => ({}),
    });

    renderComponent();

    const typeSelect = screen.getByLabelText(/Type:/i);
    const questionInput = screen.getByLabelText(/Question:/i);
    const submitButton = screen.getByText(/Create Quiz/i);

    fireEvent.change(typeSelect, { target: { value: "Quiz" } });
    fireEvent.change(questionInput, { target: { value: "Sample Quiz Question" } });
    fireEvent.click(submitButton);

    expect(global.fetch).toHaveBeenCalledWith(
      "/api/poll-and-quiz/create",
      expect.objectContaining({
        method: "POST",
        body: JSON.stringify({
          question: "Sample Quiz Question",
          type: "Quiz",
          options: [{ text: "", correct: false, explanation: "" }],
        }),
      })
    );
    expect(await screen.findByText(/Poll\/Quiz created successfully!/i)).toBeInTheDocument();
  });

  it("shows an error message when submission fails", async () => {
    vi.mocked(global.fetch).mockResolvedValueOnce({
      ok: false,
      json: async () => ({ message: "Creation failed" }),
    });

    renderComponent();

    const submitButton = screen.getByText(/Create Poll/i);
    fireEvent.click(submitButton);

    expect(await screen.findByText(/Error: Creation failed/i)).toBeInTheDocument();
  });

  it("resets the form after successful submission", async () => {
    vi.mocked(global.fetch).mockResolvedValueOnce({
      ok: true,
      json: async () => ({}),
    });

    renderComponent();

    const questionInput = screen.getByLabelText(/Question:/i);
    const submitButton = screen.getByText(/Create Poll/i);

    fireEvent.change(questionInput, { target: { value: "Sample Poll Question" } });
    fireEvent.click(submitButton);

    expect(questionInput.value).toBe(""); // Reset after submission
    expect(screen.getByText(/Poll\/Quiz created successfully!/i)).toBeInTheDocument();
  });
});
