import "@testing-library/jest-dom";

// Mock fetch for API calls
global.fetch = jest.fn();

// Mock window.alert
global.alert = jest.fn();

// Mock console methods to reduce noise in tests
global.console = {
  ...console,
  // Uncomment to ignore a specific log level
  // log: jest.fn(),
  // debug: jest.fn(),
  // info: jest.fn(),
  // warn: jest.fn(),
  // error: jest.fn(),
};

// Setup intersectionObserver mock
global.IntersectionObserver = jest.fn().mockImplementation(() => ({
  observe: jest.fn(),
  disconnect: jest.fn(),
  unobserve: jest.fn(),
}));

// Clean up after each test
afterEach(() => {
  jest.clearAllMocks();
  document.body.style.overflow = "auto"; // Reset body overflow after modal tests
});
