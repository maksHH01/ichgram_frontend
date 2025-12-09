import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import DropdownPanel from "../../shared/components/DropdownPanel/DropdownPanel";
import { searchUsers } from "../../shared/api/profile-api";
import styles from "./Search.module.css";

const backendUrl = import.meta.env.VITE_BACKEND_URL;

const Search = ({ isOpen, onClose }) => {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState([]);

  const [recentSearches, setRecentSearches] = useState(() => {
    try {
      const saved = localStorage.getItem("recentSearches");
      return saved ? JSON.parse(saved) : [];
    } catch (error) {
      console.error("Ошибка чтения localStorage:", error);
      return [];
    }
  });

  const navigate = useNavigate();

  useEffect(() => {
    localStorage.setItem("recentSearches", JSON.stringify(recentSearches));
  }, [recentSearches]);

  useEffect(() => {
    if (!query.trim()) {
      setResults([]);
      return;
    }

    const timeout = setTimeout(async () => {
      try {
        const data = await searchUsers(query);
        setResults(data);
      } catch (err) {
        console.error("Error searching users:", err);
      }
    }, 400);

    return () => clearTimeout(timeout);
  }, [query]);

  useEffect(() => {
    if (!isOpen) {
      setQuery("");
      setResults([]);
    }
  }, [isOpen]);

  const handleUserClick = (user) => {
    navigate(`/users/${user.username}`);
    onClose();

    setRecentSearches((prev) => {
      const exists = prev.find((u) => u._id === user._id);

      let newHistory;
      if (exists) {
        newHistory = [user, ...prev.filter((u) => u._id !== user._id)];
      } else {
        newHistory = [user, ...prev].slice(0, 5);
      }

      return newHistory;
    });
  };

  const handleClearHistory = () => {
    setRecentSearches([]);
    localStorage.removeItem("recentSearches");
  };

  const displayedList = query.trim() ? results : recentSearches;

  return (
    <DropdownPanel isOpen={isOpen} onClose={onClose} title="Search">
      <div className={styles.inputWrapper}>
        <input
          type="text"
          placeholder="Search"
          className={styles.input}
          value={query}
          onChange={(e) => setQuery(e.target.value)}
        />
        {query && (
          <button
            className={styles.clearBtn}
            onClick={() => setQuery("")}
            type="button"
          >
            <img src="/closeBtn.svg" alt="Clear" />
          </button>
        )}
      </div>

      {displayedList.length > 0 && (
        <>
          {!query.trim() && (
            <div className={styles.recentHeader}>
              <p className={styles.subheading}>Recent</p>
              {recentSearches.length > 0 && (
                <button
                  onClick={handleClearHistory}
                  style={{
                    background: "none",
                    border: "none",
                    color: "#0095f6",
                    fontWeight: "600",
                    cursor: "pointer",
                    fontSize: "14px",
                    paddingBottom: "15px",
                  }}
                >
                  Clear all
                </button>
              )}
            </div>
          )}

          <ul className={styles.list}>
            {displayedList.map((user) => (
              <li
                key={user._id}
                className={styles.item}
                onClick={() => handleUserClick(user)}
              >
                <img
                  src={
                    user.avatarUrl && user.avatarUrl.trim() !== ""
                      ? user.avatarUrl.startsWith("/uploads")
                        ? backendUrl + user.avatarUrl
                        : user.avatarUrl
                      : "/no-profile-pic-icon-11.jpg"
                  }
                  alt={`${user.username} avatar`}
                  className={styles.avatar}
                />
                <div className={styles.userInfo}>
                  <p>{user.username}</p>
                  {user.fullname && (
                    <span style={{ color: "#737373", fontSize: "14px" }}>
                      {user.fullname}
                    </span>
                  )}
                </div>
              </li>
            ))}
          </ul>
        </>
      )}
    </DropdownPanel>
  );
};

export default Search;
