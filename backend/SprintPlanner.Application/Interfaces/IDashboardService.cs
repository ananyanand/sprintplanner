public interface IDashboardService
{
    Task<DashboardDto?> GetDashboardByUsernameAsync(string username);
}