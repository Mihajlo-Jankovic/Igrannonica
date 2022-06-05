using Igrannonica.DataTransferObjects;
using Igrannonica.Models;
using MongoDB.Driver;

namespace Igrannonica.Services.FileService
{
    public class FileService
    {
        private readonly MySqlContext _context;
        private readonly bool isProduction;

        public FileService(MySqlContext context, bool isProduction)
        {
            _context = context;
            this.isProduction = isProduction;
        }


        public async void DeleteAllExpiredFiles()
        {


            while (true)
            {
                List<Models.File> files = _context.File.Where(f => f.IsPublic == false).ToList();
                foreach (Models.File file in files)
                {
                    if (file.UserForeignKey == null)
                    {
                        var mongoClient = new MongoClient(getMongoDBConnString());
                        var database = mongoClient.GetDatabase("igrannonica");
                        var collection = database.GetCollection<ExperimentDTO>("experiment");
                        var tmp = await collection.FindAsync(e => e.fileName == file.RandomFileName);
                        var temp = await tmp.FirstOrDefaultAsync();
                        if(temp == null && file.DateCreated.AddDays(7) < DateTime.Now)
                        {
                            HttpClient client = new HttpClient();
                            var endpoint = new Uri("http://127.0.0.1:10108/deleteFile/" + file.RandomFileName);

                            var response = await client.GetAsync(endpoint);
                            _context.File.Remove(file);
                            await _context.SaveChangesAsync();
                        }
                    }
                }
                Thread.Sleep(24 * 2 * 60 * 60 * 1000);
            }

        }
       private string getMongoDBConnString()
        {
            if (!isProduction)
            {
                return "mongodb://localhost:27017";
            }

            else
            {
                return "mongodb://localhost:10109";
            }
        }
    }
}
