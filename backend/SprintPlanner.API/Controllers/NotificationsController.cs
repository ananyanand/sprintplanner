using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using SprintPlanner.Application.Interfaces;

[ApiController]
[Authorize]
[Route("api/notifications")]
public class NotificationsController : ControllerBase
{
    private readonly INotificationService _service;

    public NotificationsController(INotificationService service)
    {
        _service = service;
    }

    // ✅ GET ALL NOTIFICATIONS
    [HttpGet("employee/{employeeId}")]
    public async Task<IActionResult> GetByEmployeeId(int employeeId)
    {
        var result = await _service.GetByEmployeeIdAsync(employeeId);
        return Ok(result);
    }

    // ✅ GET UNREAD NOTIFICATIONS
    [HttpGet("unread/{employeeId}")]
    public async Task<IActionResult> GetUnread(int employeeId)
    {
        var result = await _service.GetUnreadByEmployeeIdAsync(employeeId);
        return Ok(result);
    }

    // ✅ MARK ALL AS READ (More specific route first!)
    [HttpPut("employee/{employeeId}/read-all")]
    public async Task<IActionResult> MarkAllAsRead(int employeeId)
    {
        await _service.MarkAllAsReadAsync(employeeId);
        return Ok();
    }

    // ✅ MARK AS READ
    [HttpPut("{notificationId}/read")]
    public async Task<IActionResult> MarkAsRead(int notificationId)
    {
        await _service.MarkAsReadAsync(notificationId);
        return Ok();
    }

    // ✅ DELETE ALL NOTIFICATIONS (More specific route first!)
    [HttpDelete("employee/{employeeId}")]
    public async Task<IActionResult> DeleteAll(int employeeId)
    {
        await _service.DeleteAllByEmployeeIdAsync(employeeId);
        return Ok(new { message = "All notifications deleted successfully" });
    }

    // ✅ DELETE NOTIFICATION
    [HttpDelete("{notificationId}")]
    public async Task<IActionResult> Delete(int notificationId)
    {
        await _service.DeleteAsync(notificationId);
        return Ok(new { message = "Notification deleted successfully" });
    }
}
