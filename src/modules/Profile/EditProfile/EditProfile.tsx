import React, { useEffect, useState, useRef } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useSelector } from "react-redux";

import {
  getUserByUsername,
  updateUserProfile,
} from "../../../shared/api/profile-api";

import styles from "./EditProfile.module.css";
import Button from "../../../shared/components/Button/Button";

const backendUrl = import.meta.env.VITE_BACKEND_URL;

interface IUserProfile {
  username: string;
  fullname?: string;
  bio?: string;
  link?: string;
  avatarUrl?: string;
}

interface ICurrentUser {
  username: string;
  token: string | null;
}

interface RootState {
  auth: {
    user: ICurrentUser | null;
  };
}

function getFullAvatarUrl(src: string | null | undefined): string {
  if (!src || src.trim() === "") {
    return "/no-profile-pic-icon-11.jpg";
  }
  return src.startsWith("/uploads") ? backendUrl + src : src;
}

const EditProfile: React.FC = () => {
  const { username } = useParams<{ username: string }>();
  const navigate = useNavigate();
  const currentUser = useSelector((state: RootState) => state.auth.user);

  const fileInputRef = useRef<HTMLInputElement | null>(null);

  const [fullname, setFullname] = useState<string>("");
  const [bio, setBio] = useState<string>("");
  const [link, setLink] = useState<string>("");
  const [avatarFile, setAvatarFile] = useState<File | null>(null);
  const [avatarPreview, setAvatarPreview] = useState<string>("");

  useEffect(() => {
    if (!username || currentUser?.username !== username) {
      navigate("/dashboard");
      return;
    }

    const fetchData = async () => {
      try {
        const user: IUserProfile = await getUserByUsername(username);
        setFullname(user.fullname || "");
        setBio(user.bio || "");
        setLink(user.link || "");
        setAvatarPreview(getFullAvatarUrl(user.avatarUrl));
      } catch (err) {
        console.error("Error loading data:", err);
      }
    };

    fetchData();
  }, [username, currentUser, navigate]);

  const handleAvatarChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setAvatarFile(file);
      setAvatarPreview(URL.createObjectURL(file));
    }
  };

  const handleSave = async () => {
    if (!username || !currentUser?.token) {
      console.error("Username or token is missing.");
      return;
    }

    const formData = new FormData();
    formData.append("fullname", fullname);
    formData.append("bio", bio);
    formData.append("link", link);
    if (avatarFile) {
      formData.append("avatar", avatarFile);
    }

    try {
      await updateUserProfile(formData, currentUser.token);
      navigate(`/users/${username}`);
    } catch (err) {
      console.error("Error saving profile:", err);
    }
  };

  return (
    <div className={styles.editPage}>
      <h2>Edit Profile</h2>

      <div className={styles.avatarPreviewBox}>
        <div className={styles.userInfoBox}>
          <label htmlFor="avatar-upload" className={styles.avatarLabel}>
            <img
              src={avatarPreview || "/no-profile-pic-icon-11.jpg"}
              alt="avatar preview"
              className={styles.avatarImg}
            />
          </label>

          <div className={styles.userInfo}>
            <p className={styles.userFullname}>{fullname}</p>
            <p className={styles.userBio}>{bio}</p>
          </div>
        </div>
        <Button
          type="button"
          text="New photo"
          onClick={() => fileInputRef.current?.click()}
          color="primary"
        />

        <input
          ref={fileInputRef}
          id="avatar-upload"
          type="file"
          accept="image/*"
          style={{ display: "none" }}
          onChange={handleAvatarChange}
        />
      </div>

      <div className={styles.userInfo}>
        <h3>Full name</h3>
        <input
          type="text"
          placeholder="Full name"
          value={fullname}
          onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
            setFullname(e.target.value)
          }
          className={styles.input}
        />
      </div>

      <div className={styles.userInfo}>
        <h3>Website</h3>
        <input
          type="text"
          placeholder="Your website"
          value={link}
          onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
            setLink(e.target.value)
          }
          className={styles.input}
        />
      </div>

      <div className={styles.userInfo} style={{ position: "relative" }}>
        <h3>About</h3>
        <textarea
          placeholder="About"
          value={bio}
          onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) =>
            setBio(e.target.value)
          }
          className={styles.textarea}
          maxLength={150}
        />
        <div className={styles.captionCounter}>{bio.length}/150</div>
      </div>

      <Button
        onClick={handleSave}
        text="Save"
        color="primary"
        className={styles.saveBtn}
      />
    </div>
  );
};

export default EditProfile;
