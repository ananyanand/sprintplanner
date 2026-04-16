public class CreateTaskDto
{
    public int SprintId { get; set; }
    public string Title { get; set; } = "";
    public string Description { get; set; } = "";
    public string Status { get; set; } = "todo";
    public string Priority { get; set; } = "Medium";
    public int StoryPoints { get; set; }
    public DateOnly? StartDate { get; set; }
    public DateOnly? EndDate { get; set; }
    public int? AssignedTo { get; set; }
}