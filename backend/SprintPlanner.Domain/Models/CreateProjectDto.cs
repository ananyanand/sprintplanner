public class CreateProjectDto
{
    public string Name { get; set; } = "";
    public DateOnly StartDate { get; set; }
    public DateOnly EndDate { get; set; }
    public int SprintDuration { get; set; }
}