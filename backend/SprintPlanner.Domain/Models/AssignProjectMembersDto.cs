public class AssignProjectMembersDto
{
    public int ProjectId { get; set; }
    public List<int> EmployeeIds { get; set; } = new();
}