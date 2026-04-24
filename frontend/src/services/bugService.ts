import api from "./api";

export const bugApi = {
  // ✅ CREATE BUG
  create: async (data: {
    projectId: number;
    title: string;
    description: string;
    severity: string;
    status: string;
    assignedTo?: number | null;
    dueDate?: string | null;
  }) => {
    const res = await api.post("/bugs", data);
    return res.data;
  },

  // ✅ GET BUGS BY PROJECT
  getByProject: async (projectId: number) => {
    const res = await api.get(`/bugs/project/${projectId}`);
    return res.data;
  },

  // ✅ DELETE BUG
  delete: async (id: number) => {
    const res = await api.delete(`/bugs/${id}`);
    return res.data;
  },

  // ✅ UPDATE STATUS ONLY
  updateStatus: async (id: number, status: string) => {
    const res = await api.put(
      `/bugs/${id}/status`,
      JSON.stringify(status), // produces "fixing" — a valid JSON string
      {
        transformRequest: [(data: unknown) => data], // prevent Axios v1 from re-serializing the string
      }
    );
    return res.data;
  },
};