#nullable disable
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using PorudzbeniceAPI;
using PorudzbeniceAPI.Data;

namespace PorudzbeniceAPI.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class DostaveController : ControllerBase
    {
        private readonly DataContext _context;

        public DostaveController(DataContext context)
        {
            _context = context;
        }

        // GET: api/Dostave
        [HttpGet]
        public async Task<ActionResult<IEnumerable<Dostava>>> GetDostave()
        {
            return await _context.Dostave.ToListAsync();
        }

        // GET: api/Dostave/5
        [HttpGet("{id}")]
        public async Task<ActionResult<Dostava>> GetDostava(int id)
        {
            var dostava = await _context.Dostave.FindAsync(id);

            if (dostava == null)
            {
                return NotFound();
            }

            return dostava;
        }

        // PUT: api/Dostave/5
        // To protect from overposting attacks, see https://go.microsoft.com/fwlink/?linkid=2123754
        [HttpPut("{id}")]
        public async Task<IActionResult> PutDostava(int id, Dostava dostava)
        {
            if (id != dostava.Id)
            {
                return BadRequest();
            }

            _context.Entry(dostava).State = EntityState.Modified;

            try
            {
                await _context.SaveChangesAsync();
            }
            catch (DbUpdateConcurrencyException)
            {
                if (!DostavaExists(id))
                {
                    return NotFound();
                }
                else
                {
                    throw;
                }
            }

            return NoContent();
        }

        // POST: api/Dostave
        // To protect from overposting attacks, see https://go.microsoft.com/fwlink/?linkid=2123754
        [HttpPost]
        public async Task<ActionResult<Dostava>> PostDostava(Dostava dostava)
        {
            _context.Dostave.Add(dostava);
            await _context.SaveChangesAsync();

            return CreatedAtAction("GetDostava", new { id = dostava.Id }, dostava);
        }

        // DELETE: api/Dostave/5
        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteDostava(int id)
        {
            var dostava = await _context.Dostave.FindAsync(id);
            if (dostava == null)
            {
                return NotFound();
            }

            _context.Dostave.Remove(dostava);
            await _context.SaveChangesAsync();

            return NoContent();
        }

        private bool DostavaExists(int id)
        {
            return _context.Dostave.Any(e => e.Id == id);
        }
    }
}
