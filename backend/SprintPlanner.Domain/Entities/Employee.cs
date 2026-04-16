using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace SprintPlanner.Domain.Entities;


[Table("employees")]
public class Employee
{
    [Key]
    [Column("id")]
    public int Id { get; set; }

    [Column("name")]
    public string Name { get; set; } = "";

    [Column("role")]
    public string Role { get; set; } = "";

    [Column("created_at")]
    public DateTime CreatedAt { get; set; }

}