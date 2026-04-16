public class NotificationResponseDto
{
    public int Id { get; set; }
    public int EmployeeId { get; set; }
    public string EmployeeName { get; set; } = "";
    public string Type { get; set; } = ""; // "task_assigned" or "bug_assigned"
    public int? TaskId { get; set; }
    public int? BugId { get; set; }
    public string? TaskTitle { get; set; }
    public string? BugTitle { get; set; }
    public string Message { get; set; } = "";
    public bool IsRead { get; set; }
    public DateTime CreatedAt { get; set; }
}
