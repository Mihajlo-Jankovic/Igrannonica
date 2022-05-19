using MongoDB.Bson;
using MongoDB.Bson.Serialization.Attributes;

namespace Igrannonica.DataTransferObjects
{
    public class ExperimentVisibilityDTO
    {
        [BsonId]
        [BsonRepresentation(BsonType.ObjectId)]
        public string _id { get; set; }
        public bool Visibility { get; set; }
    }
}
