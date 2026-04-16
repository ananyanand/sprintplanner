using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using SprintPlanner.Domain.Entities;

[Table("project_members")]
public class ProjectMember
{
    [Key]
    [Column("id")] // 🔥 FIX
    public int Id { get; set; }

    [Column("project_id")] // 🔥 FIX
    public int ProjectId { get; set; }

    public Project Project { get; set; } = null!;

    [Column("employee_id")] // 🔥 FIX
    public int EmployeeId { get; set; }

    public Employee Employee { get; set; } = null!;
}