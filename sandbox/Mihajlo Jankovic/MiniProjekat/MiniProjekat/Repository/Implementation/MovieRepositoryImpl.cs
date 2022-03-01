using MiniProjekat.Models;
using System.Data.SqlClient;

namespace MiniProjekat.Repository.Implementation
{
    public class MovieRepositoryImpl : MovieRepository
    {
        private SqlConnection _connection = DbConnection.Connection;

        public bool create(Movie t)
        {
            throw new NotImplementedException();
        }

        public bool delete(int id)
        {
            throw new NotImplementedException();
        }

        public Movie get(int id)
        {
            throw new NotImplementedException();
        }

        public List<Movie> getAll()
        {
            List<Movie> movies = new List<Movie>();

            _connection.Open();

            string query = @"SELECT * FROM movies";

            SqlCommand command = new SqlCommand(query, _connection);

            SqlDataReader reader = command.ExecuteReader();

            while (reader.Read())
            {
                Movie movie = new Movie(int.Parse(reader["id"].ToString()),
                                        reader["name"].ToString(),
                                        reader["description"].ToString(),
                                        Math.Round(float.Parse(reader["rating"].ToString()),1));

                movies.Add(movie);
            }

            _connection.Close();

            return movies;
        }

        public bool update(Movie t, int id)
        {
            throw new NotImplementedException();
        }
    }
}
