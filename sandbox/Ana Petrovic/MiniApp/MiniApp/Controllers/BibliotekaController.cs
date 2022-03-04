using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using MiniApp.Models;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace MiniApp.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class BibliotekaController : ControllerBase
    {
        private readonly BibliotekaContext _context;

        public BibliotekaController(BibliotekaContext context)
        {
            _context = context;
        }

        [HttpGet]
        public async Task<ActionResult<IEnumerable<Biblioteka>>> GetBiblioteka()
        {
            return await _context.Biblioteke.ToListAsync();
        }

        // GET: api/KorisnikDetalji/5
        [HttpGet("{id}")]
        public async Task<ActionResult<Biblioteka>> GetBiblioteka(int id)
        {
            var biblioteka = await _context.Biblioteke.FindAsync(id);

            if (biblioteka == null)
            {
                return NotFound();
            }

            return biblioteka;
        }

        // PUT: api/KorisnikDetalji/5
        // To protect from overposting attacks, see https://go.microsoft.com/fwlink/?linkid=2123754
        [HttpPut("{id}")]
        public async Task<IActionResult> PutBiblioteka(int id, Biblioteka biblioteke)
        {
            if (id != biblioteke.Id)
            {
                return BadRequest();
            }

            _context.Entry(biblioteke).State = EntityState.Modified;

            try
            {
                await _context.SaveChangesAsync();
            }
            catch (DbUpdateConcurrencyException)
            {
                if (!BibliotekaExists(id))
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

        // POST: api/KorisnikDetalji
        // To protect from overposting attacks, see https://go.microsoft.com/fwlink/?linkid=2123754
        [HttpPost]
        public async Task<ActionResult<Biblioteka>> PostBiblioteka(Biblioteka biblioteka)
        {
            _context.Biblioteke.Add(biblioteka);
            await _context.SaveChangesAsync();

            return CreatedAtAction("GetBiblioteka", new { id = biblioteka.Id }, biblioteka);
        }

        // DELETE: api/KorisnikDetalji/5
        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteBiblioteka(int id)
        {
            var Biblioteka = await _context.Biblioteke.FindAsync(id);
            if (Biblioteka == null)
            {
                return NotFound();
            }

            _context.Biblioteke.Remove(Biblioteka);
            await _context.SaveChangesAsync();

            return NoContent();
        }

        public static implicit operator BibliotekaController(BibliotekaContext v)
        {
            throw new NotImplementedException();
        }
        private bool BibliotekaExists(int id)
        {
            return _context.Biblioteke.Any(e => e.Id == id);
        }
    }
}
