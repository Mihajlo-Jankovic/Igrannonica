namespace MiniProjekat.Repository
{
    public interface CRUDRepository<T,ID>
    {
        List<T> getAll();
        bool create(T t);
        T get(ID id);
        bool update(T t, ID id);

        bool delete(ID id);
    }
}
