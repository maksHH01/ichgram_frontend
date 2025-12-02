import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Link } from "react-router-dom";

import GradientAvatar from "../../shared/components/AvatarWithBorder/AvatarWithBorder";
import Button from "../../shared/components/Button/Button";
import BioWithToggle from "../../shared/components/BioWithToggle/BioWithToggle";
import ProfilePosts from "../../modules/Profile/ProfilePosts/ProfilePosts";

import styles from "./Profile.module.css";
import noPhoto from "../../assets/images/no-profile-pic.jpg";

// Моковые данные пользователя
const mockUser = {
  username: "john_doe",
  fullname: "John Doe",
  bio: "Front-end developer | React & JSX enthusiast",
  link: "https://example.com",
  avatarUrl: noPhoto,
  followers: ["alice", "bob", "charlie"],
  following: ["alice", "bob"],
};

// Моковые посты
const mockPosts = [
  { _id: "1", imageUrl: noPhoto },
  { _id: "2", imageUrl: noPhoto },
  { _id: "3", imageUrl: noPhoto },
  { _id: "4", imageUrl: noPhoto },
];

const Profile = () => {
  const { username } = useParams();
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [posts, setPosts] = useState([]);

  useEffect(() => {
    // Симуляция загрузки профиля
    setUser(mockUser);
    setPosts(mockPosts);
  }, [username]);

  if (!user) return <p>Loading profile...</p>;

  const isCurrentUser = username === mockUser.username;

  return (
    <div className={styles.profilePage}>
      <div className={styles.profileHeader}>
        <GradientAvatar
          src={user.avatarUrl || noPhoto}
          size={168}
          alt={`${user.username} avatar`}
        />
        <div className={styles.profileInfo}>
          <div className={styles.topRow}>
            <h2>{user.username}</h2>

            {isCurrentUser ? (
              <button
                className={styles.editBtn}
                onClick={() => navigate(`/users/${username}/edit-my-profile`)}
              >
                Edit Profile
              </button>
            ) : (
              <Button text="Follow" color="primary" onClick={() => {}} />
            )}
          </div>

          <div className={styles.stats}>
            <div className={styles.userInfo}>
              <p className={styles.boldNumber}>{posts.length}</p>
              <p>posts</p>
            </div>
            <div className={styles.userInfo}>
              <p className={styles.boldNumber}>{user.followers.length}</p>
              <p>followers</p>
            </div>
            <div className={styles.userInfo}>
              <p className={styles.boldNumber}>{user.following.length}</p>
              <p>following</p>
            </div>
          </div>

          <div className={styles.bio}>
            <strong>{user.fullname}</strong>
            <BioWithToggle text={user.bio} />
            {user.link && (
              <Link to={user.link} rel="noopener noreferrer">
                {user.link}
              </Link>
            )}
          </div>
        </div>
      </div>

      <ProfilePosts posts={posts} />
    </div>
  );
};

export default Profile;
