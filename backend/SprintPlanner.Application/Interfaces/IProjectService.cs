public interface IProjectService
{
    Task<ProjectResponseDto> CreateAsync(CreateProjectDto dto);
    Task<List<ProjectResponseDto>> GetAllAsync();
    Task<ProjectResponseDto?> GetByIdAsync(int id);
    Task<ProjectResponseDto?> UpdateAsync(int id, CreateProjectDto dto);
    Task<bool> DeleteAsync(int id);
}