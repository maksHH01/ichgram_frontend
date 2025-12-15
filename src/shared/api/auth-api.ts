import { authInstance } from "./instance";
import type { LoginPayload } from "../../redux/auth/auth-thunks";

export interface AuthResponse {
  accessToken: string;
  refreshToken: string;
  user: {
    _id: string;
    email: string;
    username: string;
    fullname: string;
    avatarUrl?: string;
    bio?: string;
    link?: string;
    verify: boolean;
    followers: string[];
    following: string[];
  };
}

export const loginUserApi = async (
  payload: LoginPayload
): Promise<AuthResponse> => {
  const { data } = await authInstance.post<AuthResponse>(
    "/auth/login",
    payload
  );
  return data;
};

export const getCurrentUserApi = async () => {
  const { data } = await authInstance.get("/auth/current");
  return data;
};

export const logoutUserApi = async () => {
  const { data } = await authInstance.post("/auth/logout");
  return data;
};
