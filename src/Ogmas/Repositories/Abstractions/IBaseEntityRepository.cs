using System;
using System.Collections.Generic;
using System.Threading.Tasks;
using Ogmas.Models.Entities;

namespace Ogmas.Repositories.Abstractions
{
    public interface IBaseEntityRepository<T> where T : BaseEntity
    {
        Task<T> Add(T item);

        Task<T> Update(T item);

        Task<T> Delete(string id);

        T Get(string id);

        IEnumerable<T> GetAll();

        IEnumerable<T> Filter(Func<T, bool> predicate);
    }
}