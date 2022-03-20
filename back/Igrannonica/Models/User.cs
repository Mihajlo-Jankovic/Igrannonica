using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace Igrannonica.Models
{
    public class User
    {
        [Key]
        public int id { get; set; }
        [Column(TypeName ="nvarchar(50)")]
        public string firstname { get; set; }
        [Column(TypeName = "nvarchar(50)")]
        public string lastname { get; set; }
        [Column(TypeName = "nvarchar(50)")]
        public string email { get; set; }
        [Column(TypeName = "nvarchar(50)")]
        public string username { get; set; }
        [Column(TypeName = "nvarchar(500)")]
        public byte[] passwordHash { get; set; }
        [Column(TypeName = "nvarchar(500)")]
        public byte[] passwordSalt { get; set; }
    }
}
