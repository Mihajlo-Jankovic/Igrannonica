namespace Igrannonica.DataTransferObjects
{
    public class CsvDeleteRowDTO
    {
        public string fileName { get; set; }
        public List<int> rowNumber { get; set; }
    }
}
