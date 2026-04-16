/* eslint-disable @typescript-eslint/no-explicit-any */
import AppLayout from "../components/Layout/AppLayout";
import Card from "../components/ui/Card";
import Table from "../components/ui/Table";
import Button from "../components/ui/Button";
import { AlertCircle, CheckCircle2, Zap, Target, Plus, X, Edit2, Trash2 } from "lucide-react";
import { useState, useEffect } from "react";
import { getDashboardByUsername } from "../services/dashboardApi";
import { reminderApi, type Reminder } from "../services/reminderService";
import Loader from "../components/ui/Loader";

import {
  PieChart,
  Pie,
  Cell,
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

export default function Dashboard() {
  const [dashboard, setDashboard] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [reminders, setReminders] = useState<Reminder[]>([]);
  const [remindersLoading, setRemindersLoading] = useState(false);

  const [showAddReminder, setShowAddReminder] = useState(false);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [newReminder, setNewReminder] = useState({
    title: "",
    dueDate: "",
    priority: "medium" as "low" | "medium" | "high",
  });

  // 🔹 Fetch dashboard and reminders
  useEffect(() => {
    const fetchData = async () => {
      try {
        const username = localStorage.getItem("username");
        if (!username) {
          console.error("Username not found in localStorage");
          setLoading(false);
          return;
        }

        // Fetch dashboard
        const dashboardData = await getDashboardByUsername(username);
        setDashboard(dashboardData);

        // Fetch reminders using employeeId from dashboard
        if (dashboardData?.employeeId) {
          setRemindersLoading(true);
          const remindersData = await reminderApi.getByEmployee(dashboardData.employeeId);
          setReminders(remindersData);
        }
      } catch (err) {
        console.error("Error fetching data:", err);
      } finally {
        setLoading(false);
        setRemindersLoading(false);
      }
    };

    fetchData();
  }, []);

  // 🔹 Derived Data
  const taskData = [
    { name: "Done", value: dashboard?.completedTasks || 0 },
    { name: "In Progress", value: dashboard?.inProgressTasks || 0 },
    {
      name: "Pending",
      value:
        (dashboard?.totalTasks || 0) -
        (dashboard?.completedTasks || 0) -
        (dashboard?.inProgressTasks || 0),
    },
  ];

  const COLORS = ["#4c3a51", "#b25068", "#774360"];

  const weeklyData = dashboard?.items
    ? dashboard.items.slice(0, 5).map((_item: any, index: number) => ({
        day: ["Mon", "Tue", "Wed", "Thu", "Fri"][index] || `Day ${index + 1}`,
        tasks: 1,
      }))
    : [
        { day: "Mon", tasks: 2 },
        { day: "Tue", tasks: 5 },
        { day: "Wed", tasks: 3 },
        { day: "Thu", tasks: 6 },
        { day: "Fri", tasks: 4 },
      ];

  // 🔹 Reminder Handlers
  const handleSaveReminder = async () => {
    if (!newReminder.title.trim()) return;

    try {
      if (!dashboard?.employeeId) {
        console.error("Employee ID not found");
        return;
      }

      if (editingId) {
        // Update existing reminder
        const existingReminder = reminders.find((r) => r.id === editingId);
        if (existingReminder) {
          const updatedReminder: Reminder = {
            ...existingReminder,
            title: newReminder.title,
            dueDate: newReminder.dueDate,
            priority: newReminder.priority,
          };
          await reminderApi.update(updatedReminder);
          setReminders(
            reminders.map((r) => (r.id === editingId ? updatedReminder : r))
          );
        }
        setEditingId(null);
      } else {
        // Create new reminder
        const createdReminder = await reminderApi.create({
          employeeId: dashboard.employeeId,
          title: newReminder.title,
          dueDate: newReminder.dueDate,
          priority: newReminder.priority,
        });
        setReminders([...reminders, createdReminder]);
      }

      setNewReminder({ title: "", dueDate: "", priority: "medium" });
      setShowAddReminder(false);
    } catch (error) {
      console.error("Error saving reminder:", error);
      alert("Failed to save reminder. Please try again.");
    }
  };

  const handleDeleteReminder = async (id: number) => {
    try {
      await reminderApi.delete(id);
      setReminders(reminders.filter((r) => r.id !== id));
    } catch (error) {
      console.error("Error deleting reminder:", error);
      alert("Failed to delete reminder. Please try again.");
    }
  };

  const handleToggleCompletion = async (id: number) => {
    try {
      const reminder = reminders.find((r) => r.id === id);
      if (!reminder) return;

      const updatedReminder: Reminder = {
        ...reminder,
        completed: !reminder.completed,
      };

      await reminderApi.update(updatedReminder);
      setReminders(
        reminders.map((r) => (r.id === id ? updatedReminder : r))
      );
    } catch (error) {
      console.error("Error toggling reminder completion:", error);
      alert("Failed to update reminder. Please try again.");
    }
  };

  const handleEditReminder = (id: number) => {
    const reminder = reminders.find((r) => r.id === id);
    if (reminder) {
      setNewReminder({
        title: reminder.title,
        dueDate: reminder.dueDate,
        priority: reminder.priority,
      });
      setEditingId(id);
      setShowAddReminder(true);
    }
  };

  const handleCloseModal = () => {
    setShowAddReminder(false);
    setEditingId(null);
    setNewReminder({ title: "", dueDate: "", priority: "medium" });
  };

  return (
    <AppLayout>
      {loading ? (
        <div className="flex items-center justify-center h-64">
          <Loader />
        </div>
      ) : (
        <div className="space-y-6">
          {/* 🔥 Header with Greeting */}
          <div>
            <h1 className="text-3xl font-bold text-primary">
              Welcome back, {dashboard?.name?.split(" ")[0] || "User"}! 👋
            </h1>
            <p className="text-secondary text-sm mt-1">
              Here's what's happening with your sprint today.
            </p>
          </div>

          {/* 🔥 Stats Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {[
              {
                label: "Total Tasks",
                value: dashboard?.totalTasks || 0,
                icon: Target,
                color: "accent",
              },
              {
                label: "Completed",
                value: dashboard?.completedTasks || 0,
                icon: CheckCircle2,
                color: "green-500",
              },
              {
                label: "In Progress",
                value: dashboard?.inProgressTasks || 0,
                icon: Zap,
                color: "orange-500",
              },
              {
                label: "Open Bugs",
                value: dashboard?.openBugs || 0,
                icon: AlertCircle,
                color: "red-500",
              },
            ].map((stat, idx) => {
              const Icon = stat.icon;
              return (
                <Card key={idx} className="relative overflow-hidden">
                  <div className="absolute top-0 right-0 w-16 h-16 opacity-5">
                    <Icon size={64} className={`text-${stat.color}`} />
                  </div>
                  <div className="flex items-center gap-3 relative z-10">
                    <div className={`p-3 rounded-lg bg-${stat.color}/10`}>
                      <Icon size={20} className={`text-${stat.color}`} />
                    </div>
                    <div>
                      <p className="text-secondary text-xs font-medium">
                        {stat.label}
                      </p>
                      <h2 className="text-2xl font-bold text-primary mt-1">
                        {stat.value}
                      </h2>
                    </div>
                  </div>
                </Card>
              );
            })}
          </div>

          {/* 🔥 Main Content Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* 📊 Charts Section */}
            <div className="lg:col-span-2 space-y-6">
              {/* Task Distribution */}
              <Card>
                <h3 className="text-lg font-semibold text-primary mb-4">
                  Task Distribution
                </h3>
                <ResponsiveContainer width="100%" height={220}>
                  <PieChart>
                    <Pie
                      data={taskData}
                      cx="50%"
                      cy="50%"
                      outerRadius={70}
                      dataKey="value"
                    >
                      {taskData.map((_, index) => (
                        <Cell key={index} fill={COLORS[index]} />
                      ))}
                    </Pie>
                    <Tooltip />
                  </PieChart>
                </ResponsiveContainer>
              </Card>

              {/* Weekly Activity */}
              <Card>
                <h3 className="text-lg font-semibold text-primary mb-4">
                  Weekly Activity
                </h3>
                <ResponsiveContainer width="100%" height={220}>
                  <LineChart data={weeklyData}>
                    <XAxis dataKey="day" stroke="#1a3e59" />
                    <YAxis stroke="#1a3e59" />
                    <Tooltip />
                    <Line
                      type="monotone"
                      dataKey="tasks"
                      stroke="#5c94bd"
                      strokeWidth={3}
                      dot={{ fill: "#5c94bd", r: 5 }}
                    />
                  </LineChart>
                </ResponsiveContainer>
              </Card>
            </div>

            {/* 🎯 Personal Reminders Sidebar */}
            <div className="space-y-4">
              <Card className="bg-gradient-to-br from-accent/5 to-primary/5">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-2">
                    <div className="p-2 rounded-lg bg-accent/20">
                      <AlertCircle size={18} className="text-accent" />
                    </div>
                    <h3 className="text-lg font-semibold text-primary">
                      My Reminders
                    </h3>
                  </div>
                  <button
                    onClick={() => setShowAddReminder(true)}
                    className="p-2 rounded-lg hover:bg-accent/10 transition"
                    title="Add reminder"
                  >
                    <Plus size={18} className="text-accent" />
                  </button>
                </div>

                {remindersLoading ? (
                  <div className="flex justify-center py-4">
                    <Loader />
                  </div>
                ) : (
                  <div className="space-y-2 max-h-96 overflow-y-auto">
                    {reminders.length === 0 ? (
                      <p className="text-secondary text-sm text-center py-4">
                        No reminders yet. Add one to get started!
                      </p>
                    ) : (
                      reminders.map((reminder) => {
                        const priorityColor =
                          reminder.priority === "high"
                            ? "bg-red-50 border-red-200"
                            : reminder.priority === "medium"
                            ? "bg-amber-50 border-amber-200"
                            : "bg-blue-50 border-blue-200";

                        return (
                          <div
                            key={reminder.id}
                            className={`p-3 rounded-lg border ${priorityColor} hover:shadow-md transition group`}
                          >
                            <div className="flex items-start gap-2">
                              <input
                                type="checkbox"
                                checked={reminder.completed}
                                onChange={() =>
                                  handleToggleCompletion(reminder.id)
                                }
                                className="mt-1 cursor-pointer accent-accent"
                              />
                              <div className="flex-1 min-w-0">
                                <p
                                  className={`text-sm font-medium ${
                                    reminder.completed
                                      ? "line-through text-secondary"
                                      : "text-primary"
                                  }`}
                                >
                                  {reminder.title}
                                </p>
                                <p className="text-xs text-secondary mt-1">
                                  {reminder.dueDate}
                                </p>
                              </div>
                              <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition">
                                <button
                                  onClick={() => handleEditReminder(reminder.id)}
                                  className="p-1 rounded hover:bg-black/5"
                                  title="Edit"
                                >
                                  <Edit2 size={14} className="text-primary" />
                                </button>
                                <button
                                  onClick={() =>
                                    handleDeleteReminder(reminder.id)
                                  }
                                  className="p-1 rounded hover:bg-red-200"
                                  title="Delete"
                                >
                                  <Trash2 size={14} className="text-red-500" />
                                </button>
                              </div>
                            </div>
                          </div>
                        );
                      })
                    )}
                  </div>
                )}
              </Card>

              {/* Sprint Progress */}
              <Card>
                <h3 className="text-lg font-semibold text-primary mb-4">
                  Sprint Progress
                </h3>

                <div className="space-y-3">
                  <div>
                    <div className="flex justify-between items-center mb-2">
                      <span className="text-sm text-secondary font-medium">
                        {dashboard?.sprintName || "No Active Sprint"}
                      </span>
                      <span className="text-sm font-bold text-accent">
                        {dashboard?.sprintProgress || 0}%
                      </span>
                    </div>
                    <div className="w-full h-2.5 bg-primary/10 rounded-full overflow-hidden">
                      <div
                        className="h-2.5 bg-accent rounded-full transition-all duration-300"
                        style={{ width: `${dashboard?.sprintProgress || 0}%` }}
                      />
                    </div>
                  </div>
                </div>
              </Card>

              {/* Quick Stats */}
              <Card className="bg-gradient-to-br from-primary/5 to-secondary/5">
                <h3 className="text-sm font-semibold text-primary mb-3">
                  Quick Stats
                </h3>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-secondary">Completed Today</span>
                    <span className="font-semibold text-primary">
                      {dashboard?.completedToday || 0}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-secondary">Due This Week</span>
                    <span className="font-semibold text-primary">
                      {dashboard?.dueThisWeek || 0}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-secondary">On Track</span>
                    <span className="font-semibold text-accent">
                      {(dashboard?.sprintProgress || 0) >= 50 ? "Yes ✓" : "No"}
                    </span>
                  </div>
                </div>
              </Card>
            </div>
          </div>

          {/* 🔥 Recent Tasks Table */}
          <Card>
            <div className="mb-4">
              <h3 className="text-lg font-semibold text-primary">
                Recent Tasks
              </h3>
              <p className="text-secondary text-sm mt-1">
                Keep track of all your active work
              </p>
            </div>

            <Table
              columns={[
                { header: "Task", accessor: "title" },
                { header: "Type", accessor: "type" },
                { header: "Status", accessor: "status" },
                { header: "Due Date", accessor: "dueDate" },
              ]}
              data={
                dashboard?.items?.map((item: any) => ({
                  title: item.title,
                  type: item.type,
                  status: item.status,
                  dueDate: new Date(item.dueDate).toLocaleDateString("en-US", {
                    month: "short",
                    day: "numeric",
                  }),
                })) || []
              }
            />
          </Card>
        </div>
      )}

      {/* 🔥 Add/Edit Reminder Modal */}
      {showAddReminder && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/30 backdrop-blur-sm">
          <div className="bg-background/95 backdrop-blur-xl border border-primary/10 rounded-2xl shadow-xl w-full max-w-md p-6 space-y-4">
            {/* Header */}
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-semibold text-primary">
                {editingId ? "Edit Reminder" : "Add Reminder"}
              </h2>
              <button
                onClick={handleCloseModal}
                className="p-1 hover:bg-primary/10 rounded transition"
              >
                <X size={20} className="text-primary" />
              </button>
            </div>

            {/* Title Input */}
            <div className="space-y-1">
              <label className="text-xs font-medium text-secondary">
                What do you need to do?
              </label>
              <input
                type="text"
                placeholder="e.g. Review documentation..."
                className="w-full px-3 py-2.5 rounded-lg border border-primary/10 text-sm outline-none focus:border-accent focus:ring-1 focus:ring-accent/30 transition"
                value={newReminder.title}
                onChange={(e) =>
                  setNewReminder({ ...newReminder, title: e.target.value })
                }
              />
            </div>

            {/* Due Date Input */}
            <div className="space-y-1">
              <label className="text-xs font-medium text-secondary">
                When?
              </label>
              <input
                type="text"
                placeholder="e.g. Today, Tomorrow, 2 hours..."
                className="w-full px-3 py-2.5 rounded-lg border border-primary/10 text-sm outline-none focus:border-accent focus:ring-1 focus:ring-accent/30 transition"
                value={newReminder.dueDate}
                onChange={(e) =>
                  setNewReminder({ ...newReminder, dueDate: e.target.value })
                }
              />
            </div>

            {/* Priority */}
            <div className="space-y-2">
              <label className="text-xs font-medium text-secondary">
                Priority
              </label>
              <div className="flex gap-2">
                {(["low", "medium", "high"] as const).map((p) => (
                  <button
                    key={p}
                    onClick={() =>
                      setNewReminder({
                        ...newReminder,
                        priority: p,
                      })
                    }
                    className={`flex-1 px-3 py-2 rounded-lg text-xs font-medium border transition ${
                      newReminder.priority === p
                        ? "bg-accent text-white border-accent"
                        : "border-primary/10 text-secondary hover:bg-primary/5"
                    }`}
                  >
                    {p.charAt(0).toUpperCase() + p.slice(1)}
                  </button>
                ))}
              </div>
            </div>

            {/* Actions */}
            <div className="flex justify-between items-center pt-3 border-t border-primary/10">
              <button
                onClick={handleCloseModal}
                className="text-sm text-secondary hover:text-primary transition"
              >
                Cancel
              </button>

              <Button
                onClick={handleSaveReminder}
                disabled={!newReminder.title.trim()}
              >
                {editingId ? "Update" : "Add"} Reminder
              </Button>
            </div>
          </div>
        </div>
      )}
    </AppLayout>
  );
}