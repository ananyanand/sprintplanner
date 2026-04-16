using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace SprintPlanner.Domain.Entities;

[Table("reminders")] // 🔥 table name (matches PostgreSQL)
public class Reminder
{
    [Key]
    [Column("id")]
    public int Id { get; set; }

    [Required]
    [Column("employee_id")]
    public int EmployeeId { get; set; }
    
    public Employee Employee { get; set; } = null!;

    [Required]
    [MaxLength(255)]
    [Column("title")]
    public string Title { get; set; } = "";

    [Column("due_date")]
    [MaxLength(50)]
    public string DueDate { get; set; } = "";

    [Required]
    [MaxLength(20)]
    [Column("priority")]
    public string Priority { get; set; } = "medium";

    [Column("completed")]
    public bool Completed { get; set; }

    [Column("created_at")]
    public DateTime CreatedAt { get; set; }
}