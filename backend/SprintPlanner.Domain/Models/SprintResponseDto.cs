public class SprintResponseDto
{
    public int Id { get; set; }
    public string Name { get; set; } = "";
    public DateOnly StartDate { get; set; }
    public DateOnly EndDate { get; set; }
    public string Goal { get; set; } = "";
    public string Status { get; set; } = "";
}