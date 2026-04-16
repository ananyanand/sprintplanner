import api from "./api";

/* ===============================
   TYPES
=============================== */
export type Project = {
  id: number;
  name: string;
  startDate: string;
  endDate: string;
  sprintDuration: number;
};

/* ===============================
   PROJECT API
=============================== */
export const projectApi = {
  // ✅ GET ALL
  getAll: async (): Promise<Project[]> => {
    const res = await api.get("/projects");
    return res.data;
  },

  // ✅ GET BY ID
  getById: async (id: number): Promise<Project> => {
    const res = await api.get(`/projects/${id}`);
    return res.data;
  },

  // ✅ CREATE
  create: async (data: {
    name: string;
    startDate: string;
    endDate: string;
    sprintDuration: number;
  }): Promise<Project> => {
    const res = await api.post("/projects", data);
    return res.data;
  },

  // ✅ UPDATE
  update: async (
    id: number,
    data: {
      name: string;
      startDate: string;
      endDate: string;
      sprintDuration: number;
    }
  ): Promise<Project> => {
    const res = await api.put(`/projects/${id}`, data);
    return res.data;
  },

  // ✅ DELETE
  delete: async (id: number): Promise<void> => {
    await api.delete(`/projects/${id}`);
  },
};