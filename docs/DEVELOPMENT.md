# Development Guide

This document provides comprehensive instructions for setting up, developing, and contributing to the User Data Management application.

## 🚀 Quick Start

### Prerequisites

Before you begin, ensure you have the following installed:

- **Node.js**: Version 18.0.0 or higher
- **npm**: Version 8.0.0 or higher (comes with Node.js)
- **Git**: For version control
- **Code Editor**: VSCode recommended with extensions

### Installation

1. **Clone the repository**

   ```bash
   git clone https://github.com/your-org/user-data-management.git
   cd user-data-management
   ```

2. **Install dependencies**

   ```bash
   npm install
   ```

3. **Start development server**

   ```bash
   npm run dev
   ```

4. **Open in browser**
   Navigate to `http://localhost:5173` (or the port shown in terminal)

## 🛠️ Development Environment

### Recommended VSCode Extensions

Essential extensions for optimal development experience:

```json
{
  "recommendations": [
    "esbenp.prettier-vscode",
    "bradlc.vscode-tailwindcss",
    "ms-vscode.vscode-typescript-next",
    "ms-vscode.vscode-eslint",
    "ms-vscode.vscode-jest",
    "bradlc.vscode-tailwindcss"
  ]
}
```

### VSCode Settings

Create `.vscode/settings.json` with these recommended settings:

```json
{
  "editor.formatOnSave": true,
  "editor.defaultFormatter": "esbenp.prettier-vscode",
  "editor.codeActionsOnSave": {
    "source.fixAll.eslint": true
  },
  "typescript.preferences.importModuleSpecifier": "relative",
  "jest.autoRun": "off",
  "files.associations": {
    "*.css": "css"
  }
}
```

### Environment Variables

Create a `.env.local` file for local development:

```bash
# Development configuration
VITE_API_BASE_URL=https://jsonplaceholder.typicode.com
VITE_APP_TITLE="User Data Management"
VITE_APP_VERSION="1.0.0"
```

## 📁 Project Structure

```
src/
├── components/           # React components
│   ├── UserTable/       # User table component
│   │   ├── UserTable.tsx
│   │   ├── UserTable.module.css
│   │   └── __tests__/
│   └── UserModal/       # User modal component
│       ├── UserModal.tsx
│       ├── UserModal.module.css
│       └── __tests__/
├── types/               # TypeScript type definitions
│   └── User.ts
├── __tests__/          # Application-level tests
│   ├── App.test.tsx
│   └── utils/
│       └── test-utils.tsx
├── App.tsx             # Main application component
├── App.module.css      # Application-level styles
├── main.tsx            # Application entry point
├── index.css           # Global styles
├── setupTests.ts       # Test configuration
└── vite-env.d.ts       # Vite type declarations
```

### Directory Conventions

#### Components

- Each component has its own directory
- Component file: `ComponentName.tsx`
- Styles: `ComponentName.module.css`
- Tests: `__tests__/ComponentName.test.tsx`

#### Styling

- Use CSS Modules for component-specific styles
- Global styles in `src/index.css`
- Follow BEM naming convention within CSS modules

#### Types

- All TypeScript interfaces in `src/types/`
- Export from index files for clean imports
- Use PascalCase for interface names

## 🧪 Testing

### Running Tests

```bash
# Run all tests
npm test

# Run tests in watch mode
npm run test:watch

# Run tests with coverage
npm run test:coverage

# Run tests with verbose output
npm run test:verbose
```

### Test Structure

#### Unit Tests

- Test individual components in isolation
- Mock external dependencies
- Focus on component behavior and props

#### Integration Tests

- Test component interactions
- Test complete user workflows
- Use real DOM interactions

#### Test Files

```typescript
// Component.test.tsx structure
import { render, screen, fireEvent } from "@testing-library/react";
import Component from "./Component";

describe("Component", () => {
  it("should render correctly", () => {
    // Test implementation
  });

  it("should handle user interactions", () => {
    // Test implementation
  });
});
```

### Writing Good Tests

#### Best Practices

- Test behavior, not implementation details
- Use descriptive test names
- Arrange, Act, Assert pattern
- Mock external dependencies
- Test edge cases and error conditions

#### Test Utilities

```typescript
// Custom render function with providers
export function renderWithProviders(ui: React.ReactElement) {
  return render(ui, {
    wrapper: ({ children }) => <div data-testid="test-wrapper">{children}</div>,
  });
}
```

## 🎨 Styling Guidelines

### CSS Modules

#### Naming Conventions

```css
/* Component.module.css */
.container {
  /* Main container styles */
}

.header {
  /* Header section styles */
}

.button {
  /* Base button styles */
}

.buttonPrimary {
  /* Primary button variant */
}

.isActive {
  /* State modifier */
}
```

#### Best Practices

- Use camelCase for class names
- Prefix state classes with `is` or `has`
- Keep specificity low
- Use CSS custom properties for theming

### Responsive Design

#### Mobile-First Approach

```css
.component {
  /* Mobile styles (default) */
  width: 100%;
  padding: 1rem;
}

@media (min-width: 768px) {
  .component {
    /* Tablet styles */
    width: 80%;
    padding: 2rem;
  }
}

@media (min-width: 1024px) {
  .component {
    /* Desktop styles */
    width: 60%;
    padding: 3rem;
  }
}
```

#### Breakpoints

- Mobile: up to 767px
- Tablet: 768px to 1023px
- Desktop: 1024px and above

## 🔧 Development Workflow

### Branch Strategy

#### Main Branches

- `main`: Production-ready code
- `develop`: Integration branch for features

#### Feature Branches

- `feature/feature-name`: New features
- `bugfix/bug-description`: Bug fixes
- `hotfix/critical-fix`: Critical production fixes

### Commit Guidelines

#### Commit Message Format

```
type(scope): description

[optional body]

[optional footer]
```

#### Types

- `feat`: New feature
- `fix`: Bug fix
- `docs`: Documentation changes
- `style`: Code style changes
- `refactor`: Code refactoring
- `test`: Test additions or changes
- `chore`: Build process or auxiliary tool changes

#### Examples

```bash
feat(UserTable): add sorting functionality
fix(UserModal): resolve keyboard navigation issue
docs(API): update component documentation
test(UserTable): add integration tests
```

### Pull Request Process

#### Before Creating PR

1. Ensure all tests pass
2. Run linting and fix issues
3. Update documentation if needed
4. Add/update tests for changes
5. Test in different browsers

#### PR Template

```markdown
## Description

Brief description of changes

## Type of Change

- [ ] Bug fix
- [ ] New feature
- [ ] Breaking change
- [ ] Documentation update

## Testing

- [ ] Unit tests pass
- [ ] Integration tests pass
- [ ] Manual testing completed

## Checklist

- [ ] Code follows style guidelines
- [ ] Self-review completed
- [ ] Documentation updated
- [ ] Tests added/updated
```

## 🔍 Code Quality

### Linting

#### ESLint Configuration

The project uses ESLint with TypeScript and React rules:

```bash
# Run linting
npm run lint

# Fix auto-fixable issues
npm run lint:fix
```

#### Custom Rules

- Prefer functional components
- Require explicit return types for functions
- Enforce prop types for components
- Consistent import ordering

### Prettier Configuration

```json
{
  "semi": true,
  "trailingComma": "es5",
  "singleQuote": true,
  "printWidth": 80,
  "tabWidth": 2,
  "useTabs": false
}
```

### Type Checking

```bash
# Run TypeScript type checking
npm run type-check

# Run type checking in watch mode
npm run type-check:watch
```

### Pre-commit Hooks

The project uses Husky for pre-commit hooks:

```json
{
  "husky": {
    "hooks": {
      "pre-commit": "lint-staged",
      "pre-push": "npm run test && npm run type-check"
    }
  }
}
```

## 📦 Build Process

### Development Build

```bash
# Start development server
npm run dev

# Features:
# - Hot module replacement
# - Fast compilation
# - Source maps
# - Error overlay
```

### Production Build

```bash
# Create production build
npm run build

# Preview production build
npm run preview

# Build features:
# - Code minification
# - Asset optimization
# - Tree shaking
# - Chunk splitting
```

### Build Analysis

```bash
# Analyze bundle size
npm run build:analyze

# Generate build report
npm run build:report
```

## 🚀 Deployment

### Build for Production

1. **Run tests**

   ```bash
   npm test
   ```

2. **Type check**

   ```bash
   npm run type-check
   ```

3. **Build application**

   ```bash
   npm run build
   ```

4. **Test production build**
   ```bash
   npm run preview
   ```

### Deployment Platforms

#### Vercel (Recommended)

```bash
# Install Vercel CLI
npm i -g vercel

# Deploy
vercel --prod
```

#### Netlify

```bash
# Build command: npm run build
# Publish directory: dist
```

#### GitHub Pages

```bash
# Add to package.json
"scripts": {
  "deploy": "gh-pages -d dist"
}
```

## 🔧 Troubleshooting

### Common Issues

#### Node Modules Issues

```bash
# Clear node_modules and reinstall
rm -rf node_modules package-lock.json
npm install
```

#### Cache Issues

```bash
# Clear npm cache
npm cache clean --force

# Clear Vite cache
rm -rf node_modules/.vite
```

#### TypeScript Issues

```bash
# Restart TypeScript server in VSCode
Cmd/Ctrl + Shift + P > "TypeScript: Restart TS Server"
```

### Performance Issues

#### Bundle Size

- Use `npm run build:analyze` to identify large dependencies
- Consider code splitting for large components
- Use dynamic imports for heavy libraries

#### Memory Issues

```bash
# Increase Node.js memory limit
export NODE_OPTIONS="--max_old_space_size=4096"
npm run build
```

## 📚 Learning Resources

### Documentation

- [React Documentation](https://react.dev/)
- [TypeScript Handbook](https://www.typescriptlang.org/docs/)
- [Vite Guide](https://vitejs.dev/guide/)
- [Jest Documentation](https://jestjs.io/docs/getting-started)

### Best Practices

- [React Best Practices](https://react.dev/learn/thinking-in-react)
- [TypeScript Best Practices](https://typescript-eslint.io/rules/)
- [Testing Best Practices](https://kentcdodds.com/blog/common-mistakes-with-react-testing-library)

## 🤝 Contributing

### Getting Started

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests for new functionality
5. Ensure all tests pass
6. Submit a pull request

### Development Setup

1. Follow the installation instructions above
2. Install recommended VSCode extensions
3. Configure your editor settings
4. Run tests to ensure everything works

### Code Guidelines

- Follow existing code style
- Write comprehensive tests
- Update documentation
- Use meaningful commit messages

### Need Help?

- Check existing issues and discussions
- Create a new issue for bugs or feature requests
- Join our development chat for questions

---

Happy coding! 🎉
