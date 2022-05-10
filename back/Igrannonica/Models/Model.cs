namespace Igrannonica.Models
{
    public class Model
    {
        public int id { get; set; }
        public ModelData data { get; set; }
        public ModelParameters parameters { get; set; }
        public dynamic evaluationData { get; set; } 
    }
}
