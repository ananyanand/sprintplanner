/* eslint-disable prefer-const */
/* eslint-disable @typescript-eslint/no-explicit-any */
import { useState, useEffect } from "react";
import AppLayout from "../components/Layout/AppLayout";
import Card from "../components/ui/Card";
import Button from "../components/ui/Button";
import {
  Calendar,
  Timer,
  Trash2,
  Pencil,
  Eye,
  X,
  CheckCircle2,
  Users as UsersIcon,
} from "lucide-react";
import { createPortal } from "react-dom";
import { projectApi } from "../services/projectService";
import { sprintApi } from "../services/sprintService";
import { getEmployees } from "../services/employeeServices";
import { projectMemberApi } from "../services/projectMemberService";

// TYPES
type Sprint = {
  name: string;
  startDate: string;
  endDate: string;
  goal: string;
  status: "planned" | "in-progress" | "done";
};

type Project = {
  id: number;
  name: string;
  startDate: string;
  endDate: string;
  sprintDuration: number;
};

export default function ProjectSetupPage() {
// ================= STATE =================
const [projects, setProjects] = useState<Project[]>([]);
const [open, setOpen] = useState(false);
const [loading, setLoading] = useState(false);
const [step, setStep] = useState<1 | 2 | 3>(1);
const [isEdit, setIsEdit] = useState(false);
const [expandedProjectId, setExpandedProjectId] = useState<number | null>(null);

const [projectSprints, setProjectSprints] = useState<
  Record<number, Sprint[]>
>({});
const [projectMembers, setProjectMembers] = useState<
  Record<number, string[]>
>({});

const [search, setSearch] = useState("");
const [openDropdown, setOpenDropdown] = useState(false);

const [form, setForm] = useState<Project>({
  id: 0,
  name: "",
  startDate: "",
  endDate: "",
  sprintDuration: 14,
});

const [generatedSprints, setGeneratedSprints] = useState<Sprint[]>([]);

// ✅ IMPORTANT: declare BEFORE using it
const [allEmployees, setAllEmployees] = useState<
  { id: number; name: string }[]
>([]);

const [selectedMembers, setSelectedMembers] = useState<number[]>([]);

// ================= DERIVED =================
const filteredEmployees = allEmployees.filter((e) =>
  e.name?.toLowerCase().includes(search.toLowerCase()),
);

  useEffect(() => {
    fetchProjects();
    fetchEmployees();
  }, []);

  const fetchEmployees = async () => {
    try {
      const res = await getEmployees();
      setAllEmployees(res.data);
    } catch (err) {
      console.error(err);
    }
  };

  // FETCH
  useEffect(() => {
    fetchProjects();
  }, []);

  const fetchProjects = async () => {
    try {
      const data: Project[] = await projectApi.getAll();
      setProjects(data);
    } catch (err) {
      console.error(err);
    }
  };
  
  const loadProjectDetails = async (projectId: number) => {
    try {
      // ✅ FIX: remove .data
      const sprints = await sprintApi.getByProject(projectId);
      const membersRes = await projectMemberApi.getByProject(projectId);

      // 🔥 normalize dates (important for UI)
      const formattedSprints = sprints.map((s: any) => ({
        ...s,
        startDate: s.startDate?.split("T")[0],
        endDate: s.endDate?.split("T")[0],
      }));

      setProjectSprints((prev) => ({
        ...prev,
        [projectId]: formattedSprints,
      }));

      setProjectMembers((prev) => ({
        ...prev,
        [projectId]: membersRes.data,
      }));

      setExpandedProjectId(projectId);
    } catch (err) {
      console.error("Failed to load details", err);
    }
  };

  // STEP 1 → SAVE PROJECT
  const handleSaveProject = async () => {
    // ✅ VALIDATION
    if (!form.name.trim()) {
      alert("Project name is required");
      return;
    }

    if (!form.startDate || !form.endDate) {
      alert("Start date and End date are required");
      return;
    }

    if (new Date(form.startDate) > new Date(form.endDate)) {
      alert("Start date cannot be after End date");
      return;
    }

    try {
      setLoading(true);

      let saved: Project;

      if (isEdit) {
        saved = await projectApi.update(form.id, form);
        setProjects((prev) => prev.map((p) => (p.id === form.id ? saved : p)));
      } else {
        saved = await projectApi.create(form);
        setProjects((prev) => [...prev, saved]);
      }

      setForm({
        ...saved,
        startDate: saved.startDate?.split("T")[0],
        endDate: saved.endDate?.split("T")[0],
      });

      setStep(2);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  // STEP 2 → GENERATE SPRINTS
const generateSprints = () => {
  if (!form.startDate || !form.endDate) return;

  const today = new Date();
  const start = new Date(form.startDate);
  const end = new Date(form.endDate);

  const sprints: Sprint[] = [];

  let current = new Date(start);
  let count = 1;

  while (current <= end) {
    const sprintStart = new Date(current);
    const sprintEnd = new Date(current);

    sprintEnd.setDate(sprintEnd.getDate() + form.sprintDuration - 1);

    if (sprintEnd > end) sprintEnd.setTime(end.getTime());

    let status: Sprint["status"] = "planned";

    if (today > sprintEnd) status = "done";
    else if (today >= sprintStart && today <= sprintEnd)
      status = "in-progress";

    sprints.push({
      name: `Sprint ${count}`,
      startDate: sprintStart.toISOString().split("T")[0],
      endDate: sprintEnd.toISOString().split("T")[0],
      goal: "",
      status,
    });

    current.setDate(current.getDate() + form.sprintDuration);
    count++;
  }

  // 🔥 ALWAYS overwrite
  setGeneratedSprints(sprints);
};;

  // SAVE SPRINTS
 const saveSprints = async () => {
  try {
    const payload = generatedSprints.map((s) => ({
      name: s.name,
      startDate: s.startDate,
      endDate: s.endDate,
      goal: s.goal,
      status: s.status,
    }));

    // ✅ SAVE TO DB
    await sprintApi.sync(form.id, payload);

    // 🔥 REFETCH UPDATED SPRINTS FROM BACKEND
    const updated = await sprintApi.getByProject(form.id);

    const formatted = updated.map((s: any) => ({
      ...s,
      startDate: s.startDate?.split("T")[0],
      endDate: s.endDate?.split("T")[0],
    }));

    // 🔥 UPDATE UI STATE
    setGeneratedSprints(formatted);

    setProjectSprints((prev) => ({
      ...prev,
      [form.id]: formatted,
    }));

    setStep(3);
  } catch (err) {
    console.error(err);
  }
};

  // DELETE
  const deleteProject = async (id: number) => {
    try {
      await projectApi.delete(id);
      setProjects((prev) => prev.filter((p) => p.id !== id));
    } catch (err) {
      console.error(err);
    }
  };

  // EDIT
const handleEdit = async (p: Project) => {
  setForm({
    ...p,
    startDate: p.startDate?.split("T")[0],
    endDate: p.endDate?.split("T")[0],
  });

  setIsEdit(true);
  setOpen(true);

  try {
    // ✅ GET SPRINTS (ONLY FOR VIEW)
    const sprints = await sprintApi.getByProject(p.id);

    const formattedSprints = sprints.map((s: any) => ({
      ...s,
      startDate: s.startDate?.split("T")[0],
      endDate: s.endDate?.split("T")[0],
    }));

    // 🔥 DO NOT PUT INTO generatedSprints (THIS WAS THE BUG)
    setGeneratedSprints([]); // ✅ force fresh generation

    // ✅ STORE ONLY FOR VIEW (expanded card)
    setProjectSprints((prev) => ({
      ...prev,
      [p.id]: formattedSprints,
    }));

    // ✅ GET MEMBERS
    const membersRes = await projectMemberApi.getByProject(p.id);
    const members = membersRes.data;

    setSelectedMembers(members.map((m: any) => m.id));

  } catch (err) {
    console.error("Edit load failed", err);
  }

  // ✅ go to step 1 (user edits project first)
  setStep(1);
};

  // CLOSE MODAL
  const closeModal = () => {
    setOpen(false);
    setIsEdit(false);
    setStep(1);
    setGeneratedSprints([]);
    setSearch("");
    setOpenDropdown(false);

    setForm({
      id: 0,
      name: "",
      startDate: "",
      endDate: "",
      sprintDuration: 14,
    });
  };

  const formatDate = (date: string) => {
    if (!date) return "";
    return date.split("T")[0];
  };

  const saveMembers = async (projectId: number) => {
  try {
    await projectMemberApi.assign(projectId, selectedMembers);

    alert("Setup complete ✅");

    closeModal();
  } catch (err) {
    console.error(err);
  }
};
  
  return (
    <AppLayout>
      <div className="space-y-8 max-w-7xl mx-auto">
        {/* HEADER */}
        <div className="flex justify-between items-start">
          <div className="space-y-2">
            <h1 className="text-4xl font-bold text-primary">
             Projects 📁
            </h1>
            <p className="text-secondary">Create and manage your projects with sprints & team assignments</p>
          </div>
          <Button
            onClick={() => setOpen(true)}
            className="bg-gradient-to-r from-accent to-secondary text-white font-semibold px-6 py-3 rounded-lg hover:shadow-lg hover:scale-105 transition-all"
          >
            + New Project
          </Button>
        </div>

       {/* LIST */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {projects.map((p) => (
            <Card
              key={p.id}
              className="relative group hover:shadow-xl transition-all duration-300 bg-gradient-to-br from-white to-slate-50/50"
            >
              {/* Background decoration */}
              <div className="absolute -top-12 -right-12 w-32 h-32 bg-accent/5 rounded-full blur-2xl pointer-events-none" />

              {/* ACTIONS */}
              <div className="absolute top-4 right-4 flex gap-2 z-50">
                
                {/* VIEW */}
                <button
                  onClick={() =>
                    expandedProjectId === p.id
                      ? setExpandedProjectId(null)
                      : loadProjectDetails(p.id)
                  }
                  className="p-2 rounded-lg bg-purple-100 text-purple-600 hover:bg-purple-200 transition-colors shadow-sm"
                  title="View details"
                >
                  <Eye size={16} />
                </button>

                {/* EDIT */}
                <button
                  onClick={() => {
                    console.log("EDIT CLICKED", p.id);
                    handleEdit(p);
                  }}
                  className="p-2 rounded-lg bg-amber-100 text-amber-600 hover:bg-amber-200 transition-colors shadow-sm"
                  title="Edit"
                >
                  <Pencil size={16} />
                </button>

                {/* DELETE */}
                <button
                  onClick={() => {
                    console.log("DELETE CLICKED", p.id);
                    deleteProject(p.id);
                  }}
                  className="p-2 rounded-lg bg-red-100 text-red-600 hover:bg-red-200 transition-colors shadow-sm"
                  title="Delete"
                >
                  <Trash2 size={16} />
                </button>
              </div>

              {/* Content */}
              <div className="relative z-10 space-y-4">
                {/* TITLE */}
                <h2 className="text-2xl font-bold text-primary">{p.name}</h2>

                {/* DATES */}
                <div className="flex items-center gap-3 text-sm">
                  <Calendar size={16} className="text-accent" />
                  <span className="text-secondary">
                    {formatDate(p.startDate)} → {formatDate(p.endDate)}
                  </span>
                </div>

                {/* DURATION */}
                <div className="flex items-center gap-3 text-sm">
                  <Timer size={16} className="text-accent" />
                  <span className="text-secondary">
                    {p.sprintDuration} day sprints
                  </span>
                </div>

                {/* 🔥 EXPANDED VIEW */}
                {expandedProjectId === p.id && (
                  <div className="mt-4 space-y-4 border-t border-primary/10 pt-4">

                    {/* SPRINTS */}
                    <div className="space-y-2">
                      <p className="text-sm font-semibold text-primary flex items-center gap-2">
                        <CheckCircle2 size={16} /> Sprints
                      </p>

                      <div className="space-y-2">
                        {(projectSprints[p.id] || []).map((s, i) => (
                          <div
                            key={i}
                            className={`p-3 rounded-lg border text-xs ${
                              s.status === "done"
                                ? "bg-green-50 border-green-200"
                                : s.status === "in-progress"
                                ? "bg-amber-50 border-amber-200"
                                : "bg-blue-50 border-blue-200"
                            }`}
                          >
                            <div className="font-medium text-primary">
                              {s.name}
                            </div>
                            <div className="text-secondary">
                              {formatDate(s.startDate)} → {formatDate(s.endDate)}
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* TEAM */}
                    <div className="space-y-2 border-t border-primary/10 pt-4">
                      <p className="text-sm font-semibold text-primary flex items-center gap-2">
                        <UsersIcon size={16} /> Team Members
                      </p>

                      <div className="flex flex-wrap gap-2">
                        {(projectMembers[p.id] || []).length > 0 ? (
                          (projectMembers[p.id] || []).map((member: any, idx) => (
                            <span
                              key={idx}
                              className="px-3 py-1.5 text-xs font-medium rounded-full bg-accent/20 text-accent border border-accent/30"
                            >
                              {member.name || `Member ${idx + 1}`}
                            </span>
                          ))
                        ) : (
                          <p className="text-xs text-secondary">
                            No team members assigned
                          </p>
                        )}
                      </div>
                    </div>

                  </div>
                )}
              </div>
            </Card>
          ))}
        </div>

        {/* Empty State */}
        {projects.length === 0 && (
          <div className="text-center py-20">
            <Calendar size={64} className="mx-auto text-primary/20 mb-4" />
            <h3 className="text-2xl font-semibold text-primary mb-2">
              No projects yet
            </h3>
            <p className="text-secondary mb-6">
              Create your first project to get started
            </p>
            <Button
              onClick={() => setOpen(true)}
              className="bg-gradient-to-r from-accent to-secondary"
            >
              Create Project
            </Button>
          </div>
        )}

        {/* MODAL */}
        {open &&
          createPortal(
            <div
              className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/40 backdrop-blur-md p-4"
              onClick={closeModal}
            >
              <div
                onClick={(e) => e.stopPropagation()}
                className="w-full max-w-2xl max-h-[90vh] overflow-y-auto bg-background/95 backdrop-blur-2xl border border-accent/20 rounded-3xl shadow-2xl p-8 space-y-6"
              >
                {/* HEADER WITH CLOSE */}
                <div className="flex justify-between items-start">
                  <div>
                    <h2 className="text-2xl font-bold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
                      {isEdit ? "Edit Project" : "Create Project"}
                    </h2>
                    <p className="text-secondary text-sm mt-1">Set up your project in 3 steps</p>
                  </div>
                  <button
                    onClick={closeModal}
                    className="p-2 hover:bg-primary/10 rounded-lg transition"
                  >
                    <X size={20} className="text-primary" />
                  </button>
                </div>

                {/* 🔥 STEPPER HEADER */}
                <div className="flex justify-between items-center">
                  {["Project", "Sprints", "Team"].map((label, i) => {
                    const stepNumber = i + 1;
                    const isActive = step === stepNumber;
                    const isCompleted = step > stepNumber;

                    return (
                      <div key={label} className="flex-1 flex items-center">
                        <div className="flex flex-col items-center w-full">
                          <div
                            className={`w-10 h-10 flex items-center justify-center rounded-full text-sm font-bold transition-all ${
                              isCompleted
                                ? "bg-green-500 text-white shadow-lg"
                                : isActive
                                ? "bg-gradient-to-r from-accent to-secondary text-white shadow-lg scale-110"
                                : "bg-slate-200 text-slate-500"
                            }`}
                          >
                            {isCompleted ? "✓" : stepNumber}
                          </div>

                          <span
                            className={`text-xs font-semibold mt-2 transition-colors ${
                              isActive
                                ? "text-primary"
                                : isCompleted
                                ? "text-green-600"
                                : "text-slate-400"
                            }`}
                          >
                            {label}
                          </span>
                        </div>

                        {i !== 2 && (
                          <div
                            className={`flex-1 h-1 mx-3 rounded-full transition-colors ${
                              isCompleted
                                ? "bg-green-500"
                                : step > stepNumber
                                ? "bg-green-500"
                                : "bg-slate-200"
                            }`}
                          />
                        )}
                      </div>
                    );
                  })}
                </div>

                {/* ================= STEP 1 ================= */}
                {step >= 1 && (
                  <div className="space-y-5 p-6 rounded-2xl bg-gradient-to-br from-slate-50 to-white border border-primary/10">
                    <h3 className="text-lg font-bold text-primary flex items-center gap-2">
                      <span className="w-6 h-6 flex items-center justify-center bg-accent text-white rounded-full text-sm">
                        1
                      </span>
                      Project Details
                    </h3>

                    <div className="space-y-4">
                      <div>
                        <label className="text-xs font-semibold text-secondary mb-2 block">
                          Project Name
                        </label>
                        <input
                          placeholder="e.g. Sprint Planner v2"
                          value={form.name}
                          onChange={(e) =>
                            setForm({ ...form, name: e.target.value })
                          }
                          className="w-full px-4 py-3 rounded-xl border border-primary/10 text-sm focus:border-accent focus:ring-2 focus:ring-accent/20 outline-none transition-all"
                        />
                      </div>

                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <label className="text-xs font-semibold text-secondary mb-2 block">
                            Start Date
                          </label>
                          <input
                            type="date"
                            value={form.startDate}
                            onChange={(e) =>
                              setForm({ ...form, startDate: e.target.value })
                            }
                            className="w-full px-4 py-3 rounded-xl border border-primary/10 text-sm focus:border-accent focus:ring-2 focus:ring-accent/20 outline-none transition-all"
                          />
                        </div>
                        <div>
                          <label className="text-xs font-semibold text-secondary mb-2 block">
                            End Date
                          </label>
                          <input
                            type="date"
                            value={form.endDate}
                            onChange={(e) =>
                              setForm({ ...form, endDate: e.target.value })
                            }
                            className="w-full px-4 py-3 rounded-xl border border-primary/10 text-sm focus:border-accent focus:ring-2 focus:ring-accent/20 outline-none transition-all"
                          />
                        </div>
                      </div>

                      <div>
                        <label className="text-xs font-semibold text-secondary mb-2 block">
                          Sprint Duration (days)
                        </label>
                        <input
                          type="number"
                          min={1}
                          value={form.sprintDuration}
                          onChange={(e) =>
                            setForm({
                              ...form,
                              sprintDuration: Number(e.target.value),
                            })
                          }
                          className="w-full px-4 py-3 rounded-xl border border-primary/10 text-sm focus:border-accent focus:ring-2 focus:ring-accent/20 outline-none transition-all"
                        />
                      </div>
                    </div>

                    {step === 1 && (
                      <div className="flex justify-end pt-2">
                        <Button
                          onClick={handleSaveProject}
                          disabled={
                            loading ||
                            !form.name ||
                            !form.startDate ||
                            !form.endDate
                          }
                          className="bg-gradient-to-r from-accent to-secondary text-white font-semibold"
                        >
                          {loading ? "Saving..." : "Continue to Sprints"}
                        </Button>
                      </div>
                    )}
                  </div>
                )}

                {/* ================= STEP 2 ================= */}
                {step >= 2 && (
                  <div
                    className={`space-y-5 p-6 rounded-2xl transition-all ${
                      step === 2
                        ? "bg-gradient-to-br from-slate-50 to-white border border-primary/10"
                        : "opacity-60 pointer-events-none"
                    }`}
                  >
                    <h3 className="text-lg font-bold text-primary flex items-center gap-2">
                      <span
                        className={`w-6 h-6 flex items-center justify-center rounded-full text-sm font-bold ${
                          step > 2
                            ? "bg-green-500 text-white"
                            : "bg-accent text-white"
                        }`}
                      >
                        {step > 2 ? "✓" : "2"}
                      </span>
                      Generate Sprints
                    </h3>

                    <div className="space-y-4">
                      {generatedSprints.length === 0 ? (
                        <Button
                          onClick={generateSprints}
                          className="w-full bg-primary/10 text-primary hover:bg-primary/20"
                        >
                          🚀 Generate Sprints
                        </Button>
                      ) : (
                        <>
                          <div className="space-y-2">
                            {generatedSprints.map((s, i) => (
                              <div
                                key={i}
                                className={`p-4 rounded-xl border transition-all ${
                                  s.status === "done"
                                    ? "bg-green-50 border-green-200"
                                    : s.status === "in-progress"
                                    ? "bg-amber-50 border-amber-200"
                                    : "bg-blue-50 border-blue-200"
                                }`}
                              >
                                <div className="flex justify-between items-center">
                                  <span className="font-semibold text-primary">
                                    {s.name}
                                  </span>
                                  <span className="text-xs font-medium text-secondary">
                                    {s.startDate} → {s.endDate}
                                  </span>
                                </div>
                                <div className="text-xs text-secondary mt-1 capitalize">
                                  Status: {s.status}
                                </div>
                              </div>
                            ))}
                          </div>

                          {step === 2 && (
                            <div className="flex justify-end pt-2">
                              <Button
                                onClick={saveSprints}
                                className="bg-gradient-to-r from-accent to-secondary text-white font-semibold"
                              >
                                Continue to Team
                              </Button>
                            </div>
                          )}
                        </>
                      )}
                    </div>
                  </div>
                )}

                {/* ================= STEP 3 ================= */}
                {step >= 3 && (
                  <div
                    className={`space-y-5 p-6 rounded-2xl transition-all ${
                      step === 3
                        ? "bg-gradient-to-br from-slate-50 to-white border border-primary/10"
                        : "opacity-60 pointer-events-none"
                    }`}
                  >
                    <h3 className="text-lg font-bold text-primary flex items-center gap-2">
                      <span className="w-6 h-6 flex items-center justify-center bg-accent text-white rounded-full text-sm font-bold">
                        3
                      </span>
                      Assign Team Members
                    </h3>

                    {/* 🔥 CUSTOM MULTISELECT */}
                    <div className="space-y-3">
                      <div className="relative">
                        <div
                          onClick={() => setOpenDropdown((prev) => !prev)}
                          className="w-full border border-primary/10 rounded-xl p-4 cursor-pointer flex flex-wrap gap-2 min-h-[50px] bg-white hover:border-accent transition-colors"
                        >
                          {selectedMembers.length === 0 && (
                            <span className="text-sm text-slate-400 py-1">
                              Click to select team members...
                            </span>
                          )}

                          {selectedMembers.map((id) => {
                            const emp = allEmployees.find((e) => e.id === id);
                            return (
                              <span
                                key={id}
                                className="inline-flex items-center gap-2 px-3 py-2 text-sm font-medium rounded-lg bg-gradient-to-r from-accent/20 to-secondary/20 text-accent border border-accent/30"
                              >
                                {emp?.name}
                                <button
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    setSelectedMembers((prev) =>
                                      prev.filter((x) => x !== id),
                                    );
                                  }}
                                  className="hover:bg-accent/20 rounded p-0.5"
                                >
                                  ✕
                                </button>
                              </span>
                            );
                          })}
                        </div>

                        {/* 🔥 DROPDOWN */}
                        {openDropdown && (
                          <div className="absolute z-10 mt-2 w-full bg-white border border-primary/10 rounded-xl shadow-lg p-3 space-y-3">
                            {/* 🔍 SEARCH */}
                            <input
                              autoFocus
                              placeholder="Search members..."
                              value={search}
                              onChange={(e) => setSearch(e.target.value)}
                              className="w-full px-3 py-2 text-sm border border-primary/10 rounded-lg focus:border-accent focus:ring-1 focus:ring-accent/20 outline-none"
                            />

                            {/* 👥 LIST */}
                            <div className="max-h-48 overflow-y-auto space-y-1">
                              {filteredEmployees.length === 0 ? (
                                <p className="text-xs text-secondary text-center py-4">
                                  No employees found
                                </p>
                              ) : (
                                filteredEmployees.map((emp) => {
                                  const isSelected =
                                    selectedMembers.includes(emp.id);

                                  return (
                                    <div
                                      key={emp.id}
                                      onClick={() => {
                                        if (isSelected) {
                                          setSelectedMembers((prev) =>
                                            prev.filter((id) => id !== emp.id),
                                          );
                                        } else {
                                          setSelectedMembers((prev) => [
                                            ...prev,
                                            emp.id,
                                          ]);
                                        }
                                      }}
                                      className={`px-3 py-2.5 text-sm rounded-lg cursor-pointer transition-all flex justify-between items-center ${
                                        isSelected
                                          ? "bg-accent/20 text-accent border border-accent/30 font-medium"
                                          : "hover:bg-primary/5 text-primary"
                                      }`}
                                    >
                                      <span>{emp.name}</span>
                                      {isSelected && (
                                        <CheckCircle2 size={16} />
                                      )}
                                    </div>
                                  );
                                })
                              )}
                            </div>
                          </div>
                        )}
                      </div>

                      {selectedMembers.length > 0 && (
                        <p className="text-xs text-secondary">
                          {selectedMembers.length} team member{selectedMembers.length !== 1 ? "s" : ""} selected
                        </p>
                      )}
                    </div>

                    {step === 3 && (
                      <div className="flex justify-end pt-4 border-t border-primary/10">
                        <Button
                          onClick={() => saveMembers(form.id)}
                          className="bg-gradient-to-r from-green-500 to-emerald-500 text-white font-semibold px-8"
                        >
                          ✓ Complete Setup
                        </Button>
                      </div>
                    )}
                  </div>
                )}
              </div>
            </div>,
            document.body,
          )}
      </div>
    </AppLayout>
  );
}