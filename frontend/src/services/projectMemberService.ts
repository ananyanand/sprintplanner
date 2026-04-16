import api from "./api";

export const projectMemberApi = {
  // ✅ ASSIGN MEMBERS (bulk)
  assign: (projectId: number, employeeIds: number[]) =>
    api.post("/project-members/assign", {
      projectId,
      employeeIds,
    }),

  // ✅ GET MEMBERS BY PROJECT
  getByProject: (projectId: number) =>
    api.get(`/project-members/project/${projectId}`),

  // ✅ REMOVE MEMBER
  remove: (projectId: number, employeeId: number) =>
    api.delete(`/project-members`, {
      params: { projectId, employeeId },
    }),
};