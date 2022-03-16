using MongoDB.Bson;
using MongoDB.Bson.Serialization.Attributes;

namespace Igrannonica.Models
{
    public class CSVFile
    {
        [BsonId]
        public ObjectId Id { get; set; }

        [BsonElement("user_id")]
        public int User_ID { get; set; }

        [BsonElement("filename")]
        public string FileName { get; set; }

        [BsonElement("csvfile")]
        public string File { get; set; }
    }
}
