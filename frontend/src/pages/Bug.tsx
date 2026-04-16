/* eslint-disable react-hooks/immutability */
/* eslint-disable @typescript-eslint/no-explicit-any */
import AppLayout from "../components/Layout/AppLayout";
import Card from "../components/ui/Card";
import Button from "../components/ui/Button";
import MultiSelectDropdown from "../components/ui/MultiSelectDropdown";
import {
  Bug,
  ArrowRightLeft,
  AlertCircle,
  CheckCircle2,
  Clock,
  Zap,
  Trash2,
  FolderPlus,
  ChevronDown,
} from "lucide-react";
import { createPortal } from "react-dom";
import { useState, useEffect, useRef } from "react";
import { bugApi } from "../services/bugService";
import { projectApi } from "../services/projectService";
import { projectMemberApi } from "../services/projectMemberService";

type BugType = {
  id: number;
  title: string;
  description: string;
  severity: string;
  status: string;
  projectId: number;
  projectName?: string;

  assignedTo?: number;
  assignee?: string;

  dueDate?: string;
};

export default function BugPage() {
  const [bugs, setBugs] = useState<BugType[]>([]);
  const [open, setOpen] = useState(false);

  const [projects, setProjects] = useState<any[]>([]);
  const [developers, setDevelopers] = useState<any[]>([]);
  const [selectedProject, setSelectedProject] = useState<any>(null);
  const [projectDropdownOpen, setProjectDropdownOpen] = useState(false);
  const projectDropdownRef = useRef<HTMLDivElement>(null);

  const [bug, setBug] = useState<BugType>({
    id: 0,
    title: "",
    description: "",
    severity: "Medium",
    status: "new",
    projectId: 0,
  });

  const columns = ["new", "open and assigned", "fixing", "retest", "closed"];

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

  /* ===============================
     LOAD PROJECTS
  =============================== */
  useEffect(() => {
    loadProjects();
  }, []);

  const loadProjects = async () => {
    try {
      const data = await projectApi.getAll();

      setProjects(
        data.map((p) => ({
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

  /* ===============================
     HANDLE PROJECT SELECTION
  =============================== */
  const handleProjectSelect = async (project: any) => {
    setSelectedProject(project);
    setProjectDropdownOpen(false);

    if (!project.id) return;

    try {
      // Load bugs for selected project
      await loadBugs(project.id);

      // Load project members
      await loadProjectMembers(project.id);

      // Update bug form
      setBug((prev) => ({
        ...prev,
        projectId: project.id,
      }));
    } catch (err) {
      console.error("Project load failed", err);
    }
  };

  /* ===============================
     LOAD MEMBERS
  =============================== */
  const loadProjectMembers = async (projectId: number) => {
    try {
      const res = await projectMemberApi.getByProject(projectId);
      const data = res.data || res;

      setDevelopers(
        data.map((m: any) => ({
          label: m.name,
          value: m.id,
        })),
      );
    } catch (err) {
      console.error(err);
    }
  };

  /* ===============================
     LOAD BUGS
  =============================== */
  const loadBugs = async (projectId: number) => {
    try {
      const res = await bugApi.getByProject(projectId);
      const data = res.data || res;

      setBugs(
        data.map((b: any) => ({
          id: b.id,
          title: b.title,
          description: b.description,
          severity: b.severity,
          status: b.status,
          projectId: b.projectId,
          projectName: b.projectName,
          assignee: b.assigneeName,
          assignedTo: b.assignedTo,
          dueDate: b.dueDate,
        })),
      );
    } catch (err) {
      console.error(err);
    }
  };

  /* ===============================
     MOVE BUG (STATUS UPDATE)
  =============================== */
  const moveBug = async (bugId: number, newStatus: string) => {
    try {
      // optimistic UI
      setBugs((prev) =>
        prev.map((b) => (b.id === bugId ? { ...b, status: newStatus } : b)),
      );

      await bugApi.updateStatus(bugId, newStatus);
    } catch (err) {
      console.error(err);
    }
  };

  /* ===============================
     CREATE BUG
  =============================== */
  const handleAddBug = async () => {
    try {
      // ✅ VALIDATION
      if (!bug.projectId || bug.projectId === 0) {
        alert("Select project");
        return;
      }

      if (!bug.title.trim()) {
        alert("Enter title");
        return;
      }

      const payload = {
        projectId: bug.projectId,
        title: bug.title,
        description: bug.description || "",
        severity: bug.severity,
        status: bug.status,
        assignedTo: bug.assignedTo ? Number(bug.assignedTo) : null,
        dueDate: bug.dueDate ? new Date(bug.dueDate).toISOString() : null,
      };

      console.log("🔥 Sending payload:", payload);

      await bugApi.create(payload);

      await loadBugs(bug.projectId);

      setOpen(false);

      setBug({
        id: 0,
        title: "",
        description: "",
        severity: "Medium",
        status: "new",
        projectId: bug.projectId,
      });
    } catch (err: any) {
      console.error("❌ API ERROR:", err.response?.data || err);
      alert(err.response?.data?.message || "Failed to create bug");
    }
  };

  /* ===============================
     DELETE BUG
  =============================== */
  const handleDelete = async (id: number) => {
    try {
      await bugApi.delete(id);
      setBugs((prev) => prev.filter((b) => b.id !== id));
    } catch (err) {
      console.error(err);
    }
  };

  /* ===============================
     STATS
  =============================== */
  const newCount = bugs.filter((b) => b.status === "new").length;
  const fixingCount = bugs.filter((b) => b.status === "fixing").length;
  const closedCount = bugs.filter((b) => b.status === "closed").length;
  const criticalCount = bugs.filter((b) => b.severity === "Critical").length;

  const severityColors: Record<
    string,
    { bg: string; text: string; icon: any }
  > = {
    Low: { bg: "bg-green-100", text: "text-green-700", icon: CheckCircle2 },
    Medium: { bg: "bg-yellow-100", text: "text-yellow-700", icon: Clock },
    High: { bg: "bg-orange-100", text: "text-orange-700", icon: AlertCircle },
    Critical: { bg: "bg-red-100", text: "text-red-700", icon: Zap },
  };

  const statusColors: Record<
    string,
    { bg: string; text: string; label: string }
  > = {
    new: { bg: "bg-slate-100", text: "text-slate-700", label: "New" },
    "open and assigned": {
      bg: "bg-blue-100",
      text: "text-blue-700",
      label: "Assigned",
    },
    fixing: { bg: "bg-yellow-100", text: "text-yellow-700", label: "Fixing" },
    retest: { bg: "bg-purple-100", text: "text-purple-700", label: "Retest" },
    closed: { bg: "bg-green-100", text: "text-green-700", label: "Closed" },
  };

  return (
    <AppLayout>
      <div className="space-y-8 max-w-7xl mx-auto">
        {/* 🔥 Header */}
        <div className="flex justify-between items-start">
          <div className="space-y-2">
            <h1 className="text-4xl font-bold text-primary">Bug Tracker 🐛</h1>
            <p className="text-secondary text-sm">
              Track, assign, and resolve issues
            </p>
          </div>

          <Button
            onClick={() => setOpen(true)}
            className="bg-gradient-to-r from-red-500 to-orange-500 text-white font-semibold px-6 py-3 rounded-lg hover:shadow-lg hover:scale-105 transition-all"
          >
            <Bug size={20} className="mr-2 inline" />
            Report Bug
          </Button>
        </div>

        {/* 🔥 PROJECT SELECTOR DROPDOWN */}
        <div className="relative w-80" ref={projectDropdownRef}>
          <button
            onClick={() => setProjectDropdownOpen(!projectDropdownOpen)}
            className="w-full h-[44px] px-4 py-2.5 rounded-xl border-2 border-red-200 bg-white text-primary font-medium flex items-center justify-between hover:border-red-400 transition-all shadow-sm"
          >
            <div className="flex items-center gap-2">
              <FolderPlus size={18} className="text-red-500" />
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
            <div className="absolute top-full left-0 right-0 mt-2 bg-white border-2 border-red-200 rounded-xl shadow-xl z-50 overflow-hidden">
              <div className="max-h-80 overflow-y-auto">
                {projects.length > 0 ? (
                  projects.map((project) => (
                    <button
                      key={project.id}
                      onClick={() => handleProjectSelect(project)}
                      className={`w-full text-left px-4 py-3 flex items-center gap-3 transition-all hover:bg-red-50 ${
                        selectedProject?.id === project.id
                          ? "bg-red-50 border-l-4 border-red-500"
                          : ""
                      }`}
                    >
                      <div
                        className={`w-3 h-3 rounded-full ${
                          selectedProject?.id === project.id
                            ? "bg-red-500"
                            : "bg-primary/20"
                        }`}
                      />
                      <div className="flex-1">
                        <p className="font-medium text-primary">
                          {project.name}
                        </p>
                      </div>
                      {selectedProject?.id === project.id && (
                        <CheckCircle2 size={18} className="text-red-500" />
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
                <AlertCircle size={64} className="text-red-500" />
              </div>
              <div className="flex items-center gap-3 relative z-10">
                <div className="p-3 rounded-lg bg-red-100">
                  <AlertCircle size={20} className="text-red-600" />
                </div>
                <div>
                  <p className="text-secondary text-xs font-medium">Critical</p>
                  <h2 className="text-2xl font-bold text-primary mt-1">
                    {criticalCount}
                  </h2>
                </div>
              </div>
            </Card>

            <Card className="relative overflow-hidden">
              <div className="absolute top-0 right-0 w-16 h-16 opacity-5">
                <Clock size={64} className="text-yellow-500" />
              </div>
              <div className="flex items-center gap-3 relative z-10">
                <div className="p-3 rounded-lg bg-yellow-100">
                  <Clock size={20} className="text-yellow-600" />
                </div>
                <div>
                  <p className="text-secondary text-xs font-medium">New Bugs</p>
                  <h2 className="text-2xl font-bold text-primary mt-1">
                    {newCount}
                  </h2>
                </div>
              </div>
            </Card>

            <Card className="relative overflow-hidden">
              <div className="absolute top-0 right-0 w-16 h-16 opacity-5">
                <Zap size={64} className="text-orange-500" />
              </div>
              <div className="flex items-center gap-3 relative z-10">
                <div className="p-3 rounded-lg bg-orange-100">
                  <Zap size={20} className="text-orange-600" />
                </div>
                <div>
                  <p className="text-secondary text-xs font-medium">
                    In Progress
                  </p>
                  <h2 className="text-2xl font-bold text-primary mt-1">
                    {fixingCount}
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
                  <p className="text-secondary text-xs font-medium">Resolved</p>
                  <h2 className="text-2xl font-bold text-primary mt-1">
                    {closedCount}
                  </h2>
                </div>
              </div>
            </Card>
          </div>
        )}

        {/* 🔥 BOARD */}
        {selectedProject && (
          <div className="grid md:grid-cols-5 gap-4 min-h-[500px]">
            {columns.map((col) => {
              const statusColor = statusColors[col];
              return (
                <div
                  key={col}
                  className="bg-gradient-to-br from-slate-50 to-white rounded-xl border border-primary/10 p-4 space-y-4"
                >
                  {/* Column Header */}
                  <div className="flex items-center gap-2">
                    <div className={`p-2 rounded-lg ${statusColor.bg}`}>
                      <Bug size={16} className={statusColor.text} />
                    </div>
                    <div className="flex-1">
                      <h3 className="text-sm font-bold text-primary capitalize">
                        {statusColor.label}
                      </h3>
                      <p className="text-xs text-secondary">
                        {bugs.filter((b) => b.status === col).length}
                      </p>
                    </div>
                  </div>

                  {/* Bugs */}
                  <div className="space-y-3">
                    {bugs
                      .filter((b) => b.status === col)
                      .map((b) => {
                        const sevColor = severityColors[b.severity];
                        const SevIcon = sevColor.icon;
                        return (
                          <Card
                              key={b.id}
                              className="group relative p-0 rounded-xl border-2 border-primary/10 bg-white hover:shadow-2xl hover:border-red-200 hover:-translate-y-1 transition-all duration-300 overflow-hidden"
                            >
                              {/* 🔥 TOP ACCENT BAR */}
                              <div
                                className={`h-2 w-full ${
                                  b.severity === "Critical"
                                    ? "bg-gradient-to-r from-red-500 to-red-600"
                                    : b.severity === "High"
                                    ? "bg-gradient-to-r from-orange-400 to-orange-500"
                                    : b.severity === "Medium"
                                    ? "bg-gradient-to-r from-yellow-400 to-yellow-500"
                                    : "bg-gradient-to-r from-green-400 to-green-500"
                                }`}
                              />

                              <div className="p-4">
                                {/* 🔥 HEADER WITH ACTIONS */}
                                <div className="flex items-start justify-between mb-3">
                                  {/* Severity Badge */}
                                  <span
                                    className={`px-2.5 py-1 rounded-lg text-[10px] font-bold uppercase tracking-wide flex items-center gap-1 ${sevColor.bg} ${sevColor.text}`}
                                  >
                                    <SevIcon size={11} />
                                    {b.severity}
                                  </span>

                                  {/* Actions */}
                                  <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                                    <div className="relative group/move">
                                      <button className="p-1.5 hover:bg-slate-100 rounded-lg transition">
                                        <ArrowRightLeft size={13} className="text-secondary" />
                                      </button>

                                      {/* Move Dropdown */}
                                      <div className="absolute right-0 top-full mt-1 w-32 bg-white border-2 border-primary/10 rounded-lg shadow-xl opacity-0 invisible group-hover/move:opacity-100 group-hover/move:visible transition-all z-50">
                                        {columns.map((c) => (
                                          <button
                                            key={c}
                                            onClick={() => moveBug(b.id, c)}
                                            className={`block w-full text-left px-3 py-2 text-[11px] font-semibold capitalize transition ${
                                              b.status === c
                                                ? "bg-red-50 text-red-600"
                                                : "hover:bg-slate-50 text-secondary"
                                            }`}
                                          >
                                            {statusColors[c].label}
                                          </button>
                                        ))}
                                      </div>
                                    </div>

                                    <button
                                      onClick={() => handleDelete(b.id)}
                                      className="p-1.5 hover:bg-red-50 rounded-lg transition"
                                    >
                                      <Trash2 size={13} className="text-red-500" />
                                    </button>
                                  </div>
                                </div>

                                {/* 🔥 TITLE & PROJECT */}
                                <div className="mb-3">
                                  <h3 className="text-sm font-bold text-primary leading-tight mb-1 line-clamp-2">
                                    {b.title}
                                  </h3>
                                  {b.projectName && (
                                    <div className="flex items-center gap-1 text-[10px] text-secondary font-medium">
                                      <FolderPlus size={11} />
                                      <span className="uppercase tracking-wide">{b.projectName}</span>
                                    </div>
                                  )}
                                </div>

                                {/* 🔥 STATUS BADGE */}
                                <div className="mb-3">
                                  <span
                                    className={`inline-block px-3 py-1.5 rounded-full text-[10px] font-bold uppercase tracking-wide ${statusColors[b.status].bg} ${statusColors[b.status].text}`}
                                  >
                                    {statusColors[b.status].label}
                                  </span>
                                </div>

                                {/* 🔥 DIVIDER */}
                                <div className="border-t border-primary/5 my-3" />

                                {/* 🔥 FOOTER */}
                                <div className="space-y-2.5">
                                  {/* Due Date */}
                                  <div className="flex items-center gap-2 text-[11px]">
                                    <div className="w-5 h-5 rounded bg-slate-100 flex items-center justify-center">
                                      <Clock size={12} className="text-secondary" />
                                    </div>
                                    <span className="text-secondary font-medium">
                                      {b.dueDate
                                        ? new Date(b.dueDate).toLocaleDateString("en-US", {
                                            month: "short",
                                            day: "numeric",
                                          })
                                        : "No deadline"}
                                    </span>
                                  </div>

                                  {/* Assignee */}
                                  {b.assignee ? (
                                    <div className="flex items-center gap-2">
                                      <div className="w-7 h-7 rounded-full bg-gradient-to-br from-red-400 to-orange-400 flex items-center justify-center text-[10px] font-bold text-white shadow-sm">
                                        {b.assignee
                                          .split(" ")
                                          .map((n) => n[0])
                                          .join("")
                                          .toUpperCase()
                                          .slice(0, 2)}
                                      </div>
                                      <span className="text-[11px] text-primary font-semibold">
                                        {b.assignee}
                                      </span>
                                    </div>
                                  ) : (
                                    <div className="flex items-center gap-2 text-[11px]">
                                      <div className="w-7 h-7 rounded-full bg-slate-100 flex items-center justify-center">
                                        <AlertCircle size={14} className="text-secondary" />
                                      </div>
                                      <span className="text-secondary italic">Unassigned</span>
                                    </div>
                                  )}
                                </div>
                              </div>
                            </Card>
                        );
                      })}
                  </div>
                </div>
              );
            })}
          </div>
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
                className="w-full max-w-3xl max-h-[90vh] overflow-y-auto bg-background/95 backdrop-blur-2xl border border-red-200 rounded-3xl shadow-2xl p-8 space-y-6"
              >
                {/* Header */}
                <div className="flex items-center gap-4">
                  <div className="p-3 bg-gradient-to-br from-red-100 to-orange-100 rounded-2xl">
                    <Bug size={24} className="text-red-600" />
                  </div>
                  <div>
                    <h2 className="text-2xl font-bold text-primary">
                      Report Bug
                    </h2>
                    <p className="text-xs text-secondary mt-1">
                      Track and assign issues to your team
                    </p>
                  </div>
                </div>

                {/* Grid Layout */}
                <div className="grid grid-cols-2 gap-6">
                  {/* LEFT */}
                  <div className="space-y-5">
                    {/* Project */}
                   
                     <div className="space-y-2">
                      <label className="text-xs font-semibold text-secondary">
                        Project
                      </label>

                      <div className="w-full h-[42px] px-4 flex items-center rounded-xl border border-primary/10 bg-slate-50 text-primary text-sm font-medium">
                        {selectedProject?.name || "No project selected"}
                      </div>
                    </div>

                    {/* Title */}
                    <div className="space-y-2">
                      <label className="text-xs font-semibold text-secondary">
                        Title
                      </label>
                      <input
                        placeholder="Brief description of the bug"
                        className="w-full h-[42px] px-4 py-2.5 rounded-xl border border-primary/10 text-sm focus:border-red-500 focus:ring-2 focus:ring-red-200 outline-none transition-all bg-white"
                        value={bug.title}
                        onChange={(e) =>
                          setBug({ ...bug, title: e.target.value })
                        }
                      />
                    </div>

                    {/* Severity */}
                    <div className="space-y-2">
                      <label className="text-xs font-semibold text-secondary">
                        Severity
                      </label>
                      <div className="flex gap-2 flex-wrap">
                        {["Low", "Medium", "High", "Critical"].map((s) => (
                          <button
                            key={s}
                            onClick={() => setBug({ ...bug, severity: s })}
                            className={`px-4 py-2 text-xs font-bold rounded-lg border transition-all ${
                              bug.severity === s
                                ? "bg-gradient-to-r from-red-500 to-orange-500 text-white border-transparent shadow-md"
                                : "border-primary/10 hover:bg-primary/5 text-primary"
                            }`}
                          >
                            {s}
                          </button>
                        ))}
                      </div>
                    </div>

                    {/* Due Date */}
                    <div className="space-y-2">
                      <label className="text-xs font-semibold text-secondary">
                        Due Date
                      </label>
                      <input
                        type="date"
                        className="w-full h-[42px] px-4 py-2.5 rounded-xl border border-primary/10 text-sm focus:border-red-500 focus:ring-2 focus:ring-red-200 outline-none transition-all bg-white"
                        value={bug.dueDate || ""}
                        onChange={(e) =>
                          setBug({ ...bug, dueDate: e.target.value })
                        }
                      />
                    </div>
                  </div>

                  {/* RIGHT */}
                  <div className="space-y-5">
                    {/* Description */}
                    <div className="space-y-2">
                      <label className="text-xs font-semibold text-secondary">
                        Description
                      </label>
                      <textarea
                        rows={5}
                        placeholder="Detailed description of the bug, steps to reproduce, and expected behavior"
                        className="w-full px-4 py-2.5 rounded-xl border border-primary/10 text-sm focus:border-red-500 focus:ring-2 focus:ring-red-200 outline-none transition-all resize-none bg-white"
                        value={bug.description}
                        onChange={(e) =>
                          setBug({ ...bug, description: e.target.value })
                        }
                      />
                    </div>

                    {/* Assign */}
                    <div className="space-y-2">
                      <label className="text-xs font-semibold text-secondary">
                        Assign Developer
                      </label>
                     <div className="h-[42px]">
                        <MultiSelectDropdown
                          options={developers}
                          value={bug.assignedTo ? [String(bug.assignedTo)] : []}
                          onChange={(val) =>
                            setBug({ ...bug, assignedTo: Number(val[0]) })
                          }
                          placeholder="Select developer"
                        />
                      </div>
                    </div>

                    {/* Status */}
                    <div className="space-y-2">
                      <label className="text-xs font-semibold text-secondary">
                        Initial Status
                      </label>
                      <select
                        className="w-full h-[42px] px-4 py-2.5 rounded-xl border border-primary/10 text-sm focus:border-red-500 focus:ring-2 focus:ring-red-200 outline-none transition-all bg-white"
                        value={bug.status}
                        onChange={(e) =>
                          setBug({ ...bug, status: e.target.value })
                        }
                      >
                        {columns.map((c) => (
                          <option key={c} value={c} className="capitalize">
                            {statusColors[c].label}
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>
                </div>

                {/* Actions */}
                <div className="flex justify-between items-center pt-6 border-t border-primary/10">
                  <button
                    onClick={() => setOpen(false)}
                    className="px-6 py-2.5 rounded-lg text-secondary hover:bg-slate-100 font-medium transition-colors"
                  >
                    Cancel
                  </button>

                  <Button
                    onClick={handleAddBug}
                    className="bg-gradient-to-r from-red-500 to-orange-500 text-white font-semibold"
                  >
                    Report Bug
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