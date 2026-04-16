import api from "./api";

export const getEmployees = () => api.get("/employees");

export const createEmployee = (data: {
  name: string;
  role: string;
  username: string;
  password: string;
}) => api.post("/employees", data);

export const updateEmployee = (
  id: number,
  data: { name: string; role: string }
) => api.put(`/employees/${id}`, data);

export const deleteEmployee = (id: number) =>
  api.delete(`/employees/${id}`);

export const getEmployeeById = (id: number) =>
  api.get(`/employees/${id}`);

export const getEmployeeByUsername = (username: string) =>
  api.get(`/employees/username/${username}`);