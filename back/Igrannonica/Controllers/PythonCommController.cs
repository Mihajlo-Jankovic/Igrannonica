using Igrannonica.Models;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Newtonsoft.Json;
using System.Text;

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
                var endpoint = new Uri("http://localhost:8080");
                var result = client.GetAsync(endpoint).Result;
                var json = result.Content.ReadAsStringAsync().Result;
                return Ok(json);
            }
        }

        [HttpPost("postRequest")]
        public async Task<ActionResult<string>> SendPostRequest()
        {
            using (var client = new HttpClient())
            {
                var endpoint = new Uri("http://localhost:8080");
                var newPost = new PythonRequest()
                {
                    Title = "test",
                    Body = "test",
                    Id = 4
                };
                var newPostJson = JsonConvert.SerializeObject(newPost);
                var payload = new StringContent(newPostJson, Encoding.UTF8, "application/json");
                var result = client.PostAsync(endpoint, payload).Result.Content.ReadAsStringAsync().Result;
                return Ok(result);
            }
        }
    }
}
