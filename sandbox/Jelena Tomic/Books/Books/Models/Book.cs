using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Linq;
using System.Threading.Tasks;

namespace Books.Models
{
    public class Book
    {
        [Key]
        public int id { get; set; }
        [Column(TypeName = "nvarchar(16)")]
        public string Name { get; set; }
        [Column(TypeName = "nvarchar(16)")]
        public string Author { get; set; }
    }
}
