using MongoDB.Bson;
using MongoDB.Bson.Serialization.Attributes;

namespace Igrannonica.DataTransferObjects
{
    public class DeleteDTO
    {
        [BsonId]
        [BsonRepresentation(BsonType.ObjectId)]
        public string Id { get; set; }
    }
}
