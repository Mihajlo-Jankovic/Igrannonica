using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Linq;
using System.Threading.Tasks;

namespace MiniApp.Models
{
    public class Biblioteka
    {
        [Key]
        public int Id { get; set; }

        [Column(TypeName = "nvarchar(50)")]
        public string Autor { get; set; }

        [Column(TypeName = "nvarchar(50)")]
        public string NazivKnjige { get; set; }

        [Column(TypeName = "nvarchar(5)")]
        public string Izdanje { get; set; }

    }
}
