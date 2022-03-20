using Igrannonica.Models;
using LumenWorks.Framework.IO.Csv;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using MongoDB.Bson;
using MongoDB.Driver;
using Sylvan.Data.Csv;
using System.Data;
using System.Net.Http.Headers;
﻿using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.WebUtilities;
using Microsoft.Extensions.Logging;
using Microsoft.Net.Http.Headers;
using System.IO;
using System.Threading.Tasks;

namespace LargeFilesSample.Controllers
{
    /// <summary>
    /// controller for upload large file
    /// </summary>
    [ApiController]
    [Route("api/[controller]")]
    public class FileUploadController : ControllerBase
    {
        [HttpPost, DisableRequestSizeLimit]
        private readonly ILogger<FileUploadController> _logger;

        public FileUploadController(ILogger<FileUploadController> logger)
        {
            _logger = logger;
        }

        /// <summary>
        /// Action for upload large file
        /// </summary>
        /// <remarks>
        /// Request to this action will not trigger any model binding or model validation,
        /// because this is a no-argument action
        /// </remarks>
        /// <returns></returns>
        [DisableRequestSizeLimit] 
        [HttpPost]
        [Route(nameof(Upload))]
        public async Task<IActionResult> Upload()
        {
            var request = HttpContext.Request;

            // validation of Content-Type
            // 1. first, it must be a form-data request
            // 2. a boundary should be found in the Content-Type
            if (!request.HasFormContentType ||
                !MediaTypeHeaderValue.TryParse(request.ContentType, out var mediaTypeHeader) ||
                string.IsNullOrEmpty(mediaTypeHeader.Boundary.Value))
            {
                return new UnsupportedMediaTypeResult();
            }

            var reader = new MultipartReader(mediaTypeHeader.Boundary.Value, request.Body);
            var section = await reader.ReadNextSectionAsync();

            // This sample try to get the first file from request and save it
            // Make changes according to your needs in actual use
            while (section != null)
            {
                CSVFile DBFile = new CSVFile();
                var client = new MongoClient("mongodb://localhost:27017");
                var database = client.GetDatabase("IgrannonicaDB");
                var file = Request.Form.Files[0];

                if (file.Length > 0)
                {
                    var fileName = ContentDispositionHeaderValue.Parse(file.ContentDisposition).FileName.Trim('"');
                    var fileStream = file.OpenReadStream();
                    DataTable csvTable = new DataTable();
                    using (CsvReader csvReader =
                        new CsvReader(new StreamReader(fileStream), true))
                    {
                        csvTable.Load(csvReader);
                    }

                    await SaveDataTableToCollection(csvTable, fileName);

                    return Ok("okej");
                }
                return BadRequest("nema fajla");
            }
            catch (Exception ex)
            {
                return BadRequest(ex.Message);
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
                    var folderName = Path.Combine("Resources", "CSVFiles");
                    var pathToSave = Path.Combine(Directory.GetCurrentDirectory(), folderName);
                    var fileName = "asdasdasdasd.csv";
                    var fullPath = Path.Combine(pathToSave, fileName);

                    using (var targetStream = new FileStream(fullPath, FileMode.Create))
                    {
                        await section.Body.CopyToAsync(targetStream);
                    }

                    return Ok();
                }

                section = await reader.ReadNextSectionAsync();
            }

            // If the code runs to this location, it means that no files have been saved
            return BadRequest("No files data in the request.");
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