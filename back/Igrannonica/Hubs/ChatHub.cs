using System;
using Microsoft.AspNetCore.SignalR;
using System.Threading.Tasks;
using Newtonsoft.Json;
using Igrannonica.Models;
using System.Text;

namespace Igrannonica.Hubs
{
    public class ChatHub : Hub
    {
        public override Task OnConnectedAsync()
        {
            Console.WriteLine("--> Connection Established!" + Context.ConnectionId);
            Clients.Client(Context.ConnectionId).SendAsync("ReceiveConnID", Context.ConnectionId);
            return base.OnConnectedAsync();
        }

        public async Task SendMessageAsync(string message)
        {
            var routeOb = JsonConvert.DeserializeObject<dynamic>(message);
            string toClient = routeOb.To;
            Console.WriteLine("Message received on: " + Context.ConnectionId);

            if(toClient == string.Empty)
            {
                await Clients.All.SendAsync("ReceiveMessage", message);
            }
            else
            {
                await Clients.Client(toClient).SendAsync("ReceiveMessage", message);
            }
        }



        /*public string Get(string target) => $"Hello {target} {Context.ConnectionId}";

        public async Task ReceiveStream(IAsyncEnumerable<string> messages, string param)
        {
            Console.WriteLine($"starting to read stream: {param}");

            await foreach (var message in messages)
            {
                Console.WriteLine($"Receiving {message} {param} {Context.ConnectionId}");
            }

            Console.WriteLine("finished stream");
        }*/

    }
}
