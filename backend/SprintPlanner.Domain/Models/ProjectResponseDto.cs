public class ProjectResponseDto
{
    public int Id { get; set; }
    public string Name { get; set; } = "";
    public DateOnly? StartDate { get; set; }
    public DateOnly? EndDate { get; set; }
    public int SprintDuration { get; set; }
}