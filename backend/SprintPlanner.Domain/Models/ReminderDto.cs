public class ReminderDto
{
    public int Id { get; set; }

    public int EmployeeId { get; set; }

    public string Title { get; set; } = "";
    public string DueDate { get; set; } = "";

    public string Priority { get; set; } = "medium";
    public bool Completed { get; set; }
}