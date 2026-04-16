import api from "./api";

/* ===============================
   TYPES
=============================== */
export type Reminder = {
  id: number;
  employeeId: number;

  title: string;
  dueDate: string;

  priority: "low" | "medium" | "high";
  completed: boolean;
};

/* ===============================
   REMINDER API
=============================== */
export const reminderApi = {
  // ✅ GET BY EMPLOYEE
  getByEmployee: async (employeeId: number): Promise<Reminder[]> => {
    const res = await api.get(`/reminders/employee/${employeeId}`);
    return res.data;
  },

  // ✅ CREATE
  create: async (data: {
    employeeId: number;
    title: string;
    dueDate: string;
    priority: string;
    completed?: boolean;
  }): Promise<Reminder> => {
    const res = await api.post("/reminders", {
      ...data,
      completed: data.completed ?? false,
    });
    return res.data;
  },

  // ✅ UPDATE
  update: async (data: Reminder): Promise<void> => {
    await api.put("/reminders", data);
  },

  // ✅ DELETE
  delete: async (id: number): Promise<void> => {
    await api.delete(`/reminders/${id}`);
  },
};