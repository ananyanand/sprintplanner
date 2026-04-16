import api from "./api";

export const sprintApi = {
  // 🔥 SYNC (CREATE + UPDATE + DELETE)
  sync: async (projectId: number, sprints: any[]) => {
    const res = await api.post(`/sprints/sync/${projectId}`, sprints);
    return res.data;
  },

  // ✅ GET SPRINTS BY PROJECT
  getByProject: async (projectId: number) => {
    const res = await api.get(`/sprints/project/${projectId}`);
    return res.data;
  },

  // ✅ GET SINGLE SPRINT
  getById: async (id: number) => {
    const res = await api.get(`/sprints/${id}`);
    return res.data;
  },

  // ✅ UPDATE SPRINT (goal/status)
  update: async (id: number, data: any) => {
    const res = await api.put(`/sprints/${id}`, data);
    return res.data;
  },
};