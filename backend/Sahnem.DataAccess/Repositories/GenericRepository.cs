using System.Linq.Expressions;
using Microsoft.EntityFrameworkCore;
using Sahnem.Core.Entities;
using Sahnem.Core.Interfaces;
using Sahnem.DataAccess.Contexts;

namespace Sahnem.DataAccess.Repositories
{
    public class GenericRepository<T> : IGenericRepository<T> where T : BaseEntity
    {
        protected readonly SahnemDbContext _context;
        private readonly DbSet<T> _dbSet;

        public GenericRepository(SahnemDbContext context)
        {
            _context = context;
            _dbSet = _context.Set<T>();
        }
        
        public async Task AddAsync(T entity)
        {
            await _dbSet.AddAsync(entity);
            
        }

        public Task<bool> AnyAsync(Expression<Func<T, bool>> predicate)
        {
            return _dbSet.AnyAsync(predicate);
        }

        public void Delete(T entity)
        {
            _dbSet.Remove(entity);
        }

        public Task<T?> FirstOrDefaultAsync(Expression<Func<T, bool>> predicate)
        {
            return _dbSet.FirstOrDefaultAsync(predicate);
        }

        public async Task<IEnumerable<T>> GetAllAsync()
        {
            await Task.Delay(1000); // Simulating async operation
            return await _dbSet.ToListAsync();
        }

        public async Task<T> GetByIdAsync(int id)
        {
            return await _dbSet.FindAsync(id);
        }

        public void Update(T entity)
        {
            _dbSet.Update(entity);
        }

        public async Task<IEnumerable<T>> WhereAsync(Expression<Func<T, bool>> predicate)
        {
            return await _dbSet.Where(predicate).ToListAsync();
        }

        
        
    }

}