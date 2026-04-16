import { useState, useEffect } from "react";
import Sidebar from "../../pages/Sidebar";
import Button from "../ui/Button";
import { Bell, Settings, User as UserIcon } from "lucide-react";
import { useNavigate } from "react-router-dom";
import NotificationModal from "../Notifications/NotificationModal";
import { notificationApi } from "../../services/notificationService";
import { getEmployeeByUsername } from "../../services/employeeServices";
import { Sun, Sunrise, Moon } from "lucide-react";

type Props = {
  children: React.ReactNode;
};

export default function AppLayout({ children }: Props) {
  const [notificationOpen, setNotificationOpen] = useState(false);
  const [unreadCount, setUnreadCount] = useState(0);
  const [employeeId, setEmployeeId] = useState<number | null>(null);

  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return "Good morning";
    if (hour < 18) return "Good afternoon";
    return "Good evening";
  };

const getGreetingIcon = () => {
  const hour = new Date().getHours();

  if (hour < 6) return <Moon size={20} />;
  if (hour < 12) return <Sunrise size={20} />;
  if (hour < 18) return <Sun size={20} />;
  return <Moon size={20} />;
};
  const navigate = useNavigate();

  // ✅ LOAD EMPLOYEE ID FROM USERNAME
  useEffect(() => {
    const loadEmployeeId = async () => {
      try {
        const username = localStorage.getItem("username");
        if (!username) return;

        // 🔥 Fetch employee data by username
        const response = await getEmployeeByUsername(username);
        const empId = response.data?.id;

        if (empId) {
          // ✅ Store employeeId in localStorage
          localStorage.setItem("employeeId", empId.toString());
          setEmployeeId(empId);
          loadUnreadCount(empId);

          // 🔄 Check for new notifications every 30 seconds
          const interval = setInterval(() => {
            loadUnreadCount(empId);
          }, 30000);

          return () => clearInterval(interval);
        }
      } catch (err) {
        console.error("Failed to load employee ID:", err);
      }
    };

    loadEmployeeId();
  }, []);

  // ✅ LOAD UNREAD COUNT
  const loadUnreadCount = async (empId: number) => {
    try {
      const notifications = await notificationApi.getUnread(empId);
      setUnreadCount(notifications.length);

      // 🔔 Show popup if there are unread notifications
      if (notifications.length > 0 && !notificationOpen) {
        setNotificationOpen(true);
      }
    } catch (err) {
      console.error("Failed to load unread count:", err);
    }
  };

  const handleLogout = () => {
    // 🧹 Clear session (important)
    localStorage.removeItem("username");
    localStorage.removeItem("employeeId");
    localStorage.removeItem("token"); // if you use JWT

    // 🔁 Redirect to login
    navigate("/login");
  };


  return (
    <div className="flex h-screen bg-background text-text overflow-hidden">
      {/* Sidebar */}
      <Sidebar />

      {/* Main Content */}
      <div className="flex flex-col flex-1 min-w-0">
        {/* Header */}
        <header className="h-20 px-8 border-b border-primary/10 flex items-center justify-between bg-gradient-to-r from-white via-white to-slate-50 backdrop-blur-sm shadow-sm">
          {/* Left - Greeting */}
          <div className="flex flex-col gap-1">
           <h2 className="flex items-center gap-2 text-2xl font-bold">
                <span className="bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
                  {getGreeting()}
                </span>

                {getGreetingIcon()}
              </h2>
           </div>

          {/* Right - Actions */}
          <div className="flex items-center gap-4">
            {/* Notification */}
            <button
              onClick={() => setNotificationOpen(true)}
              className="p-2.5 rounded-lg hover:bg-primary/10 text-secondary hover:text-primary transition-all relative group"
            >
              <Bell size={20} />
              {unreadCount > 0 && (
                <>
                  <span className="absolute top-2 right-2 w-2 h-2 rounded-full bg-red-500 shadow-lg animate-pulse" />
                  <span className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 text-white text-[10px] font-bold rounded-full flex items-center justify-center">
                    {unreadCount > 9 ? "9+" : unreadCount}
                  </span>
                </>
              )}
              <div className="absolute right-0 top-12 w-48 bg-white rounded-lg shadow-lg border border-primary/10 p-3 opacity-0 group-hover:opacity-100 transition-opacity z-50 pointer-events-none">
                <p className="text-xs font-medium text-primary mb-2">Notifications</p>
                <p className="text-xs text-secondary">
                  {unreadCount > 0 ? `${unreadCount} unread` : "No new notifications"}
                </p>
              </div>
            </button>

            {/* Settings */}
            <button className="p-2.5 rounded-lg hover:bg-primary/10 text-secondary hover:text-primary transition-all">
              <Settings size={20} />
            </button>

            {/* Profile */}
            <div className="w-px h-8 bg-primary/20" />

            <div className="flex items-center gap-3">
              <div className="flex flex-col items-end gap-0.5">
                <p className="text-sm font-semibold text-primary">User</p>
                <p className="text-xs text-secondary">Admin</p>
              </div>

              <button className="p-2 rounded-lg bg-gradient-to-br from-primary/20 to-accent/20 hover:from-primary/30 hover:to-accent/30 transition-all border border-primary/20">
                <UserIcon size={18} className="text-primary" />
              </button>
            </div>

            {/* Logout */}
            <Button
                variant="outline"
                className="ml-2"
                onClick={handleLogout}
              >
                Logout
              </Button>
          </div>
        </header>

        {/* Content Area */}
        <main className="flex-1 overflow-y-auto bg-gradient-to-br from-background via-white to-slate-50 px-8 py-6">
          {children}
        </main>
      </div>

      {/* Notification Modal */}
      {employeeId && (
        <NotificationModal
          employeeId={employeeId}
          isOpen={notificationOpen}
          onClose={() => setNotificationOpen(false)}
          onNotificationsUpdate={setUnreadCount}
        />
      )}
    </div>
  );
}