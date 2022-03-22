using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Igrannonica.DataTransferObjects;
using Igrannonica.Models;
using CsvHelper;
using System.Globalization;

namespace Igrannonica.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class CsvController : ControllerBase
    {
        private readonly MySqlContext _mySqlContext;

        public CsvController(MySqlContext mySqlContext)
        {
            _mySqlContext = mySqlContext;
        }

        [HttpPost]
        public async Task<IActionResult> Index(CsvDTO csv)
        {

            Models.File? file = _mySqlContext.File.Where(f => f.FileName == csv.fileName).FirstOrDefault();
            if (file == null)
                return BadRequest("no file with that name");
            var folderName = Path.Combine("Resources", "CSVFiles");
            var pathToSave = Path.Combine(Directory.GetCurrentDirectory(), folderName);
            var fileName = file.RandomFileName;
            var fullPath = Path.Combine(pathToSave, fileName);

            using(var streamReader = new StreamReader(fullPath))
            {
                using(var csvReader = new CsvReader(streamReader, CultureInfo.InvariantCulture))
                {
                    var records = csvReader.GetRecords<dynamic>();
                    var iterator = records.GetEnumerator();
                    for (int i = 0; i < csv.rowNumber; i++)
                    {
                        var moved = iterator.MoveNext();
                        if (moved == false)
                        {
                            return BadRequest("zadat veci red od ukupno redova");
                        }
                    }
                    var record = iterator.Current;
                    var result = new RouteValueDictionary(record);
                    result[csv.columnName] = csv.value;
                    streamReader.Close();
                    using (var targetStream = new StreamWriter(fullPath))
                    {
                        using (var csvWriter = new CsvWriter(targetStream, CultureInfo.InvariantCulture))
                        {
                            csvWriter.WriteRecords(records);
                        }
                        targetStream.Dispose();
                    }
                    return Ok(result);
                    //while(iterator.MoveNext())
                    //{
                    //    var record = iterator.Current;
                        
                    //}
                }
            }
            //return Ok(csv);
        }

        [HttpGet("{filename}")]
        public async Task<IActionResult> downloadfile(string filename)
        {
            Models.File? file = _mySqlContext.File.Where(f => f.FileName == filename).FirstOrDefault();
            if (file == null)
                return BadRequest("no file with that name");
            var folderName = Path.Combine("Resources", "CSVFiles");
            var pathToSave = Path.Combine(Directory.GetCurrentDirectory(), folderName);
            var fileName = file.RandomFileName;
            var fullPath = Path.Combine(pathToSave, fileName);

            var bytes = await System.IO.File.ReadAllBytesAsync(fullPath);
            return File(bytes, "csv/plain", Path.GetFileName(fullPath));
        }
    }
}
