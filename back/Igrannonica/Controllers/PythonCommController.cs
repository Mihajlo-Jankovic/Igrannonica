using Igrannonica.Models;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Newtonsoft.Json;
using System.Text;
using Igrannonica.DataTransferObjects;
using Microsoft.AspNetCore.SignalR;
using Igrannonica.Hubs;
using Newtonsoft.Json.Linq;

namespace Igrannonica.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class PythonCommController : ControllerBase
    {

        private IHubContext<ChatHub> _hub;
        private IConfiguration _configuration;

        public PythonCommController(IHubContext<ChatHub> hub, IConfiguration configuration)
        {
            _configuration = configuration;
            _hub = hub;
        }

        

        [HttpPost("getTableData")]
        public async Task<ActionResult<string>> GetTableData(TableDataDTO parameters)
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
                    PageNum = parameters.PageNum,
                    ColName = parameters.ColName
                };
                var newPostJson = JsonConvert.SerializeObject(newPost);

                var payload = new StringContent(newPostJson, Encoding.UTF8, "application/json");
                var result = client.PostAsync(endpoint, payload).Result.Content.ReadAsStringAsync().Result;
                return Ok(result);
            }
        }

        [HttpPost("getStatistics")]
        public async Task<ActionResult<string>> GetStatistics(StatisticsDTO parameters)
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
            return Ok(new {responseMessage = _configuration.GetSection("ResponseMessages:Success").Value });
        }
    }
}
