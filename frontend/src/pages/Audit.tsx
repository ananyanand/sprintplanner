/* eslint-disable @typescript-eslint/no-explicit-any */
import { useState } from "react";
import AppLayout from "../components/Layout/AppLayout";
import Card from "../components/ui/Card";
import MultiSelectDropdown from "../components/ui/MultiSelectDropdown";
import {
  Clock,
  Folder,
  ClipboardList,
  Bug,
  Activity,
  User,
  Filter,
} from "lucide-react";

type AuditLog = {
  id: number;
  user: string;
  action: string;
  entity: string;
  entityName: string;
  project: string;
  time: string;
};

export default function AuditPage() {
  const [logs] = useState<AuditLog[]>([
    {
      id: 1,
      user: "Ananya",
      action: "created",
      entity: "Task",
      entityName: "Login UI",
      project: "Sprint Planner",
      time: "2 mins ago",
    },
    {
      id: 2,
      user: "Rahul",
      action: "updated",
      entity: "Bug",
      entityName: "API crash",
      project: "AI Platform",
      time: "10 mins ago",
    },
    {
      id: 3,
      user: "Ananya",
      action: "deleted",
      entity: "Task",
      entityName: "Outdated feature",
      project: "Sprint Planner",
      time: "25 mins ago",
    },
    {
      id: 4,
      user: "Rahul",
      action: "assigned",
      entity: "Bug",
      entityName: "Database timeout",
      project: "AI Platform",
      time: "1 hour ago",
    },
  ]);

  const [filterProject, setFilterProject] = useState<string[]>([]);
  const [filterUser, setFilterUser] = useState<string[]>([]);

  const projects = [
    { label: "Sprint Planner", value: "Sprint Planner" },
    { label: "AI Platform", value: "AI Platform" },
  ];

  const users = [
    { label: "Ananya", value: "Ananya" },
    { label: "Rahul", value: "Rahul" },
  ];

  const actionColors: Record<string, string> = {
    created: "bg-green-100 text-green-700",
    updated: "bg-blue-100 text-blue-700",
    deleted: "bg-red-100 text-red-700",
    assigned: "bg-purple-100 text-purple-700",
    moved: "bg-amber-100 text-amber-700",
  };

  const entityIcons: Record<string, { icon: any; bg: string; text: string }> = {
    Task: { icon: ClipboardList, bg: "bg-blue-50", text: "text-blue-600" },
    Bug: { icon: Bug, bg: "bg-red-50", text: "text-red-600" },
    Project: { icon: Folder, bg: "bg-amber-50", text: "text-amber-600" },
    default: { icon: Activity, bg: "bg-slate-50", text: "text-slate-600" },
  };

  const getIconConfig = (entity: string) => {
    return entityIcons[entity] || entityIcons.default;
  };

  const filteredLogs = logs.filter((log) => {
    return (
      (filterProject.length === 0 ||
        filterProject.includes(log.project)) &&
      (filterUser.length === 0 ||
        filterUser.includes(log.user))
    );
  });

  // Calculate stats
  const totalActions = logs.length;
  const uniqueUsers = [...new Set(logs.map(l => l.user))].length;
  const uniqueProjects = [...new Set(logs.map(l => l.project))].length;
  const createdCount = logs.filter(l => l.action === "created").length;

  return (
    <AppLayout>
      <div className="space-y-8 max-w-6xl mx-auto">
        {/* 🔥 Header */}
        <div className="flex justify-between items-start">
          <div className="space-y-2">
            <h1 className="text-4xl font-bold text-primary">Audit Logs 📋</h1>
            <p className="text-secondary text-sm">Track all system activity and changes</p>
          </div>
          <div className="text-right text-sm">
            <p className="text-secondary">Last updated</p>
            <p className="text-primary font-semibold">Just now</p>
          </div>
        </div>

        {/* 🔥 Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Card className="relative overflow-hidden">
            <div className="absolute top-0 right-0 w-16 h-16 opacity-5">
              <Activity size={64} className="text-accent" />
            </div>
            <div className="flex items-center gap-3 relative z-10">
              <div className="p-3 rounded-lg bg-accent/10">
                <Activity size={20} className="text-accent" />
              </div>
              <div>
                <p className="text-secondary text-xs font-medium">Total Actions</p>
                <h2 className="text-2xl font-bold text-primary mt-1">
                  {totalActions}
                </h2>
              </div>
            </div>
          </Card>

          <Card className="relative overflow-hidden">
            <div className="absolute top-0 right-0 w-16 h-16 opacity-5">
              <User size={64} className="text-blue-500" />
            </div>
            <div className="flex items-center gap-3 relative z-10">
              <div className="p-3 rounded-lg bg-blue-100">
                <User size={20} className="text-blue-600" />
              </div>
              <div>
                <p className="text-secondary text-xs font-medium">Active Users</p>
                <h2 className="text-2xl font-bold text-primary mt-1">
                  {uniqueUsers}
                </h2>
              </div>
            </div>
          </Card>

          <Card className="relative overflow-hidden">
            <div className="absolute top-0 right-0 w-16 h-16 opacity-5">
              <Folder size={64} className="text-amber-500" />
            </div>
            <div className="flex items-center gap-3 relative z-10">
              <div className="p-3 rounded-lg bg-amber-100">
                <Folder size={20} className="text-amber-600" />
              </div>
              <div>
                <p className="text-secondary text-xs font-medium">Projects</p>
                <h2 className="text-2xl font-bold text-primary mt-1">
                  {uniqueProjects}
                </h2>
              </div>
            </div>
          </Card>

          <Card className="relative overflow-hidden">
            <div className="absolute top-0 right-0 w-16 h-16 opacity-5">
              <ClipboardList size={64} className="text-green-500" />
            </div>
            <div className="flex items-center gap-3 relative z-10">
              <div className="p-3 rounded-lg bg-green-100">
                <ClipboardList size={20} className="text-green-600" />
              </div>
              <div>
                <p className="text-secondary text-xs font-medium">Created</p>
                <h2 className="text-2xl font-bold text-primary mt-1">
                  {createdCount}
                </h2>
              </div>
            </div>
          </Card>
        </div>

        {/* 🔥 Filters */}
        <Card className="bg-gradient-to-br from-slate-50 to-white border border-primary/10 p-6">
          <div className="flex items-center gap-2 mb-4">
            <Filter size={18} className="text-primary" />
            <h3 className="text-sm font-semibold text-primary">Filter Logs</h3>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="text-xs font-semibold text-secondary mb-2 block">Project</label>
              <MultiSelectDropdown
                options={projects}
                value={filterProject}
                onChange={setFilterProject}
                placeholder="Filter by project"
              />
            </div>

            <div>
              <label className="text-xs font-semibold text-secondary mb-2 block">User</label>
              <MultiSelectDropdown
                options={users}
                value={filterUser}
                onChange={setFilterUser}
                placeholder="Filter by user"
              />
            </div>
          </div>
        </Card>

        {/* 🔥 Activity Timeline */}
        <div className="space-y-3">
          <h3 className="text-lg font-bold text-primary flex items-center gap-2">
            <Clock size={20} />
            Activity Timeline
          </h3>

          {filteredLogs.length === 0 ? (
            <Card className="text-center py-12">
              <Activity size={48} className="mx-auto text-primary/20 mb-4" />
              <p className="text-sm text-secondary">No logs found</p>
            </Card>
          ) : (
            <div className="relative">
              {/* Timeline line */}
              <div className="absolute left-6 top-0 bottom-0 w-0.5 bg-gradient-to-b from-accent to-primary/20" />

              {/* Timeline items */}
              <div className="space-y-4">
                {filteredLogs.map((log) => {
                  const iconConfig = getIconConfig(log.entity);
                  const Icon = iconConfig.icon;
                  const actionColor = actionColors[log.action] || "bg-slate-100 text-slate-700";

                  return (
                    <Card
                      key={log.id}
                      className="relative ml-16 p-5 hover:shadow-lg transition-all duration-300 bg-gradient-to-br from-white to-slate-50/50 border border-primary/10"
                    >
                      {/* Timeline dot */}
                      <div className="absolute -left-10 top-6 w-4 h-4 rounded-full bg-accent border-4 border-white shadow-md" />

                      {/* Content */}
                      <div className="space-y-3">
                        {/* Action header */}
                        <div className="flex items-start justify-between gap-4">
                          <div className="flex items-start gap-3 flex-1">
                            {/* Entity Icon */}
                            <div className={`p-2.5 rounded-lg flex-shrink-0 ${iconConfig.bg}`}>
                              <Icon size={18} className={iconConfig.text} />
                            </div>

                            {/* Action text */}
                            <div className="flex-1 min-w-0">
                              <p className="text-sm text-primary">
                                <span className="font-bold">{log.user}</span>
                                {" "}
                                <span className={`inline-block px-2.5 py-0.5 rounded-full text-xs font-semibold ${actionColor}`}>
                                  {log.action}
                                </span>
                                {" "}
                                <span className="font-bold">{log.entity}</span>
                              </p>
                              <p className="text-sm text-accent font-semibold mt-1">
                                "{log.entityName}"
                              </p>
                            </div>
                          </div>

                          {/* Time */}
                          <div className="text-xs font-medium text-secondary whitespace-nowrap flex-shrink-0">
                            <Clock size={14} className="inline mr-1" />
                            {log.time}
                          </div>
                        </div>

                        {/* Footer */}
                        <div className="flex items-center gap-2 pt-2 border-t border-primary/10">
                          <Folder size={12} className="text-secondary" />
                          <span className="text-xs text-secondary">{log.project}</span>
                        </div>
                      </div>
                    </Card>
                  );
                })}
              </div>
            </div>
          )}
        </div>
      </div>
    </AppLayout>
  );
}