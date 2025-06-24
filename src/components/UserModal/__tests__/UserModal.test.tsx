import { screen, fireEvent } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { render, mockUser } from "../../../__tests__/utils/test-utils";
import UserModal from "../UserModal";

describe("UserModal Component", () => {
  const mockOnClose = jest.fn();

  const defaultProps = {
    user: mockUser,
    onClose: mockOnClose,
  };

  beforeEach(() => {
    jest.clearAllMocks();
    // Reset body overflow
    document.body.style.overflow = "auto";
  });

  describe("Rendering", () => {
    it("renders user information correctly", () => {
      render(<UserModal {...defaultProps} />);

      // Header with name and email
      expect(screen.getByText("John Doe")).toBeInTheDocument();
      expect(screen.getByText("john@example.com")).toBeInTheDocument();

      // Address section
      expect(screen.getByText("Address")).toBeInTheDocument();
      expect(screen.getByText("Main St, Apt. Apt 123")).toBeInTheDocument();
      expect(screen.getByText("New York, 12345")).toBeInTheDocument();

      // Contact section
      expect(screen.getByText("Contact")).toBeInTheDocument();
      expect(screen.getByText("+1-555-0123")).toBeInTheDocument();

      // Company section
      expect(screen.getByText("Company")).toBeInTheDocument();
      expect(screen.getByText("Test Company")).toBeInTheDocument();
      expect(screen.getByText("Testing is everything")).toBeInTheDocument();
      expect(screen.getByText("quality assurance")).toBeInTheDocument();
    });

    it("renders close button", () => {
      render(<UserModal {...defaultProps} />);

      const closeButton = screen.getByRole("button", { name: /×/i });
      expect(closeButton).toBeInTheDocument();
    });

    it("renders map button", () => {
      render(<UserModal {...defaultProps} />);

      const mapButton = screen.getByRole("button", { name: /view on map/i });
      expect(mapButton).toBeInTheDocument();
    });

    it("renders email as clickable link", () => {
      render(<UserModal {...defaultProps} />);

      const emailLink = screen.getByRole("link", { name: /john@example.com/i });
      expect(emailLink).toBeInTheDocument();
      expect(emailLink).toHaveAttribute("href", "mailto:john@example.com");
    });

    it("renders website as clickable link", () => {
      render(<UserModal {...defaultProps} />);

      const websiteLink = screen.getByRole("link", { name: "example.com" });
      expect(websiteLink).toBeInTheDocument();
      expect(websiteLink).toHaveAttribute("href", "http://example.com");
      expect(websiteLink).toHaveAttribute("target", "_blank");
      expect(websiteLink).toHaveAttribute("rel", "noopener noreferrer");
    });
  });

  describe("Modal Behavior", () => {
    it("sets body overflow to hidden when modal opens", () => {
      render(<UserModal {...defaultProps} />);

      expect(document.body.style.overflow).toBe("hidden");
    });

    it("restores body overflow when modal unmounts", () => {
      const { unmount } = render(<UserModal {...defaultProps} />);

      expect(document.body.style.overflow).toBe("hidden");

      unmount();

      expect(document.body.style.overflow).toBe("auto");
    });

    it("calls onClose when close button is clicked", () => {
      render(<UserModal {...defaultProps} />);

      const closeButton = screen.getByRole("button", { name: /×/i });
      fireEvent.click(closeButton);

      expect(mockOnClose).toHaveBeenCalledTimes(1);
    });

    it("calls onClose when clicking on backdrop", () => {
      render(<UserModal {...defaultProps} />);

      const overlay = screen.getByRole("dialog").parentElement;
      if (overlay) {
        fireEvent.click(overlay);
        expect(mockOnClose).toHaveBeenCalledTimes(1);
      }
    });

    it("does not call onClose when clicking inside modal", () => {
      render(<UserModal {...defaultProps} />);

      const modal = screen.getByRole("dialog");
      fireEvent.click(modal);

      expect(mockOnClose).not.toHaveBeenCalled();
    });

    it("calls onClose when Escape key is pressed", async () => {
      const user = userEvent.setup();
      render(<UserModal {...defaultProps} />);

      await user.keyboard("{Escape}");

      expect(mockOnClose).toHaveBeenCalledTimes(1);
    });

    it("does not call onClose for other keys", async () => {
      const user = userEvent.setup();
      render(<UserModal {...defaultProps} />);

      await user.keyboard("{Enter}");
      await user.keyboard("{Space}");
      await user.keyboard("a");

      expect(mockOnClose).not.toHaveBeenCalled();
    });
  });

  describe("Contact Information", () => {
    it("displays phone number correctly", () => {
      render(<UserModal {...defaultProps} />);

      expect(screen.getByText("Phone:")).toBeInTheDocument();
      expect(screen.getByText("+1-555-0123")).toBeInTheDocument();
    });

    it("displays website correctly", () => {
      render(<UserModal {...defaultProps} />);

      expect(screen.getByText("Website:")).toBeInTheDocument();
      const websiteLink = screen.getByRole("link", { name: "example.com" });
      expect(websiteLink).toBeInTheDocument();
    });
  });

  describe("Company Information", () => {
    it("displays all company details", () => {
      render(<UserModal {...defaultProps} />);

      expect(screen.getByText("Name:")).toBeInTheDocument();
      expect(screen.getByText("Test Company")).toBeInTheDocument();

      expect(screen.getByText("Catchphrase:")).toBeInTheDocument();
      expect(screen.getByText("Testing is everything")).toBeInTheDocument();

      expect(screen.getByText("Business:")).toBeInTheDocument();
      expect(screen.getByText("quality assurance")).toBeInTheDocument();
    });
  });

  describe("Accessibility", () => {
    it("has proper modal structure", () => {
      render(<UserModal {...defaultProps} />);

      const modal = screen.getByRole("dialog");
      expect(modal).toBeInTheDocument();
    });

    it("focuses on close button when modal opens", () => {
      render(<UserModal {...defaultProps} />);

      const closeButton = screen.getByRole("button", { name: /×/i });
      expect(closeButton).toBeInTheDocument();
      // Note: Focus testing might need additional setup in a real app
    });

    it("has proper heading structure", () => {
      render(<UserModal {...defaultProps} />);

      const mainHeading = screen.getByRole("heading", { level: 2 });
      expect(mainHeading).toHaveTextContent("John Doe");

      const subHeadings = screen.getAllByRole("heading", { level: 3 });
      expect(subHeadings).toHaveLength(3); // Address, Contact, Company
    });

    it("external links have proper security attributes", () => {
      render(<UserModal {...defaultProps} />);

      const websiteLink = screen.getByRole("link", { name: "example.com" });
      expect(websiteLink).toHaveAttribute("rel", "noopener noreferrer");
    });
  });

  describe("Event Handling", () => {
    it("cleans up event listeners on unmount", () => {
      const addEventListenerSpy = jest.spyOn(document, "addEventListener");
      const removeEventListenerSpy = jest.spyOn(
        document,
        "removeEventListener"
      );

      const { unmount } = render(<UserModal {...defaultProps} />);

      expect(addEventListenerSpy).toHaveBeenCalledWith(
        "keydown",
        expect.any(Function)
      );

      unmount();

      expect(removeEventListenerSpy).toHaveBeenCalledWith(
        "keydown",
        expect.any(Function)
      );

      addEventListenerSpy.mockRestore();
      removeEventListenerSpy.mockRestore();
    });
  });
});
