using System.Data.SqlClient;

namespace MiniProjekat.Models
{
    public class DbConnection
    {
        private static SqlConnection _connection = null;

        public static SqlConnection Connection
        {
            get
            {
                if (_connection == null) _connection = new SqlConnection(@"Data Source=(localdb)\SI;Initial Catalog=Baza;Integrated Security=True");
                return _connection;
            }
        }
    }
}
