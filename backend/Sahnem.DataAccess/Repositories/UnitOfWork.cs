using Sahnem.Core.Interfaces;
using Sahnem.DataAccess.Contexts;

namespace Sahnem.DataAccess.Repositories
{
    public class UnitOfWork : IUnitOfWork
    {
        private readonly SahnemDbContext _context;
        public UnitOfWork(SahnemDbContext context)
        {
            _context = context;
        }

        public async Task SaveChanges()
        {
            await _context.SaveChangesAsync();
        }
    }
}