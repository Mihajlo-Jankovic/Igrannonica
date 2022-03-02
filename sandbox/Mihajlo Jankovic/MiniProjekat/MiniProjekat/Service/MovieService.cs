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

        public bool addMovie(Movie movie)
        {
            return movieRepositoryImpl.create(movie);
        }

        public bool deleteMovie(int id)
        {
            return movieRepositoryImpl.delete(id);
        }
    }
}
