public class CreateEmployeeDto
{
    public string Name { get; set; } = "";
    public string Role { get; set; } = "";

    // 🔐 Login
    public string Username { get; set; } = "";
    public string Password { get; set; } = "";
}