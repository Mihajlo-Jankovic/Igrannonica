namespace MiniProjekat.Models
{
    public class Movie
    {
        public int Id { get; set; }
        public string Name { get; set; }
        public string Description { get; set; }
        public double Rating { get; set; }

        public Movie(int id, string name, string description, double rating)
        {
            Id = id;
            Name = name;
            Description = description;
            Rating = rating;
        }
    }
}
