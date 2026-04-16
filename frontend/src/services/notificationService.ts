import api from "./api";

export type Notification = {
  id: number;
  employeeId: number;
  employeeName: string;
  type: "task_assigned" | "bug_assigned"; // task or bug
  taskId?: number;
  bugId?: number;
  taskTitle?: string;
  bugTitle?: string;
  message: string;
  isRead: boolean;
  createdAt: string;
};

export const notificationApi = {
  // ✅ GET UNREAD NOTIFICATIONS
  getUnread: async (employeeId: number) => {
    const res = await api.get(`/notifications/unread/${employeeId}`);
    return res.data;
  },

  // ✅ GET ALL NOTIFICATIONS
  getAll: async (employeeId: number) => {
    const res = await api.get(`/notifications/employee/${employeeId}`);
    return res.data;
  },

  // ✅ MARK AS READ
  markAsRead: async (notificationId: number) => {
    const res = await api.put(`/notifications/${notificationId}/read`);
    return res.data;
  },

  // ✅ MARK ALL AS READ
  markAllAsRead: async (employeeId: number) => {
    const res = await api.put(`/notifications/employee/${employeeId}/read-all`);
    return res.data;
  },

  // ✅ DELETE NOTIFICATION
  delete: async (notificationId: number) => {
    const res = await api.delete(`/notifications/${notificationId}`);
    return res.data;
  },

  // ✅ DELETE ALL
  deleteAll: async (employeeId: number) => {
    const res = await api.delete(`/notifications/employee/${employeeId}`);
    return res.data;
  },
};
