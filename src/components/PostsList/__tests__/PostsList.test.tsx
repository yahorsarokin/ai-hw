import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import PostsList from "../PostsList";
import { Post } from "../../../types/Post";

// Mock fetch
global.fetch = jest.fn();

const mockPosts: Post[] = [
  {
    userId: 1,
    id: 1,
    title: "Test Post 1",
    body: "This is the body of test post 1",
  },
  {
    userId: 1,
    id: 2,
    title: "Test Post 2",
    body: "This is the body of test post 2",
  },
];

describe("PostsList", () => {
  const mockFetch = fetch as jest.MockedFunction<typeof fetch>;

  beforeEach(() => {
    jest.clearAllMocks();
  });

  afterEach(() => {
    jest.resetAllMocks();
  });

  it("should display loading state initially", () => {
    mockFetch.mockImplementation(() => new Promise(() => {})); // Never resolves

    render(<PostsList userId={1} />);

    expect(screen.getByText("User Posts")).toBeInTheDocument();
    expect(screen.getByText("Loading posts...")).toBeInTheDocument();
    expect(
      screen.getByRole("progressbar", { hidden: true })
    ).toBeInTheDocument(); // spinner
  });

  it("should fetch and display posts successfully", async () => {
    mockFetch.mockResolvedValueOnce({
      ok: true,
      json: async () => mockPosts,
    } as Response);

    render(<PostsList userId={1} />);

    await waitFor(() => {
      expect(screen.getByText("User Posts (2)")).toBeInTheDocument();
    });

    expect(screen.getByText("Test Post 1")).toBeInTheDocument();
    expect(screen.getByText("Test Post 2")).toBeInTheDocument();
  });

  it("should display error state when fetch fails", async () => {
    mockFetch.mockRejectedValueOnce(new Error("Network error"));

    render(<PostsList userId={1} />);

    await waitFor(() => {
      expect(
        screen.getByText("Failed to load posts: Network error")
      ).toBeInTheDocument();
    });
  });

  it("should display error state when response is not ok", async () => {
    mockFetch.mockResolvedValueOnce({
      ok: false,
      status: 404,
    } as Response);

    render(<PostsList userId={1} />);

    await waitFor(() => {
      expect(
        screen.getByText("Failed to load posts: Failed to fetch posts")
      ).toBeInTheDocument();
    });
  });

  it("should display empty state when no posts are found", async () => {
    mockFetch.mockResolvedValueOnce({
      ok: true,
      json: async () => [],
    } as Response);

    render(<PostsList userId={1} />);

    await waitFor(() => {
      expect(
        screen.getByText("No posts found for this user.")
      ).toBeInTheDocument();
    });
  });

  it("should expand and collapse post content", async () => {
    const user = userEvent.setup();
    mockFetch.mockResolvedValueOnce({
      ok: true,
      json: async () => mockPosts,
    } as Response);

    render(<PostsList userId={1} />);

    await waitFor(() => {
      expect(screen.getByText("Test Post 1")).toBeInTheDocument();
    });

    // Initially, post content should not be visible
    expect(
      screen.queryByText("This is the body of test post 1")
    ).not.toBeInTheDocument();

    // Click to expand
    const postHeader = screen.getByRole("button", { name: /test post 1/i });
    await user.click(postHeader);

    expect(
      screen.getByText("This is the body of test post 1")
    ).toBeInTheDocument();
    expect(screen.getByText("Post ID: 1")).toBeInTheDocument();

    // Click to collapse
    await user.click(postHeader);
    expect(
      screen.queryByText("This is the body of test post 1")
    ).not.toBeInTheDocument();
  });

  it("should show correct expand/collapse icons", async () => {
    const user = userEvent.setup();
    mockFetch.mockResolvedValueOnce({
      ok: true,
      json: async () => mockPosts,
    } as Response);

    render(<PostsList userId={1} />);

    await waitFor(() => {
      expect(screen.getByText("Test Post 1")).toBeInTheDocument();
    });

    const postHeader = screen.getByRole("button", { name: /test post 1/i });

    // Should show + icon when collapsed
    expect(postHeader).toHaveTextContent("+");

    // Click to expand
    await user.click(postHeader);

    // Should show - icon when expanded
    expect(postHeader).toHaveTextContent("−");
  });

  it("should handle multiple posts independently", async () => {
    const user = userEvent.setup();
    mockFetch.mockResolvedValueOnce({
      ok: true,
      json: async () => mockPosts,
    } as Response);

    render(<PostsList userId={1} />);

    await waitFor(() => {
      expect(screen.getByText("Test Post 1")).toBeInTheDocument();
      expect(screen.getByText("Test Post 2")).toBeInTheDocument();
    });

    // Expand first post
    const post1Header = screen.getByRole("button", { name: /test post 1/i });
    await user.click(post1Header);

    expect(
      screen.getByText("This is the body of test post 1")
    ).toBeInTheDocument();
    expect(
      screen.queryByText("This is the body of test post 2")
    ).not.toBeInTheDocument();

    // Expand second post (first should collapse)
    const post2Header = screen.getByRole("button", { name: /test post 2/i });
    await user.click(post2Header);

    expect(
      screen.queryByText("This is the body of test post 1")
    ).not.toBeInTheDocument();
    expect(
      screen.getByText("This is the body of test post 2")
    ).toBeInTheDocument();
  });

  it("should have proper accessibility attributes", async () => {
    mockFetch.mockResolvedValueOnce({
      ok: true,
      json: async () => mockPosts,
    } as Response);

    render(<PostsList userId={1} />);

    await waitFor(() => {
      expect(screen.getByText("Test Post 1")).toBeInTheDocument();
    });

    const postHeader = screen.getByRole("button", { name: /test post 1/i });

    expect(postHeader).toHaveAttribute("aria-expanded", "false");
    expect(postHeader).toHaveAttribute("aria-controls", "post-content-1");
  });

  it("should update aria-expanded when post is expanded", async () => {
    const user = userEvent.setup();
    mockFetch.mockResolvedValueOnce({
      ok: true,
      json: async () => mockPosts,
    } as Response);

    render(<PostsList userId={1} />);

    await waitFor(() => {
      expect(screen.getByText("Test Post 1")).toBeInTheDocument();
    });

    const postHeader = screen.getByRole("button", { name: /test post 1/i });

    // Initially collapsed
    expect(postHeader).toHaveAttribute("aria-expanded", "false");

    // Click to expand
    await user.click(postHeader);
    expect(postHeader).toHaveAttribute("aria-expanded", "true");
  });

  it("should fetch posts with correct userId", () => {
    mockFetch.mockResolvedValueOnce({
      ok: true,
      json: async () => mockPosts,
    } as Response);

    render(<PostsList userId={123} />);

    expect(mockFetch).toHaveBeenCalledWith(
      "https://jsonplaceholder.typicode.com/posts?userId=123"
    );
  });

  it("should refetch posts when userId changes", async () => {
    mockFetch.mockResolvedValue({
      ok: true,
      json: async () => mockPosts,
    } as Response);

    const { rerender } = render(<PostsList userId={1} />);

    expect(mockFetch).toHaveBeenCalledWith(
      "https://jsonplaceholder.typicode.com/posts?userId=1"
    );

    rerender(<PostsList userId={2} />);

    expect(mockFetch).toHaveBeenCalledWith(
      "https://jsonplaceholder.typicode.com/posts?userId=2"
    );
    expect(mockFetch).toHaveBeenCalledTimes(2);
  });
});
