using Igrannonica.Models;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using MongoDB.Driver;
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
                var collection = database.GetCollection<CSVFile>("CSVFiles");
                var file = Request.Form.Files[0];

                if(file.Length > 0)
                {
                    using var fileStream = file.OpenReadStream();
                    var parser = new Microsoft.VisualBasic.FileIO.TextFieldParser(fileStream);
                    parser.TextFieldType = Microsoft.VisualBasic.FileIO.FieldType.Delimited;
                    parser.SetDelimiters(new string[] { ";" });
                    var fileContents = parser.ReadToEnd();
                    var fileName = ContentDispositionHeaderValue.Parse(file.ContentDisposition).FileName.Trim('"');
                    DBFile.FileName = fileName;
                    DBFile.File = fileContents;
                    DBFile.User_ID = 1;
                    await collection.InsertOneAsync(DBFile);

                    return Ok("okej");
                }
                return BadRequest( "nema fajla" );
            }
            catch (Exception ex)
            {
                return BadRequest(ex.Message);
            }
        }
    }
}
