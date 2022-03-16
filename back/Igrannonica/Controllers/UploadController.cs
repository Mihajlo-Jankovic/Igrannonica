using Igrannonica.Models;
using LumenWorks.Framework.IO.Csv;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using MongoDB.Bson;
using MongoDB.Driver;
using Sylvan.Data.Csv;
using System.Data;
using System.Net.Http.Headers;

namespace Igrannonica.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class UploadController : ControllerBase
    {
        [HttpPost,DisableRequestSizeLimit]
        public async Task<IActionResult> Upload()
        {
            try
            {
                CSVFile DBFile = new CSVFile();
                var client = new MongoClient("mongodb://localhost:27017");
                var database = client.GetDatabase("IgrannonicaDB");
                var file = Request.Form.Files[0];

                if(file.Length > 0)
                {
                    var fileName = ContentDispositionHeaderValue.Parse(file.ContentDisposition).FileName.Trim('"');
                    var fileStream = file.OpenReadStream();
                    DataTable csvTable = new DataTable();
                    using (CsvReader csvReader =
                        new CsvReader(new StreamReader(fileStream), true))
                    {
                        csvTable.Load(csvReader);
                    }

                    await SaveDataTableToCollection(csvTable,fileName);

                    return Ok("okej");
                }
                return BadRequest( "nema fajla" );
            }
            catch (Exception ex)
            {
                return BadRequest(ex.Message);
            }
        }

        [NonAction]
        public async Task SaveDataTableToCollection(DataTable dt, string fileName)
        {
            var client = new MongoClient("mongodb://localhost:27017");
            var database = client.GetDatabase("IgrannonicaDB");
            database.CreateCollection(fileName);
            var collection = database.GetCollection<BsonDocument>(fileName);

            List<BsonDocument> batch = new List<BsonDocument>();
            foreach (DataRow dr in dt.Rows)
            {
                var dictionary = dr.Table.Columns.Cast<DataColumn>().ToDictionary(col => col.ColumnName, col => dr[col.ColumnName]);
                batch.Add(new BsonDocument(dictionary));
            }

            await collection.InsertManyAsync(batch.AsEnumerable());
        }
    }
}
