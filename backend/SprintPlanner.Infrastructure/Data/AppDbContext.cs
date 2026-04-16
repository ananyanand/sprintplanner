using Microsoft.EntityFrameworkCore;
using SprintPlanner.Domain.Entities;

namespace SprintPlanner.Infrastructure;

public class AppDbContext : DbContext
{
    public AppDbContext(DbContextOptions<AppDbContext> options)
        : base(options)
    {
    }

    // 🔥 Tables
    public DbSet<User> Users { get; set; }
    public DbSet<Employee> Employees { get; set; }
    public DbSet<Project> Projects { get; set; }
    public DbSet<ProjectMember> ProjectMembers { get; set; }
    public DbSet<Sprint> Sprints { get; set; }
    public DbSet<TaskItem> Tasks { get; set; }
    public DbSet<Bug> Bugs { get; set; }
    public DbSet<AuditLog> AuditLogs { get; set; }
    public DbSet<Reminder> Reminders { get; set; }
    public DbSet<Notification> Notifications { get; set; }
        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            modelBuilder.Entity<TaskItem>(entity =>
            {
                entity.Property(e => e.CreatedAt)
                    .HasConversion(
                        v => v,
                        v => DateTime.SpecifyKind(v, DateTimeKind.Utc)
                    );

                entity.Property(e => e.UpdatedAt)
                    .HasConversion(
                        v => v,
                        v => v.HasValue
                            ? DateTime.SpecifyKind(v.Value, DateTimeKind.Utc)
                            : v
                    );
            });

            // 🔥 NOTIFICATION RELATIONSHIPS
            modelBuilder.Entity<Notification>(entity =>
            {
                entity.HasOne(n => n.Employee)
                    .WithMany()
                    .HasForeignKey(n => n.EmployeeId)
                    .OnDelete(DeleteBehavior.Restrict);

                entity.HasOne(n => n.Task)
                    .WithMany()
                    .HasForeignKey(n => n.TaskId)
                    .OnDelete(DeleteBehavior.SetNull);

                entity.HasOne(n => n.Bug)
                    .WithMany()
                    .HasForeignKey(n => n.BugId)
                    .OnDelete(DeleteBehavior.SetNull);
            });
        }
}