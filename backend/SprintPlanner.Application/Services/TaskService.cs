using SprintPlanner.Domain.Entities;
using SprintPlanner.Application.Interfaces;

public class TaskService : ITaskService
{
    private readonly ITaskRepository _repo;
    private readonly INotificationService _notificationService;
    private readonly IEmployeeRepository _employeeRepository;

    public TaskService(ITaskRepository repo, INotificationService notificationService, IEmployeeRepository employeeRepository)
    {
        _repo = repo;
        _notificationService = notificationService;
        _employeeRepository = employeeRepository;
    }

    // ✅ CREATE
    public async Task<TaskResponseDto> CreateAsync(CreateTaskDto dto)
    {
        var task = new TaskItem
        {
            SprintId = dto.SprintId,
            Title = dto.Title,
            Description = dto.Description,
            Status = dto.Status,
            Priority = dto.Priority,
            StoryPoints = dto.StoryPoints,
            StartDate = dto.StartDate,
            EndDate = dto.EndDate,
            AssignedTo = dto.AssignedTo,
            CreatedAt = DateTime.UtcNow
        };

        await _repo.AddAsync(task);

        // 🔥 CREATE NOTIFICATION if task is assigned
        if (dto.AssignedTo.HasValue)
        {
            var assignee = await _employeeRepository.GetByIdAsync(dto.AssignedTo.Value);
            if (assignee != null)
            {
                await _notificationService.CreateTaskAssignmentNotificationAsync(
                    employeeId: dto.AssignedTo.Value,
                    taskId: task.Id,
                    taskTitle: task.Title,
                    assignedByName: "System" // 🔥 Get current user name if available
                );
            }
        }

        return Map(task);
    }

    // ✅ GET BY SPRINT
    public async Task<List<TaskResponseDto>> GetBySprintIdAsync(int sprintId)
    {
        var tasks = await _repo.GetBySprintIdAsync(sprintId);
        return tasks.Select(Map).ToList();
    }

    // ✅ DELETE
    public async Task DeleteAsync(int id)
    {
        var task = await _repo.GetByIdAsync(id);

        if (task == null)
            throw new Exception("Task not found");

        await _repo.DeleteAsync(task);
    }

    // 🔥 MAPPER
    private TaskResponseDto Map(TaskItem t) => new()
    {
        Id = t.Id,
        SprintId = t.SprintId,
        Title = t.Title,
        Description = t.Description,
        Status = t.Status,
        Priority = t.Priority,
        StoryPoints = t.StoryPoints,
        StartDate = t.StartDate,
        EndDate = t.EndDate,
        AssignedTo = t.AssignedTo,
        AssigneeName = t.Assignee?.Name // 🔥 from Employee table
    };

    // ✅ UPDATE (All Fields)
    public async Task<TaskResponseDto> UpdateAsync(int id, UpdateTaskDto dto)
    {
        var task = await _repo.GetByIdAsync(id);

        if (task == null)
            throw new Exception("Task not found");

        // 🔥 Check if assignee is being changed
        bool assigneeChanged = dto.AssignedTo.HasValue && task.AssignedTo != dto.AssignedTo.Value;
        int? oldAssignee = task.AssignedTo;

        // ✅ Update only provided fields
        if (dto.Title != null)
            task.Title = dto.Title;

        if (dto.Description != null)
            task.Description = dto.Description;

        if (dto.Status != null)
            task.Status = dto.Status;

        if (dto.Priority != null)
            task.Priority = dto.Priority;

        if (dto.StoryPoints.HasValue)
            task.StoryPoints = dto.StoryPoints.Value;

        if (dto.StartDate.HasValue)
            task.StartDate = dto.StartDate;

        if (dto.EndDate.HasValue)
            task.EndDate = dto.EndDate;

        if (dto.AssignedTo.HasValue)
            task.AssignedTo = dto.AssignedTo;

        // 🔥 IMPORTANT: set UpdatedAt
        task.UpdatedAt = DateTime.UtcNow;

        await _repo.UpdateAsync(task);

        // 🔥 CREATE NOTIFICATION if assignee changed
        if (assigneeChanged && dto.AssignedTo.HasValue)
        {
            var assignee = await _employeeRepository.GetByIdAsync(dto.AssignedTo.Value);
            if (assignee != null)
            {
                await _notificationService.CreateTaskAssignmentNotificationAsync(
                    employeeId: dto.AssignedTo.Value,
                    taskId: task.Id,
                    taskTitle: task.Title,
                    assignedByName: "System"
                );
            }
        }

        return Map(task);
    }

    // ✅ UPDATE STATUS ONLY (Backward compatibility)
    public async Task UpdateStatusAsync(int id, string status)
    {
        var task = await _repo.GetByIdAsync(id);

        if (task == null)
            throw new Exception("Task not found");

        // ✅ Update status
        task.Status = status;

        // 🔥 IMPORTANT: set UpdatedAt
        task.UpdatedAt = DateTime.UtcNow;

        await _repo.UpdateAsync(task);
    }
}