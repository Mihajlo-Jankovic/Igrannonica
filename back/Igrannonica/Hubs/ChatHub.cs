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


        public string GetConnectionId() => Context.ConnectionId;

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




    }
}
