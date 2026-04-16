public class UpdateBugDto
{
    public string? Title { get; set; }
    public string? Description { get; set; }
    public string? Severity { get; set; }
    public string? Status { get; set; }
    public int? AssignedTo { get; set; }
    public DateTime? DueDate { get; set; }
}
