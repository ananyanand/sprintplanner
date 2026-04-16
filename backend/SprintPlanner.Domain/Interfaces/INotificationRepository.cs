using SprintPlanner.Domain.Entities;

namespace SprintPlanner.Domain.Interfaces;

public interface INotificationRepository
{
    Task<List<Notification>> GetByEmployeeIdAsync(int employeeId);
    Task<List<Notification>> GetUnreadByEmployeeIdAsync(int employeeId);
    Task<Notification?> GetByIdAsync(int id);
    Task AddAsync(Notification notification);
    Task UpdateAsync(Notification notification);
    Task DeleteAsync(Notification notification);
    Task DeleteAllByEmployeeIdAsync(int employeeId);
}
