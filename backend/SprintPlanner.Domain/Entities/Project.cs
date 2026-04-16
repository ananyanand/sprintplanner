using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace SprintPlanner.Domain.Entities;

[Table("projects")] // 🔥 table name
public class Project
{
    [Key]
    [Column("id")]
    public int Id { get; set; }

    [Required]
    [MaxLength(100)]
    [Column("name")]
    public string Name { get; set; } = "";

   [Column("start_date")]
    public DateOnly? StartDate { get; set; }

    [Column("end_date")]
    public DateOnly? EndDate { get; set; }

    [Column("sprint_duration")]
    public int SprintDuration { get; set; }

    [Column("created_at")]
    public DateTime CreatedAt { get; set; }

}