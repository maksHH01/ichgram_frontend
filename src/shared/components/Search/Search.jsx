import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

import DropPanel from "../../../layouts/DropPanel/DropPanel";
import styles from "./Search.module.css";

import noImage from "../../../assets/images/no-profile-pic.jpg";
import clearIcon from "../../../assets/svg/clear.svg";

const mockUsers = [
  { _id: "1", username: "john_doe", fullname: "John Doe", avatarUrl: noImage },
  {
    _id: "2",
    username: "jane_smith",
    fullname: "Jane Smith",
    avatarUrl: noImage,
  },
  {
    _id: "3",
    username: "artem_dev",
    fullname: "Artem Developer",
    avatarUrl: noImage,
  },
  { _id: "4", username: "catlover", fullname: "Mila Kit", avatarUrl: noImage },
];

const Search = ({ isOpen, onClose }) => {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState([]);
  const [recentSearches, setRecentSearches] = useState(mockUsers.slice(0, 3));

  const navigate = useNavigate();

  useEffect(() => {
    if (!query.trim()) {
      setResults([]);
      return;
    }

    const timeout = setTimeout(() => {
      const filtered = mockUsers.filter(
        (user) =>
          user.username.toLowerCase().includes(query.toLowerCase()) ||
          user.fullname.toLowerCase().includes(query.toLowerCase())
      );
      setResults(filtered);
    }, 300);

    return () => clearTimeout(timeout);
  }, [query]);

  const handleUserClick = (user) => {
    navigate(`/users/${user.username}`);
    onClose();

    setRecentSearches((prev) => {
      const exists = prev.find((u) => u._id === user._id);
      if (exists) {
        return [user, ...prev.filter((u) => u._id !== user._id)];
      }
      return [user, ...prev.slice(0, 4)];
    });
  };

  const displayedList = query.trim() ? results : recentSearches;

  if (!isOpen) return null;

  return (
    <DropPanel isOpen={isOpen} onClose={onClose} title="Search">
      <div className={styles.inputWrapper}>
        <input
          type="text"
          placeholder="Search"
          className={styles.input}
          value={query}
          onChange={(e) => setQuery(e.target.value)}
        />

        {query.trim() && (
          <button
            className={styles.clearBtn}
            onClick={() => setQuery("")}
            type="button"
          >
            <img src={clearIcon} alt="Clear" />
          </button>
        )}
      </div>

      {!query.trim() && <p className={styles.subheading}>Recent</p>}

      <ul className={styles.list}>
        {displayedList.map((user) => (
          <li
            key={user._id}
            className={styles.item}
            onClick={() => handleUserClick(user)}
          >
            <img
              src={user.avatarUrl || noImage}
              alt={user.username}
              className={styles.avatar}
            />
            <div className={styles.userInfo}>
              <p className={styles.userName}>{user.username}</p>
              <span className={styles.fullname}>{user.fullname}</span>
            </div>
          </li>
        ))}
      </ul>

      {!query.trim() && displayedList.length === 0 && (
        <p className={styles.subheading}>No recent searches</p>
      )}

      {query.trim() && results.length === 0 && (
        <p className={styles.subheading}>No results</p>
      )}
    </DropPanel>
  );
};

export default Search;
