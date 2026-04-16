using SprintPlanner.Domain.Entities;

public class ProjectService : IProjectService
{
    private readonly IProjectRepository _projectRepository;

    public ProjectService(IProjectRepository projectRepository)
    {
        _projectRepository = projectRepository;
    }

    // ✅ CREATE PROJECT ONLY
    public async Task<ProjectResponseDto> CreateAsync(CreateProjectDto dto)
    {
        var project = new Project
        {
            Name = dto.Name,
            StartDate = dto.StartDate,
            EndDate   = dto.EndDate,

            SprintDuration = dto.SprintDuration,
            CreatedAt = DateTime.UtcNow
        };

        await _projectRepository.AddAsync(project);
        await _projectRepository.SaveChangesAsync();

        return Map(project);
    }

    // ✅ GET ALL
    public async Task<List<ProjectResponseDto>> GetAllAsync()
    {
        var projects = await _projectRepository.GetAllAsync();
        return projects.Select(Map).ToList();
    }

    // ✅ GET BY ID
    public async Task<ProjectResponseDto?> GetByIdAsync(int id)
    {
        var project = await _projectRepository.GetByIdAsync(id);
        return project == null ? null : Map(project);
    }

    // ✅ UPDATE
    public async Task<ProjectResponseDto?> UpdateAsync(int id, CreateProjectDto dto)
    {
        var project = await _projectRepository.GetByIdAsync(id);
        if (project == null) return null;

        project.Name = dto.Name;
        project.StartDate = dto.StartDate;
        project.EndDate = dto.EndDate;
        project.SprintDuration = dto.SprintDuration;

        project.CreatedAt = DateTime.SpecifyKind(project.CreatedAt, DateTimeKind.Utc);


        await _projectRepository.UpdateAsync(project);
        await _projectRepository.SaveChangesAsync();

        return Map(project);
    }

    // ✅ DELETE
    public async Task<bool> DeleteAsync(int id)
    {
        var project = await _projectRepository.GetByIdAsync(id);
        if (project == null) return false;

        await _projectRepository.DeleteAsync(project);
        await _projectRepository.SaveChangesAsync();

        return true;
    }

    // 🔹 MAPPER
    private ProjectResponseDto Map(Project p) => new()
    {
        Id = p.Id,
        Name = p.Name,
        StartDate = p.StartDate,
        EndDate = p.EndDate,
        SprintDuration = p.SprintDuration
    };
}