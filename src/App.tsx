import React, { useState, useEffect, useMemo } from "react";
import UserTable from "./components/UserTable/UserTable";
import UserModal from "./components/UserModal/UserModal";
import SearchBar from "./components/SearchBar/SearchBar";
import { User } from "./types/User";
import styles from "./App.module.css";

const App: React.FC = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      setLoading(true);
      const response = await fetch(
        "https://jsonplaceholder.typicode.com/users"
      );
      if (!response.ok) {
        throw new Error("Failed to fetch users");
      }
      const data = await response.json();
      setUsers(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : "An error occurred");
    } finally {
      setLoading(false);
    }
  };

  const handleUserClick = (user: User) => {
    setSelectedUser(user);
  };

  const handleCloseModal = () => {
    setSelectedUser(null);
  };

  const handleDeleteUser = (userId: number) => {
    setUsers(users.filter((user) => user.id !== userId));
  };

  const handleSearchChange = (newSearchTerm: string) => {
    setSearchTerm(newSearchTerm);
  };

  // Filter users based on search term
  const filteredUsers = useMemo(() => {
    if (!searchTerm.trim()) {
      return users;
    }

    const searchLower = searchTerm.toLowerCase();
    return users.filter(
      (user) =>
        user.name.toLowerCase().includes(searchLower) ||
        user.email.toLowerCase().includes(searchLower) ||
        user.company.name.toLowerCase().includes(searchLower) ||
        user.username.toLowerCase().includes(searchLower)
    );
  }, [users, searchTerm]);

  if (loading) {
    return (
      <div className={styles.container}>
        <div className={styles.loading}>Loading users...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className={styles.container}>
        <div className={styles.error}>Error: {error}</div>
      </div>
    );
  }

  return (
    <div className={styles.container}>
      <header className={styles.header}>
        <h1>User Management</h1>
        <p className={styles.subtitle}>
          {filteredUsers?.length || 0} of {users?.length || 0} users
          {searchTerm && ` matching "${searchTerm}"`}
        </p>
      </header>

      <SearchBar
        searchTerm={searchTerm}
        onSearchChange={handleSearchChange}
        placeholder="Search by name, email or company..."
      />

      <UserTable
        users={filteredUsers}
        onUserClick={handleUserClick}
        onDeleteUser={handleDeleteUser}
      />
      {selectedUser && (
        <UserModal user={selectedUser} onClose={handleCloseModal} />
      )}
    </div>
  );
};

export default App;
