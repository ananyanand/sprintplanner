public interface ISprintService
{
    Task SyncSprintsAsync(int projectId, List<CreateSprintDto> dto);

    Task<List<SprintResponseDto>> GetByProjectIdAsync(int projectId);

    Task<SprintResponseDto?> GetByIdAsync(int id);

    Task<SprintResponseDto?> UpdateAsync(int id, UpdateSprintDto dto);
}