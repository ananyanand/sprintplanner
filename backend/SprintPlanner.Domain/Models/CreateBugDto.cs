public class CreateBugDto
{
    public int ProjectId { get; set; }

    public string Title { get; set; } = "";
    public string Description { get; set; } = "";

    public string Severity { get; set; } = "";
    public string Status { get; set; } = "";

    public int? AssignedTo { get; set; }
    public DateTime? DueDate { get; set; }
}