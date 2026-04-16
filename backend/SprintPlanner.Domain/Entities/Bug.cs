using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace SprintPlanner.Domain.Entities;

[Table("bugs")] // 🔥 table name
public class Bug
{
    [Key]
    [Column("id")]
    public int Id { get; set; }

    // 🔗 Project FK
    [Column("project_id")]
    public int ProjectId { get; set; }

    [ForeignKey("ProjectId")]
    public Project? Project { get; set; } = null!;

    // 🔥 Fields
    [Required]
    [MaxLength(200)]
    [Column("title")]
    public string Title { get; set; } = "";

    [Column("description")]
    public string Description { get; set; } = "";

    [Column("severity")]
    public string Severity { get; set; } = "";

    [Column("status")]
    public string Status { get; set; } = "";

    // 🔗 Assignee FK
    [Column("assigned_to")]
    public int? AssignedTo { get; set; }

    [ForeignKey("AssignedTo")]
    public Employee? Assignee { get; set; }

    // 📅 Dates
    [Column("due_date")]
    public DateTime? DueDate { get; set; }

    [Column("created_at")]
    public DateTime CreatedAt { get; set; } = DateTime.UtcNow; // ✅ FIXED
}