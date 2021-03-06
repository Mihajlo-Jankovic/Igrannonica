namespace Igrannonica.Models
{
    public class ModelParameters
    {
        public List<string> inputList { get; set; }
        public string output { get; set; }
        public double ratio1 { get; set; }
        public double ratio2 { get; set; }
        public int numLayers { get; set; }
        public List<int> layerList { get; set; }
        public string[] activationFunctions { get; set; }
        public string regularization { get; set; }
        public double regularizationRate { get; set; }
        public string optimizer { get; set; }
        public double learningRate { get; set; }
        public string problemType { get; set; }
        public string lossFunction { get; set; }
        public List<string> metrics { get; set; }
        public int numEpochs { get; set; }
        public string connID { get; set; }
        public List<List<string>> encodingList { get; set; }
        public string fileName { get; set; }
    }
}
