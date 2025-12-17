import { useSelector, useDispatch } from "react-redux";
import { useCallback, useState } from "react";
import { getCurrent } from "../../redux/auth/auth-thunks";
import {
  followUser,
  unfollowUser,
  getUserByUsername,
} from "../api/profile-api";
import type { RootState } from "../../redux/store";
import type { User } from "../types/User";

export const useFollow = (
  user: User | null,
  setUser?: (user: User) => void
) => {
  const dispatch = useDispatch<any>();
  const currentUser = useSelector((state: RootState) => state.auth.user);
  const token = useSelector((state: RootState) => state.auth.token);
  const [isProcessing, setIsProcessing] = useState(false);

  const isFollowing =
    user && currentUser ? currentUser.following?.includes(user._id) : false;

  const syncUsers = async () => {
    if (!user || !token) return;

    try {
      const updatedUser = await getUserByUsername(user.username);
      if (setUser) setUser(updatedUser);

      await dispatch(getCurrent());
    } catch (err) {
      console.error(err);
    }
  };

  const handleFollow = useCallback(async () => {
    if (!user || !currentUser || !token || isProcessing) return;
    setIsProcessing(true);
    try {
      await followUser(user._id, token);
      await syncUsers();
    } catch (err) {
      console.error(err);
    } finally {
      setIsProcessing(false);
    }
  }, [user, currentUser, token, isProcessing, dispatch]);

  const handleUnfollow = useCallback(async () => {
    if (!user || !currentUser || !token || isProcessing) return;
    setIsProcessing(true);
    try {
      await unfollowUser(user._id, token);
      await syncUsers();
    } catch (err) {
      console.error(err);
    } finally {
      setIsProcessing(false);
    }
  }, [user, currentUser, token, isProcessing, dispatch]);

  return { isFollowing, handleFollow, handleUnfollow, isProcessing };
};
