using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.EntityFrameworkCore;
using Ogmas.Exceptions;
using Ogmas.Models.Entities;

namespace Ogmas.Repositories
{
    public abstract class BaseEntityRepository<T> where T : BaseEntity
    {
        protected readonly DatabaseContext Context;

        public BaseEntityRepository(DatabaseContext context)
        {
            Context = context;
        }

        protected abstract IQueryable<T> Query();

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
            var item = Get(id);

            if(item is null)
                throw new NotFoundException("item does not exist");
                
            item.IsDeleted = true;
            Context.Set<T>().Update(item);
            await Context.SaveChangesAsync();
            return item;
        }

        public T Get(string id)
        {
            return Query().Where(i => i.Id == id).FirstOrDefault();
        }

        public IEnumerable<T> GetAll()
        {
            return Query().ToList();
        }

        public IEnumerable<T> Filter(Func<T, bool> predicate)
        {
            return Query().Where(predicate).ToList();
        }
    }
}