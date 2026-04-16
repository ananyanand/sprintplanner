import { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import {
  LayoutDashboard,
  ClipboardList,
  Bug,
  PanelLeftClose,
  PanelLeftOpen,
  Settings,
  User,
  Zap,
} from "lucide-react";

export default function Sidebar() {
  const [collapsed, setCollapsed] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  const menu = [
    { name: "Dashboard", path: "/dashboard", icon: LayoutDashboard, color: "text-blue-600" },
    { name: "Team", path: "/employee", icon: User, color: "text-green-600" },
    { name: "Projects", path: "/project-setup", icon: Settings, color: "text-purple-600" },
    { name: "Sprints", path: "/sprint", icon: ClipboardList, color: "text-amber-600" },
    { name: "Bugs", path: "/bugs", icon: Bug, color: "text-red-600" },
  ];

  return (
    <aside
      className={`
        h-full bg-gradient-to-b from-slate-50 to-white
        border-r border-primary/10
        flex flex-col justify-between
        transition-all duration-300 ease-in-out
        shadow-lg
        ${collapsed ? "w-20" : "w-64"}
      `}
    >
      {/* Top Section */}
      <div className="flex flex-col space-y-6 p-4">
        {/* Header with Toggle */}
        <div className="flex items-center justify-between">
          {!collapsed && (
            <div className="flex items-center gap-2">
              <div className="p-2.5 rounded-lg bg-gradient-to-br from-primary to-accent shadow-md">
                <Zap size={20} className="text-white" />
              </div>
              <div>
                <h1 className="text-lg font-bold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
                  Sprint
                </h1>
                <p className="text-[10px] text-secondary font-medium">Planner</p>
              </div>
            </div>
          )}

          <button
            onClick={() => setCollapsed(!collapsed)}
            className={`p-2 rounded-lg text-secondary hover:text-primary hover:bg-primary/10 transition-all ${
              collapsed ? "mx-auto" : ""
            }`}
            title={collapsed ? "Expand sidebar" : "Collapse sidebar"}
          >
            {collapsed ? <PanelLeftOpen size={20} /> : <PanelLeftClose size={20} />}
          </button>
        </div>

        {/* Divider */}
        {!collapsed && <div className="h-px bg-gradient-to-r from-primary/20 to-accent/20" />}

        {/* Navigation Menu */}
        <nav className="flex flex-col gap-1.5 pt-2">
          {menu.map((item) => {
            const active = location.pathname === item.path;
            const Icon = item.icon;

            return (
              <button
                key={item.name}
                onClick={() => navigate(item.path)}
                className={`
                  flex items-center gap-3 px-3.5 py-2.5 rounded-lg text-sm font-medium
                  transition-all duration-200 ease-in-out
                  relative overflow-hidden group
                  ${
                    active
                      ? "bg-gradient-to-r from-primary/15 to-accent/15 text-primary shadow-sm border border-primary/20"
                      : "text-secondary hover:text-primary hover:bg-primary/8"
                  }
                `}
              >
                {/* Background animation for hover */}
                <div className="absolute inset-0 bg-gradient-to-r from-primary/0 to-accent/0 group-hover:from-primary/5 group-hover:to-accent/5 transition-all" />

                {/* Icon */}
                <div className={`relative z-10 flex-shrink-0 transition-all ${active ? "scale-110" : "group-hover:scale-110"}`}>
                  <Icon size={18} className={active ? item.color : "text-secondary group-hover:text-primary"} />
                </div>

                {/* Label */}
                {!collapsed && (
                  <span className="relative z-10 flex-1 text-left">{item.name}</span>
                )}

                {/* Active indicator */}
                {active && !collapsed && (
                  <div className="relative z-10 w-2 h-2 rounded-full bg-gradient-to-r from-primary to-accent shadow-md" />
                )}
              </button>
            );
          })}
        </nav>
      </div>

      {/* Bottom Section */}
      <div className="space-y-4 p-4 border-t border-primary/10">
        {!collapsed && (
          <div className="bg-gradient-to-br from-primary/10 to-accent/10 rounded-lg p-3.5 border border-primary/20">
            <p className="text-xs font-semibold text-primary mb-2">✨ Quick Tip</p>
            <p className="text-xs text-secondary leading-relaxed">
              Use keyboard shortcuts to navigate faster
            </p>
          </div>
        )}

        {/* Version */}
        <div className={`flex items-center justify-center text-xs font-medium ${collapsed ? "gap-1" : "gap-2"}`}>
          <span className="w-2 h-2 rounded-full bg-green-500 shadow-lg" />
          <span className={`text-secondary ${collapsed ? "hidden" : "block"}`}>v1.0</span>
        </div>
      </div>
    </aside>
  );
}