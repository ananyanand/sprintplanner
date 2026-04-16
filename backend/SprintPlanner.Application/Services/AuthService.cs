using SprintPlanner.Application.Services;
public class AuthService : IAuthService
{
    private readonly IUserRepository _userRepository;
    private readonly PasswordService _passwordService;
    private readonly JwtService _jwtService;

    public AuthService(
        IUserRepository userRepository,
        PasswordService passwordService,
        JwtService jwtService)
    {
        _userRepository = userRepository;
        _passwordService = passwordService;
        _jwtService = jwtService;
    }

    public async Task<LoginResponseDto?> LoginAsync(LoginRequestDto request)
    {
        var user = await _userRepository.GetByUsernameAsync(request.Username);

        if (user == null)
            return null;

        var isValid = _passwordService.VerifyPassword(request.Password, user.PasswordHash);

        if (!isValid)
            return null;

        var token = _jwtService.GenerateToken(user);

        return new LoginResponseDto
        {
            Token = token,
            Username = user.Username
        };
    }
}