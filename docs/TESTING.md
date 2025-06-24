# Testing Guidelines and Standards

This document outlines the testing standards, rules, and best practices for the User Data Management application.

## 📋 Testing Framework Stack

- **Jest**: Primary testing framework
- **React Testing Library**: React component testing
- **Jest DOM**: Custom Jest matchers for DOM testing
- **User Event**: User interaction simulation
- **TypeScript**: Type safety in tests

## 🎯 Coverage Requirements

### Minimum Coverage Thresholds

- **Lines**: 80%
- **Functions**: 80%
- **Branches**: 80%
- **Statements**: 80%

### Coverage Commands

```bash
npm run test:coverage      # Run tests with coverage report
npm run test:ci           # CI-optimized test run with coverage
```

## 🏗️ Test Structure and Organization

### File Naming Conventions

- Unit tests: `ComponentName.test.tsx`
- Integration tests: `App.test.tsx` or `feature.integration.test.tsx`
- Test utilities: `test-utils.tsx`
- Mock data: `mockData.ts`

### Directory Structure

```
src/
├── __tests__/
│   ├── utils/
│   │   └── test-utils.tsx
│   └── App.test.tsx
├── components/
│   └── ComponentName/
│       ├── __tests__/
│       │   └── ComponentName.test.tsx
│       ├── ComponentName.tsx
│       └── ComponentName.module.css
```

### Test Organization

Each test file should be organized with `describe` blocks:

```typescript
describe("ComponentName", () => {
  describe("Rendering", () => {
    // Tests for component rendering
  });

  describe("User Interactions", () => {
    // Tests for user event handling
  });

  describe("Edge Cases", () => {
    // Tests for error states and edge cases
  });

  describe("Accessibility", () => {
    // Tests for accessibility features
  });
});
```

## 🧪 Testing Standards

### 1. Test Naming

- Use descriptive test names that explain the expected behavior
- Follow the pattern: "should [expected behavior] when [condition]"
- Use `it()` consistently instead of `test()`

```typescript
// ✅ Good
it("should call onUserClick when clicking on user row", () => {});

// ❌ Bad
it("clicks user", () => {});
```

### 2. Test Independence

- Each test should be independent and not rely on other tests
- Use `beforeEach` and `afterEach` for setup and cleanup
- Always clean up mocks and DOM state

```typescript
beforeEach(() => {
  jest.clearAllMocks();
  document.body.style.overflow = "auto";
});
```

### 3. Mocking Strategy

- Mock external dependencies (APIs, third-party libraries)
- Use `jest.fn()` for function mocks
- Provide mock data that represents realistic scenarios

```typescript
// Mock fetch globally
global.fetch = jest.fn();

// Mock successful API response
export const mockFetchSuccess = (data: any) => {
  (global.fetch as jest.Mock).mockResolvedValueOnce({
    ok: true,
    json: async () => data,
  });
};
```

### 4. Async Testing

- Use `waitFor` for asynchronous operations
- Prefer `findBy` queries for elements that appear asynchronously
- Always await asynchronous operations

```typescript
// ✅ Good
await waitFor(() => {
  expect(screen.getByText("Loading...")).not.toBeInTheDocument();
});

// ✅ Good
const button = await screen.findByRole("button", { name: /submit/i });
```

### 5. User-Centric Testing

- Test from the user's perspective
- Use accessible queries (getByRole, getByLabelText, etc.)
- Simulate real user interactions

```typescript
// ✅ Good - Tests user interaction
const deleteButton = screen.getByLabelText("Delete John Doe");
await user.click(deleteButton);

// ❌ Bad - Tests implementation details
const deleteButton = container.querySelector(".delete-button");
```

## 🎨 Query Priority (React Testing Library)

Use queries in this order of preference:

1. **Accessible to everyone**: `getByRole`, `getByLabelText`, `getByPlaceholderText`, `getByText`
2. **Semantic queries**: `getByAltText`, `getByTitle`
3. **Test IDs**: `getByTestId` (only as last resort)

## 🚦 Test Categories

### Unit Tests

Test individual components in isolation:

- Rendering with different props
- Event handling
- State changes
- Edge cases and error states

### Integration Tests

Test component interactions and data flow:

- API integration
- User workflows
- Component communication
- End-to-end scenarios

### Accessibility Tests

Ensure components are accessible:

- Proper ARIA attributes
- Keyboard navigation
- Screen reader compatibility
- Focus management

## 📊 Testing Best Practices

### 1. Arrange, Act, Assert (AAA) Pattern

```typescript
it("should delete user when delete button is clicked", () => {
  // Arrange
  const mockOnDelete = jest.fn();
  render(<UserTable users={[mockUser]} onDeleteUser={mockOnDelete} />);

  // Act
  const deleteButton = screen.getByLabelText("Delete John Doe");
  fireEvent.click(deleteButton);

  // Assert
  expect(mockOnDelete).toHaveBeenCalledWith(mockUser.id);
});
```

### 2. Test Behavior, Not Implementation

```typescript
// ✅ Good - Tests behavior
it("should display user information when modal opens", () => {
  render(<UserModal user={mockUser} onClose={jest.fn()} />);
  expect(screen.getByText("John Doe")).toBeInTheDocument();
});

// ❌ Bad - Tests implementation
it("should set selectedUser state when user is clicked", () => {
  // Testing internal state
});
```

### 3. Mock External Dependencies

```typescript
// Mock API calls
beforeEach(() => {
  global.fetch = jest.fn();
});

// Mock timers when needed
beforeEach(() => {
  jest.useFakeTimers();
});

afterEach(() => {
  jest.useRealTimers();
});
```

### 4. Test Error States

```typescript
it("should display error message when API fails", async () => {
  mockFetchError("Network error");

  render(<App />);

  await waitFor(() => {
    expect(screen.getByText(/Error: Network error/)).toBeInTheDocument();
  });
});
```

## 🛠️ Common Testing Utilities

### Custom Render Function

```typescript
const customRender = (ui: React.ReactElement, options?: RenderOptions) => {
  return render(ui, options);
};

export { customRender as render };
```

### Mock Data Factory

```typescript
export const createMockUser = (overrides: Partial<User> = {}): User => ({
  id: 1,
  name: "John Doe",
  email: "john@example.com",
  // ... other properties
  ...overrides,
});
```

### Helper Functions

```typescript
export const waitForLoadingToFinish = async () => {
  await waitFor(() => {
    expect(screen.queryByText("Loading...")).not.toBeInTheDocument();
  });
};
```

## 🚨 Common Pitfalls to Avoid

1. **Testing Implementation Details**: Don't test internal state or component methods
2. **Overmocking**: Only mock what's necessary; prefer real implementations when possible
3. **Brittle Selectors**: Use semantic queries instead of CSS selectors
4. **Async Issues**: Always wait for async operations to complete
5. **Test Pollution**: Ensure tests don't affect each other

## 📈 Continuous Improvement

### Code Reviews

- All tests must be reviewed before merging
- Focus on test quality, not just coverage
- Ensure tests add value and catch real bugs

### Test Maintenance

- Update tests when requirements change
- Remove obsolete tests
- Refactor tests to reduce duplication

### Performance

- Keep tests fast by avoiding unnecessary renders
- Use `screen.debug()` sparingly for debugging
- Prefer `screen` over destructuring `render()` result

## 🎯 Testing Checklist

Before submitting code, ensure:

- [ ] All tests pass (`npm test`)
- [ ] Coverage thresholds are met (`npm run test:coverage`)
- [ ] Tests follow naming conventions
- [ ] Edge cases are covered
- [ ] Error states are tested
- [ ] Accessibility is verified
- [ ] Async operations are properly awaited
- [ ] Mocks are cleaned up
- [ ] Tests are independent and isolated

## 📚 Additional Resources

- [Testing Library Documentation](https://testing-library.com/)
- [Jest Documentation](https://jestjs.io/)
- [React Testing Library Cheatsheet](https://testing-library.com/docs/react-testing-library/cheatsheet)
- [Common Mistakes with React Testing Library](https://kentcdodds.com/blog/common-mistakes-with-react-testing-library)
