using Microsoft.EntityFrameworkCore;
using SprintPlanner.Domain.Entities;
using SprintPlanner.Infrastructure;

public class UserRepository : IUserRepository
{
    private readonly AppDbContext _context;

    public UserRepository(AppDbContext context)
    {
        _context = context;
    }

    public async Task<User?> GetByUsernameAsync(string username)
    {
        return await _context.Users
            .FirstOrDefaultAsync(u => u.Username == username && u.IsActive);
    }
    public async Task AddAsync(User user)
        {
            await _context.Users.AddAsync(user);
        }
}