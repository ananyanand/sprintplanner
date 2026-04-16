public class DashboardService : IDashboardService
{
    private readonly IUserRepository _userRepo;
    private readonly IEmployeeRepository _employeeRepo;
    private readonly ITaskRepository _taskRepo;
    private readonly IBugRepository _bugRepo;
    private readonly ISprintRepository _sprintRepo;

    public DashboardService(
        IUserRepository userRepo,
        IEmployeeRepository employeeRepo,
        ITaskRepository taskRepo,
        IBugRepository bugRepo,
        ISprintRepository sprintRepo)
    {
        _userRepo = userRepo;
        _employeeRepo = employeeRepo;
        _taskRepo = taskRepo;
        _bugRepo = bugRepo;
        _sprintRepo = sprintRepo;
    }

    public async Task<DashboardDto?> GetDashboardByUsernameAsync(string username)
    {
        var user = await _userRepo.GetByUsernameAsync(username);
        if (user == null || user.EmployeeId == null)
            return null;

        var employeeId = user.EmployeeId.Value;

        var employee = await _employeeRepo.GetByIdAsync(employeeId);
        if (employee == null)
            return null;

        var tasks = await _taskRepo.GetByEmployeeAsync(employeeId);
        var bugs = await _bugRepo.GetByEmployeeAsync(employeeId);
        var sprint = await _sprintRepo.GetActiveSprintAsync();

        // 🔥 TASK CALCULATIONS
        var totalTasks = tasks.Count;
        var completedTasks = tasks.Count(t => t.Status == "done");
        var inProgressTasks = tasks.Count(t => t.Status == "in progress");

        // 🔥 BUG CALCULATIONS
        var totalBugs = bugs.Count;
        var openBugs = bugs.Count(b => b.Status != "closed");
        var criticalBugs = bugs.Count(b => b.Severity == "Critical");

        // 🔥 FIXED (NULL SAFE)
        var completedToday = tasks.Count(t =>
            t.Status == "done" &&
            t.UpdatedAt.HasValue &&
            t.UpdatedAt.Value.Date == DateTime.UtcNow.Date
        );

        var dueThisWeek = tasks.Count(t =>
            t.EndDate.HasValue &&
            t.EndDate.Value <= DateOnly.FromDateTime(DateTime.UtcNow.AddDays(7))
        );

      double sprintProgress = 0;

            if (sprint != null)
            {
                var totalDays = sprint.EndDate.DayNumber - sprint.StartDate.DayNumber;

                var today = DateOnly.FromDateTime(DateTime.UtcNow);
                var elapsedDays = today.DayNumber - sprint.StartDate.DayNumber;

                sprintProgress = totalDays > 0
                    ? Math.Min(100, Math.Max(0, (elapsedDays * 100.0) / totalDays))
                    : 0;
            } // The result of the expression is always the same since a value of this type is never equal to 'null'

        // 🔥 MERGED DATA
        var items = new List<DashboardItemDto>();

        items.AddRange(tasks.Select(t => new DashboardItemDto
        {
            Title = t.Title,
            Type = "Task",
            Status = t.Status,
            DueDate = t.EndDate?.ToString("yyyy-MM-dd") ?? ""
        }));

        items.AddRange(bugs.Select(b => new DashboardItemDto
        {
            Title = b.Title,
            Type = "Bug",
            Status = b.Status,
            DueDate = b.DueDate?.ToString("yyyy-MM-dd") ?? ""
        }));

        return new DashboardDto
        {
            EmployeeId = employee.Id,
            Name = employee.Name,

            TotalTasks = totalTasks,
            CompletedTasks = completedTasks,
            InProgressTasks = inProgressTasks,

            TotalBugs = totalBugs,
            OpenBugs = openBugs,
            CriticalBugs = criticalBugs,

            SprintName = sprint?.Name ?? "Sprint",
            SprintProgress = sprintProgress,

            CompletedToday = completedToday,
            DueThisWeek = dueThisWeek,

            Items = items
        };
    }
}