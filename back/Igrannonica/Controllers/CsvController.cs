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
            var content = await response.Content.ReadAsStringAsync();
            return Ok(content);

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
            var content = await response.Content.ReadAsStringAsync();
            return Ok(content);

        }

        [HttpGet("{filename}")]
        public async Task<IActionResult> downloadfile(string filename)
        {
            Models.File? file = _mySqlContext.File.Where(f => f.RandomFileName == filename).FirstOrDefault();
            if (file == null) 
                return BadRequest(new
                {
                    responseMessage = _configuration.GetSection("ResponseMessages:BadFileName").Value
                });
            HttpClient client = new HttpClient();
            var endpoint = new Uri(_configuration.GetSection("PythonServerLinks:Link").Value
                    + _configuration.GetSection("PythonServerPorts:FileUploadServer").Value
                    + _configuration.GetSection("Endpoints:DownloadFile").Value + filename);
            var response = await client.GetAsync(endpoint);
            var bytes = await response.Content.ReadAsByteArrayAsync();
            return File(bytes, "csv/plain", filename);
        }

        private int paging(string flag, int numPerPage, int userId)
        {
            List<Models.File> tmpList;

            if (flag == "public")
            {
                tmpList = _mySqlContext.File.Where(f => f.IsPublic == true).ToList();
            }

            else
            {
                tmpList = _mySqlContext.File.Where(u => u.UserForeignKey == userId).ToList();
            }

            int numOfPages;
            int numOfFiles = 0;

            foreach (var tmp in tmpList)
            {
                numOfFiles++;
            }

            if (numOfFiles % numPerPage != 0) { numOfPages = numOfFiles / numPerPage; numOfPages++; }
            else numOfPages = numOfFiles / numPerPage;

            return numOfPages;
        }


        [HttpPost("getCSVAuthorized"), Authorize]
        public async Task<ActionResult<List<Models.File>>> GetCSVAuthorized(PagingDTO dto)
        {
            var usernameOriginal = _userService.GetUsername();
            User user = _mySqlContext.User.Where(u => u.username == usernameOriginal).FirstOrDefault();

            if (user == null) return BadRequest("JWT is bad!");

            List <dynamic> files = new List<dynamic>();

            if (dto.Visibility == "public")
            {
                List<Models.File> tmpList = _mySqlContext.File.OrderByDescending(f => f.DateCreated).Where(f => f.IsPublic == true).Take(dto.NumPerPage * dto.PageNum).ToList();

                if (dto.NumOfPages == 0) dto.NumOfPages = paging("public", dto.NumPerPage, 0);

                int i = 0;
                foreach (var tmp in tmpList)
                {
                    if (i < (dto.PageNum - 1) * dto.NumPerPage) { i++; continue; }

                    User tmpUser = _mySqlContext.User.Where(u => u.id == tmp.UserForeignKey).FirstOrDefault();

                    var file = new { fileId = tmp.Id, fileName = tmp.FileName, dateCreated = tmp.DateCreated.ToString("MM/dd/yyyy hh:mm tt"), userId = tmp.UserForeignKey, username = tmpUser.username, isPublic = tmp.IsPublic, randomFileName = tmp.RandomFileName };
                    files.Add(file);
                }
            }

            else
            {
                List<Models.File> tmpList = _mySqlContext.File.OrderByDescending(f => f.DateCreated).Where(u => u.UserForeignKey == user.id).Take(dto.NumPerPage * dto.PageNum).ToList();

                if (dto.NumOfPages == 0) dto.NumOfPages = paging("mydataset", dto.NumPerPage, user.id);

                int i = 0;
                foreach (var tmp in tmpList)
                {
                    if (i < (dto.PageNum - 1) * dto.NumPerPage) { i++; continue; }

                    var file = new { fileId = tmp.Id, fileName = tmp.FileName, dateCreated = tmp.DateCreated.ToString("MM/dd/yyyy hh:mm tt"), userId = tmp.UserForeignKey, username = user.username, isPublic = tmp.IsPublic, randomFileName = tmp.RandomFileName };
                    files.Add(file);
                }
            }

            return Ok(new { files = files, numOfPages = dto.NumOfPages });
        }

        [HttpPost("getCSVUnauthorized")]
        public async Task<ActionResult<List<Models.File>>> GetCSVUnauthorized(PagingDTO dto)
        {
            List<Models.File> tmpList = _mySqlContext.File.OrderByDescending(f => f.DateCreated).Where(f => f.IsPublic == true).Take(dto.NumPerPage * dto.PageNum).ToList();

            if (dto.NumOfPages == 0) dto.NumOfPages = paging("public", dto.NumPerPage, 0);

            List<dynamic> files = new List<dynamic>();

            int i = 0;
            foreach (var tmp in tmpList)
            {
                if (i < (dto.PageNum - 1) * dto.NumPerPage) { i++; continue; }

                User tmpUser = _mySqlContext.User.Where(u => u.id == tmp.UserForeignKey).FirstOrDefault();

                var file = new { fileName = tmp.FileName, dateCreated = tmp.DateCreated.ToString("MM/dd/yyyy hh:mm tt"), userId = tmp.UserForeignKey, username = tmpUser.username, isPublic = tmp.IsPublic, randomFileName = tmp.RandomFileName };
                files.Add(file);
            }

            return Ok(new { files = files, numOfPages = dto.NumOfPages });
        }
        
        [HttpPost("updateVisibility"), Authorize]
        public async Task<ActionResult<string>> UpdateVisibility(VisibilityDTO request)
        {
            var usernameOriginal = _userService.GetUsername();
            User user = _mySqlContext.User.Where(u => u.username == usernameOriginal).FirstOrDefault();
            
            if (user == null) 
                return BadRequest(new
                {
                    responseMessage = _configuration.GetSection("ResponseMessages:UsernameNotFound").Value
                });

            Models.File file = _mySqlContext.File.Where(f => f.Id == request.Id).FirstOrDefault();

            if (file.UserForeignKey != user.id)
                return BadRequest(new
                {
                    responseMessage = _configuration.GetSection("ResponseMessages:WrongFileAccess").Value
                });

            file.IsPublic = request.IsVisible;

            _mySqlContext.File.Update(file);
            await _mySqlContext.SaveChangesAsync();

            return Ok(new { responseMessage = _configuration.GetSection("ResponseMessages:Success").Value });
        }

        [HttpPost("fillmissingvaluesAuthorized"), Authorize]
        public async Task<IActionResult> FillMissingValuesAuthorized(ValuesToChangeDTO missingValues)
        {
            var usernameOriginal = _userService.GetUsername();
            var result = await changeValues(_configuration.GetSection("Endpoints:FillMissingValues").Value, missingValues, usernameOriginal);

            return Ok(result);
        }

        [HttpPost("fillmissingvaluesunauthorized")]
        public async Task<IActionResult> FillMissingValuesUnauthorized(ValuesToChangeDTO missingValues)
        {
            var result = await changeValues(_configuration.GetSection("Endpoints:FillMissingValues").Value, missingValues, null);

            return Ok(result);
        }

        [HttpPost("changeoutliersauthorized"), Authorize]
        public async Task<IActionResult> ChangeOutliersAuthorized(ValuesToChangeDTO missingValues)
        {
            var usernameOriginal = _userService.GetUsername();
            var result = await changeValues(_configuration.GetSection("Endpoints:ChangeOutliers").Value, missingValues, usernameOriginal);

            return Ok(result);
        }

        [HttpPost("changeoutliersunauthorized")]
        public async Task<IActionResult> ChangeOutliersUnauthorized(ValuesToChangeDTO missingValues)
        {
            var result = await changeValues(_configuration.GetSection("Endpoints:ChangeOutliers").Value, missingValues, null);

            return Ok(result);
        }

        private async Task<IActionResult> changeValues(string endpointValue, ValuesToChangeDTO missingValues, string? usernameOriginal)
        {
            if (usernameOriginal != null)
            {
                User user = _mySqlContext.User.Where(u => u.username == usernameOriginal).FirstOrDefault();

                if (user == null)
                    return BadRequest(new
                    {
                        responseMessage = "Error: No user found with that name!"
                    });

                Models.File file = _mySqlContext.File.Where(f => f.FileName == missingValues.FileName).FirstOrDefault();

                if (file.UserForeignKey != user.id)
                    return BadRequest(new
                    {
                        responseMessage = "Error: The file you are trying to change doesn't belong to you!"
                    });
            }
            using var client = new HttpClient();
            var endpoint = new Uri(_configuration.GetSection("PythonServerLinks:Link").Value
                + _configuration.GetSection("PythonServerPorts:TrainingServer").Value
                + endpointValue);

            var newPostJson = JsonConvert.SerializeObject(missingValues);
            var payload = new StringContent(newPostJson, Encoding.UTF8, "application/json");
            var result = client.PostAsync(endpoint, payload).Result.Content.ReadAsStringAsync().Result;

            return Ok(result);
        }
    }
}
