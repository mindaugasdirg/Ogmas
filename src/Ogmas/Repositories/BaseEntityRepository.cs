using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.ChangeTracking;
using Ogmas.Models.Entities;

namespace Ogmas.Repositories
{
    public class BaseEntityRepository<T> where T : BaseEntity
    {
        protected readonly DatabaseContext Context;

        public BaseEntityRepository(DatabaseContext context)
        {
            Context = context;
        }

        public async Task<T> Add(T item)
        {
            var added = await Context.Set<T>().AddAsync(item);
            await Context.SaveChangesAsync();
            return added.Entity;
        }

        public async Task<T> Update(T item)
        {
            var entity = Context.Entry(item);
            entity.State = EntityState.Modified;
            await Context.SaveChangesAsync();
            return entity.Entity;
        }

        public async Task<T> Delete(string id)
        {
            var item = await Get(id);

            item.IsDeleted = true;
            Context.Set<T>().Update(item);
            await Context.SaveChangesAsync();
            return item;
        }

        public async Task<T> Get(string id)
        {
            var item = await Context.Set<T>().Where(i => i.Id == id).FirstOrDefaultAsync();
            if(item is null)
                throw new ArgumentException($"Item with id '{id}' does not exist");

            return item;
        }

        public async Task<IEnumerable<T>> GetAll()
        {
            return await Context.Set<T>().ToListAsync();
        }

        public IEnumerable<T> Filter(Func<T, bool> predicate)
        {
            return Context.Set<T>().Where(predicate).ToList();
        }
    }
}