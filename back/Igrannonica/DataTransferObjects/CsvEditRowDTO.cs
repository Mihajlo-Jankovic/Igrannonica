namespace Igrannonica.DataTransferObjects
{
    public class CsvEditRowDTO
    {
        public string fileName { get; set; }
        public int rowNumber { get; set; }
        public string columnName { get; set; }
        public string value { get; set; }
    }
}
