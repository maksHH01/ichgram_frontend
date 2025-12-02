import React, { useEffect, useState, useRef } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useSelector } from "react-redux";

import {
  getUserByUsername,
  updateUserProfile,
} from "../../../shared/api/profile-api";
import styles from "./EditProfile.module.css";
import Button from "../../../shared/components/Button/Button";

const backendUrl = import.meta.env.VITE_BACKEND_URL || "";

function getFullAvatarUrl(src) {
  if (!src || src.trim() === "") return "/no-profile-pic-icon-11.jpg";
  return src.startsWith("/uploads") ? backendUrl + src : src;
}

const EditProfile = () => {
  const { username } = useParams();
  const navigate = useNavigate();
  const currentUser = useSelector((state) => state.auth.user);

  const fileInputRef = useRef(null);

  const [fullname, setFullname] = useState("");
  const [bio, setBio] = useState("");
  const [link, setLink] = useState("");
  const [avatarFile, setAvatarFile] = useState(null);
  const [avatarPreview, setAvatarPreview] = useState("");

  useEffect(() => {
    // Если пользователь не тот, кто залогинен — редирект
    if (!username || currentUser?.username !== username) {
      navigate("/dashboard");
      return;
    }

    const fetchUserData = async () => {
      try {
        const user = await getUserByUsername(username);
        setFullname(user.fullname || "");
        setBio(user.bio || "");
        setLink(user.link || "");
        setAvatarPreview(getFullAvatarUrl(user.avatarUrl || ""));
      } catch (err) {
        console.error("Ошибка при загрузке данных пользователя:", err);
      }
    };

    fetchUserData();
  }, [username, currentUser, navigate]);

  const handleAvatarChange = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      setAvatarFile(file);
      setAvatarPreview(URL.createObjectURL(file));
    }
  };

  const handleSave = async () => {
    if (!currentUser?.token) {
      console.error("Пользователь не авторизован");
      return;
    }

    const formData = new FormData();
    formData.append("fullname", fullname);
    formData.append("bio", bio);
    formData.append("link", link);
    if (avatarFile) formData.append("avatar", avatarFile);

    try {
      await updateUserProfile(formData, currentUser.token);
      navigate(`/users/${username}`); // Возврат на страницу профиля
    } catch (err) {
      console.error("Ошибка при сохранении профиля:", err);
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
              alt="Avatar preview"
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
          color="primary"
          onClick={() => fileInputRef.current?.click()}
        />
        <input
          ref={fileInputRef}
          type="file"
          id="avatar-upload"
          accept="image/*"
          style={{ display: "none" }}
          onChange={handleAvatarChange}
        />
      </div>

      <div className={styles.userInfo}>
        <h3>Full name</h3>
        <input
          type="text"
          value={fullname}
          onChange={(e) => setFullname(e.target.value)}
          className={styles.input}
          placeholder="Full name"
        />
      </div>

      <div className={styles.userInfo}>
        <h3>Website</h3>
        <input
          type="text"
          value={link}
          onChange={(e) => setLink(e.target.value)}
          className={styles.input}
          placeholder="Your website"
        />
      </div>

      <div className={styles.userInfo} style={{ position: "relative" }}>
        <h3>About</h3>
        <textarea
          value={bio}
          onChange={(e) => setBio(e.target.value)}
          className={styles.textarea}
          placeholder="About"
          maxLength={150}
        />
        <div className={styles.captionCounter}>{bio.length}/150</div>
      </div>

      <Button onClick={handleSave} text="Save" color="primary" />
    </div>
  );
};

export default EditProfile;
