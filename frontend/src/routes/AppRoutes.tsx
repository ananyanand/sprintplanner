import { Routes, Route } from "react-router-dom";
import Landing from "../pages/Landing";
import Playground from "../pages/Playground";
import Login from "../pages/Login";
import Dashboard from "../pages/Dashboard";
import SprintPage from "../pages/SprintPage";
import ProjectSetupPage from "../pages/ProjectSetupPage";
import EmployeePage from "../pages/Employee";
import BugPage from "../pages/Bug";
import AuditPage from "../pages/Audit";
// import Dashboard from "../pages/Dashboard/Dashboard";

export default function AppRoutes() {
  return (
    <Routes>
      <Route path="/" element={<Landing />} />
      <Route path="/playground" element={<Playground />} />
      <Route path="/login" element={<Login />} />
      <Route path="/dashboard" element={<Dashboard />} />
      <Route path="/sprint" element={<SprintPage />} />
      <Route path="/project-setup" element={<ProjectSetupPage />} />
      <Route path="/employee" element={<EmployeePage />} />
      <Route path="/bugs" element={<BugPage />} />
      <Route path="/audit" element={<AuditPage />} />
    </Routes>
  );
}