using SprintPlanner.Domain.Entities;
using SprintPlanner.Domain.Interfaces;
using SprintPlanner.Infrastructure;
using Microsoft.EntityFrameworkCore;

namespace SprintPlanner.Infrastructure.Repository;

public class NotificationRepository : INotificationRepository
{
    private readonly AppDbContext _context;

    public NotificationRepository(AppDbContext context)
    {
        _context = context;
    }

    public async Task<List<Notification>> GetByEmployeeIdAsync(int employeeId)
    {
        return await _context.Notifications
            .Include(n => n.Employee)
            .Include(n => n.Task)
            .Include(n => n.Bug)
            .Where(n => n.EmployeeId == employeeId)
            .OrderByDescending(n => n.CreatedAt)
            .ToListAsync();
    }

    public async Task<List<Notification>> GetUnreadByEmployeeIdAsync(int employeeId)
    {
        return await _context.Notifications
            .Include(n => n.Employee)
            .Include(n => n.Task)
            .Include(n => n.Bug)
            .Where(n => n.EmployeeId == employeeId && !n.IsRead)
            .OrderByDescending(n => n.CreatedAt)
            .ToListAsync();
    }

    public async Task<Notification?> GetByIdAsync(int id)
    {
        return await _context.Notifications
            .Include(n => n.Employee)
            .Include(n => n.Task)
            .Include(n => n.Bug)
            .FirstOrDefaultAsync(n => n.Id == id);
    }

    public async Task AddAsync(Notification notification)
    {
        await _context.Notifications.AddAsync(notification);
        await _context.SaveChangesAsync();
    }

   public async Task UpdateAsync(Notification notification)
    {
        // 🔥 FIX: Force UTC before saving
        notification.CreatedAt = DateTime.SpecifyKind(
            notification.CreatedAt,
            DateTimeKind.Utc
        );

        _context.Notifications.Update(notification);
        await _context.SaveChangesAsync();
    }
    public async Task DeleteAsync(Notification notification)
    {
        _context.Notifications.Remove(notification);
        await _context.SaveChangesAsync();
    }

    public async Task DeleteAllByEmployeeIdAsync(int employeeId)
    {
        var notifications = await _context.Notifications
            .Where(n => n.EmployeeId == employeeId)
            .ToListAsync();

        _context.Notifications.RemoveRange(notifications);
        await _context.SaveChangesAsync();
    }
}
