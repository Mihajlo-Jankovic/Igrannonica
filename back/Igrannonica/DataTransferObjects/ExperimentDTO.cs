using Igrannonica.Models;

namespace Igrannonica.DataTransferObjects
{
    public class ExperimentDTO
    {
        public int userId { get; set; }
        public string name { get; set; }
        public string date { get; set; }
        public string fileName { get; set; }
        public string realName { get; set; }
        public string description { get; set; }
        public bool visibility { get; set; }
        public List<Model> models { get; set; }
    }
}
