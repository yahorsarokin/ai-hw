import React, { useEffect } from "react";
import { User } from "../../types/User";
import styles from "./UserModal.module.css";

interface UserModalProps {
  user: User;
  onClose: () => void;
}

const UserModal: React.FC<UserModalProps> = ({ user, onClose }) => {
  useEffect(() => {
    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        onClose();
      }
    };

    document.addEventListener("keydown", handleEscape);
    document.body.style.overflow = "hidden";

    return () => {
      document.removeEventListener("keydown", handleEscape);
      document.body.style.overflow = "auto";
    };
  }, [onClose]);

  const handleBackdropClick = (event: React.MouseEvent) => {
    if (event.target === event.currentTarget) {
      onClose();
    }
  };

  return (
    <div className={styles.overlay} onClick={handleBackdropClick}>
      <div
        className={styles.modal}
        role="dialog"
        aria-modal="true"
        aria-labelledby="modal-title"
      >
        <div className={styles.header}>
          <div className={styles.headerTitle}>
            <h2 id="modal-title">{user.name}</h2>
            <a href={`mailto:${user.email}`} className={styles.emailLink}>
              {user.email}
            </a>
          </div>
          <button className={styles.closeButton} onClick={onClose}>
            ×
          </button>
        </div>

        <div className={styles.content}>
          <div className={styles.section}>
            <h3>Address</h3>
            <div className={styles.addressContainer}>
              <p>
                {user.address.street}, Apt. {user.address.suite}
              </p>
              <p>
                {user.address.city}, {user.address.zipcode}
              </p>
              <button className={styles.mapButton}>📍 View on map</button>
            </div>
          </div>

          <div className={styles.section}>
            <h3>Contact</h3>
            <div className={styles.contactInfo}>
              <div className={styles.contactItem}>
                <span className={styles.label}>Phone:</span>
                <span>{user.phone}</span>
              </div>
              <div className={styles.contactItem}>
                <span className={styles.label}>Website:</span>
                <a
                  href={`http://${user.website}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={styles.websiteLink}
                >
                  {user.website}
                </a>
              </div>
            </div>
          </div>

          <div className={styles.section}>
            <h3>Company</h3>
            <div className={styles.companyInfo}>
              <div className={styles.companyItem}>
                <span className={styles.label}>Name:</span>
                <span>{user.company.name}</span>
              </div>
              <div className={styles.companyItem}>
                <span className={styles.label}>Catchphrase:</span>
                <span>{user.company.catchPhrase}</span>
              </div>
              <div className={styles.companyItem}>
                <span className={styles.label}>Business:</span>
                <span>{user.company.bs}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserModal;
