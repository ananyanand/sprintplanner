using SprintPlanner.Application.Interfaces;
using SprintPlanner.Domain.Entities;
using SprintPlanner.Domain.Interfaces;

namespace SprintPlanner.Application.Services;

public class NotificationService : INotificationService
{
    private readonly INotificationRepository _repo;

    public NotificationService(INotificationRepository repo)
    {
        _repo = repo;
    }

    // ✅ GET ALL NOTIFICATIONS BY EMPLOYEE
    public async Task<List<NotificationResponseDto>> GetByEmployeeIdAsync(int employeeId)
    {
        var notifications = await _repo.GetByEmployeeIdAsync(employeeId);
        return notifications.Select(Map).ToList();
    }

    // ✅ GET UNREAD NOTIFICATIONS
    public async Task<List<NotificationResponseDto>> GetUnreadByEmployeeIdAsync(int employeeId)
    {
        var notifications = await _repo.GetUnreadByEmployeeIdAsync(employeeId);
        return notifications.Select(Map).ToList();
    }

    // ✅ MARK AS READ
    public async Task MarkAsReadAsync(int notificationId)
    {
        var notification = await _repo.GetByIdAsync(notificationId);
        if (notification == null)
            throw new Exception("Notification not found");

        notification.IsRead = true;
        await _repo.UpdateAsync(notification);
    }

    // ✅ MARK ALL AS READ
    public async Task MarkAllAsReadAsync(int employeeId)
    {
        var notifications = await _repo.GetByEmployeeIdAsync(employeeId);
        foreach (var notification in notifications)
        {
            notification.IsRead = true;
            await _repo.UpdateAsync(notification);
        }
    }

    // ✅ DELETE
    public async Task DeleteAsync(int notificationId)
    {
        var notification = await _repo.GetByIdAsync(notificationId);
        if (notification == null)
            throw new Exception("Notification not found");

        await _repo.DeleteAsync(notification);
    }

    // ✅ DELETE ALL
    public async Task DeleteAllByEmployeeIdAsync(int employeeId)
    {
        await _repo.DeleteAllByEmployeeIdAsync(employeeId);
    }

    // ✅ CREATE TASK ASSIGNMENT NOTIFICATION
    public async Task CreateTaskAssignmentNotificationAsync(
        int employeeId,
        int taskId,
        string taskTitle,
        string assignedByName)
    {
        var notification = new Notification
        {
            EmployeeId = employeeId,
            Type = "task_assigned",
            TaskId = taskId,
            Message = $"You have been assigned a task ",
            IsRead = false,
            CreatedAt = DateTime.UtcNow
        };

        await _repo.AddAsync(notification);
    }

    // ✅ CREATE BUG ASSIGNMENT NOTIFICATION
    public async Task CreateBugAssignmentNotificationAsync(
        int employeeId,
        int bugId,
        string bugTitle,
        string assignedByName)
    {
        var notification = new Notification
        {
            EmployeeId = employeeId,
            Type = "bug_assigned",
            BugId = bugId,
            Message = $"You have been assigned a bug ",
            IsRead = false,
            CreatedAt = DateTime.UtcNow
        };

        await _repo.AddAsync(notification);
    }

    // 🔥 MAPPER
    private NotificationResponseDto Map(Notification n) => new()
    {
        Id = n.Id,
        EmployeeId = n.EmployeeId,
        EmployeeName = n.Employee?.Name ?? "",
        Type = n.Type,
        TaskId = n.TaskId,
        BugId = n.BugId,
        TaskTitle = n.Task?.Title,
        BugTitle = n.Bug?.Title,
        Message = n.Message,
        IsRead = n.IsRead,
        CreatedAt = n.CreatedAt
    };
}
