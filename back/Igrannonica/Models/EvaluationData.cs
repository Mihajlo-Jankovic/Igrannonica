namespace Igrannonica.Models
{
    public class EvaluationData
    {
        public float? logcosh { get; set; }
        public float? loss { get; set; }
        public float? mae { get; set; }
        public float? mape { get; set; }
        public float? mse { get; set; }
        public float? msle { get; set; }
        public float? binary_accuracy { get; set; }
        public float? categorical_accuracy { get; set; }
        public float? sparse_categorical_accuracy { get; set; }
        public float? top_k_accuracy { get; set; }
        public float? sparse_top_k_categorical_accuracy { get; set; }
        public float? accuracy { get; set; }
    }
}
