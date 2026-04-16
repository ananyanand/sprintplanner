using SprintPlanner.Application.Services;
using SprintPlanner.Domain.Entities;

public class EmployeeService : IEmployeeService
{
    private readonly IEmployeeRepository _employeeRepository;
    private readonly IUserRepository _userRepository;
    private readonly PasswordService _passwordService;

    public EmployeeService(
        IEmployeeRepository employeeRepository,
        IUserRepository userRepository,
        PasswordService passwordService)
    {
        _employeeRepository = employeeRepository;
        _userRepository = userRepository;
        _passwordService = passwordService;
    }

    public async Task<EmployeeResponseDto> CreateAsync(CreateEmployeeDto dto)
    {
        // 🔹 1. Create Employee
        var employee = new Employee
        {
            Name = dto.Name,
            Role = dto.Role,
            CreatedAt = DateTime.UtcNow
        };

        await _employeeRepository.AddAsync(employee);
        await _employeeRepository.SaveChangesAsync(); // get ID

        // 🔹 2. Create User (Login)
        var user = new User
        {
            Username = dto.Username,
            PasswordHash = _passwordService.HashPassword(dto.Password),
            EmployeeId = employee.Id
        };

        await _userRepository.AddAsync(user);
        await _employeeRepository.SaveChangesAsync();

        return new EmployeeResponseDto
        {
            Id = employee.Id,
            Name = employee.Name,
            Role = employee.Role,
            Username = user.Username
        };
    }

    public async Task<List<EmployeeResponseDto>> GetAllAsync()
    {
        var employees = await _employeeRepository.GetAllAsync();

        return employees.Select(e => new EmployeeResponseDto
        {
            Id = e.Id,
            Name = e.Name,
            Role = e.Role
        }).ToList();
    }
    public async Task<EmployeeResponseDto?> UpdateAsync(int id, CreateEmployeeDto dto)
    {
        var employee = await _employeeRepository.GetByIdAsync(id);

        if (employee == null)
            return null;

        // 🔥 FIX: ensure UTC
        employee.CreatedAt = DateTime.SpecifyKind(employee.CreatedAt, DateTimeKind.Utc);

        employee.Name = dto.Name;
        employee.Role = dto.Role;

        await _employeeRepository.UpdateAsync(employee);
        await _employeeRepository.SaveChangesAsync();

        return new EmployeeResponseDto
        {
            Id = employee.Id,
            Name = employee.Name,
            Role = employee.Role
        };
    }

    public async Task<bool> DeleteAsync(int id)
    {
        var employee = await _employeeRepository.GetByIdAsync(id);

        if (employee == null)
            return false;

        await _employeeRepository.DeleteAsync(employee);
        await _employeeRepository.SaveChangesAsync();

        return true;
    }
    public async Task<EmployeeResponseDto?> GetByIdAsync(int id)
    {
        var employee = await _employeeRepository.GetByIdAsync(id);

        if (employee == null)
            return null;

        return new EmployeeResponseDto
        {
            Id = employee.Id,
            Name = employee.Name,
            Role = employee.Role
        };
    }
    public async Task<EmployeeResponseDto?> GetByUsernameAsync(string username)
    {
        var user = await _userRepository.GetByUsernameAsync(username);

        if (user == null || user.EmployeeId == null)
            return null;

        var employee = await _employeeRepository.GetByIdAsync(user.EmployeeId.Value);

        if (employee == null)
            return null;

        return new EmployeeResponseDto
        {
            Id = employee.Id,
            Name = employee.Name,
            Role = employee.Role,
            Username = user.Username
        };
    }
}