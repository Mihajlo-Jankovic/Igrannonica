using MiniProjekat.Models;
using MiniProjekat.Repository.Implementation;

namespace MiniProjekat.Service
{
    public class MovieService
    {
        MovieRepositoryImpl movieRepositoryImpl = new MovieRepositoryImpl();
        public List<Movie> getAllMovies()
        {
            return movieRepositoryImpl.getAll();
        }
    }
}
