import api from "./api";

export const login = (data: { username: string; password: string }) =>
  api.post("/auth/login", data);