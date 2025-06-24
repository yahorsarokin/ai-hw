# Contributing Guide

Welcome to the User Data Management project! This guide will help you understand how to contribute effectively to the project.

## 🌟 Getting Started

### Prerequisites

Before contributing, ensure you have:

- **Node.js**: Version 18.0.0 or higher
- **npm**: Version 8.0.0 or higher
- **Git**: For version control
- **Code Editor**: VSCode recommended with our extension pack

### Development Setup

1. **Fork the repository**

   ```bash
   # Fork via GitHub UI, then clone your fork
   git clone https://github.com/your-username/user-data-management.git
   cd user-data-management
   ```

2. **Add upstream remote**

   ```bash
   git remote add upstream https://github.com/original-org/user-data-management.git
   ```

3. **Install dependencies**

   ```bash
   npm install
   ```

4. **Verify setup**
   ```bash
   npm test
   npm run dev
   ```

## 🎯 Ways to Contribute

### Bug Reports

Before creating a bug report:

- Check existing issues to avoid duplicates
- Use the latest version of the application
- Test in different browsers (if applicable)

#### Bug Report Template

```markdown
**Bug Description**
A clear description of what the bug is.

**To Reproduce**
Steps to reproduce the behavior:

1. Go to '...'
2. Click on '....'
3. Scroll down to '....'
4. See error

**Expected Behavior**
What you expected to happen.

**Screenshots**
If applicable, add screenshots to help explain your problem.

**Environment:**

- OS: [e.g. Windows 10, macOS 12]
- Browser: [e.g. Chrome 96, Firefox 95]
- Node.js: [e.g. 18.0.0]
- App Version: [e.g. 1.2.3]

**Additional Context**
Any other context about the problem.
```

### Feature Requests

For new features:

- Check if the feature already exists or is planned
- Ensure it aligns with project goals
- Consider if it could be implemented as a plugin

#### Feature Request Template

```markdown
**Feature Description**
A clear description of what you want to add.

**Problem Statement**
What problem does this feature solve?

**Proposed Solution**
Describe your solution in detail.

**Alternatives Considered**
Other solutions you've considered.

**Additional Context**
Mockups, examples, or other relevant information.
```

### Code Contributions

#### Types of Code Contributions

- **Bug fixes**: Resolve existing issues
- **New features**: Add functionality (discuss first)
- **Performance improvements**: Optimize existing code
- **Documentation**: Improve or add documentation
- **Tests**: Add or improve test coverage

## 🔧 Development Workflow

### Branch Strategy

We use a Git Flow-inspired workflow:

```
main                 # Production-ready code
├── develop          # Integration branch
├── feature/xxx      # New features
├── bugfix/xxx       # Bug fixes
├── hotfix/xxx       # Critical production fixes
└── docs/xxx         # Documentation updates
```

### Creating a Feature Branch

```bash
# Start from develop branch
git checkout develop
git pull upstream develop

# Create feature branch
git checkout -b feature/your-feature-name

# Work on your feature
# ... make changes ...

# Push to your fork
git push origin feature/your-feature-name
```

### Commit Guidelines

#### Commit Message Format

We follow the [Conventional Commits](https://www.conventionalcommits.org/) specification:

```
type(scope): description

[optional body]

[optional footer]
```

#### Types

- `feat`: New feature
- `fix`: Bug fix
- `docs`: Documentation changes
- `style`: Code style changes (formatting, etc.)
- `refactor`: Code refactoring without feature changes
- `perf`: Performance improvements
- `test`: Adding or updating tests
- `chore`: Build process or auxiliary tool changes
- `ci`: CI/CD changes

#### Examples

```bash
feat(UserTable): add sorting functionality
fix(UserModal): resolve keyboard navigation issue
docs(API): update component documentation
test(UserTable): add integration tests for delete functionality
refactor(App): extract user management logic to custom hook
```

#### Detailed Commit Body

For complex changes, include details in the commit body:

```
feat(UserTable): add sorting functionality

- Add ascending/descending sort for all columns
- Implement keyboard navigation for sort controls
- Add visual indicators for current sort state
- Include accessibility improvements for screen readers

Closes #123
```

### Pull Request Process

#### Before Creating a PR

1. **Sync with upstream**

   ```bash
   git checkout develop
   git pull upstream develop
   git checkout feature/your-feature-name
   git rebase develop
   ```

2. **Run all checks**

   ```bash
   npm run lint          # Check code style
   npm run type-check    # TypeScript checks
   npm test              # Run all tests
   npm run build         # Verify build
   ```

3. **Update documentation**
   - Update relevant documentation files
   - Add/update component documentation
   - Update API documentation if needed

#### Creating the Pull Request

1. **Push your branch**

   ```bash
   git push origin feature/your-feature-name
   ```

2. **Create PR via GitHub**
   - Use the PR template
   - Link related issues
   - Add appropriate labels
   - Request reviewers

#### Pull Request Template

```markdown
## Description

Brief description of changes made.

## Type of Change

- [ ] Bug fix (non-breaking change that fixes an issue)
- [ ] New feature (non-breaking change that adds functionality)
- [ ] Breaking change (fix or feature that causes existing functionality to not work as expected)
- [ ] Documentation update
- [ ] Performance improvement
- [ ] Code refactoring

## Related Issues

Closes #(issue_number)
Relates to #(issue_number)

## Testing

Describe the tests you ran:

- [ ] Unit tests pass
- [ ] Integration tests pass
- [ ] Manual testing completed
- [ ] Cross-browser testing (if applicable)

## Screenshots (if applicable)

Add screenshots for UI changes.

## Checklist

- [ ] My code follows the style guidelines
- [ ] I have performed a self-review
- [ ] I have commented my code where necessary
- [ ] I have made corresponding changes to documentation
- [ ] My changes generate no new warnings
- [ ] I have added tests that prove my fix is effective or feature works
- [ ] New and existing unit tests pass locally
- [ ] Any dependent changes have been merged and published
```

### Code Review Process

#### For Authors

- Respond to feedback promptly
- Address all review comments
- Push additional commits to address feedback
- Squash commits before merge (if requested)

#### For Reviewers

Review criteria:

- **Functionality**: Does the code work as intended?
- **Code Quality**: Is the code clean, readable, and maintainable?
- **Testing**: Are there adequate tests?
- **Documentation**: Is documentation updated?
- **Performance**: Are there any performance implications?
- **Security**: Are there any security concerns?

## 📋 Code Standards

### TypeScript Guidelines

#### Strict Type Checking

```typescript
// ✅ Good: Explicit types
interface UserProps {
  user: User;
  onSelect: (user: User) => void;
}

// ❌ Bad: Any types
function handleUser(user: any) {
  // ...
}
```

#### Naming Conventions

```typescript
// ✅ Components: PascalCase
const UserModal: React.FC<UserModalProps> = ({ user, onClose }) => {
  // ...
};

// ✅ Functions: camelCase
const formatUserName = (user: User): string => {
  // ...
};

// ✅ Constants: SCREAMING_SNAKE_CASE
const API_ENDPOINTS = {
  USERS: "/api/users",
} as const;

// ✅ Interfaces: PascalCase with 'I' prefix (optional)
interface UserData {
  id: number;
  name: string;
}
```

### React Guidelines

#### Component Structure

```typescript
// 1. Imports
import React, { useState, useEffect } from "react";
import styles from "./Component.module.css";

// 2. Types
interface ComponentProps {
  prop1: string;
  prop2?: number;
}

// 3. Component
const Component: React.FC<ComponentProps> = ({ prop1, prop2 = 0 }) => {
  // 4. Hooks
  const [state, setState] = useState<string>("");

  // 5. Event handlers
  const handleClick = () => {
    setState("clicked");
  };

  // 6. Effects
  useEffect(() => {
    // Effect logic
  }, []);

  // 7. Render
  return <div className={styles.container}>{/* JSX */}</div>;
};

export default Component;
```

#### Hooks Guidelines

```typescript
// ✅ Custom hooks start with 'use'
const useUserData = () => {
  const [users, setUsers] = useState<User[]>([]);
  // ... hook logic
  return { users, setUsers };
};

// ✅ Proper dependency arrays
useEffect(() => {
  fetchUsers();
}, []); // Empty for mount only

useEffect(() => {
  updateUser(selectedUser);
}, [selectedUser]); // Include dependencies
```

### CSS Guidelines

#### CSS Modules

```css
/* Component.module.css */
.container {
  /* Use meaningful class names */
  padding: var(--spacing-md);
  border-radius: var(--border-radius);
}

.header {
  /* Follow BEM-like conventions */
  margin-bottom: var(--spacing-sm);
}

.button {
  /* Base styles */
  padding: var(--spacing-sm) var(--spacing-md);
  border: none;
  border-radius: var(--border-radius);
}

.buttonPrimary {
  /* Modifier classes */
  background-color: var(--color-primary);
  color: var(--color-white);
}
```

#### Responsive Design

```css
/* Mobile-first approach */
.container {
  width: 100%;
  padding: 1rem;
}

@media (min-width: 768px) {
  .container {
    width: 80%;
    padding: 2rem;
  }
}

@media (min-width: 1024px) {
  .container {
    width: 60%;
    padding: 3rem;
  }
}
```

## 🧪 Testing Guidelines

### Test Structure

```typescript
// ComponentName.test.tsx
import { render, screen, fireEvent } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import ComponentName from "./ComponentName";

// Mock dependencies
jest.mock("../api/userService");

describe("ComponentName", () => {
  // Setup and teardown
  beforeEach(() => {
    jest.clearAllMocks();
  });

  // Group related tests
  describe("rendering", () => {
    it("should render with required props", () => {
      render(<ComponentName prop="value" />);
      expect(screen.getByText("Expected text")).toBeInTheDocument();
    });
  });

  describe("user interactions", () => {
    it("should handle click events", async () => {
      const user = userEvent.setup();
      const mockHandler = jest.fn();

      render(<ComponentName onClick={mockHandler} />);

      await user.click(screen.getByRole("button"));
      expect(mockHandler).toHaveBeenCalledTimes(1);
    });
  });

  describe("edge cases", () => {
    it("should handle empty data gracefully", () => {
      render(<ComponentName data={[]} />);
      expect(screen.getByText("No data available")).toBeInTheDocument();
    });
  });
});
```

### Testing Best Practices

- **Test behavior, not implementation**
- **Use descriptive test names**
- **Follow AAA pattern (Arrange, Act, Assert)**
- **Mock external dependencies**
- **Test edge cases and error conditions**
- **Aim for 80%+ code coverage**

## 📚 Documentation Standards

### Component Documentation

Each component should have a README.md file:

```markdown
# ComponentName

Brief description of the component.

## Props

[Document all props with types and descriptions]

## Usage

[Provide usage examples]

## Accessibility

[Document accessibility features]

## Testing

[Document testing approach]
```

### API Documentation

Update `docs/API.md` when:

- Adding new components
- Changing component interfaces
- Adding new utilities or hooks

### Inline Documentation

```typescript
/**
 * Formats a user's full name for display
 * @param user - User object containing name information
 * @returns Formatted full name string
 * @example
 * formatUserName({ firstName: 'John', lastName: 'Doe' })
 * // Returns: 'John Doe'
 */
const formatUserName = (user: User): string => {
  return `${user.firstName} ${user.lastName}`;
};
```

## 🚨 Security Guidelines

### Input Validation

```typescript
// ✅ Validate and sanitize inputs
const validateEmail = (email: string): boolean => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

// ✅ Handle user input safely
const UserComponent = ({ userInput }: { userInput: string }) => {
  const sanitizedInput = DOMPurify.sanitize(userInput);
  return <div dangerouslySetInnerHTML={{ __html: sanitizedInput }} />;
};
```

### External Links

```tsx
// ✅ Safe external links
<a href={user.website} target="_blank" rel="noopener noreferrer">
  Visit Website
</a>
```

## 🎉 Recognition

### Contributors

We recognize contributors through:

- GitHub contributor graphs
- CONTRIBUTORS.md file
- Release notes mentions
- Community highlights

### First-Time Contributors

Special recognition for first-time contributors:

- Mentorship and guidance
- "Good first issue" labels
- Detailed code review feedback
- Welcome message in PR

## 📞 Getting Help

### Community Resources

- **GitHub Discussions**: For questions and general discussion
- **Issues**: For bug reports and feature requests
- **Discord/Slack**: For real-time communication (if available)

### Code of Conduct

Please read and follow our [Code of Conduct](CODE_OF_CONDUCT.md).

### Mentorship

New contributors can request mentorship for:

- Understanding the codebase
- Learning best practices
- Guidance on specific contributions

---

## 🎯 Quick Reference

### Essential Commands

```bash
npm install          # Install dependencies
npm run dev          # Start development server
npm test             # Run tests
npm run lint         # Check code style
npm run type-check   # TypeScript validation
npm run build        # Create production build
```

### Before Submitting

- [ ] Code follows style guidelines
- [ ] All tests pass
- [ ] Documentation updated
- [ ] Commit messages follow convention
- [ ] PR template completed

Thank you for contributing to the User Data Management project! 🙏
