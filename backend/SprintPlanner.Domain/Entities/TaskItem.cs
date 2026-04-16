using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace SprintPlanner.Domain.Entities;

[Table("tasks")] // 🔥 table name
public class TaskItem
{
    [Key]
    [Column("id")]
    public int Id { get; set; }

    [Column("sprint_id")]
    public int SprintId { get; set; }


    [Required]
    [MaxLength(200)]
    [Column("title")]
    public string Title { get; set; } = "";

    [Column("description")]
    public string Description { get; set; } = "";

    [Column("status")]
    public string Status { get; set; } = "";

    [Column("priority")]
    public string Priority { get; set; } = "";

    [Column("story_points")]
    public int StoryPoints { get; set; }

    [Column("start_date")]
    public DateOnly? StartDate { get; set; }

    [Column("end_date")]
    public DateOnly? EndDate { get; set; }

    [Column("assigned_to")]
    public int? AssignedTo { get; set; }

    // 🔗 Navigation
    [ForeignKey("AssignedTo")]
    public Employee? Assignee { get; set; }

    [Column("created_at")]
    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;

    [Column("updated_at")]
    public DateTime? UpdatedAt { get; set; }
}