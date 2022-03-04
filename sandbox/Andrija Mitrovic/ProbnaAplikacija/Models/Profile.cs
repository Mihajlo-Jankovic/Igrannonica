using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace ProbnaAplikacija.Models
{
    public class Profile
    {
        [Key]
        public int UserID { get; set; }

        [Required]
        [Column(TypeName = "nvarchar(100)")]
        public string FirstName { get; set; }

        [Required]
        [Column(TypeName = "varchar(100)")]
        public string LastName { get; set; }

        [Required]
        [Column(TypeName = "varchar(100)")]
        public string EMail { get; set; }

        [Required]
        [Column(TypeName = "varchar(100)")]
        public string Password { get; set; }
    }
}
