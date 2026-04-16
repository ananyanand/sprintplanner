public class BugDto
{
    public int Id { get; set; }

    public int ProjectId { get; set; }
    public string ProjectName { get; set; } = "";

    public string Title { get; set; } = "";
    public string Description { get; set; } = "";

    public string Severity { get; set; } = "";
    public string Status { get; set; } = "";

    public int? AssignedTo { get; set; }
    public string? AssigneeName { get; set; }

    public DateTime? DueDate { get; set; }
    public DateTime CreatedAt { get; set; }
}