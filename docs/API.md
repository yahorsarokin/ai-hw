# API Reference

This document provides comprehensive API documentation for all components, interfaces, and utilities in the User Data Management application.

## 📋 Table of Contents

- [Data Types](#data-types)
- [Components](#components)
  - [App](#app-component)
  - [UserTable](#usertable-component)
  - [UserModal](#usermodal-component)
- [Utilities](#utilities)
- [Constants](#constants)
- [Error Handling](#error-handling)

## 🏷️ Data Types

### User Interface

The main data structure representing a user from the JSONPlaceholder API.

```typescript
interface User {
  id: number;
  name: string;
  username: string;
  email: string;
  address: Address;
  phone: string;
  website: string;
  company: Company;
}
```

#### Properties

| Property   | Type      | Description                    |
| ---------- | --------- | ------------------------------ |
| `id`       | `number`  | Unique identifier for the user |
| `name`     | `string`  | Full name of the user          |
| `username` | `string`  | Username for the user          |
| `email`    | `string`  | Email address of the user      |
| `address`  | `Address` | User's address information     |
| `phone`    | `string`  | Phone number of the user       |
| `website`  | `string`  | User's website URL             |
| `company`  | `Company` | User's company information     |

### Address Interface

Represents a user's address information.

```typescript
interface Address {
  street: string;
  suite: string;
  city: string;
  zipcode: string;
  geo: {
    lat: string;
    lng: string;
  };
}
```

#### Properties

| Property  | Type     | Description               |
| --------- | -------- | ------------------------- |
| `street`  | `string` | Street address            |
| `suite`   | `string` | Suite or apartment number |
| `city`    | `string` | City name                 |
| `zipcode` | `string` | Postal/ZIP code           |
| `geo`     | `object` | Geographic coordinates    |
| `geo.lat` | `string` | Latitude coordinate       |
| `geo.lng` | `string` | Longitude coordinate      |

### Company Interface

Represents a user's company information.

```typescript
interface Company {
  name: string;
  catchPhrase: string;
  bs: string;
}
```

#### Properties

| Property      | Type     | Description                   |
| ------------- | -------- | ----------------------------- |
| `name`        | `string` | Company name                  |
| `catchPhrase` | `string` | Company slogan or catchphrase |
| `bs`          | `string` | Business strategy description |

## 🧩 Components

### App Component

The root component that manages the application state and coordinates child components.

#### Props

The App component doesn't accept any props as it's the root component.

#### State

```typescript
interface AppState {
  users: User[];
  selectedUser: User | null;
  loading: boolean;
  error: string | null;
}
```

#### State Properties

| Property       | Type             | Description                               |
| -------------- | ---------------- | ----------------------------------------- |
| `users`        | `User[]`         | Array of all users fetched from API       |
| `selectedUser` | `User \| null`   | Currently selected user for modal display |
| `loading`      | `boolean`        | Whether data is currently being fetched   |
| `error`        | `string \| null` | Error message if API call fails           |

#### Methods

##### `fetchUsers()`

Fetches user data from the JSONPlaceholder API.

```typescript
const fetchUsers = async (): Promise<void>
```

**Returns**: Promise that resolves when users are fetched

**Side Effects**:

- Updates `users` state with fetched data
- Sets `loading` to false
- Sets `error` if request fails

##### `handleUserClick(user: User)`

Handles user selection for modal display.

```typescript
const handleUserClick = (user: User): void
```

**Parameters**:

- `user` (`User`): The user object to display in modal

**Side Effects**:

- Sets `selectedUser` state

##### `handleDeleteUser(userId: number)`

Removes a user from the users array.

```typescript
const handleDeleteUser = (userId: number): void
```

**Parameters**:

- `userId` (`number`): ID of the user to delete

**Side Effects**:

- Updates `users` state by filtering out the deleted user

##### `handleCloseModal()`

Closes the user detail modal.

```typescript
const handleCloseModal = (): void
```

**Side Effects**:

- Sets `selectedUser` to null

#### Usage Example

```typescript
import App from "./App";

// App is the root component, typically rendered in main.tsx
function AppRoot() {
  return <App />;
}
```

---

### UserTable Component

Displays users in a responsive table format with interactive features.

#### Props

```typescript
interface UserTableProps {
  users: User[];
  onUserClick: (user: User) => void;
  onDeleteUser: (userId: number) => void;
}
```

#### Props Properties

| Property       | Type                       | Required | Description                            |
| -------------- | -------------------------- | -------- | -------------------------------------- |
| `users`        | `User[]`                   | Yes      | Array of users to display              |
| `onUserClick`  | `(user: User) => void`     | Yes      | Callback when user row is clicked      |
| `onDeleteUser` | `(userId: number) => void` | Yes      | Callback when delete button is clicked |

#### Features

- **Responsive Design**: Adapts to different screen sizes
- **Clickable Rows**: Entire row is clickable for user selection
- **Delete Functionality**: Individual delete buttons for each user
- **External Links**: Website links open in new tabs
- **Accessibility**: Proper ARIA labels and keyboard navigation

#### Styling Classes

| Class Name      | Description           |
| --------------- | --------------------- |
| `.container`    | Main table container  |
| `.table`        | Table element styling |
| `.header`       | Table header styling  |
| `.row`          | Table row styling     |
| `.cell`         | Table cell styling    |
| `.deleteButton` | Delete button styling |
| `.websiteLink`  | Website link styling  |

#### Usage Example

```typescript
import UserTable from "./components/UserTable/UserTable";

function App() {
  const [users, setUsers] = useState<User[]>([]);

  const handleUserClick = (user: User) => {
    console.log("User clicked:", user);
  };

  const handleDeleteUser = (userId: number) => {
    setUsers(users.filter((user) => user.id !== userId));
  };

  return (
    <UserTable
      users={users}
      onUserClick={handleUserClick}
      onDeleteUser={handleDeleteUser}
    />
  );
}
```

#### Accessibility Features

- **Keyboard Navigation**: Tab through interactive elements
- **Screen Reader Support**: Proper table structure and labels
- **ARIA Attributes**: Descriptive labels for buttons and links
- **Focus Management**: Visible focus indicators

---

### UserModal Component

Displays detailed user information in a modal overlay.

#### Props

```typescript
interface UserModalProps {
  user: User;
  onClose: () => void;
}
```

#### Props Properties

| Property  | Type         | Required | Description                               |
| --------- | ------------ | -------- | ----------------------------------------- |
| `user`    | `User`       | Yes      | User object containing details to display |
| `onClose` | `() => void` | Yes      | Callback function to close the modal      |

#### Features

- **Modal Overlay**: Semi-transparent backdrop
- **Keyboard Support**: ESC key to close
- **Click Outside**: Click backdrop to close
- **Body Scroll Lock**: Prevents background scrolling
- **Focus Management**: Traps focus within modal
- **Responsive Design**: Adapts to screen sizes

#### Modal Sections

##### Header Section

- User's full name
- Email address (clickable link)
- Close button

##### Content Sections

- **Address Information**: Complete address with geographic coordinates
- **Contact Information**: Phone number and website
- **Company Information**: Company details and business description

#### Styling Classes

| Class Name     | Description            |
| -------------- | ---------------------- |
| `.overlay`     | Modal backdrop overlay |
| `.modal`       | Main modal container   |
| `.header`      | Modal header section   |
| `.content`     | Modal content area     |
| `.section`     | Information sections   |
| `.closeButton` | Close button styling   |
| `.emailLink`   | Email link styling     |
| `.websiteLink` | Website link styling   |

#### Event Handlers

##### `handleKeyDown(event: KeyboardEvent)`

Handles keyboard events for modal interactions.

```typescript
const handleKeyDown = (event: KeyboardEvent): void
```

**Parameters**:

- `event` (`KeyboardEvent`): Keyboard event object

**Behavior**:

- Closes modal when ESC key is pressed

##### `handleOverlayClick(event: MouseEvent)`

Handles clicks on the modal overlay.

```typescript
const handleOverlayClick = (event: MouseEvent): void
```

**Parameters**:

- `event` (`MouseEvent`): Mouse event object

**Behavior**:

- Closes modal when clicking outside the modal content

#### Usage Example

```typescript
import UserModal from "./components/UserModal/UserModal";

function App() {
  const [selectedUser, setSelectedUser] = useState<User | null>(null);

  const handleCloseModal = () => {
    setSelectedUser(null);
  };

  return (
    <>
      {selectedUser && (
        <UserModal user={selectedUser} onClose={handleCloseModal} />
      )}
    </>
  );
}
```

#### Accessibility Features

- **ARIA Dialog**: Proper dialog role and attributes
- **Focus Management**: Focus trapped within modal
- **Keyboard Navigation**: ESC key support
- **Screen Reader Support**: Proper labeling and structure
- **High Contrast**: Sufficient color contrast ratios

## 🛠️ Utilities

### API Functions

#### `fetchUsers()`

Utility function to fetch users from JSONPlaceholder API.

```typescript
const fetchUsers = async (): Promise<User[]>
```

**Returns**: Promise resolving to array of User objects

**Throws**: Error if request fails or response is invalid

**Usage**:

```typescript
try {
  const users = await fetchUsers();
  console.log("Users loaded:", users);
} catch (error) {
  console.error("Failed to fetch users:", error);
}
```

### Formatting Functions

#### `formatAddress(address: Address)`

Formats an address object into a readable string.

```typescript
const formatAddress = (address: Address): string
```

**Parameters**:

- `address` (`Address`): Address object to format

**Returns**: Formatted address string

**Example**:

```typescript
const address = {
  street: "Kulas Light",
  suite: "Apt. 556",
  city: "Gwenborough",
  zipcode: "92998-3874",
  geo: { lat: "-37.3159", lng: "81.1496" },
};

const formatted = formatAddress(address);
// Returns: "Kulas Light, Apt. 556, Gwenborough, 92998-3874"
```

#### `formatPhone(phone: string)`

Formats a phone number for display.

```typescript
const formatPhone = (phone: string): string
```

**Parameters**:

- `phone` (`string`): Raw phone number string

**Returns**: Formatted phone number

**Example**:

```typescript
const formatted = formatPhone("1-770-736-8031 x56442");
// Returns: "1-770-736-8031 x56442" (unchanged for JSONPlaceholder format)
```

## 📊 Constants

### API Configuration

```typescript
const API_ENDPOINTS = {
  USERS: "https://jsonplaceholder.typicode.com/users",
} as const;
```

### CSS Classes

```typescript
const CSS_CLASSES = {
  MODAL_OPEN: "modal-open",
  HIDDEN: "hidden",
  LOADING: "loading",
  ERROR: "error",
} as const;
```

### Breakpoints

```typescript
const BREAKPOINTS = {
  MOBILE: "768px",
  TABLET: "1024px",
  DESKTOP: "1200px",
} as const;
```

## ❌ Error Handling

### Error Types

#### `APIError`

Custom error class for API-related errors.

```typescript
class APIError extends Error {
  constructor(message: string, public status?: number) {
    super(message);
    this.name = "APIError";
  }
}
```

#### `ValidationError`

Custom error class for data validation errors.

```typescript
class ValidationError extends Error {
  constructor(message: string, public field?: string) {
    super(message);
    this.name = "ValidationError";
  }
}
```

### Error Handling Patterns

#### API Error Handling

```typescript
try {
  const users = await fetchUsers();
  return users;
} catch (error) {
  if (error instanceof APIError) {
    console.error("API Error:", error.message, "Status:", error.status);
  } else {
    console.error("Unexpected error:", error);
  }
  throw error;
}
```

#### Component Error Boundaries

```typescript
interface ErrorBoundaryState {
  hasError: boolean;
  error?: Error;
}

class ErrorBoundary extends Component<PropsWithChildren, ErrorBoundaryState> {
  constructor(props: PropsWithChildren) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error: Error): ErrorBoundaryState {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error("Error boundary caught an error:", error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return <div>Something went wrong. Please refresh the page.</div>;
    }

    return this.props.children;
  }
}
```

## 🔧 Development Notes

### Type Safety

All components and functions are fully typed with TypeScript. The application uses strict type checking to prevent runtime errors.

### Performance Considerations

- Components use React.memo for optimization where appropriate
- Event handlers are properly memoized to prevent unnecessary re-renders
- CSS modules provide efficient styling with build-time optimization

### Testing

All components and utilities have comprehensive test coverage. Refer to `docs/TESTING.md` for testing guidelines and examples.

### Browser Support

The application supports modern browsers with ES2020+ features:

- Chrome 80+
- Firefox 72+
- Safari 13.1+
- Edge 80+

---

This API documentation is automatically updated with code changes. For the most current information, refer to the TypeScript interfaces and JSDoc comments in the source code.
