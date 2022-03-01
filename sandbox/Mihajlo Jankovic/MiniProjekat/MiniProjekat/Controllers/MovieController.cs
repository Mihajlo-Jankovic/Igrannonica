using Microsoft.AspNetCore.Mvc;
using MiniProjekat.Models;
using MiniProjekat.Service;

namespace MiniProjekat.Controllers
{
    [Route("/")]
    [ApiController]
    public class MovieController : ControllerBase
    {
        MovieService movieService = new MovieService();

        [HttpGet]
        public ActionResult<List<Movie>> GetAll()
        {
            return movieService.getAllMovies();
        }
    }
}