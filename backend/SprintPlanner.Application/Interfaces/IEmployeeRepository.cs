using SprintPlanner.Domain.Entities;

public interface IEmployeeRepository
{
    Task<Employee> AddAsync(Employee employee);
    Task<List<Employee>> GetAllAsync();
    Task<Employee?> GetByIdAsync(int id);
    Task SaveChangesAsync();
    Task UpdateAsync(Employee employee);
    Task DeleteAsync(Employee employee);
}