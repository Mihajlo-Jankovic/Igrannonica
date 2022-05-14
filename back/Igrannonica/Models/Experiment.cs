using MongoDB.Bson;
using MongoDB.Bson.Serialization.Attributes;

namespace Igrannonica.Models
{
    public class Experiment
    {
        [BsonId]
        [BsonRepresentation(BsonType.ObjectId)]
        public string _id { get; set; }
        public int userId { get; set; }
        public string username { get; set; }
        public string name { get; set; }
        public string date { get; set; }
        public string fileName { get; set; }
        public string realName { get; set; }
        public string description { get; set; }
        public bool visibility { get; set; }
        public bool overwrite { get; set; }
        public List<Model> models { get; set; }
    }
}
