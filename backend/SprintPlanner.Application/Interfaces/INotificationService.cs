namespace SprintPlanner.Application.Interfaces;

public interface INotificationService
{
    Task<List<NotificationResponseDto>> GetByEmployeeIdAsync(int employeeId);
    Task<List<NotificationResponseDto>> GetUnreadByEmployeeIdAsync(int employeeId);
    Task MarkAsReadAsync(int notificationId);
    Task MarkAllAsReadAsync(int employeeId);
    Task DeleteAsync(int notificationId);
    Task DeleteAllByEmployeeIdAsync(int employeeId);
    Task CreateTaskAssignmentNotificationAsync(int employeeId, int taskId, string taskTitle, string assignedByName);
    Task CreateBugAssignmentNotificationAsync(int employeeId, int bugId, string bugTitle, string assignedByName);
}
