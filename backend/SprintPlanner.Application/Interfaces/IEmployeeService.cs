public interface IEmployeeService
{
    Task<EmployeeResponseDto> CreateAsync(CreateEmployeeDto dto);
    Task<List<EmployeeResponseDto>> GetAllAsync();
    Task<EmployeeResponseDto?> UpdateAsync(int id, CreateEmployeeDto dto);
    Task<bool> DeleteAsync(int id);
    Task<EmployeeResponseDto?> GetByIdAsync(int id);
    Task<EmployeeResponseDto?> GetByUsernameAsync(string username);
}