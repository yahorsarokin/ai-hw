# User Data Management App

A lightweight React + TypeScript application that displays and manages user data from the JSONPlaceholder API.

## Features

- 📊 **Table View**: Clean, responsive table displaying user information
- 🔍 **User Details**: Click on any user to view detailed information in a modal
- 📱 **Responsive Design**: Optimized for both desktop and mobile devices
- 🗑️ **Delete Users**: Remove users from the list with a single click
- 🔗 **External Links**: Direct links to user websites
- ⌨️ **Keyboard Navigation**: Press Escape to close modals

## Tech Stack

- **React 18** with **TypeScript** for type safety
- **Vite** for fast development and building
- **CSS Modules** for scoped styling
- **JSONPlaceholder API** for test data

## Getting Started

### Prerequisites

- Node.js (version 16 or higher)
- npm or yarn

### Installation

1. Clone or download this repository
2. Install dependencies:

```bash
npm install
```

### Development

Start the development server:

```bash
npm run dev
```

The application will be available at `http://localhost:3000`

### Build for Production

```bash
npm run build
```

### Preview Production Build

```bash
npm run preview
```

## Project Structure

```
src/
├── components/
│   ├── UserTable/
│   │   ├── UserTable.tsx
│   │   └── UserTable.module.css
│   └── UserModal/
│       ├── UserModal.tsx
│       └── UserModal.module.css
├── types/
│   └── User.ts
├── App.tsx
├── App.module.css
├── main.tsx
└── index.css
```

## Usage

1. **View Users**: The main page displays all users in a table format
2. **User Details**: Click on any user row to open a detailed modal
3. **Delete Users**: Click the red × button to remove a user from the list
4. **Visit Websites**: Click on website links to visit user websites in a new tab
5. **Close Modal**: Click outside the modal, press Escape, or click the × button

## API

This application uses the [JSONPlaceholder API](https://jsonplaceholder.typicode.com/) which provides fake user data for testing and prototyping.

## License

This project is open source and available under the MIT License.
