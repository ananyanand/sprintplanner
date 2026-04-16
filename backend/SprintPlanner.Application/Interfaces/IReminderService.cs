public interface IReminderService
{
    Task<List<ReminderDto>> GetByEmployeeAsync(int employeeId);

    Task<ReminderDto> CreateAsync(ReminderDto dto);

    Task UpdateAsync(ReminderDto dto);

    Task DeleteAsync(int id);
}