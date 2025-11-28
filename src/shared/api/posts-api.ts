import { backendInstance } from "./instance";

const API_ORIGIN = import.meta.env.VITE_API_URL.replace("/api", "");

export const getExplorePosts = async () => {
  const { data } = await backendInstance.get("/posts/explore");

  const normalized = data.map((post) => ({
    ...post,
    imageUrl: `${API_ORIGIN}${post.imageUrl}`,
  }));

  return normalized;
};

export const getPostsByUsername = async (username) => {
  const res = await backendInstance.get(`/posts/${username}/posts`);

  const normalized = res.data.map((post) => ({
    ...post,
    imageUrl: `${API_ORIGIN}${post.imageUrl}`,
  }));

  return normalized;
};

export const getPostById = async (postId) => {
  const { data } = await backendInstance.get(`/posts/${postId}`);

  return {
    ...data,
    imageUrl: `${API_ORIGIN}${data.imageUrl}`,
  };
};

export const likePost = async (postId, token) => {
  const { data } = await backendInstance.post(
    `/posts/${postId}/like`,
    {},
    { headers: { Authorization: `Bearer ${token}` } }
  );
  return data;
};

export const unlikePost = async (postId, token) => {
  const { data } = await backendInstance.post(
    `/posts/${postId}/unlike`,
    {},
    { headers: { Authorization: `Bearer ${token}` } }
  );
  return data;
};

export const likeComment = async (postId, commentId, token) => {
  const { data } = await backendInstance.post(
    `/posts/${postId}/comments/${commentId}/like`,
    {},
    { headers: { Authorization: `Bearer ${token}` } }
  );
  return data;
};

export const unlikeComment = async (postId, commentId, token) => {
  const { data } = await backendInstance.post(
    `/posts/${postId}/comments/${commentId}/unlike`,
    {},
    { headers: { Authorization: `Bearer ${token}` } }
  );
  return data;
};

export const createNewPost = async (formData, token) => {
  const response = await backendInstance.post(
    "/posts/create-new-post",
    formData,
    {
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "multipart/form-data",
      },
    }
  );

  return response.data;
};

export const deletePost = async (postId, token) => {
  await backendInstance.delete(`/posts/${postId}`, {
    headers: { Authorization: `Bearer ${token}` },
  });
};

export const editPost = async (postId, caption, token) => {
  const { data } = await backendInstance.put(
    `/posts/${postId}/edit`,
    { caption },
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );

  return {
    ...data,
    imageUrl: `${API_ORIGIN}${data.imageUrl}`,
  };
};

export const getFeedPosts = async (token) => {
  const response = await backendInstance.get("/posts/dashboard", {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  return response.data;
};

export const addCommentToPost = async (postId, text, token) => {
  const response = await backendInstance.post(
    `/posts/${postId}/comments`,
    { text },
    {
      headers: { Authorization: `Bearer ${token}` },
    }
  );
  return response.data;
};
