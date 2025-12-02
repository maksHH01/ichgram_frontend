import { backendInstance } from "./instance";

export const getUserByUsername = async (username) => {
  const res = await backendInstance.get(`/users/${username}`);
  return res.data;
};

export const getUserById = async (userId) => {
  const res = await backendInstance.get(`/users/by-id/${userId}`);
  return res.data;
};

export const followUser = async (userId, token) => {
  const { data } = await backendInstance.post(
    `/users/${userId}/follow`,
    {},
    { headers: { Authorization: `Bearer ${token}` } }
  );
  return data;
};

export const unfollowUser = async (userId, token) => {
  const { data } = await backendInstance.post(
    `/users/${userId}/unfollow`,
    {},
    { headers: { Authorization: `Bearer ${token}` } }
  );
  return data;
};

export const searchUsers = async (query) => {
  const res = await backendInstance.get(`/users/search?q=${query}`);
  return res.data;
};

export const updateUserProfile = async (formData, token) => {
  const response = await backendInstance.patch("/users/me", formData, {
    headers: {
      "Content-Type": "multipart/form-data",
      Authorization: `Bearer ${token}`,
    },
  });
  return response.data;
};
