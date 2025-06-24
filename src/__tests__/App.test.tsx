import { screen, fireEvent, waitFor, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import {
  render,
  mockUsers,
  mockUser,
  mockFetchSuccess,
  mockFetchError,
} from "./utils/test-utils";
import App from "../App";

describe("App Integration Tests", () => {
  beforeEach(() => {
    jest.clearAllMocks();
    // Reset body overflow
    document.body.style.overflow = "auto";
  });

  describe("Initial Loading", () => {
    it("shows loading state initially", async () => {
      // Mock a delayed response
      (global.fetch as jest.Mock).mockImplementationOnce(
        () =>
          new Promise((resolve) =>
            setTimeout(
              () =>
                resolve({
                  ok: true,
                  json: async () => mockUsers,
                }),
              100
            )
          )
      );

      render(<App />);

      expect(screen.getByText("Loading users...")).toBeInTheDocument();

      await waitFor(() => {
        expect(screen.queryByText("Loading users...")).not.toBeInTheDocument();
      });
    });

    it("displays users after successful API call", async () => {
      mockFetchSuccess(mockUsers);

      render(<App />);

      await waitFor(() => {
        expect(screen.getByText("John Doe")).toBeInTheDocument();
        expect(screen.getByText("Jane Smith")).toBeInTheDocument();
      });

      expect(screen.getByText("User Management")).toBeInTheDocument();
      expect(screen.getByRole("table")).toBeInTheDocument();
    });

    it("displays error message on API failure", async () => {
      mockFetchError("Failed to fetch users");

      render(<App />);

      await waitFor(() => {
        expect(
          screen.getByText(/Error: Failed to fetch users/)
        ).toBeInTheDocument();
      });

      expect(screen.queryByRole("table")).not.toBeInTheDocument();
    });

    it("handles network error gracefully", async () => {
      mockFetchError("Network error");

      render(<App />);

      await waitFor(() => {
        expect(screen.getByText(/Error: Network error/)).toBeInTheDocument();
      });
    });
  });

  describe("User Table Interactions", () => {
    beforeEach(async () => {
      mockFetchSuccess(mockUsers);
      render(<App />);

      await waitFor(() => {
        expect(screen.getByText("John Doe")).toBeInTheDocument();
      });
    });

    it("opens modal when clicking on user", async () => {
      const userRow = screen.getByText("John Doe");
      fireEvent.click(userRow);

      await waitFor(() => {
        expect(screen.getByRole("dialog")).toBeInTheDocument();
        expect(screen.getByText("Address")).toBeInTheDocument();
        expect(screen.getByText("Contact")).toBeInTheDocument();
        expect(screen.getByText("Company")).toBeInTheDocument();
      });

      // Check body overflow is set to hidden
      expect(document.body.style.overflow).toBe("hidden");
    });

    it("closes modal when clicking close button", async () => {
      // Open modal
      const userRow = screen.getByText("John Doe");
      fireEvent.click(userRow);

      await waitFor(() => {
        expect(screen.getByRole("dialog")).toBeInTheDocument();
      });

      // Close modal
      const closeButton = screen.getByRole("button", { name: /×/i });
      fireEvent.click(closeButton);

      await waitFor(() => {
        expect(screen.queryByRole("dialog")).not.toBeInTheDocument();
      });

      // Check body overflow is restored
      expect(document.body.style.overflow).toBe("auto");
    });

    it("closes modal when pressing Escape key", async () => {
      const user = userEvent.setup();

      // Open modal
      const userRow = screen.getByText("John Doe");
      fireEvent.click(userRow);

      await waitFor(() => {
        expect(screen.getByRole("dialog")).toBeInTheDocument();
      });

      // Press Escape
      await user.keyboard("{Escape}");

      await waitFor(() => {
        expect(screen.queryByRole("dialog")).not.toBeInTheDocument();
      });
    });

    it("deletes user when clicking delete button", async () => {
      // Initially both users should be present
      expect(screen.getByText("John Doe")).toBeInTheDocument();
      expect(screen.getByText("Jane Smith")).toBeInTheDocument();

      // Delete John Doe
      const deleteButton = screen.getByLabelText("Delete John Doe");
      fireEvent.click(deleteButton);

      // John Doe should be removed, Jane Smith should remain
      await waitFor(() => {
        expect(screen.queryByText("John Doe")).not.toBeInTheDocument();
        expect(screen.getByText("Jane Smith")).toBeInTheDocument();
      });
    });

    it("allows deleting multiple users", async () => {
      // Delete first user
      const firstDeleteButton = screen.getByLabelText("Delete John Doe");
      fireEvent.click(firstDeleteButton);

      await waitFor(() => {
        expect(screen.queryByText("John Doe")).not.toBeInTheDocument();
      });

      // Delete second user
      const secondDeleteButton = screen.getByLabelText("Delete Jane Smith");
      fireEvent.click(secondDeleteButton);

      await waitFor(() => {
        expect(screen.queryByText("Jane Smith")).not.toBeInTheDocument();
      });

      // Table should still be present but empty
      expect(screen.getByRole("table")).toBeInTheDocument();
      expect(screen.getByText("NAME / EMAIL")).toBeInTheDocument();
    });
  });

  describe("Modal Interactions", () => {
    beforeEach(async () => {
      mockFetchSuccess([mockUser]);
      render(<App />);

      await waitFor(() => {
        expect(screen.getByText("John Doe")).toBeInTheDocument();
      });

      // Open modal
      const userRow = screen.getByText("John Doe");
      fireEvent.click(userRow);

      await waitFor(() => {
        expect(screen.getByRole("dialog")).toBeInTheDocument();
      });
    });

    it("displays all user information in modal", () => {
      // Personal info - use more specific queries for modal content
      expect(
        screen.getByRole("heading", { level: 2, name: "John Doe" })
      ).toBeInTheDocument();
      expect(
        screen.getByRole("link", { name: "john@example.com" })
      ).toBeInTheDocument();

      // Address
      expect(screen.getByText("Main St, Apt. Apt 123")).toBeInTheDocument();
      expect(screen.getByText("New York, 12345")).toBeInTheDocument();

      // Contact - verify contact section exists and website link in modal
      const contactSection = screen.getByText("Contact").closest("div");
      expect(contactSection).toBeInTheDocument();

      // Get website link specifically from modal (not table)
      const modal = screen.getByRole("dialog");
      const modalWebsiteLink = within(modal).getByRole("link", {
        name: "example.com",
      });
      expect(modalWebsiteLink).toBeInTheDocument();

      // Company - verify company info in modal context
      const companySection = screen.getByText("Company").closest("div");
      expect(companySection).toBeInTheDocument();

      // Use within modal to get specific company information
      const modalCompanyName = within(modal).getByText("Test Company");
      expect(modalCompanyName).toBeInTheDocument();
      expect(screen.getByText("Testing is everything")).toBeInTheDocument();
      expect(screen.getByText("quality assurance")).toBeInTheDocument();
    });

    it("has working external links in modal", () => {
      const emailLink = screen.getByRole("link", { name: "john@example.com" });
      expect(emailLink).toHaveAttribute("href", "mailto:john@example.com");

      const websiteLinks = screen.getAllByRole("link", {
        name: /example.com/i,
      });
      const modalWebsiteLink = websiteLinks.find(
        (link) =>
          link.getAttribute("href") === "http://example.com" &&
          link.getAttribute("target") === "_blank"
      );
      expect(modalWebsiteLink).toBeInTheDocument();
      expect(modalWebsiteLink).toHaveAttribute("href", "http://example.com");
      expect(modalWebsiteLink).toHaveAttribute("target", "_blank");
    });

    it("has functional map button", () => {
      const mapButton = screen.getByRole("button", { name: /view on map/i });
      expect(mapButton).toBeInTheDocument();
      // Note: In a real app, this might open a map service
    });
  });

  describe("API Integration", () => {
    it("calls the correct API endpoint", async () => {
      mockFetchSuccess(mockUsers);

      render(<App />);

      await waitFor(() => {
        expect(global.fetch).toHaveBeenCalledWith(
          "https://jsonplaceholder.typicode.com/users"
        );
      });
    });

    it("handles empty API response", async () => {
      mockFetchSuccess([]);

      render(<App />);

      await waitFor(() => {
        expect(screen.getByRole("table")).toBeInTheDocument();
        expect(screen.queryByText("John Doe")).not.toBeInTheDocument();
      });
    });

    it("handles malformed API response gracefully", async () => {
      mockFetchSuccess(null);

      render(<App />);

      // Should handle gracefully without crashing - check for header
      await waitFor(() => {
        expect(
          screen.getByRole("heading", { level: 1, name: "User Management" })
        ).toBeInTheDocument();
      });

      // Table should still be rendered even with null data
      expect(screen.getByRole("table")).toBeInTheDocument();
    });
  });

  describe("Responsive Behavior", () => {
    beforeEach(async () => {
      mockFetchSuccess(mockUsers);
      render(<App />);

      await waitFor(() => {
        expect(screen.getByText("John Doe")).toBeInTheDocument();
      });
    });

    it("table is responsive", () => {
      const table = screen.getByRole("table");
      expect(table).toBeInTheDocument();

      // Check that table is in a container with proper classes
      const tableContainer = table.closest("div");
      expect(tableContainer).toBeInTheDocument();
      expect(tableContainer?.className).toContain("tableContainer");
    });

    it("modal adapts to screen size", async () => {
      // Open modal
      const userRow = screen.getByText("John Doe");
      fireEvent.click(userRow);

      await waitFor(() => {
        const modal = screen.getByRole("dialog");
        expect(modal).toBeInTheDocument();

        // Modal should have proper CSS classes
        expect(modal).toHaveAttribute(
          "class",
          expect.stringContaining("modal")
        );
      });
    });
  });

  describe("Error Recovery", () => {
    it("allows retry after error", async () => {
      // First call fails
      mockFetchError("Network error");

      render(<App />);

      await waitFor(() => {
        expect(screen.getByText(/Error: Network error/)).toBeInTheDocument();
      });

      // Simulate retry by triggering component re-mount or refresh
      // In a real app, there might be a retry button
      // For now, we just verify error state is properly displayed
      expect(screen.queryByRole("table")).not.toBeInTheDocument();
    });
  });

  describe("Search Functionality", () => {
    beforeEach(async () => {
      mockFetchSuccess(mockUsers);
      render(<App />);

      await waitFor(() => {
        expect(screen.getByText("John Doe")).toBeInTheDocument();
        expect(screen.getByText("Jane Smith")).toBeInTheDocument();
      });
    });

    it("should filter users based on search term", async () => {
      const user = userEvent.setup();

      // Search for "John"
      const searchInput = screen.getByRole("textbox");
      await user.type(searchInput, "John");

      // Should show only John Doe
      expect(screen.getByText("John Doe")).toBeInTheDocument();
      expect(screen.queryByText("Jane Smith")).not.toBeInTheDocument();

      // Clear search
      const clearButton = screen.getByRole("button", { name: /clear search/i });
      await user.click(clearButton);

      // Should show both users again
      expect(screen.getByText("John Doe")).toBeInTheDocument();
      expect(screen.getByText("Jane Smith")).toBeInTheDocument();
    });

    it("should search by email", async () => {
      const user = userEvent.setup();

      // Search by email
      const searchInput = screen.getByRole("textbox");
      await user.type(searchInput, "jane@example.com");

      expect(screen.queryByText("John Doe")).not.toBeInTheDocument();
      expect(screen.getByText("Jane Smith")).toBeInTheDocument();
    });

    it("should search by company name", async () => {
      const user = userEvent.setup();

      // Search by company
      const searchInput = screen.getByRole("textbox");
      await user.type(searchInput, "Test Company");

      expect(screen.getByText("John Doe")).toBeInTheDocument();
      expect(screen.queryByText("Jane Smith")).not.toBeInTheDocument();
    });

    it("should search by username", async () => {
      const user = userEvent.setup();

      // Search by username
      const searchInput = screen.getByRole("textbox");
      await user.type(searchInput, "janesmith");

      expect(screen.queryByText("John Doe")).not.toBeInTheDocument();
      expect(screen.getByText("Jane Smith")).toBeInTheDocument();
    });

    it("should show user count and search info", async () => {
      const user = userEvent.setup();

      await waitFor(() => {
        expect(screen.getByText("2 of 2 users")).toBeInTheDocument();
      });

      // Search for something
      const searchInput = screen.getByRole("textbox");
      await user.type(searchInput, "John");

      expect(
        screen.getByText('1 of 2 users matching "John"')
      ).toBeInTheDocument();
    });

    it("should handle no search results", async () => {
      const user = userEvent.setup();

      // Search for something that doesn't exist
      const searchInput = screen.getByRole("textbox");
      await user.type(searchInput, "NonExistentUser");

      expect(
        screen.getByText('0 of 2 users matching "NonExistentUser"')
      ).toBeInTheDocument();
      expect(screen.queryByText("John Doe")).not.toBeInTheDocument();
      expect(screen.queryByText("Jane Smith")).not.toBeInTheDocument();
    });

    it("should be case insensitive", async () => {
      const user = userEvent.setup();

      // Search with different cases
      const searchInput = screen.getByRole("textbox");
      await user.type(searchInput, "JOHN");

      expect(screen.getByText("John Doe")).toBeInTheDocument();
      expect(screen.queryByText("Jane Smith")).not.toBeInTheDocument();
    });

    it("should search within partial matches", async () => {
      const user = userEvent.setup();

      // Search with partial match
      const searchInput = screen.getByRole("textbox");
      await user.type(searchInput, "doe");

      expect(screen.getByText("John Doe")).toBeInTheDocument();
      expect(screen.queryByText("Jane Smith")).not.toBeInTheDocument();
    });
  });
});
