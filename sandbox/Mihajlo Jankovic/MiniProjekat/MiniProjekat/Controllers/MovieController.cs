using Microsoft.AspNetCore.Mvc;
using MiniProjekat.Models;
using MiniProjekat.Service;

namespace MiniProjekat.Controllers
{
    [Route("/api/movies")]
    [ApiController]
    public class MovieController : ControllerBase
    {
        MovieService movieService = new MovieService();

        [HttpGet]
        public ActionResult<List<Movie>> GetAll()
        {
            return movieService.getAllMovies();
        }

        [HttpPost]
        public async Task<IActionResult> addMovie(Movie movie)
        {
            bool flag = movieService.addMovie(movie);
            
            if (!flag)
            {
                return NotFound();
            }

            return NoContent();
        }

        [HttpDelete("/api/movies/{id}")]
        public async Task<IActionResult> DeleteMovie(int id)
        {
            bool flag = movieService.deleteMovie(id);
            
            if (!flag)
            {
                return NotFound();
            }

            return NoContent();
        }

    }
}