import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import DropdownPanel from "../../shared/components/DropdownPanel/DropdownPanel";
import { searchUsers } from "../../shared/api/profile-api";
import styles from "./Search.module.css";

const backendUrl = import.meta.env.VITE_BACKEND_URL;

interface ISearchUser {
  _id: string;
  username: string;
  fullname: string | null;
  avatarUrl: string | null;
}

interface SearchProps {
  isOpen: boolean;
  onClose: () => void;
}

const Search: React.FC<SearchProps> = ({ isOpen, onClose }) => {
  const [query, setQuery] = useState<string>("");
  const [results, setResults] = useState<ISearchUser[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [recentSearches, setRecentSearches] = useState<ISearchUser[]>(() => {
    try {
      const saved = localStorage.getItem("recentSearches");
      return saved ? JSON.parse(saved) : [];
    } catch (error) {
      console.error("Error reading localStorage:", error);
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
      setIsLoading(false);
      return;
    }

    setIsLoading(true);
    const timeout = setTimeout(async () => {
      try {
        const data: ISearchUser[] = await searchUsers(query);
        setResults(data);
      } catch (err) {
        console.error("Error searching users:", err);
      } finally {
        setIsLoading(false);
      }
    }, 400);

    return () => clearTimeout(timeout);
  }, [query]);

  useEffect(() => {
    if (!isOpen) {
      setQuery("");
      setResults([]);
      setIsLoading(false);
    }
  }, [isOpen]);

  const handleUserClick = (user: ISearchUser) => {
    navigate(`/users/${user.username}`);
    onClose();

    setRecentSearches((prev) => {
      const exists = prev.find((u) => u._id === user._id);
      let newHistory: ISearchUser[];

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

  const displayedList: ISearchUser[] = query.trim() ? results : recentSearches;

  return (
    <DropdownPanel isOpen={isOpen} onClose={onClose} title="Search">
      <div className={styles.inputWrapper}>
        <input
          type="text"
          placeholder="Search"
          className={styles.input}
          value={query}
          onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
            setQuery(e.target.value)
          }
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
                  className={styles.clearHistoryBtn}
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
                    <span className={styles.fullname}>{user.fullname}</span>
                  )}
                </div>
              </li>
            ))}
          </ul>
        </>
      )}

      {query.trim() && results.length === 0 && !isLoading && (
        <div className={styles.noResults}>
          <p>No results found.</p>
        </div>
      )}

      {isLoading && <div className={styles.loadingState}></div>}
    </DropdownPanel>
  );
};

export default Search;