using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using System.Net.Http;

namespace KonekcijaSaPythonom
{
    class Program
    {
        HttpClient client = new HttpClient();
        static async Task Main(string[] args)
        {
            Program program = new Program();
            await program.DoSomething();
        }
        private async Task DoSomething()
        {
            string response = await client.GetStringAsync("http://localhost:8080");
            Console.WriteLine(response);
            Console.ReadKey();
        }
    }
}
