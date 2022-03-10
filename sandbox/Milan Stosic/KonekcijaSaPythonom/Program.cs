using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using System.Net.Http;
using Newtonsoft.Json;

namespace KonekcijaSaPythonom
{
    class Program
    {
        static void Main(string[] args)
        {
            SendPostRequest();
        }

        public static void SendGetRequest()
        {
            using (var client = new HttpClient())
            {
                var endpoint = new Uri("http://localhost:8080");
                var result = client.GetAsync(endpoint).Result;
                var json = result.Content.ReadAsStringAsync().Result;
                Console.WriteLine(json);
                Console.ReadLine();
            }
        }

        public static void SendPostRequest()
        {
            using (var client = new HttpClient())
            {
                var endpoint = new Uri("http://localhost:8080");
                var newPost = new Post()
                {
                    Title = "test",
                    Body = "test",
                    Id = 4
                };
                var newPostJson = JsonConvert.SerializeObject(newPost);
                var payload = new StringContent(newPostJson, Encoding.UTF8, "application/json");
                var result = client.PostAsync(endpoint, payload).Result.Content.ReadAsStringAsync().Result;
                Console.WriteLine(result);
                Console.ReadLine();
            }
        }
    }
}
