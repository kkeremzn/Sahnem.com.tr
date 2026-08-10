using System.Linq.Expressions;
using Sahnem.Core.Entities;

namespace Sahnem.Core.Interfaces
{
    public interface IGenericRepository<T> where T : BaseEntity
    {
        Task<IEnumerable<T>> GetAllAsync();
        Task<T> GetByIdAsync(int id);
        Task<IEnumerable<T>> WhereAsync(Expression<Func<T, bool>> predicate);
        Task<T?> FirstOrDefaultAsync(Expression<Func<T, bool>> predicate);
        Task<bool> AnyAsync(Expression<Func<T,bool>> predicate);

        Task AddAsync(T entity);
        void Update(T entity);
        void Delete(T entity);


    }
}