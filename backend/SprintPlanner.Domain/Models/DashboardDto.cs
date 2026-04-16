public class DashboardDto
{
    public int EmployeeId { get; set; }
    public string Name { get; set; } = "";

    // 🔹 Task Stats
    public int TotalTasks { get; set; }
    public int CompletedTasks { get; set; }
    public int InProgressTasks { get; set; }

    // 🔹 Bug Stats
    public int TotalBugs { get; set; }
    public int OpenBugs { get; set; }
    public int CriticalBugs { get; set; }

    // 🔹 Sprint
    public string SprintName { get; set; } = "";
    public double SprintProgress { get; set; } // %

    // 🔹 Quick Stats
    public int CompletedToday { get; set; }
    public int DueThisWeek { get; set; }

    // 🔹 Table Data
    public List<DashboardItemDto> Items { get; set; } = new();
}

public class DashboardItemDto
{
    public string Title { get; set; } = "";
    public string Type { get; set; } = ""; // Task / Bug
    public string Status { get; set; } = "";
    public string DueDate { get; set; } = "";
}