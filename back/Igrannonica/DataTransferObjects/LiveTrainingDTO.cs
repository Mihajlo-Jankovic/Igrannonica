namespace Igrannonica.DataTransferObjects
{
    public class LiveTrainingDTO
    {
        public string ConnID { get; set; }
        public int epoch { get; set; }
        public dynamic TrainingData { get; set; }
    }
}
