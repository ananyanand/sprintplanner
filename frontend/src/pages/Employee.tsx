/* eslint-disable react-hooks/set-state-in-effect */
/* eslint-disable @typescript-eslint/no-explicit-any */
import { useState, useEffect, useCallback } from "react";
import AppLayout from "../components/Layout/AppLayout";
import Card from "../components/ui/Card";
import Button from "../components/ui/Button";
import { UserPlus, Trash2, Users, Pencil, Code, Briefcase } from "lucide-react";
import { createPortal } from "react-dom";

import {
  getEmployees,
  createEmployee,
  updateEmployee,
  deleteEmployee,
  getEmployeeById,
} from "../services/employeeServices";

type Employee = {
  id: number;
  name: string;
  role: string;
  username?: string;
};

const roleColors: Record<string, { bg: string; text: string; icon: string }> = {
  developer: { bg: "bg-blue-50", text: "text-blue-700", icon: "💻" },
  designer: { bg: "bg-purple-50", text: "text-purple-700", icon: "🎨" },
  manager: { bg: "bg-emerald-50", text: "text-emerald-700", icon: "📊" },
  devops: { bg: "bg-orange-50", text: "text-orange-700", icon: "⚙️" },
  default: { bg: "bg-slate-50", text: "text-slate-700", icon: "👤" },
};



export default function EmployeePage() {
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [open, setOpen] = useState(false);
  const [isEdit, setIsEdit] = useState(false);

  const [form, setForm] = useState<any>({
    id: 0,
    name: "",
    role: "",
    username: "",
    password: "",
  });

// 🔥 FETCH FUNCTION (memoized for ESLint)
const fetchEmployees = useCallback(async () => {
  try {
    const res = await getEmployees();

    const data = res?.data ?? res;

    setEmployees(data);
  } catch (err) {
    console.error("Fetch failed", err);
  }
}, []);

// 🔥 FETCH ON LOAD
useEffect(() => {
  fetchEmployees();
}, [fetchEmployees]);

// ➕ CREATE + ✏️ UPDATE
const handleAdd = async () => {
  try {
    if (isEdit) {
      // ✏️ UPDATE
      const res = await updateEmployee(form.id, {
        name: form.name,
        role: form.role,
      });

      const updated = res?.data ?? res;

      setEmployees((prev) =>
        prev.map((e) => (e.id === form.id ? updated : e))
      );

    } else {
      // ➕ CREATE
      const res = await createEmployee({
        name: form.name,
        role: form.role,
        username: form.username,
        password: form.password,
      });

      const created = res?.data ?? res;

      setEmployees((prev) => [...prev, created]);
    }

    // ✅ Reset UI
    setOpen(false);
    setIsEdit(false);

    setForm({
      id: 0,
      name: "",
      role: "",
      username: "",
      password: "",
    });

  } catch (err: any) {
    console.error("ERROR:", err);
    alert(err?.response?.data || "Operation failed");
  }
};

// ❌ DELETE
const handleDelete = async (id: number) => {
  try {
    await deleteEmployee(id);

    setEmployees((prev) =>
      prev.filter((e) => e.id !== id)
    );

  } catch (err) {
    console.error("Delete failed", err);
  }
};

// 🎨 ROLE COLOR
const getRoleColor = (role: string) => {
  return roleColors[role?.toLowerCase()] || roleColors.default;
};

  return (
    <AppLayout>
      <div className="space-y-8 max-w-7xl mx-auto">
        {/* 🔥 Header Section */}
        <div className="flex justify-between items-start">
          <div className="space-y-2">
            <h1 className="text-4xl font-bold text-primary">Manage Team 👥</h1>
            <p className="text-secondary text-sm">
              Organize team members and their project assignments
            </p>
          </div>

          <Button
            onClick={() => {
              setIsEdit(false);
              setForm({
                id: 0,
                name: "",
                role: "",
                username: "",
                password: "",
              });
              setOpen(true);
            }}
            className="bg-gradient-to-r from-accent to-secondary text-white font-semibold px-6 py-3 rounded-lg hover:shadow-lg hover:scale-105 transition-all"
          >
            <UserPlus size={20} className="mr-2 inline" />
            Add Employee
          </Button>
        </div>

        {/* 🔥 Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Card className="relative overflow-hidden">
            <div className="absolute top-0 right-0 w-16 h-16 opacity-5">
              <Users size={64} className="text-accent" />
            </div>
            <div className="flex items-center gap-3 relative z-10">
              <div className="p-3 rounded-lg bg-accent/10">
                <Users size={20} className="text-accent" />
              </div>
              <div>
                <p className="text-secondary text-xs font-medium">Total Members</p>
                <h2 className="text-2xl font-bold text-primary mt-1">
                  {employees.length}
                </h2>
              </div>
            </div>
          </Card>

          <Card className="relative overflow-hidden">
            <div className="absolute top-0 right-0 w-16 h-16 opacity-5">
              <Code size={64} className="text-primary" />
            </div>
            <div className="flex items-center gap-3 relative z-10">
              <div className="p-3 rounded-lg bg-primary/10">
                <Code size={20} className="text-primary" />
              </div>
              <div>
                <p className="text-secondary text-xs font-medium">Developers</p>
                <h2 className="text-2xl font-bold text-primary mt-1">
                  {employees.filter(e => e.role?.toLowerCase() === 'developer').length}
                </h2>
              </div>
            </div>
          </Card>

          <Card className="relative overflow-hidden">
            <div className="absolute top-0 right-0 w-16 h-16 opacity-5">
              <Briefcase size={64} className="text-purple-500" />
            </div>
            <div className="flex items-center gap-3 relative z-10">
              <div className="p-3 rounded-lg bg-purple-100">
                <Briefcase size={20} className="text-purple-600" />
              </div>
              <div>
                <p className="text-secondary text-xs font-medium">Designers</p>
                <h2 className="text-2xl font-bold text-primary mt-1">
                  {employees.filter(e => e.role?.toLowerCase() === 'designer').length}
                </h2>
              </div>
            </div>
          </Card>

          <Card className="relative overflow-hidden">
            <div className="absolute top-0 right-0 w-16 h-16 opacity-5">
              <Users size={64} className="text-emerald-500" />
            </div>
            <div className="flex items-center gap-3 relative z-10">
              <div className="p-3 rounded-lg bg-emerald-100">
                <Users size={20} className="text-emerald-600" />
              </div>
              <div>
                <p className="text-secondary text-xs font-medium">Managers</p>
                <h2 className="text-2xl font-bold text-primary mt-1">
                  {employees.filter(e => e.role?.toLowerCase() === 'manager').length}
                </h2>
              </div>
            </div>
          </Card>
        </div>

        {/* 🔥 Employee Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {employees.map((e) => {
            const roleColor = getRoleColor(e.role);
            return (
              <Card
                key={e.id}
                className="relative overflow-hidden group hover:shadow-xl transition-all duration-300 bg-gradient-to-br from-white to-slate-50/50"
              >
                {/* Background decoration */}
                <div className="absolute -top-12 -right-12 w-32 h-32 bg-accent/5 rounded-full blur-2xl" />

                {/* Action Buttons */}
          <div className="absolute top-4 right-4 flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity z-50 pointer-events-auto">
                  <button
                    onClick={async (ev) => {
                      ev.stopPropagation();

                      try {
                        const res = await getEmployeeById(e.id);

                        setForm({
                          id: res.data.id,
                          name: res.data.name,
                          role: res.data.role,
                          username: "",
                          password: "",
                        });

                        setIsEdit(true);
                        setOpen(true);
                      } catch (err) {
                        console.error("Failed to fetch employee", err);
                      }
                    }}
                    className="p-2 rounded-lg bg-blue-100 text-blue-600 hover:bg-blue-200 transition-colors"
                    title="Edit"
                  >
                    <Pencil size={16} />
                  </button>
                  <button
                    onClick={(ev) => {
                      ev.stopPropagation();
                      handleDelete(e.id);
                    }}
                    className="p-2 rounded-lg bg-red-100 text-red-600 hover:bg-red-200 transition-colors"
                    title="Delete"
                  >
                    <Trash2 size={16} />
                  </button>
                </div>

                {/* Content */}
                <div className="relative z-10 space-y-4">
                  {/* Name & Role */}
                  <div>
                    <h2 className="text-2xl font-bold text-primary mb-2">
                      {e.name}
                    </h2>
                    <div className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-full ${roleColor.bg} ${roleColor.text} font-semibold text-sm`}>
                      <span>{roleColor.icon}</span>
                      <span className="capitalize">{e.role}</span>
                    </div>
                  </div>

                  {/* Divider */}
                  <div className="h-px bg-gradient-to-r from-primary/20 to-accent/20" />
                  {/* Stats Footer */}
                  <div className="pt-2 border-t border-primary/10 flex items-center justify-between text-xs text-secondary">
                    <span>ID: #{e.id}</span>
                    <span className="font-semibold text-accent">Active ✓</span>
                  </div>
                </div>
              </Card>
            );
          })}
        </div>

        {/* Empty State */}
        {employees.length === 0 && (
          <div className="text-center py-20">
            <Users size={64} className="mx-auto text-primary/20 mb-4" />
            <h3 className="text-2xl font-semibold text-primary mb-2">
              No team members yet
            </h3>
            <p className="text-secondary mb-6">
              Add your first employee to get started
            </p>
            <Button
              onClick={() => {
                setIsEdit(false);
                setForm({
                  id: 0,
                  name: "",
                  role: "",
              
                  username: "",
                  password: "",
                });
                setOpen(true);
              }}
            >
              Add First Employee
            </Button>
          </div>
        )}

        {/* 🔥 MODAL */}
        {open &&
          createPortal(
            <div
              className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/40 backdrop-blur-md"
              onClick={() => setOpen(false)}
            >
              <div
                onClick={(e) => e.stopPropagation()}
                className="bg-background/95 backdrop-blur-2xl border border-accent/20 rounded-3xl shadow-2xl w-full max-w-lg p-8 space-y-6 max-h-96 overflow-y-auto"
              >
                {/* Header */}
                <div className="flex items-center gap-4">
                  <div className="p-3 bg-gradient-to-br from-accent/20 to-secondary/20 rounded-2xl">
                    <UserPlus size={24} className="text-accent" />
                  </div>
                  <div>
                    <h2 className="text-2xl font-bold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
                      {isEdit ? "Edit Employee" : "Add Employee"}
                    </h2>
                    <p className="text-xs text-secondary mt-1">
                      {isEdit
                        ? "Update employee information"
                        : "Create employee & login access"}
                    </p>
                  </div>
                </div>

                {/* Employee Info */}
                <div className="space-y-4">
                  <div>
                    <label className="text-xs font-semibold text-secondary mb-2 block">
                      Full Name
                    </label>
                    <input
                      placeholder="e.g. Ananya Kumar"
                      className="w-full px-4 py-3 rounded-xl border border-primary/10 text-sm focus:border-accent focus:ring-2 focus:ring-accent/20 outline-none transition-all bg-slate-50/50"
                      value={form.name}
                      onChange={(e) =>
                        setForm({ ...form, name: e.target.value })
                      }
                    />
                  </div>

                  <div>
                    <label className="text-xs font-semibold text-secondary mb-2 block">
                      Role
                    </label>
                    <input
                      placeholder="e.g. Developer, Designer, Manager"
                      className="w-full px-4 py-3 rounded-xl border border-primary/10 text-sm focus:border-accent focus:ring-2 focus:ring-accent/20 outline-none transition-all bg-slate-50/50"
                      value={form.role}
                      onChange={(e) =>
                        setForm({ ...form, role: e.target.value })
                      }
                    />
                  </div>

                </div>

                {/* Login (only for create) */}
                {!isEdit && (
                  <div className="space-y-4 border-t border-primary/10 pt-4">
                    <div>
                      <label className="text-xs font-semibold text-secondary mb-2 block">
                        Username
                      </label>
                      <input
                        placeholder="Create username"
                        className="w-full px-4 py-3 rounded-xl border border-primary/10 text-sm focus:border-accent focus:ring-2 focus:ring-accent/20 outline-none transition-all bg-slate-50/50"
                        value={form.username}
                        onChange={(e) =>
                          setForm({ ...form, username: e.target.value })
                        }
                      />
                    </div>

                    <div>
                      <label className="text-xs font-semibold text-secondary mb-2 block">
                        Password
                      </label>
                      <input
                        placeholder="Create password"
                        type="password"
                        className="w-full px-4 py-3 rounded-xl border border-primary/10 text-sm focus:border-accent focus:ring-2 focus:ring-accent/20 outline-none transition-all bg-slate-50/50"
                        value={form.password}
                        onChange={(e) =>
                          setForm({ ...form, password: e.target.value })
                        }
                      />
                    </div>
                  </div>
                )}

                {/* Actions */}
                <div className="flex justify-between items-center pt-4 border-t border-primary/10 gap-3">
                  <button
                    onClick={() => setOpen(false)}
                    className="px-6 py-2.5 rounded-lg text-secondary hover:bg-slate-100 font-medium transition-colors"
                  >
                    Cancel
                  </button>

                  <Button
                    onClick={handleAdd}
                    className="bg-gradient-to-r from-accent to-secondary text-white font-semibold"
                  >
                    {isEdit ? "Update Employee" : "Create Employee"}
                  </Button>
                </div>
              </div>
            </div>,
            document.body,
          )}
      </div>
    </AppLayout>
  );
}