using Igrannonica.DataTransferObjects;
using Igrannonica.Models;
using Igrannonica.Services.EncryptionService;
using Igrannonica.Services.UserService;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.WebUtilities;
using Microsoft.Extensions.Logging;
using Microsoft.Net.Http.Headers;
using System.Net;
using System.Text.Json;
using System.Threading.Tasks;

namespace Igrannonica.Controllers
{
    /// <summary>
    /// controller for upload large file
    /// </summary>
    [ApiController]
    [Route("api/[controller]")]
    public class FileUploadController : ControllerBase
    {
        private readonly ILogger<FileUploadController> _logger;
        private readonly IUserService _userService;
        private readonly MySqlContext _context;
        private readonly IConfiguration _configuration;

        public FileUploadController(IConfiguration configuration, ILogger<FileUploadController> logger, IUserService userService, MySqlContext context)
        {
            _configuration = configuration;
            _logger = logger;
            _userService = userService;
            _context = context;
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
        [HttpPost, Authorize]
        public async Task<IActionResult> UploadAuthorized()
        {
            var request = HttpContext.Request;
            string userName = _userService.GetUsername();

            User user = _context.User.Where(u => u.username == userName).FirstOrDefault();
            Models.File file = new Models.File();
            var folderName = Path.Combine("Resources", "CSVFiles");
            var pathToSave = Path.Combine(Directory.GetCurrentDirectory(), folderName);
            var RandomFileName = string.Format("{0}.csv", Path.GetRandomFileName().Replace(".", string.Empty));
            var fullPath = Path.Combine(pathToSave, RandomFileName);
            var task = UploadFile(request, fullPath);
            if (task.Result == "los tip fajla" || task.Result == "No files data in the request.")
                return BadRequest(task.Result);
            file.FileName = task.Result;
            file.UserForeignKey = user.id;
            await _context.File.AddAsync(file);
            await _context.SaveChangesAsync();
            return Ok("fajl uspesno uploadovan");

        }

        [DisableRequestSizeLimit]
        [HttpPost("unauthorized")]
        public IActionResult UploadUnauthorized()
        {
            var request = HttpContext.Request;

            var folderName = Path.Combine("Resources", "CSVFilesUnauthorized");
            var pathToSave = Path.Combine(Directory.GetCurrentDirectory(), folderName);
            var RandomFileName = string.Format("{0}.csv", Path.GetRandomFileName().Replace(".", string.Empty));
            var encryptedFileName = AesOperation.EncryptString(_configuration.GetSection("AppSettings:Key").Value, RandomFileName);
            var fullPath = Path.Combine(pathToSave, RandomFileName);
            var task = UploadFile(request, fullPath);
            if (task.Result == "los tip fajla" || task.Result == "No files data in the request.")
                return BadRequest(task.Result);
            EncryptedFileNameDTO efn = new EncryptedFileNameDTO();
            efn.filename = encryptedFileName;
            return Ok(efn);

        }

        [HttpGet("delete-unauthorized/{filename}")]
        public IActionResult DeleteFileUnauthorized(EncryptedFileNameDTO efn)
        {
            var filename = AesOperation.DecryptString(_configuration.GetSection("AppSettings:Key").Value, efn.filename);
            var folderName = Path.Combine("Resources", "CSVFilesUnauthorized");
            var pathToSave = Path.Combine(Directory.GetCurrentDirectory(), folderName);
            var fullPath = Path.Combine(pathToSave, filename);
            System.IO.File.Delete(fullPath);
            return Ok();
        }

        private async Task<string> UploadFile(HttpRequest request, string fullPath)
        {
            // validation of Content-Type
            // 1. first, it must be a form-data request
            // 2. a boundary should be found in the Content-Type
            if (!request.HasFormContentType ||
                !MediaTypeHeaderValue.TryParse(request.ContentType, out var mediaTypeHeader) ||
                string.IsNullOrEmpty(mediaTypeHeader.Boundary.Value))
            {
                return "los tip fajla";
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
                    using (var targetStream = new FileStream(fullPath, FileMode.Create))
                    {
                        await section.Body.CopyToAsync(targetStream);
                        targetStream.Dispose();
                    }
                    return contentDisposition.FileName.Value;
                }

                section = await reader.ReadNextSectionAsync();
            }
            // If the code runs to this location, it means that no files have been saved
            return "No files data in the request.";
        }

    }

}