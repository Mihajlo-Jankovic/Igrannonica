using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace PorudzbeniceAPI
{
    public class Dostava
    {
        [Key]
        public int Id { get; set; }
        [Column(TypeName ="nvarchar(100)")]
        public string Ime { get; set; }
        [Column(TypeName = "nvarchar(100)")]
        public string Adresa { get; set; }
        [Column(TypeName = "nvarchar(5)")]
        public string ZipKod { get; set; }
        [Column(TypeName = "nvarchar(100)")]
        public string Grad { get; set; }
        [Column(TypeName = "nvarchar(10)")]
        public string Telefon { get; set; }

    }
}
