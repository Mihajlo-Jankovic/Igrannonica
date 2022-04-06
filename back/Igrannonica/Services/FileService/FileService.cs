namespace Igrannonica.Services.FileService
{
    public class FileService
    {
        public void DeleteAllExpiredFiles()
        {
            var folderName = Path.Combine("Resources", "CSVFilesUnauthorized");
            var path = Path.Combine(Directory.GetCurrentDirectory(), folderName);
            string[] files = Directory.GetFiles(path);

            foreach(string file in files)
            {
                FileInfo fi = new FileInfo(file);
                if(fi.Extension == ".csv")
                {
                    if(fi.LastAccessTime < DateTime.Now.AddHours(-2))
                    {
                        fi.Delete();
                    }
                }
                while(true)
                {
                    Thread.Sleep(7200000);
                }
            }
        }
    }
}
