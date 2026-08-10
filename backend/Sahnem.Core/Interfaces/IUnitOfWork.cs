namespace Sahnem.Core.Interfaces
{
    public interface IUnitOfWork
    {
        Task SaveChanges();
    }
}