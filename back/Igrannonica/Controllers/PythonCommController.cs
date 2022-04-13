using Igrannonica.Models;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Newtonsoft.Json;
using System.Text;
using Igrannonica.DataTransferObjects;
using Microsoft.AspNetCore.SignalR;
using Igrannonica.Hubs;

namespace Igrannonica.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class PythonCommController : ControllerBase
    {

        private IHubContext<ChatHub> _hub;

        public PythonCommController(IHubContext<ChatHub> hub)
        {
            _hub = hub;
        }

        [HttpGet("getRequest")]
        public async Task<ActionResult<string>> SendGetRequest()
        {
            using (var client = new HttpClient())
            {
                var endpoint = new Uri("http://127.0.0.1:8000/simpleget");
                var result = client.GetAsync(endpoint).Result;
                var json = result.Content.ReadAsStringAsync().Result;
                return Ok(json);
            }
        }

        [HttpPost("getTableData")]
        public async Task<ActionResult<string>> GetTableData(TableDataDTO parameters)
        {
            using (var client = new HttpClient())
            {
                var endpoint = new Uri("http://127.0.0.1:8000/tabledata");
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

        [HttpPost("getStatistics")]
        public async Task<ActionResult<string>> GetStatistics(StatisticsDTO parameters)
        {
            using (var client = new HttpClient())
            {
                var endpoint = new Uri("http://127.0.0.1:8000/statistics");

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
                var endpoint = new Uri("http://127.0.0.1:5000/startTraining");

                var newPostJson = JsonConvert.SerializeObject(parameters);
                var payload = new StringContent(newPostJson, Encoding.UTF8, "application/json");
                var result = client.PostAsync(endpoint, payload).Result.Content.ReadAsStringAsync().Result;

                return Ok(result);
            }
        }

        [HttpGet("testiranje")]
        public async Task<ActionResult<string>> TestiranjeIstorije()
        {
            using (var client = new HttpClient())
            {
                var endpoint = new Uri("http://127.0.0.1:5000/testiranje");
                var result = client.GetAsync(endpoint).Result;
                var json = result.Content.ReadAsStringAsync().Result;
                return Ok(json);
            }
        }

        [HttpPost("testLive")]
        public async Task<ActionResult<string>> LiveTreniranje(dynamic obj)
        {
            Console.WriteLine(obj.ToString());
            _hub.Clients.Client(obj.ConnID).SendAsync("trainingdata", obj.ToString());
            return Ok("OK");
        }
    }
}
