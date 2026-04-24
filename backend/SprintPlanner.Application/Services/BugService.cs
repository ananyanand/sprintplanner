using SprintPlanner.Domain.Entities;
using SprintPlanner.Application.Interfaces;

public class BugService : IBugService
{
    private readonly IBugRepository _repo;
    private readonly INotificationService _notificationService;
    private readonly IEmployeeRepository _employeeRepository;

    public BugService(IBugRepository repo, INotificationService notificationService, IEmployeeRepository employeeRepository)
    {
        _repo = repo;
        _notificationService = notificationService;
        _employeeRepository = employeeRepository;
    }

    public async Task<List<BugDto>> GetByProjectAsync(int projectId)
    {
        var bugs = await _repo.GetByProjectAsync(projectId);

        return bugs.Select(b => new BugDto
        {
            Id = b.Id,
            Title = b.Title,
            Description = b.Description,
            Severity = b.Severity,
            Status = b.Status,

            ProjectId = b.ProjectId,
            ProjectName = b.Project.Name,

            AssignedTo = b.AssignedTo,
            AssigneeName = b.Assignee != null ? b.Assignee.Name : null,

            DueDate = b.DueDate,
            CreatedAt = b.CreatedAt
        }).ToList();
    }

    public async Task<BugDto> CreateAsync(CreateBugDto dto)
    {
        var bug = new Bug
        {
            ProjectId = dto.ProjectId,
            Title = dto.Title,
            Description = dto.Description,
            Severity = dto.Severity,
            Status = dto.Status,
            AssignedTo = dto.AssignedTo,

            CreatedAt = DateTime.UtcNow,
            DueDate = dto.DueDate.HasValue
                ? DateTime.SpecifyKind(dto.DueDate.Value, DateTimeKind.Utc)
                : null
        };

        await _repo.AddAsync(bug);

        // 🔥 CREATE NOTIFICATION if bug is assigned
        if (dto.AssignedTo.HasValue)
        {
            var assignee = await _employeeRepository.GetByIdAsync(dto.AssignedTo.Value);
            if (assignee != null)
            {
                await _notificationService.CreateBugAssignmentNotificationAsync(
                    employeeId: dto.AssignedTo.Value,
                    bugId: bug.Id,
                    bugTitle: bug.Title,
                    assignedByName: "System"
                );
            }
        }

        return new BugDto
        {
            Id = bug.Id,
            Title = bug.Title,
            Description = bug.Description,
            Severity = bug.Severity,
            Status = bug.Status,
            ProjectId = bug.ProjectId,
            AssignedTo = bug.AssignedTo,
            DueDate = bug.DueDate,
            CreatedAt = bug.CreatedAt
        };
    }

    public async Task DeleteAsync(int id)
    {
        await _repo.DeleteAsync(id);
    }

    public async Task UpdateStatusAsync(int id, string status)
    {
        await _repo.UpdateStatusDirectAsync(id, status);
    }

    // ✅ UPDATE BUG (All Fields)
    public async Task<BugDto> UpdateAsync(int id, UpdateBugDto dto)
    {
        var bug = await _repo.GetByIdAsync(id);

        if (bug == null)
            throw new Exception("Bug not found");

        // 🔥 Check if assignee is being changed
        bool assigneeChanged = dto.AssignedTo.HasValue && bug.AssignedTo != dto.AssignedTo.Value;

        // ✅ Update only provided fields
        if (!string.IsNullOrEmpty(dto.Title))
            bug.Title = dto.Title;

        if (!string.IsNullOrEmpty(dto.Description))
            bug.Description = dto.Description;

        if (!string.IsNullOrEmpty(dto.Severity))
            bug.Severity = dto.Severity;

        if (!string.IsNullOrEmpty(dto.Status))
            bug.Status = dto.Status;

        if (dto.AssignedTo.HasValue)
            bug.AssignedTo = dto.AssignedTo;

        if (dto.DueDate.HasValue)
            bug.DueDate = DateTime.SpecifyKind(dto.DueDate.Value, DateTimeKind.Utc);

        await _repo.UpdateAsync(bug);

        // 🔥 CREATE NOTIFICATION if assignee changed
        if (assigneeChanged && dto.AssignedTo.HasValue)
        {
            var assignee = await _employeeRepository.GetByIdAsync(dto.AssignedTo.Value);
            if (assignee != null)
            {
                await _notificationService.CreateBugAssignmentNotificationAsync(
                    employeeId: dto.AssignedTo.Value,
                    bugId: bug.Id,
                    bugTitle: bug.Title,
                    assignedByName: "System"
                );
            }
        }

        return new BugDto
        {
            Id = bug.Id,
            Title = bug.Title,
            Description = bug.Description,
            Severity = bug.Severity,
            Status = bug.Status,
            ProjectId = bug.ProjectId,
            AssignedTo = bug.AssignedTo,
            AssigneeName = bug.Assignee?.Name,
            DueDate = bug.DueDate,
            CreatedAt = bug.CreatedAt
        };
    }
}