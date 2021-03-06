namespace Igrannonica.Models
{
    public class TrainingDTO
    {
        public string connID { get; set; }
        public string fileName { get; set; }
        public string[] inputList { get; set; }
        public string output { get; set; }
        public float ratio1 { get; set; }
        public float ratio2 { get; set; }
        public List<List<string>> encodingList { get; set; }
        public int numLayers { get; set; }
        public int[] layerList { get; set; }
        public string[] activationFunctions { get; set; }
        public string regularization { get; set; }
        public float regularizationRate { get; set; }
        public string optimizer { get; set; }
        public float learningRate { get; set; }
        public string problemType { get; set; }
        public string lossFunction { get; set; }
        public string[] metrics { get; set; }
        public int numEpochs { get; set; }
    }
}
