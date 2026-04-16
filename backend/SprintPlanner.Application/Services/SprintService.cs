using SprintPlanner.Domain.Entities;

public class SprintService : ISprintService
{
    private readonly ISprintRepository _repo;

    public SprintService(ISprintRepository repo)
    {
        _repo = repo;
    }

    // 🔥 SYNC SPRINTS (UPDATE + INSERT + DELETE)
    public async Task SyncSprintsAsync(int projectId, List<CreateSprintDto> dto)
    {
        var existing = await _repo.GetByProjectIdAsync(projectId);

        // 🔥 1. DELETE ALL existing sprints
        foreach (var sprint in existing)
        {
            await _repo.DeleteAsync(sprint);
        }

        // 🔥 2. ADD fresh sprints (based on updated dates)
        var newSprints = dto.Select(s => new Sprint
        {
            ProjectId = projectId,
            Name = s.Name,
            StartDate = s.StartDate,
            EndDate = s.EndDate,
            Goal = s.Goal,
            Status = s.Status,
            CreatedAt = DateTime.UtcNow
        }).ToList();

        await _repo.AddRangeAsync(newSprints);

        await _repo.SaveChangesAsync();
    }
    // ✅ GET ALL BY PROJECT
    public async Task<List<SprintResponseDto>> GetByProjectIdAsync(int projectId)
    {
        var sprints = await _repo.GetByProjectIdAsync(projectId);
        return sprints.Select(Map).ToList();
    }

    // ✅ GET BY ID
    public async Task<SprintResponseDto?> GetByIdAsync(int id)
    {
        var sprint = await _repo.GetByIdAsync(id);
        return sprint == null ? null : Map(sprint);
    }

    // ✅ UPDATE (goal + status)
    public async Task<SprintResponseDto?> UpdateAsync(int id, UpdateSprintDto dto)
    {
        var sprint = await _repo.GetByIdAsync(id);
        if (sprint == null) return null;

        sprint.Goal = dto.Goal;
        sprint.Status = dto.Status;

        await _repo.UpdateAsync(sprint);
        await _repo.SaveChangesAsync();

        return Map(sprint);
    }

    // 🔹 MAPPER
    private SprintResponseDto Map(Sprint s) => new()
    {
        Id = s.Id,
        Name = s.Name,
       StartDate = s.StartDate,
        EndDate = s.EndDate,
        Goal = s.Goal,
        Status = s.Status
    };
}