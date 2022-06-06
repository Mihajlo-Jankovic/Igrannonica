using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace Igrannonica.Models
{
    public class File
    {
        [Key]
        public int Id { get; set; }

        public string RandomFileName { get; set; }

        public string FileName { get; set; }
        public DateTime DateCreated { get; set; }

        public bool IsPublic { get; set; }
        public int? SessionID { get; set; }

        public int? UserForeignKey { get; set; }
        public User? User { get; set; }
    }
}
