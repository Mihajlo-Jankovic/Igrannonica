using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Igrannonica.DataTransferObjects;
using Igrannonica.Models;
using CsvHelper;
using System.Globalization;
using Microsoft.Net.Http.Headers;
using System.Net;
using Microsoft.AspNetCore.WebUtilities;

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
        public async Task<IActionResult> Edit(CsvEditRowDTO csv)
        {

            Models.File? file = _mySqlContext.File.Where(f => f.FileName == csv.fileName).FirstOrDefault();
            if (file == null)
                return BadRequest("no file with that name");

            using (var client = new HttpClient())
            {
                var endpoint = new Uri("http://127.0.0.1:5000/simpleget");
                var result = client.GetAsync(endpoint).Result;
                //var json = result.;
                //return Ok(json);
                return Ok(result);
            }

            
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

        [HttpPost("updatefilecall")]
        public async Task<IActionResult> UpdateFileCall()
        {
            using (var client = new HttpClient())
            {
                var endpoint = new Uri("http://127.0.0.1:5000/editcell");
                var request = HttpContext.Request;// validation of Content-Type
                                                  // 1. first, it must be a form-data request
                                                  // 2. a boundary should be found in the Content-Type
                if (!request.HasFormContentType ||
                    !MediaTypeHeaderValue.TryParse(request.ContentType, out var mediaTypeHeader) ||
                    string.IsNullOrEmpty(mediaTypeHeader.Boundary.Value))
                {
                    return Ok("los tip fajla");
                }

                var reader = new MultipartReader(mediaTypeHeader.Boundary.Value, request.Body);
                var section = await reader.ReadNextSectionAsync();

                // This sample try to get the first file from request and save it
                // Make changes according to your needs in actual use
                while (section != null)
                {
                    var hasContentDispositionHeader = ContentDispositionHeaderValue.TryParse(section.ContentDisposition,
                        out var contentDisposition);

                    if (hasContentDispositionHeader && contentDisposition.DispositionType.Equals("form-data") &&
                        !string.IsNullOrEmpty(contentDisposition.FileName.Value))
                    {
                        // Don't trust any file name, file extension, and file data from the request unless you trust them completely
                        // Otherwise, it is very likely to cause problems such as virus uploading, disk filling, etc
                        // In short, it is necessary to restrict and verify the upload
                        // Here, we just use the temporary folder and a random file name

                        // Get the temporary folder, and combine a random file name with it

                        var trustedFileNameForDisplay = WebUtility.HtmlEncode(
                                contentDisposition.FileName.Value);
                        var folderName = Path.Combine("Resources", "CSVFilesUnauthorized");
                        var pathToSave = Path.Combine(Directory.GetCurrentDirectory(), folderName);
                        var RandomFileName = contentDisposition.FileName.Value;
                        var fullPath = Path.Combine(pathToSave, RandomFileName);
                        using (var targetStream = new FileStream(fullPath, FileMode.Create))
                        {
                            await section.Body.CopyToAsync(targetStream);
                            targetStream.Dispose();
                        }
                        return Ok(contentDisposition.FileName.Value);
                    }

                    section = await reader.ReadNextSectionAsync();
                }
                // If the code runs to this location, it means that no files have been saved
                return BadRequest("No files data in the request.");
            }
        }

        
    }
}
