namespace SprintPlanner.Domain.Entities;

public class AuditLog
{
    public int Id { get; set; }

    public int? UserId { get; set; }
    public Employee? User { get; set; }

    public string Action { get; set; } = "";
    public string Entity { get; set; } = "";

    public int EntityId { get; set; }

    public string Details { get; set; } = "";

    public DateTime CreatedAt { get; set; }
}