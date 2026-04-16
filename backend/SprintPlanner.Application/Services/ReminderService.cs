using SprintPlanner.Domain.Entities;

public class ReminderService : IReminderService
{
    private readonly IReminderRepository _repo;

    public ReminderService(IReminderRepository repo)
    {
        _repo = repo;
    }

    public async Task<List<ReminderDto>> GetByEmployeeAsync(int employeeId)
    {
        var data = await _repo.GetByEmployeeAsync(employeeId);

        return data.Select(r => new ReminderDto
        {
            Id = r.Id,
            EmployeeId = r.EmployeeId,
            Title = r.Title,
            DueDate = r.DueDate,
            Priority = r.Priority,
            Completed = r.Completed
        }).ToList();
    }

    public async Task<ReminderDto> CreateAsync(ReminderDto dto)
    {
        var entity = new Reminder
        {
            EmployeeId = dto.EmployeeId,
            Title = dto.Title,
            DueDate = dto.DueDate,
            Priority = dto.Priority,
            Completed = dto.Completed,
            CreatedAt = DateTime.UtcNow
        };

        await _repo.AddAsync(entity);

        dto.Id = entity.Id;
        return dto;
    }

   public async Task UpdateAsync(ReminderDto dto)
{
    var reminder = await _repo.GetByIdAsync(dto.Id);

    if (reminder == null)
        throw new Exception("Reminder not found");

    reminder.Title = dto.Title;
    reminder.DueDate = dto.DueDate;
    reminder.Priority = dto.Priority;
    reminder.Completed = dto.Completed;

    // 🔥 FIX: ensure UTC
    reminder.CreatedAt = DateTime.SpecifyKind(reminder.CreatedAt, DateTimeKind.Utc);

    await _repo.UpdateAsync(reminder);
}

    public async Task DeleteAsync(int id)
    {
        await _repo.DeleteAsync(id);
    }
}