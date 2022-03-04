using MiniProjekat.Models;
using System.Data.SqlClient;

namespace MiniProjekat.Repository.Implementation
{
    public class MovieRepositoryImpl : MovieRepository
    {
        private SqlConnection _connection = DbConnection.Connection;

        public bool create(Movie movie)
        {
            try
            {
                _connection.Open();

                string query = @"INSERT INTO movies (name, description, rating)
                                 VALUES ('" + movie.Name + "', '" + movie.Description + "', " + movie.Rating + ");";

                SqlCommand command = new SqlCommand(query, _connection);

                int flag = command.ExecuteNonQuery();

                _connection.Close();

                return true;
            }
            catch (Exception ex)
            {
                return false;
            }
        }

        public bool delete(int id)
        {
            try
            {
                _connection.Open();

                string query = @"DELETE FROM movies WHERE id = " + id;

                SqlCommand command = new SqlCommand(query, _connection);

                int flag = command.ExecuteNonQuery();

                _connection.Close();

                return true;
            } catch (Exception ex) {
                return false;
            }
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
