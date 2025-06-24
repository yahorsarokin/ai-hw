import { screen, fireEvent } from "@testing-library/react";
import {
  render,
  mockUsers,
  mockUser,
} from "../../../__tests__/utils/test-utils";
import UserTable from "../UserTable";

describe("UserTable Component", () => {
  const mockOnUserClick = jest.fn();
  const mockOnDeleteUser = jest.fn();

  const defaultProps = {
    users: mockUsers,
    onUserClick: mockOnUserClick,
    onDeleteUser: mockOnDeleteUser,
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe("Rendering", () => {
    it("renders the table with correct headers", () => {
      render(<UserTable {...defaultProps} />);

      expect(screen.getByText("NAME / EMAIL")).toBeInTheDocument();
      expect(screen.getByText("ADDRESS")).toBeInTheDocument();
      expect(screen.getByText("PHONE")).toBeInTheDocument();
      expect(screen.getByText("WEBSITE")).toBeInTheDocument();
      expect(screen.getByText("COMPANY")).toBeInTheDocument();
      expect(screen.getByText("ACTION")).toBeInTheDocument();
    });

    it("renders all users in the table", () => {
      render(<UserTable {...defaultProps} />);

      expect(screen.getByText("John Doe")).toBeInTheDocument();
      expect(screen.getByText("jane@example.com")).toBeInTheDocument();
      expect(screen.getByText("Test Company")).toBeInTheDocument();
      expect(screen.getByText("Another Company")).toBeInTheDocument();
    });

    it("renders user information correctly", () => {
      render(<UserTable {...defaultProps} users={[mockUser]} />);

      // Check name and email
      expect(screen.getByText("John Doe")).toBeInTheDocument();
      expect(screen.getByText("john@example.com")).toBeInTheDocument();

      // Check address formatting
      expect(
        screen.getByText("Main St, Apt 123, New York, 12345")
      ).toBeInTheDocument();

      // Check phone
      expect(screen.getByText("+1-555-0123")).toBeInTheDocument();

      // Check company
      expect(screen.getByText("Test Company")).toBeInTheDocument();
    });

    it("renders website as clickable link", () => {
      render(<UserTable {...defaultProps} users={[mockUser]} />);

      const websiteLink = screen.getByRole("link", { name: /example.com/i });
      expect(websiteLink).toBeInTheDocument();
      expect(websiteLink).toHaveAttribute("href", "http://example.com");
      expect(websiteLink).toHaveAttribute("target", "_blank");
      expect(websiteLink).toHaveAttribute("rel", "noopener noreferrer");
    });

    it("renders delete button for each user", () => {
      render(<UserTable {...defaultProps} />);

      const deleteButtons = screen.getAllByLabelText(/delete/i);
      expect(deleteButtons).toHaveLength(mockUsers.length);
    });
  });

  describe("User Interactions", () => {
    it("calls onUserClick when clicking on user row", () => {
      render(<UserTable {...defaultProps} users={[mockUser]} />);

      const nameCell = screen.getByText("John Doe");
      fireEvent.click(nameCell);

      expect(mockOnUserClick).toHaveBeenCalledTimes(1);
      expect(mockOnUserClick).toHaveBeenCalledWith(mockUser);
    });

    it("calls onUserClick when clicking on address cell", () => {
      render(<UserTable {...defaultProps} users={[mockUser]} />);

      const addressCell = screen.getByText("Main St, Apt 123, New York, 12345");
      fireEvent.click(addressCell);

      expect(mockOnUserClick).toHaveBeenCalledWith(mockUser);
    });

    it("calls onDeleteUser when clicking delete button", () => {
      render(<UserTable {...defaultProps} users={[mockUser]} />);

      const deleteButton = screen.getByLabelText("Delete John Doe");
      fireEvent.click(deleteButton);

      expect(mockOnDeleteUser).toHaveBeenCalledTimes(1);
      expect(mockOnDeleteUser).toHaveBeenCalledWith(mockUser.id);
    });

    it("does not call onUserClick when clicking on website link", () => {
      render(<UserTable {...defaultProps} users={[mockUser]} />);

      const websiteLink = screen.getByRole("link", { name: /example.com/i });
      fireEvent.click(websiteLink);

      expect(mockOnUserClick).not.toHaveBeenCalled();
    });

    it("does not call onUserClick when clicking delete button", () => {
      render(<UserTable {...defaultProps} users={[mockUser]} />);

      const deleteButton = screen.getByLabelText("Delete John Doe");
      fireEvent.click(deleteButton);

      expect(mockOnUserClick).not.toHaveBeenCalled();
    });
  });

  describe("Edge Cases", () => {
    it("renders empty table when no users provided", () => {
      render(<UserTable {...defaultProps} users={[]} />);

      // Headers should still be present
      expect(screen.getByText("NAME / EMAIL")).toBeInTheDocument();

      // But no user data
      expect(screen.queryByText("John Doe")).not.toBeInTheDocument();
    });

    it("handles users with missing or undefined properties gracefully", () => {
      const incompleteUser = {
        ...mockUser,
        address: {
          ...mockUser.address,
          suite: "",
        },
        company: {
          ...mockUser.company,
          name: "",
        },
      };

      render(<UserTable {...defaultProps} users={[incompleteUser]} />);

      // Should still render without crashing
      expect(screen.getByText("John Doe")).toBeInTheDocument();
    });
  });

  describe("Accessibility", () => {
    it("has proper table structure", () => {
      render(<UserTable {...defaultProps} />);

      const table = screen.getByRole("table");
      expect(table).toBeInTheDocument();

      const headers = screen.getAllByRole("columnheader");
      expect(headers).toHaveLength(6);
    });

    it("delete buttons have proper aria labels", () => {
      render(<UserTable {...defaultProps} users={[mockUser]} />);

      const deleteButton = screen.getByLabelText("Delete John Doe");
      expect(deleteButton).toBeInTheDocument();
    });

    it("website links have proper accessibility attributes", () => {
      render(<UserTable {...defaultProps} users={[mockUser]} />);

      const websiteLink = screen.getByRole("link", { name: /example.com/i });
      expect(websiteLink).toHaveAttribute("rel", "noopener noreferrer");
    });
  });
});
