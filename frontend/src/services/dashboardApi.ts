import api from "./api";

export const getDashboardByUsername = async (username: string) => {
  const res = await api.get(`/dashboard/${username}`);
  return res.data;
};