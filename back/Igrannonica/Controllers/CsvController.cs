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
        public CsvController(MySqlContext mySqlContext, IUserService userService)
        {
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
            return File(bytes, "csv/plain", file.FileName);
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
    }
}
