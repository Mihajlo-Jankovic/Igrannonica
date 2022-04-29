namespace Igrannonica.Models
{
    public class ModelData
    {
        public List<double>? logcosh { get; set; }
        public List<double>? loss { get; set; }
        public List<double>? mae { get; set; }
        public List<double>? mape { get; set; }
        public List<double>? mse { get; set; }
        public List<double>? msle { get; set; }
        public List<double>? val_logcosh { get; set; }
        public List<double>? val_loss { get; set; }
        public List<double>? val_mae { get; set; }
        public List<double>? val_mape { get; set; }
        public List<double>? val_mse { get; set; }
        public List<double>? val_msle { get; set; }
        public List<double>? binary_accuracy { get; set; }
        public List<double>? val_binary_accuracy { get; set; }
        public List<double>? categorical_accuracy { get; set; }
        public List<double>? val_categorical_accuracy { get; set; }
        public List<double>? sparse_categorical_accuracy { get; set; }
        public List<double>? val_sparse_categorical_accuracy { get; set; }
        public List<double>? top_k_accuracy { get; set; }
        public List<double>? val_top_k_accuracy { get; set; }
        public List<double>? sparse_top_k_categorical_accuracy { get; set; }
        public List<double>? val_sparse_top_k_categorical_accuracy { get; set; }
        public List<double>? accuracy { get; set; }
        public List<double>? val_accuracy { get; set; }

    }                      
}
