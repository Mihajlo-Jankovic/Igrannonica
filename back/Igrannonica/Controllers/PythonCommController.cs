using Igrannonica.Models;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Newtonsoft.Json;
using System.Text;
using Igrannonica.DataTransferObjects;

namespace Igrannonica.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class PythonCommController : ControllerBase
    {
        [HttpGet("getRequest")]
        public async Task<ActionResult<string>> SendGetRequest()
        {
            using (var client = new HttpClient())
            {
                var endpoint = new Uri("http://127.0.0.1:5000/simpleget");
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
                var endpoint = new Uri("http://127.0.0.1:5000/tabledata");
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
                var endpoint = new Uri("http://127.0.0.1:5000/statistics");

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
        public async Task<ActionResult<string>> LiveTreniranje(Object obj)
        {
            Console.WriteLine(obj.ToString());

            return Ok("OK");
        }
    }
}
