import { render, screen, fireEvent } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import SearchBar from "../SearchBar";

describe("SearchBar", () => {
  const mockOnSearchChange = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("should render with default placeholder", () => {
    render(<SearchBar searchTerm="" onSearchChange={mockOnSearchChange} />);

    expect(screen.getByPlaceholderText("Search users...")).toBeInTheDocument();
  });

  it("should render with custom placeholder", () => {
    const customPlaceholder = "Custom search placeholder";
    render(
      <SearchBar
        searchTerm=""
        onSearchChange={mockOnSearchChange}
        placeholder={customPlaceholder}
      />
    );

    expect(screen.getByPlaceholderText(customPlaceholder)).toBeInTheDocument();
  });

  it("should display current search term", () => {
    const searchTerm = "John Doe";
    render(
      <SearchBar searchTerm={searchTerm} onSearchChange={mockOnSearchChange} />
    );

    expect(screen.getByDisplayValue(searchTerm)).toBeInTheDocument();
  });

  it("should call onSearchChange when typing", async () => {
    const user = userEvent.setup();
    render(<SearchBar searchTerm="" onSearchChange={mockOnSearchChange} />);

    const input = screen.getByRole("textbox");
    await user.type(input, "test");

    expect(mockOnSearchChange).toHaveBeenCalledTimes(4); // once for each character
    expect(mockOnSearchChange).toHaveBeenLastCalledWith("test");
  });

  it("should show clear button when search term exists", () => {
    render(<SearchBar searchTerm="test" onSearchChange={mockOnSearchChange} />);

    expect(
      screen.getByRole("button", { name: /clear search/i })
    ).toBeInTheDocument();
  });

  it("should not show clear button when search term is empty", () => {
    render(<SearchBar searchTerm="" onSearchChange={mockOnSearchChange} />);

    expect(
      screen.queryByRole("button", { name: /clear search/i })
    ).not.toBeInTheDocument();
  });

  it("should clear search when clear button is clicked", async () => {
    const user = userEvent.setup();
    render(<SearchBar searchTerm="test" onSearchChange={mockOnSearchChange} />);

    const clearButton = screen.getByRole("button", { name: /clear search/i });
    await user.click(clearButton);

    expect(mockOnSearchChange).toHaveBeenCalledWith("");
  });

  it("should show search info when search term exists", () => {
    const searchTerm = "John";
    render(
      <SearchBar searchTerm={searchTerm} onSearchChange={mockOnSearchChange} />
    );

    expect(screen.getByText(`Searching for:`)).toBeInTheDocument();
    expect(screen.getByText(searchTerm)).toBeInTheDocument();
  });

  it("should not show search info when search term is empty", () => {
    render(<SearchBar searchTerm="" onSearchChange={mockOnSearchChange} />);

    expect(screen.queryByText("Searching for:")).not.toBeInTheDocument();
  });

  it("should have proper accessibility attributes", () => {
    render(<SearchBar searchTerm="" onSearchChange={mockOnSearchChange} />);

    const input = screen.getByRole("textbox");
    expect(input).toHaveAttribute(
      "aria-label",
      "Search users by name, email, or company"
    );
  });

  it("should handle input change events", () => {
    render(<SearchBar searchTerm="" onSearchChange={mockOnSearchChange} />);

    const input = screen.getByRole("textbox");
    fireEvent.change(input, { target: { value: "new value" } });

    expect(mockOnSearchChange).toHaveBeenCalledWith("new value");
  });

  it("should maintain focus after clearing search", async () => {
    const user = userEvent.setup();
    render(<SearchBar searchTerm="test" onSearchChange={mockOnSearchChange} />);

    const clearButton = screen.getByRole("button", { name: /clear search/i });

    await user.click(clearButton);

    expect(mockOnSearchChange).toHaveBeenCalledWith("");
  });
});
