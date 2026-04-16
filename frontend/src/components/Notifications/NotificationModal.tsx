import { useState, useEffect } from "react";
import { X, CheckCircle2, AlertCircle } from "lucide-react";
import Button from "../ui/Button";
import { notificationApi, type Notification } from "../../services/notificationService";

type Props = {
  employeeId: number;
  isOpen: boolean;
  onClose: () => void;
  onNotificationsUpdate?: (count: number) => void;
};

export default function NotificationModal({
  employeeId,
  isOpen,
  onClose,
  onNotificationsUpdate,
}: Props) {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [loading, setLoading] = useState(false);

  // ✅ LOAD NOTIFICATIONS
  const loadNotifications = async () => {
    try {
      setLoading(true);
      const data = await notificationApi.getAll(employeeId);
      setNotifications(data);
      if (onNotificationsUpdate) {
        const unreadCount = data.filter((n: Notification) => !n.isRead).length;
        onNotificationsUpdate(unreadCount);
      }
    } catch (err) {
      console.error("Failed to load notifications:", err);
    } finally {
      setLoading(false);
    }
  };

  // ✅ MARK AS READ
  const handleMarkAsRead = async (id: number) => {
    try {
      await notificationApi.markAsRead(id);
      setNotifications((prev) =>
        prev.map((n) => (n.id === id ? { ...n, isRead: true } : n))
      );
      loadNotifications();
    } catch (err) {
      console.error("Failed to mark as read:", err);
    }
  };

  // ✅ DELETE NOTIFICATION
  const handleDelete = async (id: number) => {
    try {
      await notificationApi.delete(id);
      setNotifications((prev) => prev.filter((n) => n.id !== id));
      loadNotifications();
    } catch (err) {
      console.error("Failed to delete notification:", err);
    }
  };

  // ✅ MARK ALL AS READ
  const handleMarkAllAsRead = async () => {
    try {
      await notificationApi.markAllAsRead(employeeId);
      setNotifications((prev) => prev.map((n) => ({ ...n, isRead: true })));
      loadNotifications();
    } catch (err) {
      console.error("Failed to mark all as read:", err);
    }
  };

  useEffect(() => {
    if (isOpen) {
      loadNotifications();
    }
  }, [isOpen]);

  const unreadCount = notifications.filter((n) => !n.isRead).length;

  if (!isOpen) return null;

  return (
    <>
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/50 z-40"
        onClick={onClose}
      />

      {/* Modal */}
      <div className="fixed right-8 top-24 w-96 bg-white rounded-2xl shadow-2xl border border-primary/10 z-50 max-h-[600px] flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-primary/10">
          <div>
            <h3 className="text-lg font-semibold text-primary">
              Notifications
            </h3>
            {unreadCount > 0 && (
              <p className="text-xs text-secondary mt-0.5">
                {unreadCount} unread
              </p>
            )}
          </div>

          <button
            onClick={onClose}
            className="p-1 hover:bg-primary/10 rounded-lg transition-colors"
          >
            <X size={20} className="text-secondary" />
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto">
          {loading ? (
            <div className="p-8 text-center">
              <p className="text-sm text-secondary">Loading...</p>
            </div>
          ) : notifications.length === 0 ? (
            <div className="p-8 text-center">
              <p className="text-sm text-secondary">No notifications yet</p>
            </div>
          ) : (
            <div className="divide-y divide-primary/5">
              {notifications.map((notification) => (
                <div
                  key={notification.id}
                  className={`p-4 hover:bg-primary/5 transition-colors cursor-pointer ${
                    !notification.isRead ? "bg-accent/5" : ""
                  }`}
                >
                  <div className="flex gap-3">
                    {/* Icon */}
                    <div className="flex-shrink-0 mt-1">
                      {notification.type === "task_assigned" ? (
                        <CheckCircle2
                          size={20}
                          className="text-blue-500"
                        />
                      ) : (
                        <AlertCircle
                          size={20}
                          className="text-red-500"
                        />
                      )}
                    </div>

                    {/* Content */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between gap-2">
                        <div className="flex-1">
                          <p className="text-sm font-medium text-primary">
                            {notification.type === "task_assigned"
                              ? "Task Assigned"
                              : "Bug Assigned"}
                          </p>
                          <p className="text-xs text-secondary mt-0.5">
                            {notification.message}
                          </p>
                          {notification.taskTitle && (
                            <p className="text-xs font-medium text-primary mt-1">
                              {notification.taskTitle}
                            </p>
                          )}
                          {notification.bugTitle && (
                            <p className="text-xs font-medium text-primary mt-1">
                              {notification.bugTitle}
                            </p>
                          )}
                        </div>

                        {!notification.isRead && (
                          <div className="w-2 h-2 rounded-full bg-blue-500 flex-shrink-0 mt-1" />
                        )}
                      </div>

                      <p className="text-[10px] text-secondary mt-2">
                        {new Date(notification.createdAt).toLocaleDateString()} at{" "}
                        {new Date(notification.createdAt).toLocaleTimeString([], {
                          hour: "2-digit",
                          minute: "2-digit",
                        })}
                      </p>

                      {/* Actions */}
                      <div className="flex gap-2 mt-2">
                        {!notification.isRead && (
                          <button
                            onClick={() => handleMarkAsRead(notification.id)}
                            className="text-[11px] px-2 py-1 rounded hover:bg-blue-100 text-blue-600 font-medium transition-colors"
                          >
                            Mark as read
                          </button>
                        )}
                        <button
                          onClick={() => handleDelete(notification.id)}
                          className="text-[11px] px-2 py-1 rounded hover:bg-red-100 text-red-600 font-medium transition-colors"
                        >
                          Delete
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Footer */}
        {notifications.length > 0 && (
          <div className="border-t border-primary/10 p-3 flex gap-2">
            <Button
              variant="outline"
              onClick={handleMarkAllAsRead}
              className="flex-1"
            >
              Mark all as read
            </Button>
          </div>
        )}
      </div>
    </>
  );
}
