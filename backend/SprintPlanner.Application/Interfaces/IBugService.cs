public interface IBugService
{
    Task<List<BugDto>> GetByProjectAsync(int projectId);
    Task<BugDto> CreateAsync(CreateBugDto dto);
    Task DeleteAsync(int id);
    Task<BugDto> UpdateAsync(int id, UpdateBugDto dto);
    Task UpdateStatusAsync(int id, string status);
}