/* eslint-disable react-hooks/immutability */
/* eslint-disable @typescript-eslint/no-explicit-any */
import { useState, useEffect, useRef } from "react";
import AppLayout from "../components/Layout/AppLayout";
import Card from "../components/ui/Card";
import Button from "../components/ui/Button";
import MultiSelectDropdown from "../components/ui/MultiSelectDropdown";
import {
  FolderPlus,
  Pencil,
  Plus,
  Timer,
  Users,
  CheckCircle2,
  Clock,
  Zap,
  ChevronDown,
} from "lucide-react";
import TaskCard from "../components/Sprints/TaskCard"; // adjust path if needed
import TimelineView from "../components/Sprints/TimelineView";
import { createPortal } from "react-dom";
import { projectApi } from "../services/projectService";
import { sprintApi } from "../services/sprintService";
import { projectMemberApi } from "../services/projectMemberService";
import { taskApi } from "../services/taskService";

type Task = {
  id: number;
  title: string;
  description: string;
  status: string;
  assignee: string[];
  createdAt: string;
  startDate: string;
  endDate: string;
  priority: string;
  project: string;
  storyPoints: number;
  sprintId: number | null;
};

export default function SprintPage() {
  const [view, setView] = useState<"board" | "timeline" | "list">("board");
  const [open, setOpen] = useState(false);
  const [modalMode, setModalMode] = useState<"create" | "edit" | "view">("create");

  const [projects, setProjects] = useState<any[]>([]);
  const [users, setUsers] = useState<any[]>([]);
  const [sprints, setSprints] = useState<any[]>([]);
  const [tasks, setTasks] = useState<Task[]>([]);

  const [selectedProject, setSelectedProject] = useState<any>(null);
  const [projectDropdownOpen, setProjectDropdownOpen] = useState(false);
  const projectDropdownRef = useRef<HTMLDivElement>(null);

  const [task, setTask] = useState<Task>({
    id: 0,
    title: "",
    description: "",
    status: "todo",
    assignee: [],
    createdAt: new Date().toISOString(),
    startDate: "",
    endDate: "",
    priority: "Medium",
    project: "",
    storyPoints: 1,
    sprintId: null,
  });

  const columns = ["todo", "planning", "inprogress", "review", "done"];

 const statusColors: Record<string, { bg: string; text: string; icon: any }> = {
  todo: {
    bg: "bg-slate-100",
    text: "text-slate-700",
    icon: Clock,
  },
  planning: {
    bg: "bg-blue-100",
    text: "text-blue-700",
    icon: Zap,
  },
  inprogress: {
    bg: "bg-yellow-100",
    text: "text-yellow-700",
    icon: Clock,
  },
  review: {
    bg: "bg-purple-100",
    text: "text-purple-700",
    icon: Pencil,
  },
  done: {
    bg: "bg-green-100",
    text: "text-green-700",
    icon: CheckCircle2,
  },

  // 🔥 FIX: Add this
  backlog: {
    bg: "bg-red-100",
    text: "text-red-700",
    icon: Clock,
  },
};

  // 🔥 CLOSE DROPDOWN ON OUTSIDE CLICK
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        projectDropdownRef.current &&
        !projectDropdownRef.current.contains(event.target as Node)
      ) {
        setProjectDropdownOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // 🔥 LOAD PROJECTS
  useEffect(() => {
    loadProjects();
  }, []);

  const loadProjects = async () => {
    try {
     const data = await projectApi.getAll();

      setProjects(
        data.map((p: any) => ({
          id: p.id,
          name: p.name,
          label: p.name,
          value: p.id,
        })),
      );
    } catch (err) {
      console.error(err);
    }
  };

  // 🔥 LOAD TASKS WHEN SPRINT CHANGES
  useEffect(() => {
    if (!task.sprintId) return;
    loadTasks(task.sprintId);
  }, [task.sprintId]);

  // 🔥 LOAD TASKS
  const loadTasks = async (sprintId: number) => {
    try {
      const res = await taskApi.getBySprint(sprintId);
      const data = res.data || res;

      const today = new Date();

      const formatted = data.map((t: any) => {
        let status = t.status;

        if (t.endDate && new Date(t.endDate) < today && t.status !== "done") {
          status = "backlog";
        }

        return {
          id: t.id,
          title: t.title,
          description: t.description,
          status,
          priority: t.priority,
          storyPoints: t.storyPoints,

          createdAt: t.createdAt, // ✅ KEEP THIS
          startDate: t.startDate, // ✅ KEEP THIS
          endDate: t.endDate, // ✅ KEEP THIS

          assignee: t.assigneeName ? [t.assigneeName] : [],
        };
      });

      setTasks(formatted);
    } catch (err) {
      console.error(err);
    }
  };

  // 🔥 HANDLE PROJECT SELECTION
  const handleProjectSelect = async (project: any) => {
    setSelectedProject(project);
    setProjectDropdownOpen(false);

    setTask({
      ...task,
      project: project.name,
      sprintId: null,
      assignee: [],
    });

    if (!project.id) return;

    try {
      // 🔥 LOAD SPRINTS
      const sprintRes = await sprintApi.getByProject(project.id);

      const formattedSprints = sprintRes.map((s: any) => ({
        ...s,
        startDate: s.startDate.split("T")[0],
        endDate: s.endDate.split("T")[0],
      }));

      setSprints(formattedSprints);

      // 🔥 AUTO SELECT ACTIVE SPRINT
      const today = new Date();
      const activeSprint = formattedSprints.find((s: any) => {
        const start = new Date(s.startDate);
        const end = new Date(s.endDate);
        return today >= start && today <= end;
      });

      if (activeSprint) {
        setTask((prev) => ({
          ...prev,
          sprintId: activeSprint.id,
          startDate: activeSprint.startDate || "",
          endDate: activeSprint.endDate || "",
        }));

        await loadTasks(activeSprint.id);
      }

      // 🔥 LOAD MEMBERS
      const membersRes = await projectMemberApi.getByProject(project.id);

      setUsers(
        membersRes.data.map((m: any) => ({
          label: m.name,
          value: m.id,
        })),
      );
    } catch (err) {
      console.error("Project load failed", err);
    }
  };

  // 🔥 SPRINT STATUS
  const getSprintStatus = (s: any) => {
    const today = new Date();
    const start = new Date(s.startDate);
    const end = new Date(s.endDate);

    if (today >= start && today <= end) return "Active";
    if (today < start) return "Planned";
    return "Completed";
  };

  // 🔥 OPEN VIEW MODAL
  const handleViewTask = (taskId: number) => {
    const foundTask = tasks.find((t) => t.id === taskId);
    if (foundTask) {
      setTask(foundTask);
      setModalMode("view");
      setOpen(true);
    }
  };

  // 🔥 OPEN EDIT MODAL
  const handleEditTask = (taskId: number) => {
    const foundTask = tasks.find((t) => t.id === taskId);
    if (foundTask) {
      setTask(foundTask);
      setModalMode("edit");
      setOpen(true);
    }
  };

  // 🔥 ADD/UPDATE TASK
  const handleSaveTask = async () => {
    try {
      if (!task.sprintId) {
        alert("Select sprint");
        return;
      }

      if (modalMode === "edit") {
        // ✅ UPDATE: Only send fields that can change
        const updatePayload = {
          title: task.title,
          description: task.description,
          status: task.status,
          priority: task.priority,
          storyPoints: task.storyPoints,
          startDate: task.startDate || null,
          endDate: task.endDate || null,
          assignedTo: task.assignee?.length ? Number(task.assignee[0]) : null,
        };
        await taskApi.update(task.id, updatePayload);
      } else {
        // ✅ CREATE: Include sprintId
        const createPayload = {
          sprintId: task.sprintId,
          title: task.title,
          description: task.description,
          status: task.status,
          priority: task.priority,
          storyPoints: task.storyPoints,
          startDate: task.startDate || null,
          endDate: task.endDate || null,
          assignedTo: task.assignee?.length ? Number(task.assignee[0]) : null,
        };
        await taskApi.create(createPayload);
      }

      await loadTasks(task.sprintId);

      setOpen(false);
      setModalMode("create");

      setTask({
        id: 0,
        title: "",
        description: "",
        status: "todo",
        assignee: [],
        startDate: "",
        endDate: "",
        createdAt: new Date().toISOString(),
        priority: "Medium",
        project: selectedProject?.name || "",
        storyPoints: 1,
        sprintId: task.sprintId,
      });
    } catch (err) {
      console.error(err);
    }
  };

  // 🔥 MOVE TASK
  const moveTask = async (taskId: number, newStatus: string) => {
    try {
      // ✅ Optimistic UI update
      setTasks((prev) =>
        prev.map((t) => (t.id === taskId ? { ...t, status: newStatus } : t)),
      );

      // ✅ API call
      await taskApi.updateStatus(taskId, newStatus);
    } catch (err) {
      console.error(err);
    }
  };

  // 🔥 DELETE TASK
  const handleDelete = async (id: number) => {
    try {
      await taskApi.delete(id);
      setTasks((prev) => prev.filter((t) => t.id !== id));
    } catch (err) {
      console.error(err);
    }
  };

  // 🔥 STATS
  const todoCount = tasks.filter((t) => t.status === "todo").length;
  const inProgressCount = tasks.filter((t) => t.status === "inprogress").length;
  const doneCount = tasks.filter((t) => t.status === "done").length;
  const totalPoints = tasks.reduce((sum, t) => sum + t.storyPoints, 0);

  return (
    <AppLayout>
      <div className="space-y-8 max-w-7xl mx-auto">
        {/* 🔥 Header */}
        <div className="flex justify-between items-start">
          <div className="space-y-2">
            <h1 className="text-4xl font-bold text-primary">Sprint Board 🚀</h1>
            <p className="text-secondary text-sm">
              Manage tasks across different stages
            </p>
          </div>

          <Button
            onClick={() => {
              setModalMode("create");
              setTask({
                id: 0,
                title: "",
                description: "",
                status: "todo",
                assignee: [],
                createdAt: new Date().toISOString(),
                startDate: "",
                endDate: "",
                priority: "Medium",
                project: selectedProject?.name || "",
                storyPoints: 1,
                sprintId: task.sprintId,
              });
              setOpen(true);
            }}
            className="bg-gradient-to-r from-accent to-secondary text-white font-semibold px-6 py-3 rounded-lg hover:shadow-lg hover:scale-105 transition-all"
          >
            <Plus size={20} className="mr-2 inline" />
            Add Task
          </Button>
        </div>

        {/* 🔥 PROJECT SELECTOR DROPDOWN */}
        <div className="relative w-80" ref={projectDropdownRef}>
          <button
            onClick={() => setProjectDropdownOpen(!projectDropdownOpen)}
            className="w-full h-[44px] px-4 py-2.5 rounded-xl border-2 border-accent/20 bg-white text-primary font-medium flex items-center justify-between hover:border-accent/40 transition-all shadow-sm"
          >
            <div className="flex items-center gap-2">
              <FolderPlus size={18} className="text-accent" />
              <span>
                {selectedProject ? selectedProject.name : "Select Project"}
              </span>
            </div>
            <ChevronDown
              size={18}
              className={`text-secondary transition-transform ${
                projectDropdownOpen ? "rotate-180" : ""
              }`}
            />
          </button>

          {/* Dropdown Menu */}
          {projectDropdownOpen && (
            <div className="absolute top-full left-0 right-0 mt-2 bg-white border-2 border-accent/20 rounded-xl shadow-xl z-50 overflow-hidden">
              <div className="max-h-80 overflow-y-auto">
                {projects.length > 0 ? (
                  projects.map((project) => (
                    <button
                      key={project.id}
                      onClick={() => handleProjectSelect(project)}
                      className={`w-full text-left px-4 py-3 flex items-center gap-3 transition-all hover:bg-accent/10 ${
                        selectedProject?.id === project.id
                          ? "bg-accent/20 border-l-4 border-accent"
                          : ""
                      }`}
                    >
                      <div
                        className={`w-3 h-3 rounded-full ${
                          selectedProject?.id === project.id
                            ? "bg-accent"
                            : "bg-primary/20"
                        }`}
                      />
                      <div className="flex-1">
                        <p className="font-medium text-primary">
                          {project.name}
                        </p>
                      </div>
                      {selectedProject?.id === project.id && (
                        <CheckCircle2 size={18} className="text-accent" />
                      )}
                    </button>
                  ))
                ) : (
                  <div className="px-4 py-8 text-center text-secondary">
                    No projects available
                  </div>
                )}
              </div>
            </div>
          )}
        </div>

        {/* 🔥 Stats Cards */}
        {selectedProject && (
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <Card className="relative overflow-hidden">
              <div className="absolute top-0 right-0 w-16 h-16 opacity-5">
                <Clock size={64} className="text-blue-500" />
              </div>
              <div className="flex items-center gap-3 relative z-10">
                <div className="p-3 rounded-lg bg-blue-100">
                  <Clock size={20} className="text-blue-600" />
                </div>
                <div>
                  <p className="text-secondary text-xs font-medium">To Do</p>
                  <h2 className="text-2xl font-bold text-primary mt-1">
                    {todoCount}
                  </h2>
                </div>
              </div>
            </Card>

            <Card className="relative overflow-hidden">
              <div className="absolute top-0 right-0 w-16 h-16 opacity-5">
                <Zap size={64} className="text-yellow-500" />
              </div>
              <div className="flex items-center gap-3 relative z-10">
                <div className="p-3 rounded-lg bg-yellow-100">
                  <Zap size={20} className="text-yellow-600" />
                </div>
                <div>
                  <p className="text-secondary text-xs font-medium">
                    In Progress
                  </p>
                  <h2 className="text-2xl font-bold text-primary mt-1">
                    {inProgressCount}
                  </h2>
                </div>
              </div>
            </Card>

            <Card className="relative overflow-hidden">
              <div className="absolute top-0 right-0 w-16 h-16 opacity-5">
                <CheckCircle2 size={64} className="text-green-500" />
              </div>
              <div className="flex items-center gap-3 relative z-10">
                <div className="p-3 rounded-lg bg-green-100">
                  <CheckCircle2 size={20} className="text-green-600" />
                </div>
                <div>
                  <p className="text-secondary text-xs font-medium">Done</p>
                  <h2 className="text-2xl font-bold text-primary mt-1">
                    {doneCount}
                  </h2>
                </div>
              </div>
            </Card>

            <Card className="relative overflow-hidden">
              <div className="absolute top-0 right-0 w-16 h-16 opacity-5">
                <Zap size={64} className="text-accent" />
              </div>
              <div className="flex items-center gap-3 relative z-10">
                <div className="p-3 rounded-lg bg-accent/10">
                  <Zap size={20} className="text-accent" />
                </div>
                <div>
                  <p className="text-secondary text-xs font-medium">
                    Story Points
                  </p>
                  <h2 className="text-2xl font-bold text-primary mt-1">
                    {totalPoints}
                  </h2>
                </div>
              </div>
            </Card>
          </div>
        )}

        {/* 🔥 View Tabs */}
        {selectedProject && (
          <div className="flex gap-2 border-b border-primary/10 pb-4">
            {["board", "timeline", "list"].map((tab) => (
              <button
                key={tab}
                onClick={() => setView(tab as any)}
                className={`px-4 py-2.5 text-sm font-medium rounded-lg transition-all ${
                  view === tab
                    ? "bg-gradient-to-r from-accent to-secondary text-white shadow-md"
                    : "text-secondary hover:bg-primary/5"
                }`}
              >
                {tab === "board" && "📊"} {tab === "timeline" && "📅"}{" "}
                {tab === "list" && "📋"} {tab.toUpperCase()}
              </button>
            ))}
          </div>
        )}

        {/* 🧩 BOARD VIEW */}
        {view === "board" && selectedProject && (
          <div className="grid md:grid-cols-5 gap-4 min-h-[500px]">
            {columns.map((col) => {
              const statusColor = statusColors[col];
              const Icon = statusColor.icon;
              return (
                <div
                  key={col}
                  className="bg-gradient-to-br from-slate-50 to-white rounded-xl border border-primary/10 p-4 space-y-4"
                >
                  {/* Column Header */}
                  <div className="flex items-center gap-2">
                    <div className={`p-2 rounded-lg ${statusColor.bg}`}>
                      <Icon size={16} className={statusColor.text} />
                    </div>
                    <div className="flex-1">
                      <h3 className="text-sm font-bold text-primary capitalize">
                        {col}
                      </h3>
                      <p className="text-xs text-secondary">
                        {tasks.filter((t) => t.status === col).length}
                      </p>
                    </div>
                  </div>

                  {/* Tasks */}
                  <div className="space-y-3">
                    {tasks
                      .filter((t) => t.status === col)
                      .map((t) => (
                        <TaskCard
                          key={t.id}
                          id={t.id}
                          title={t.title}
                          description={t.description}
                          status={t.status}
                          priority={t.priority}
                          storyPoints={t.storyPoints}
                          assignee={t.assignee}
                          onDelete={handleDelete}
                          onMove={moveTask}
                          onView={handleViewTask}
                          onEdit={handleEditTask}
                          columns={columns}
                        />
                      ))}
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {/* Timeline View */}
        {view === "timeline" && selectedProject && task.sprintId && (() => {
          const sprint = sprints.find((s) => s.id === task.sprintId);
          return sprint ? (
            <TimelineView
              tasks={tasks.map((t) => ({
                id: t.id,
                title: t.title,
                // ✅ START = START DATE (YYYY-MM-DD or ISO format, fallback to createdAt)
                start: t.startDate ? (t.startDate.length === 10 ? `${t.startDate}T00:00:00Z` : t.startDate) : t.createdAt,
                // ✅ END = END DATE (YYYY-MM-DD or ISO format, fallback to createdAt)
                end: t.endDate ? (t.endDate.length === 10 ? `${t.endDate}T00:00:00Z` : t.endDate) : t.createdAt,
                status: t.status,
              }))}
              startDate={sprint.startDate}
              endDate={sprint.endDate}
            />
          ) : null;
        })()}

        {/* 📋 LIST VIEW */}
        {view === "list" && selectedProject && (
          <Card className="overflow-hidden border border-primary/10 rounded-2xl shadow-sm">

            {/* 🔥 Divider Header */}
            <div className="px-6 py-4 border-b border-primary/10 bg-gradient-to-r from-primary/5 to-accent/5">
              <h2 className="text-sm font-semibold text-primary">Task List</h2>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-sm border-separate border-spacing-y-1">

                {/* 🔥 HEADER */}
                <thead>
                  <tr className="text-secondary text-xs uppercase tracking-wide">
                    <th className="px-6 py-3 text-left">Task</th>
                    <th className="px-6 py-3 text-center">Status</th>
                    <th className="px-6 py-3 text-center">Priority</th>
                    <th className="px-6 py-3 text-center">End Date</th>
                    <th className="px-6 py-3 text-center">Assignee</th>
                    <th className="px-6 py-3 text-center">Points</th>
                  </tr>
                </thead>

                {/* 🔥 BODY */}
                <tbody>
                  {tasks.map((t) => {
                    const isOverdue =
                      t.endDate &&
                      new Date(t.endDate) < new Date() &&
                      t.status !== "done";

                    return (
                      <tr
                        key={t.id}
                        className="bg-white hover:bg-primary/5 transition rounded-xl shadow-sm"
                      >
                        {/* TASK */}
                        <td className="px-6 py-4 text-left">
                          <div className="flex flex-col">
                            <span className="font-semibold text-primary">
                              {t.title}
                            </span>
                            <span className="text-[11px] text-secondary">
                              #{t.id}
                            </span>
                          </div>
                        </td>

                        {/* STATUS */}
                        <td className="px-6 py-4 text-center">
                          <span
                            className={`px-3 py-1 rounded-full text-xs font-semibold shadow-sm
                            ${statusColors[t.status].bg} ${statusColors[t.status].text}`}
                          >
                            {t.status}
                          </span>
                        </td>

                        {/* PRIORITY */}
                        <td className="px-6 py-4 text-center">
                          <span
                            className={`inline-flex items-center justify-center gap-1 px-3 py-1 rounded-full text-xs font-semibold
                            ${
                              t.priority === "High"
                                ? "bg-red-100 text-red-600"
                                : t.priority === "Medium"
                                ? "bg-amber-100 text-amber-700"
                                : "bg-slate-100 text-slate-600"
                            }`}
                          >
                            ● {t.priority}
                          </span>
                        </td>

                        {/* END DATE */}
                        <td className="px-6 py-4 text-center">
                          <div className="flex flex-col items-center">
                            <span
                              className={`text-sm font-medium ${
                                isOverdue ? "text-red-500" : "text-secondary"
                              }`}
                            >
                              {t.endDate
                                ? new Date(t.endDate).toLocaleDateString()
                                : "—"}
                            </span>

                            {isOverdue && (
                              <span className="text-[10px] text-red-500 font-semibold">
                                Overdue
                              </span>
                            )}
                          </div>
                        </td>

                        {/* ASSIGNEE */}
                        <td className="px-6 py-4">
                          <div className="flex items-center justify-center gap-2">
                            {t.assignee.length ? (
                              <>
                                <div className="w-8 h-8 rounded-full bg-accent/20 flex items-center justify-center text-xs font-bold text-accent">
                                  {t.assignee[0]
                                    .split(" ")
                                    .map((n) => n[0])
                                    .join("")
                                    .toUpperCase()}
                                </div>
                                <span className="text-sm font-medium text-primary">
                                  {t.assignee[0]}
                                </span>
                              </>
                            ) : (
                              <span className="text-xs text-secondary italic">
                                Unassigned
                              </span>
                            )}
                          </div>
                        </td>

                        {/* POINTS */}
                        <td className="px-6 py-4 text-center">
                          <span className="px-3 py-1 rounded-full bg-accent/10 text-accent text-xs font-bold">
                            {t.storyPoints} ⭐
                          </span>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>

              </table>
            </div>
          </Card>
        )}
        {/* 🔥 MODAL */}
        {open &&
          createPortal(
            <div
              className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/40 backdrop-blur-md p-4"
              onClick={() => setOpen(false)}
            >
              <div
                onClick={(e) => e.stopPropagation()}
                className="w-full max-w-3xl max-h-[90vh] overflow-y-auto bg-background/95 backdrop-blur-2xl border border-accent/20 rounded-3xl shadow-2xl p-8 space-y-6"
              >
                {/* Header */}
                <div className="flex items-center gap-4">
                  <div className="p-3 bg-gradient-to-br from-accent/20 to-secondary/20 rounded-2xl">
                    <Plus size={24} className="text-accent" />
                  </div>
                  <div>
                    <h2 className="text-2xl font-bold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
                      {modalMode === "create" && "Create Task"}
                      {modalMode === "edit" && "Edit Task"}
                      {modalMode === "view" && "View Task"}
                    </h2>
                    <p className="text-xs text-secondary mt-1">
                      {modalMode === "create" && "Add new task to your sprint"}
                      {modalMode === "edit" && "Edit task details"}
                      {modalMode === "view" && "Task details (read-only)"}
                    </p>
                  </div>
                </div>

                {/* 2 Column Layout */}
                <div className="grid grid-cols-2 gap-6">
                  {/* LEFT SIDE */}
                  <div className="space-y-5">
                    {/* PROJECT DISPLAY */}
                    {selectedProject && (
                      <div className="space-y-2">
                        <label className="text-xs font-semibold text-secondary flex items-center gap-1">
                          <FolderPlus size={14} /> Project
                        </label>

                        <div className="w-full h-[42px] px-4 py-2.5 rounded-xl border border-primary/10 text-sm bg-white flex items-center">
                          <span className="text-primary font-medium">
                            {selectedProject.name}
                          </span>
                        </div>
                      </div>
                    )}

                    {/* SPRINT */}
                    {selectedProject && (
                      <div className="space-y-2">
                        <label className="text-xs font-semibold text-secondary">
                          Sprint
                        </label>

                        <select
                          disabled={modalMode === "view"}
                          className="w-full h-[42px] px-4 py-2.5 rounded-xl border border-primary/10 text-sm bg-white focus:border-accent focus:ring-2 focus:ring-accent/20 outline-none transition-all disabled:bg-slate-100 disabled:cursor-not-allowed disabled:text-secondary"
                          value={task.sprintId || ""}
                          onChange={(e) =>
                            setTask({
                              ...task,
                              sprintId: Number(e.target.value),
                            })
                          }
                        >
                          <option value="">Select sprint</option>

                          {sprints.map((s) => {
                            const status = getSprintStatus(s);
                            return (
                              <option key={s.id} value={s.id}>
                                {s.name} ({status})
                              </option>
                            );
                          })}
                        </select>
                      </div>
                    )}

                    {/* TITLE */}
                    <div className="space-y-2">
                      <label className="text-xs font-semibold text-secondary">
                        Title
                      </label>

                      <input
                        disabled={modalMode === "view"}
                        placeholder="Task title"
                        className="w-full h-[42px] px-4 py-2.5 rounded-xl border border-primary/10 text-sm focus:border-accent focus:ring-2 focus:ring-accent/20 outline-none transition-all bg-white disabled:bg-slate-100 disabled:cursor-not-allowed"
                        value={task.title}
                        onChange={(e) =>
                          setTask({ ...task, title: e.target.value })
                        }
                      />
                    </div>

                    {/* ASSIGN */}
                    <div className="space-y-2">
                      <label className="text-xs font-semibold text-secondary flex items-center gap-1">
                        <Users size={14} /> Assign
                      </label>

                      <div className={`h-[42px] ${modalMode === "view" ? "opacity-60 pointer-events-none" : ""}`}>
                        <MultiSelectDropdown
                          options={users}
                          value={task.assignee}
                          onChange={(val) =>
                            modalMode !== "view" && setTask({ ...task, assignee: val })
                          }
                          placeholder="Select team members"
                        />
                      </div>
                    </div>

                    {/* START DATE */}
                    <div className="space-y-2">
                      <label className="text-xs font-semibold text-secondary">
                        Start Date
                      </label>

                      <input
                        disabled={modalMode === "view"}
                        type="date"
                        className="w-full h-[42px] px-4 py-2.5 rounded-xl border border-primary/10 text-sm bg-white focus:border-accent focus:ring-2 focus:ring-accent/20 outline-none transition-all disabled:bg-slate-100 disabled:cursor-not-allowed"
                        value={task.startDate || ""}
                        onChange={(e) =>
                          setTask({
                            ...task,
                            startDate: e.target.value,
                          })
                        }
                      />
                    </div>

                    {/* END DATE */}
                    <div className="space-y-2">
                      <label className="text-xs font-semibold text-secondary">
                        End Date
                      </label>

                      <input
                        disabled={modalMode === "view"}
                        type="date"
                        className="w-full h-[42px] px-4 py-2.5 rounded-xl border border-primary/10 text-sm bg-white focus:border-accent focus:ring-2 focus:ring-accent/20 outline-none transition-all disabled:bg-slate-100 disabled:cursor-not-allowed"
                        value={task.endDate || ""}
                        onChange={(e) =>
                          setTask({
                            ...task,
                            endDate: e.target.value,
                          })
                        }
                      />
                    </div>
                  </div>

                  {/* RIGHT SIDE */}
                  <div className="space-y-5">
                    {/* DESCRIPTION */}
                    <div className="space-y-2">
                      <label className="text-xs font-semibold text-secondary">
                        Description
                      </label>

                      <textarea
                        disabled={modalMode === "view"}
                        rows={4}
                        placeholder="Task description"
                        className="w-full px-4 py-2.5 rounded-xl border border-primary/10 text-sm focus:border-accent focus:ring-2 focus:ring-accent/20 outline-none transition-all resize-none bg-white disabled:bg-slate-100 disabled:cursor-not-allowed"
                        value={task.description}
                        onChange={(e) =>
                          setTask({ ...task, description: e.target.value })
                        }
                      />
                    </div>

                    {/* STATUS */}
                    <div className="space-y-2">
                      <label className="text-xs font-semibold text-secondary">
                        Status
                      </label>

                      <select
                        disabled={modalMode === "view"}
                        className="w-full h-[42px] px-4 py-2.5 rounded-xl border border-primary/10 text-sm bg-white focus:border-accent focus:ring-2 focus:ring-accent/20 outline-none disabled:bg-slate-100 disabled:cursor-not-allowed disabled:text-secondary"
                        value={task.status}
                        onChange={(e) =>
                          setTask({ ...task, status: e.target.value })
                        }
                      >
                        {columns.map((c) => (
                          <option key={c} value={c}>
                            {c}
                          </option>
                        ))}
                      </select>
                    </div>

                    {/* STORY POINTS */}
                    <div className="space-y-2">
                      <label className="text-xs font-semibold text-secondary">
                        Story Points
                      </label>

                      <div className={`flex flex-wrap gap-2 ${modalMode === "view" ? "opacity-60 pointer-events-none" : ""}`}>
                        {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((pt) => (
                          <button
                            key={pt}
                            onClick={() =>
                              setTask({ ...task, storyPoints: pt })
                            }
                            className={`w-9 h-9 text-xs font-bold rounded-lg ${
                              task.storyPoints === pt
                                ? "bg-accent text-white"
                                : "border"
                            }`}
                          >
                            {pt}
                          </button>
                        ))}
                      </div>
                    </div>

                    {/* PRIORITY */}
                    <div className="space-y-2">
                      <label className="text-xs font-semibold text-secondary flex items-center gap-1">
                        <Timer size={14} /> Priority
                      </label>

                      <div className={`flex gap-2 ${modalMode === "view" ? "opacity-60 pointer-events-none" : ""}`}>
                        {["Low", "Medium", "High"].map((p) => (
                          <button
                            key={p}
                            onClick={() => setTask({ ...task, priority: p })}
                            className={`flex-1 px-3 py-2 text-xs font-bold rounded-lg ${
                              task.priority === p
                                ? "bg-accent text-white"
                                : "border"
                            }`}
                          >
                            {p}
                          </button>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>

                {/* ACTIONS */}
                <div className="flex justify-between items-center pt-6 border-t border-primary/10">
                  <button
                    onClick={() => {
                      setOpen(false);
                      setModalMode("create");
                    }}
                    className="px-6 py-2.5 rounded-lg text-secondary hover:bg-slate-100"
                  >
                    {modalMode === "view" ? "Close" : "Cancel"}
                  </button>

                  {modalMode !== "view" && (
                    <Button
                      onClick={handleSaveTask}
                      className="bg-gradient-to-r from-accent to-secondary text-white"
                    >
                      {modalMode === "create" ? "Create Task" : "Update Task"}
                    </Button>
                  )}
                </div>
              </div>
            </div>,
            document.body,
          )}
      </div>
    </AppLayout>
  );
}
