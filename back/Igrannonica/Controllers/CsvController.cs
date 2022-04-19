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
using Igrannonica.Services.UserService;
using Microsoft.AspNetCore.Authorization;

namespace Igrannonica.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class CsvController : ControllerBase
    {
        private User user = new User();
        private readonly MySqlContext _mySqlContext;
        private readonly IUserService _userService;
        private readonly IConfiguration _configuration;
        public CsvController(MySqlContext mySqlContext, IUserService userService, IConfiguration configuration)
        {
            _configuration = configuration;
            _mySqlContext = mySqlContext;
            _userService = userService;
        }

        [DisableRequestSizeLimit]
        [HttpPost("updatefilerow")]
        public async Task<IActionResult> Edit(CsvEditRowDTO csv)
        {

            /*Models.File? file = _mySqlContext.File.Where(f => f.FileName == csv.fileName).FirstOrDefault();
            if (file == null)
                return BadRequest("no file with that name");*/

            var endpoint = new Uri(_configuration.GetSection("PythonServerLinks:Link").Value
                    + _configuration.GetSection("PythonServerPorts:FileUploadServer").Value
                    + _configuration.GetSection("Endpoints:EditCell").Value);
            
            HttpClient client = new HttpClient(); 
            var csvJson = JsonConvert.SerializeObject(csv);
            var response = await client.PostAsync(endpoint, new StringContent(csvJson, Encoding.UTF8, "application/json"));
            
            return Ok();

        }

        [DisableRequestSizeLimit]
        [HttpPost("deletefilerow")]
        public async Task<IActionResult> Delete(CsvDeleteRowDTO csv)
        {

            /*Models.File? file = _mySqlContext.File.Where(f => f.FileName == csv.fileName).FirstOrDefault();
            if (file == null)
                return BadRequest("no file with that name");*/

            var endpoint = new Uri(_configuration.GetSection("PythonServerLinks:Link").Value
                    + _configuration.GetSection("PythonServerPorts:FileUploadServer").Value
                    + _configuration.GetSection("Endpoints:DeleteRow").Value);
            
            HttpClient client = new HttpClient();
            var csvJson = JsonConvert.SerializeObject(csv);
            var response = await client.PostAsync(endpoint, new StringContent(csvJson, Encoding.UTF8, "application/json"));
            
            return Ok();

        }

        [HttpGet("{filename}")]
        public async Task<IActionResult> downloadfile(string filename)
        {
            Models.File? file = _mySqlContext.File.Where(f => f.RandomFileName == filename).FirstOrDefault();
            if (file == null)
                return BadRequest("no file with that name");
            HttpClient client = new HttpClient();
            var endpoint = new Uri(_configuration.GetSection("PythonServerLinks:Link").Value
                    + _configuration.GetSection("PythonServerPorts:FileUploadServer").Value
                    + _configuration.GetSection("Endpoints:DownloadFile").Value + filename);
            var response = await client.GetAsync(endpoint);
            var bytes = await response.Content.ReadAsByteArrayAsync();
            return File(bytes, "csv/plain", filename);
        }

        

        
        [HttpGet("getCSVAuthorized"), Authorize]
        public async Task<ActionResult<List<Models.File>>> GetCSVAuthorized()
        {
            using (var client = new HttpClient())
            {
                var usernameOriginal = _userService.GetUsername();
                User user = _mySqlContext.User.Where(u => u.username == usernameOriginal).FirstOrDefault();
                
                if (user == null)
                    return BadRequest("JWT is bad!");

                List < Models.File > tmpList = _mySqlContext.File.Where(u => u.UserForeignKey == user.id || u.IsPublic == true).ToList();

                List<dynamic> files = new List<dynamic>();

                foreach (var tmp in tmpList)
                {
                    User tmpUser = _mySqlContext.User.Where(u => u.id == tmp.UserForeignKey).FirstOrDefault();

                    var file = new { fileId = tmp.Id, fileName = tmp.FileName, userId = tmp.UserForeignKey, username = tmpUser.username, isPublic = tmp.IsPublic, randomFileName = tmp.RandomFileName };
                    files.Add(file);
                }

                return Ok(files);
            }
        }
        

        
        [HttpGet("getCSVUnauthorized")]
        public async Task<ActionResult<List<Models.File>>> GetCSVUnauthorized()
        {
            using (var client = new HttpClient())
            {
                List<Models.File> tmpList = _mySqlContext.File.Where(u => u.IsPublic == true).ToList();

                List<dynamic> files = new List<dynamic>();

                foreach (var tmp in tmpList)
                {

                    User tmpUser = _mySqlContext.User.Where(u => u.id == tmp.UserForeignKey).FirstOrDefault();

                    var file = new { fileName = tmp.FileName, userId = tmp.UserForeignKey, username = tmpUser.username, isPublic = tmp.IsPublic, randomFileName = tmp.RandomFileName };
                    files.Add(file);
                }

                return Ok(files);
            }
        }
        
        [HttpPost("updateVisibility"), Authorize]
        public async Task<ActionResult<string>> UpdateVisibility(VisibilityDTO request)
        {
            var usernameOriginal = _userService.GetUsername();
            User user = _mySqlContext.User.Where(u => u.username == usernameOriginal).FirstOrDefault();
            
            if (user == null)
                return BadRequest("JWT is bad!");

            Models.File file = _mySqlContext.File.Where(f => f.Id == request.Id).FirstOrDefault();

            if (file.UserForeignKey != user.id)
                return BadRequest("JWT is bad!");

            file.IsPublic = request.IsVisible;

            _mySqlContext.File.Update(file);
            await _mySqlContext.SaveChangesAsync();

            return Ok("Success!");
        }

    }
}
