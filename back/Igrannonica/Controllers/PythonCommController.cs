using Igrannonica.Models;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Newtonsoft.Json;
using System.Text;
using Igrannonica.DataTransferObjects;
using Microsoft.AspNetCore.SignalR;
using Igrannonica.Hubs;
using Newtonsoft.Json.Linq;
using Microsoft.AspNetCore.Authorization;
using Igrannonica.Services.UserService;

namespace Igrannonica.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class PythonCommController : ControllerBase
    {
        private readonly MySqlContext _mySqlContext;
        private IHubContext<ChatHub> _hub;
        private IConfiguration _configuration;
        private readonly IUserService _userService;

        public PythonCommController(IHubContext<ChatHub> hub, IConfiguration configuration, IUserService userService, MySqlContext mySqlContext)
        {
            _configuration = configuration;
            _mySqlContext = mySqlContext;
            _hub = hub;
            _userService = userService;
        }

        

        [HttpPost("getTableDataAuthorized"), Authorize]
        public async Task<IActionResult> GetTableDataAuthorized(TableDataDTO parameters)
        {
            var usernameOriginal = _userService.GetUsername();

            Models.File? file = _mySqlContext.File.Where(f => f.FileName == parameters.FileName).FirstOrDefault();
            if (file == null)
                return BadRequest("no file with that name");

            var checkedCredentials = checkCredentials(file.Id, usernameOriginal);

            if (checkedCredentials.Equals(Ok()) == false)
            {
                return checkedCredentials;
            }
            using (var client = new HttpClient())
            {
                var endpoint = new Uri(_configuration.GetSection("PythonServerLinks:Link").Value
                    + _configuration.GetSection("PythonServerPorts:FileUploadServer").Value
                    + _configuration.GetSection("Endpoints:TableData").Value);
                var newPost = new TableDataDTO()
                {
                    FileName = parameters.FileName,
                    DataType = parameters.DataType, //all, null, not null
                    Rows = parameters.Rows,
                    PageNum = parameters.PageNum
                };
                var newPostJson = JsonConvert.SerializeObject(newPost);

                var payload = new StringContent(newPostJson, Encoding.UTF8, "application/json");
                var result = client.PostAsync(endpoint, payload).Result.Content.ReadAsStringAsync().Result;
                return Ok(result);
            }
        }

        [HttpPost("getTableDataUnauthorized")]
        public async Task<IActionResult> GetTableDataUnauthorized(TableDataDTO parameters)
        {
            using (var client = new HttpClient())
            {
                var endpoint = new Uri(_configuration.GetSection("PythonServerLinks:Link").Value
                    + _configuration.GetSection("PythonServerPorts:FileUploadServer").Value
                    + _configuration.GetSection("Endpoints:TableData").Value);
                var newPost = new TableDataDTO()
                {
                    FileName = parameters.FileName,
                    DataType = parameters.DataType, //all, null, not null
                    Rows = parameters.Rows,
                    PageNum = parameters.PageNum
                };
                var newPostJson = JsonConvert.SerializeObject(newPost);

                var payload = new StringContent(newPostJson, Encoding.UTF8, "application/json");
                var result = client.PostAsync(endpoint, payload).Result.Content.ReadAsStringAsync().Result;
                return Ok(result);
            }
        }

        [HttpPost("getStatisticsAuthorized")]
        public async Task<IActionResult> GetStatisticsAuthorized(StatisticsDTO parameters)
        {
            var usernameOriginal = _userService.GetUsername();

            Models.File? file = _mySqlContext.File.Where(f => f.FileName == parameters.FileName).FirstOrDefault();
            if (file == null)
                return BadRequest("no file with that name");

            var checkedCredentials = checkCredentials(file.Id, usernameOriginal);

            if (checkedCredentials.Equals(Ok()) == false)
            {
                return checkedCredentials;
            }
            using (var client = new HttpClient())
            {
                var endpoint = new Uri(_configuration.GetSection("PythonServerLinks:Link").Value
                    + _configuration.GetSection("PythonServerPorts:FileUploadServer").Value
                    + _configuration.GetSection("Endpoints:Statistics").Value);

                var newPost = new StatisticsDTO()
                {
                    FileName = parameters.FileName,
                    ColIndex = parameters.ColIndex
                };

                var newPostJson = JsonConvert.SerializeObject(newPost);
                var payload = new StringContent(newPostJson, Encoding.UTF8, "application/json");
                var result = client.PostAsync(endpoint, payload).Result.Content.ReadAsStringAsync().Result;

                return Ok(result);
            }
        }

        [HttpPost("getStatisticsUnauthorized")]
        public async Task<ActionResult<string>> GetStatisticsUnauthorized(StatisticsDTO parameters)
        {
            using (var client = new HttpClient())
            {
                var endpoint = new Uri(_configuration.GetSection("PythonServerLinks:Link").Value
                    + _configuration.GetSection("PythonServerPorts:FileUploadServer").Value
                    + _configuration.GetSection("Endpoints:Statistics").Value);

                var newPost = new StatisticsDTO()
                {
                    FileName = parameters.FileName,
                    ColIndex = parameters.ColIndex
                };

                var newPostJson = JsonConvert.SerializeObject(newPost);
                var payload = new StringContent(newPostJson, Encoding.UTF8, "application/json");
                var result = client.PostAsync(endpoint, payload).Result.Content.ReadAsStringAsync().Result;

                return Ok(result);
            }
        }

        [HttpPost("startTraining")]
        public async Task<ActionResult<string>> startTraining(TrainingDTO parameters)
        {
            using (var client = new HttpClient())
            {
                var endpoint = new Uri(_configuration.GetSection("PythonServerLinks:Link").Value
                    + _configuration.GetSection("PythonServerPorts:TrainingServer").Value
                    + _configuration.GetSection("Endpoints:StartTraining").Value);

                var newPostJson = JsonConvert.SerializeObject(parameters);
                var payload = new StringContent(newPostJson, Encoding.UTF8, "application/json");
                var result = client.PostAsync(endpoint, payload).Result.Content.ReadAsStringAsync().Result;

                return Ok(result);
            }
        }

       

        [HttpPost("testLive")]
        public async Task<ActionResult<string>> LiveTreniranje(LiveTrainingDTO liveTraining)
        {

            await _hub.Clients.Client(liveTraining.ConnID).SendAsync("trainingdata", liveTraining);
            Console.WriteLine(liveTraining.ConnID);
            //Console.WriteLine(liveTraining.TrainingData.toString());
            return Ok(new {responseMessage = "OK" });
        }

        private IActionResult checkCredentials(int fileID, string username)
        {
            var user = _mySqlContext.User.Where(u => u.username == username).FirstOrDefault();

            if (user == null)
                return BadRequest(new
                {
                    responseMessage = "Error: No user found with that name!"
                });

            var file = _mySqlContext.File.Where(f => f.Id == fileID).FirstOrDefault();

            if (file != null && file.UserForeignKey != user.id && file.IsPublic == false)
                return BadRequest(new
                {
                    responseMessage = "Error: The file you are trying to change doesn't belong to you!"
                });
            return Ok();
        }
    }
}
