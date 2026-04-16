public class TaskResponseDto
{
    public int Id { get; set; }
    public int SprintId { get; set; }
    public string Title { get; set; } = "";
    public string Description { get; set; } = "";
    public string Status { get; set; } = "";
    public string Priority { get; set; } = "";
    public int StoryPoints { get; set; }
    public DateOnly? StartDate { get; set; }
    public DateOnly? EndDate { get; set; }

    public int? AssignedTo { get; set; }
    public string? AssigneeName { get; set; }
}