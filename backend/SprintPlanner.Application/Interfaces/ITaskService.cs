public interface ITaskService
{
    Task<TaskResponseDto> CreateAsync(CreateTaskDto dto);
    Task<List<TaskResponseDto>> GetBySprintIdAsync(int sprintId);
    Task DeleteAsync(int id);
    Task<TaskResponseDto> UpdateAsync(int id, UpdateTaskDto dto);
    Task UpdateStatusAsync(int id, string status);
}