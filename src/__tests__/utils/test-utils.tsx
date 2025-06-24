import React from "react";
import { render, RenderOptions } from "@testing-library/react";
import { User } from "../../types/User";

// Custom render function that can be extended with providers if needed
const customRender = (ui: React.ReactElement, options?: RenderOptions) => {
  return render(ui, options);
};

// Mock user data for testing
export const mockUser: User = {
  id: 1,
  name: "John Doe",
  username: "johndoe",
  email: "john@example.com",
  address: {
    street: "Main St",
    suite: "Apt 123",
    city: "New York",
    zipcode: "12345",
    geo: {
      lat: "40.7128",
      lng: "-74.0060",
    },
  },
  phone: "+1-555-0123",
  website: "example.com",
  company: {
    name: "Test Company",
    catchPhrase: "Testing is everything",
    bs: "quality assurance",
  },
};

export const mockUsers: User[] = [
  mockUser,
  {
    ...mockUser,
    id: 2,
    name: "Jane Smith",
    username: "janesmith",
    email: "jane@example.com",
    company: {
      name: "Another Company",
      catchPhrase: "Innovation at its best",
      bs: "innovative solutions",
    },
  },
];

// Mock successful API response
export const mockFetchSuccess = (data: any) => {
  (global.fetch as jest.Mock).mockResolvedValueOnce({
    ok: true,
    json: async () => data,
  });
};

// Mock failed API response
export const mockFetchError = (error: string = "API Error") => {
  (global.fetch as jest.Mock).mockRejectedValueOnce(new Error(error));
};

// Helper to wait for loading states
export const waitForLoadingToFinish = async () => {
  await new Promise((resolve) => setTimeout(resolve, 0));
};

// Re-export everything from testing library
export * from "@testing-library/react";
export { customRender as render };
