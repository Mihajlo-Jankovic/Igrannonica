using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Igrannonica.DataTransferObjects;
using Igrannonica.Models;
using CsvHelper;
using System.Globalization;
using Microsoft.Net.Http.Headers;
using System.Net;
using Microsoft.AspNetCore.WebUtilities;
using System.Text;
using Newtonsoft.Json;

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

        [DisableRequestSizeLimit]
        [HttpPost("updatefilerow")]
        public async Task<IActionResult> Edit(CsvEditRowDTO csv)
        {

            /*Models.File? file = _mySqlContext.File.Where(f => f.FileName == csv.fileName).FirstOrDefault();
            if (file == null)
                return BadRequest("no file with that name");*/

            var endpoint = new Uri("http://127.0.0.1:5000/editcell");
            var folderName = Path.Combine("Resources", "CSVFiles");
            var pathToSave = Path.Combine(Directory.GetCurrentDirectory(), folderName);
            var fileName = csv.fileName;
            var fullPath = Path.Combine(pathToSave, fileName);
            HttpClient client = new HttpClient(); 
            var csvJson = JsonConvert.SerializeObject(csv);
            var response = await client.PostAsync(endpoint, new StringContent(csvJson, Encoding.UTF8, "application/json"));
            using (var fs = new FileStream(
                fullPath,
                FileMode.OpenOrCreate,FileAccess.Write))
            {
                await response.Content.CopyToAsync(fs);
            }
            return Ok();

        }

        [DisableRequestSizeLimit]
        [HttpPost("deletefilerow")]
        public async Task<IActionResult> Delete(CsvDeleteRowDTO csv)
        {

            /*Models.File? file = _mySqlContext.File.Where(f => f.FileName == csv.fileName).FirstOrDefault();
            if (file == null)
                return BadRequest("no file with that name");*/

            var endpoint = new Uri("http://127.0.0.1:5000/deleterow");
            var folderName = Path.Combine("Resources", "CSVFiles");
            var pathToSave = Path.Combine(Directory.GetCurrentDirectory(), folderName);
            var fileName = csv.fileName;
            var fullPath = Path.Combine(pathToSave, fileName);
            HttpClient client = new HttpClient();
            var csvJson = JsonConvert.SerializeObject(csv);
            var response = await client.PostAsync(endpoint, new StringContent(csvJson, Encoding.UTF8, "application/json"));
            using (var fs = new FileStream(
                fullPath,
                FileMode.OpenOrCreate, FileAccess.Write))
            {
                await response.Content.CopyToAsync(fs);
            }
            return Ok();

        }

        [HttpGet("{filename}")]
        public async Task<IActionResult> downloadfile(string filename)
        {
            Models.File? file = _mySqlContext.File.Where(f => f.RandomFileName == filename).FirstOrDefault();
            if (file == null)
                return BadRequest("no file with that name");
            var folderName = Path.Combine("Resources", "CSVFiles");
            var pathToSave = Path.Combine(Directory.GetCurrentDirectory(), folderName);
            var fileName = file.RandomFileName;
            var fullPath = Path.Combine(pathToSave, fileName);

            var bytes = await System.IO.File.ReadAllBytesAsync(fullPath);
            return File(bytes, "csv/plain", Path.GetFileName(fullPath));
        }

        [HttpPost("updatefilecall")]
        public async Task<IActionResult> UpdateFileCall()
        {
            var endpoint = new Uri("http://127.0.0.1:5000/editcell");
            var folderName = Path.Combine("Resources", "CSVFiles");
            var pathToSave = Path.Combine(Directory.GetCurrentDirectory(), folderName);
            var fileName = "prvipokusaj.csv";
            var fullPath = Path.Combine(pathToSave, fileName);
            WebClient webClient = new WebClient();
            await webClient.DownloadFileTaskAsync(endpoint, fullPath);
            return Ok();
        }

    }
}
