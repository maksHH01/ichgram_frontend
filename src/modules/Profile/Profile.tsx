import React, { useEffect, useState } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { ThunkDispatch } from "@reduxjs/toolkit";
import { UnknownAction } from "redux";

import { useFollow } from "../../shared/hooks/useFollow";
import { getUserByUsername } from "../../shared/api/profile-api";
import { fetchPostsByUsername } from "../../redux/posts/posts-thunks";
import { setShouldReloadPosts } from "../../redux/posts/posts-slice";

import GradientAvatar from "../../shared/components/GradientAvatar/GradientAvatar";
import Button from "../../shared/components/Button/Button";
import BioWithToggle from "./BioWithToggle/BioWithToggle";
import ProfilePosts from "./ProfilePosts/ProfilePosts";

import styles from "./Profile.module.css";

interface IPost {
  _id: string;
  imageUrl: string;
}

interface IUserProfile {
  _id: string;
  username: string;
  fullname: string;
  bio: string;
  link: string;
  avatarUrl: string;
  followers: string[];
  following: string[];
}

interface ICurrentUser {
  username: string;
}

interface RootState {
  auth: {
    user: ICurrentUser | null;
  };
  posts: {
    posts: IPost[];
    loading: boolean;
    error: string | null;
    shouldReloadPosts: boolean;
  };
}

type AppDispatch = ThunkDispatch<RootState, unknown, UnknownAction>;

const Profile: React.FC = () => {
  const { username } = useParams<{ username: string }>();
  const [user, setUser] = useState<IUserProfile | null>(null);

  const shouldReloadPosts = useSelector(
    (state: RootState) => state.posts.shouldReloadPosts
  );

  const navigate = useNavigate();
  const dispatch: AppDispatch = useDispatch();

  const currentUser = useSelector((state: RootState) => state.auth.user);
  const posts = useSelector((state: RootState) => state.posts.posts);
  const loading = useSelector((state: RootState) => state.posts.loading);
  const error = useSelector((state: RootState) => state.posts.error);

  const { isFollowing, handleFollow, handleUnfollow, isProcessing } = useFollow(
    user,
    setUser
  );

  useEffect(() => {
    if (shouldReloadPosts && username) {
      dispatch(fetchPostsByUsername(username));
      dispatch(setShouldReloadPosts(false));
    }
  }, [shouldReloadPosts, dispatch, username]);

  useEffect(() => {
    if (!username) return;
    dispatch(fetchPostsByUsername(username));
  }, [username, dispatch]);

  useEffect(() => {
    if (!username) return;

    const fetchUser = async () => {
      try {
        const freshUser = await getUserByUsername(username);

        setUser({
          ...freshUser,
          fullname: freshUser.fullname || "",
          bio: freshUser.bio || "",
          link: freshUser.link || "",
          avatarUrl: freshUser.avatarUrl || "",
        });
      } catch (err) {
        console.error(err);
        navigate("/404");
      }
    };

    fetchUser();
  }, [username, navigate]);

  const handleMessageClick = () => {
    if (!user) return;
    navigate("/messages", {
      state: {
        startChatWith: {
          id: user._id,
          username: user.username,
          avatarUrl: user.avatarUrl,
          fullname: user.fullname,
        },
      },
    });
  };

  if (!user) return <p>Loading profile...</p>;
  if (loading && posts.length === 0) return <p>Loading posts...</p>;
  if (error) return <p>Error: {error}</p>;

  return (
    <div className={styles.profilePage}>
      <div className={styles.profileHeader}>
        <GradientAvatar
          src={user.avatarUrl || "/no-profile-pic-icon-11.jpg"}
          size={168}
          alt={`${user.username} avatar`}
        />
        <div className={styles.profileInfo}>
          <div className={styles.topRow}>
            <h2>{user.username}</h2>

            {currentUser?.username === user.username ? (
              <button
                className={styles.editBtn}
                onClick={() => navigate(`/users/${username}/edit-my-profile`)}
              >
                Edit Profile
              </button>
            ) : (
              <div className={styles.actionButtons}>
                <Button
                  text={isFollowing ? "Unfollow" : "Follow"}
                  color={isFollowing ? "basic" : "primary"}
                  onClick={isFollowing ? handleUnfollow : handleFollow}
                  disabled={isProcessing}
                />
                <button className={styles.editBtn} onClick={handleMessageClick}>
                  Message
                </button>
              </div>
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
            <BioWithToggle text={user.bio} maxChars={80} />
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
