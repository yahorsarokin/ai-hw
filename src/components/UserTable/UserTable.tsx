import React from "react";
import { User } from "../../types/User";
import styles from "./UserTable.module.css";

interface UserTableProps {
  users: User[];
  onUserClick: (user: User) => void;
  onDeleteUser: (userId: number) => void;
}

const UserTable: React.FC<UserTableProps> = ({
  users,
  onUserClick,
  onDeleteUser,
}) => {
  const formatAddress = (address: User["address"]) => {
    return `${address.street}, ${address.suite}, ${address.city}, ${address.zipcode}`;
  };

  return (
    <div className={styles.tableContainer}>
      <table className={styles.table}>
        <thead>
          <tr>
            <th>NAME / EMAIL</th>
            <th>ADDRESS</th>
            <th>PHONE</th>
            <th>WEBSITE</th>
            <th>COMPANY</th>
            <th>ACTION</th>
          </tr>
        </thead>
        <tbody>
          {users.map((user) => (
            <tr key={user.id} className={styles.row}>
              <td className={styles.nameCell} onClick={() => onUserClick(user)}>
                <div className={styles.nameContainer}>
                  <div className={styles.name}>{user.name}</div>
                  <div className={styles.email}>{user.email}</div>
                </div>
              </td>
              <td onClick={() => onUserClick(user)}>
                {formatAddress(user.address)}
              </td>
              <td onClick={() => onUserClick(user)}>{user.phone}</td>
              <td onClick={() => onUserClick(user)}>
                <a
                  href={`http://${user.website}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={styles.websiteLink}
                  onClick={(e) => e.stopPropagation()}
                >
                  {user.website}
                </a>
              </td>
              <td onClick={() => onUserClick(user)}>{user.company.name}</td>
              <td>
                <button
                  className={styles.deleteButton}
                  onClick={(e) => {
                    e.stopPropagation();
                    onDeleteUser(user.id);
                  }}
                  aria-label={`Delete ${user.name}`}
                >
                  ×
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default UserTable;
