import axiosClient from "./axiosClient";
export const login = (data) => axiosClient.post("/api/auth/login", data);
export const register = (data) => axiosClient.post("/api/auth/register", data);
export const logout = (data) => axiosClient.post("/api/auth/logout", data);
export const refreshToken = (data) =>
  axiosClient.post("/api/auth/refresh-token", data);
