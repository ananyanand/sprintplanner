import api from "./api";

export const taskApi = {
  // ✅ CREATE TASK
  create: async (data: {
    sprintId: number;
    title: string;
    description: string;
    status: string;
    priority: string;
    storyPoints: number;
    startDate?: string | null;
    endDate?: string | null;
    assignedTo?: number | null;
  }) => {
    const res = await api.post("/tasks", data);
    return res.data;
  },

  // ✅ GET TASKS BY SPRINT
  getBySprint: async (sprintId: number) => {
    const res = await api.get(`/tasks/sprint/${sprintId}`);
    return res.data;
  },

  // ✅ DELETE TASK
  delete: async (id: number) => {
    const res = await api.delete(`/tasks/${id}`);
    return res.data;
  },

  // ✅ UPDATE TASK STATUS (FIXED ✅)
  updateStatus: async (id: number, status: string) => {
    const res = await api.put(
      `/tasks/${id}/status`,
      status, // ✅ send raw string
      {
        headers: {
          "Content-Type": "application/json",
        },
      }
    );
    return res.data;
  },

  // ✅ UPDATE FULL TASK
  update: async (
    id: number,
    data: {
      title?: string;
      description?: string;
      status?: string;
      priority?: string;
      storyPoints?: number;
      startDate?: string | null;
      endDate?: string | null;
      assignedTo?: number | null;
    }
  ) => {
    const res = await api.put(`/tasks/${id}`, data);
    return res.data;
  },
};