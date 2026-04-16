using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace SprintPlanner.Domain.Entities;

[Table("notifications")]
public class Notification
{
    [Key]
    [Column("id")]
    public int Id { get; set; }

    [Column("employee_id")]
    public int EmployeeId { get; set; }

    [Required]
    [MaxLength(50)]
    [Column("type")] // "task_assigned" or "bug_assigned"
    public string Type { get; set; } = "";

    [Column("task_id")]
    public int? TaskId { get; set; }

    [Column("bug_id")]
    public int? BugId { get; set; }

    [Required]
    [MaxLength(500)]
    [Column("message")]
    public string Message { get; set; } = "";

    [Column("is_read")]
    public bool IsRead { get; set; } = false;

    [Column("created_at")]
    public DateTime CreatedAt { get; set; }

    // 🔗 Navigation
    [ForeignKey("EmployeeId")]
    public Employee? Employee { get; set; }

    [ForeignKey("TaskId")]
    public TaskItem? Task { get; set; }

    [ForeignKey("BugId")]
    public Bug? Bug { get; set; }
}
