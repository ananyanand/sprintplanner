using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace SprintPlanner.Domain.Entities;

[Table("sprints")] // 🔥 FIX
public class Sprint
{
    [Key]
    [Column("id")]
    public int Id { get; set; }

    [Column("project_id")]
    public int ProjectId { get; set; }

    public Project Project { get; set; } = null!;

    [Column("name")]
    public string Name { get; set; } = "";

    [Column("start_date")]
    public DateOnly StartDate { get; set; }

    [Column("end_date")]
    public DateOnly EndDate { get; set; }

    [Column("goal")]
    public string Goal { get; set; } = "";

    [Column("status")]
    public string Status { get; set; } = "planned";

    [Column("created_at")]
    public DateTime CreatedAt { get; set; } 

}