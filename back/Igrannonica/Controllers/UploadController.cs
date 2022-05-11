using Igrannonica.DataTransferObjects;
using Igrannonica.Models;
using Igrannonica.Services.EncryptionService;
using Igrannonica.Services.UserService;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.WebUtilities;
using Microsoft.Extensions.Logging;
using Microsoft.IdentityModel.Tokens;
using Microsoft.Net.Http.Headers;
using Newtonsoft.Json;
using System.IdentityModel.Tokens.Jwt;
using System.Net;
using System.Security.Claims;
using System.Text;
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

        [HttpPost("usefileauthorized"),]
        public async Task<IActionResult> UseFileAuthorized(UsageDTO usageDTO)
        {
            

            var NewRandomFileName = string.Format("{0}.csv", Path.GetRandomFileName().Replace(".", string.Empty));
            HttpClient client = new HttpClient();
            client.DefaultRequestHeaders.Accept.ParseAdd("application/json");
            var endpoint = new Uri(_configuration.GetSection("PythonServerLinks:Link").Value
            + _configuration.GetSection("PythonServerPorts:FileUploadServer").Value
            + _configuration.GetSection("Endpoints:CopyFile").Value);

            var newPostJson = JsonConvert.SerializeObject(new {
                                                                usageDTO.OldRandomFileName,
                                                                NewRandomFileName
                                                              });
            
            var payload = new StringContent(newPostJson, Encoding.UTF8, "application/json");
            var httpResponse = await client.PostAsync(endpoint, payload);
            var response = await httpResponse.Content.ReadAsStringAsync();

            if (usageDTO.ConnectToUser == 1)
            {
                User? user = _context.User.Where(u => u.username == usageDTO.username).FirstOrDefault();
                if (user == null)
                    return BadRequest(new { responseMessage = "No username with that name" });
                Models.File file = new Models.File
                {
                    RandomFileName = NewRandomFileName,
                    DateCreated = DateTime.Now,
                    FileName = usageDTO.FileName,
                    UserForeignKey = user.id,
                    IsPublic = false
                };

                await _context.File.AddAsync(file);
                await _context.SaveChangesAsync();
            }
            return Ok(new { randomFileName = NewRandomFileName });
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

            User? user = _context.User.Where(u => u.username == userName).FirstOrDefault();
            Models.File file = new Models.File();
            var RandomFileName = string.Format("{0}.csv", Path.GetRandomFileName().Replace(".", string.Empty));
            file.RandomFileName = RandomFileName;
            file.DateCreated = DateTime.Now;
            var task = UploadFile(request, RandomFileName);
            if (task.Result == "Bad file type in the request" || task.Result == "No files data in the request.")
                return BadRequest(task.Result);
            file.FileName = task.Result;
            file.UserForeignKey = user.id;
            file.IsPublic = false;
            await _context.File.AddAsync(file);
            await _context.SaveChangesAsync();
            return Ok(new { randomFileName = RandomFileName });

        }

        [DisableRequestSizeLimit]
        [HttpPost("unauthorized")]
        public async Task<IActionResult> UploadUnauthorized()
        {
            var RandomFileName = string.Format("{0}.csv", Path.GetRandomFileName().Replace(".", string.Empty));
            var request = HttpContext.Request;
            
            var task = UploadFile(request, RandomFileName);
            if (task.Result == "Bad file type in the request" || task.Result == "No files data in the request.")
                return BadRequest(task.Result);
            return Ok(new { randomFileName = RandomFileName });

        }


        [HttpGet("delete-unauthorized/{filename}")]
        public async Task<IActionResult> DeleteFileUnauthorized(string filename)
        {
            HttpClient client = new HttpClient();
            var endpoint = new Uri(_configuration.GetSection("PythonServerLinks:Link").Value
                    + _configuration.GetSection("PythonServerPorts:FileUploadServer").Value
                    + _configuration.GetSection("Endpoints:DeleteFile").Value + filename);

            var response = await client.GetAsync(endpoint);
            var content = await response.Content.ReadAsStringAsync();
            return Ok(content);
        }


        [HttpGet("delete-authorized/{filename}"), Authorize]
        public async Task<IActionResult> DeleteFileAuthorized(string filename)
        {
            Models.File? file = _context.File.Where(f => f.RandomFileName == filename).FirstOrDefault();
            if (file == null)
            {
                return BadRequest(new {reponseMessage = "wrong filename" });
            }
            string username = _userService.GetUsername();
            User? user = _context.User.Where(u => u.username == username).FirstOrDefault();


            if (user.Files.Contains(file) == false)
            {
                return BadRequest(new { reponseMessage = "not your file" });
            }
            _context.Remove(file);
            await _context.SaveChangesAsync();
            HttpClient client = new HttpClient();
            var endpoint = new Uri(_configuration.GetSection("PythonServerLinks:Link").Value
                    + _configuration.GetSection("PythonServerPorts:FileUploadServer").Value
                    + _configuration.GetSection("Endpoints:DeleteFile").Value + filename);
            var response = await client.GetAsync(endpoint);
            var content = await response.Content.ReadAsStringAsync();
            return Ok(content);
        }


        private async Task<string> UploadFile(HttpRequest request, string randomFileName)
        {
            // validation of Content-Type
            // 1. first, it must be a form-data request
            // 2. a boundary should be found in the Content-Type
            if (!request.HasFormContentType ||
                !MediaTypeHeaderValue.TryParse(request.ContentType, out var mediaTypeHeader) ||
                string.IsNullOrEmpty(mediaTypeHeader.Boundary.Value))
            {
                return "Bad file type in the request";
            }
            HttpClient client = new HttpClient();
            client.DefaultRequestHeaders.Accept.ParseAdd("application/json");


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

                    var endpoint = new Uri(_configuration.GetSection("PythonServerLinks:Link").Value
                    + _configuration.GetSection("PythonServerPorts:FileUploadServer").Value
                    + _configuration.GetSection("Endpoints:UploadFile").Value);
                    StreamContent content = new StreamContent(section.Body);
                    var response = await client.PostAsync(endpoint, new MultipartFormDataContent
                    {
                        {content, "file", randomFileName },
                    });

                    return contentDisposition.FileName.Value;
                }

                section = await reader.ReadNextSectionAsync();
            }
            // If the code runs to this location, it means that no files have been saved
            return "No files data in the request.";
        }

    }

}