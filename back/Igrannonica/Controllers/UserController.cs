#nullable disable
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Igrannonica.Models;
using System.Security.Cryptography;
using System.Security.Claims;
using Microsoft.IdentityModel.Tokens;
using System.IdentityModel.Tokens.Jwt;
using Microsoft.AspNetCore.Authorization;
using Igrannonica.DataTransferObjects;
using Igrannonica.Services.UserService;
using MongoDB.Driver;
using MongoDB.Driver.Builders;
using MongoDB.Bson;
using System.Text;

namespace Igrannonica.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class UserController : ControllerBase
    {
        private User user = new User();
        private readonly IHostEnvironment _hostEnvironment;
        private readonly IConfiguration _configuration;
        private readonly IUserService _userService;
        private readonly MySqlContext _context;

        private string mongoConnString = "mongodb://Cortex:hPkyrLiG@147.91.204.115:10109/Cortex"; // mongodb://Cortex:hPkyrLiG@localhost:10109/?authSource=admin 1

        


        public UserController(MySqlContext context, IConfiguration configuration, IUserService userService, IHostEnvironment hostEnvironment)
        {
            _configuration = configuration;
            _userService = userService;
            _context = context;

            _hostEnvironment = hostEnvironment;

            /*if(_env.IsProduction()) mongoConnString = _configuration.GetConnectionString("MongoProdConnection");
            else mongoConnString = _configuration.GetConnectionString("MongoDevConnection");

            Console.WriteLine(mongoConnString);*/
        }


        [HttpPost("register")]
        public async Task<ActionResult<User>> Register(UserDTO request)
        {
            TokenDTO token = new TokenDTO();
            User user = _context.User.Where(u => u.username == request.username).FirstOrDefault();
            if(user != null)
            {
                token.token = "Username already exists!";
                return Ok(token);
            }
            user = _context.User.Where(u => u.email == request.email).FirstOrDefault();
            if(user != null)
            {
                token.token = "Email is taken!";
                return Ok(token);
            }

            CreatePasswordHash(request.password, out byte[] passwordHash, out byte[] passwordSalt);

            this.user.id = request.id;
            this.user.firstname = request.firstname;
            this.user.lastname = request.lastname;
            this.user.email = request.email;
            this.user.passwordHash = passwordHash;
            this.user.passwordSalt = passwordSalt;
            this.user.username = request.username;

            _context.User.Add(this.user);
            await _context.SaveChangesAsync();

            token.token = "Success";
            return Ok(token);
        }

        [HttpPost("EditUserName"), Authorize]
        public async Task<ActionResult<User>> EditUserName(UpdateUserNameDTO request)
        {
            var usernameOriginal = _userService.GetUsername();
            User userOriginal = _context.User.Where(u => u.username == usernameOriginal).FirstOrDefault();
            if(userOriginal == null)
                return BadRequest("JWT is bad!");
            userOriginal.firstname = request.firstname;
            userOriginal.lastname = request.lastname;

            _context.User.Update(userOriginal);
            await _context.SaveChangesAsync();

            return Ok("Success!");
        }

        [HttpPost("EditUserPassword"), Authorize]
        public async Task<ActionResult<User>> EditUserPassword(UpdateUserPasswordDTO request)
        {
            var usernameOriginal = _userService.GetUsername();
            User userOriginal = _context.User.Where(u => u.username == usernameOriginal).FirstOrDefault();
            if (userOriginal == null)
                return BadRequest("JWT is bad!");
            if (!VerifyPasswordHash(request.oldPassword, userOriginal.passwordHash, userOriginal.passwordSalt))
                return BadRequest("Wrong password");
            CreatePasswordHash(request.newPassword, out byte[] newPasswordHash, out byte[] newPasswordSalt);
            userOriginal.passwordHash = newPasswordHash;
            userOriginal.passwordSalt = newPasswordSalt;

            _context.User.Update(userOriginal);
            await _context.SaveChangesAsync();

            return Ok("Success!");
        }

        [HttpGet("GetNameSurnameEmail"), Authorize]
        public ActionResult<object> GetNameSurnameEmail()
        {
            var userName = _userService.GetUsername();
            User user = _context.User.Where(u => u.username == userName).FirstOrDefault(); 
            if (user == null)
            {
                return Ok("User not found");
            }


            return Ok(new
            {
                user.username,
                user.email,
                user.firstname,
                user.lastname,
            });
           
            
        }

        [HttpPost("login")]
        public async Task<ActionResult<TokenDTO>> Login(LoginDTO loginDTO)
        {
            TokenDTO token = new TokenDTO();
            User user =  _context.User.Where(u => u.username == loginDTO.username).FirstOrDefault();
            if (user == null)
            {
                token.token = "User not found";
                return Ok(token);
            }
            if (!VerifyPasswordHash(loginDTO.password, user.passwordHash, user.passwordSalt))
            {
                token.token = "Wrong password";
                return Ok(token);
            }
            token.token = CreateToken(user);
            var jwt = new JwtSecurityTokenHandler().ReadJwtToken(token.token);
            return Ok(token);
        }

        [HttpGet("refreshToken/{jwtString}")]
        public async Task<ActionResult<TokenDTO>> RefreshToken(string jwtString)
        {
            var claims = ValidateToken(jwtString);
            if(claims == null)
            {
                return Ok(new { token = "Token not valid" });
            }
            var username = claims.FindFirst("http://schemas.xmlsoap.org/ws/2005/05/identity/claims/name").Value;
            User user = _context.User.Where(u => u.username == username).FirstOrDefault();
            if (user == null)
            {
                return Ok(new { token = "Token not valid" });
            }
            return Ok(new { token = CreateToken(user) });
        }

        private ClaimsPrincipal ValidateToken(string jwtToken)
        {

            SecurityToken validatedToken;
            TokenValidationParameters validationParameters = new TokenValidationParameters
            {
                ValidateActor = false,
                ValidateAudience = false,
                ValidateIssuer = false,
                ValidateLifetime = true,

                IssuerSigningKey = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(_configuration.GetSection("AppSettings:Token").Value))
            };

            ClaimsPrincipal principal = new JwtSecurityTokenHandler().ValidateToken(jwtToken, validationParameters, out validatedToken);


            return principal;
        }

        private string CreateToken(User user)
        {
            List<Claim> claims = new List<Claim>
            {
                new Claim(ClaimTypes.Name, user.username),
                new Claim(ClaimTypes.Role, "User")
            };

            var key = new SymmetricSecurityKey(System.Text.Encoding.UTF8.GetBytes(_configuration.GetSection("AppSettings:Token").Value));
            var cred = new SigningCredentials(key, SecurityAlgorithms.HmacSha512Signature);

            var token = new JwtSecurityToken(
                claims: claims,
                expires: DateTime.UtcNow.AddDays(1),
                signingCredentials: cred
                );

            var jwt = new JwtSecurityTokenHandler().WriteToken(token);

            return jwt;
        }

        private void CreatePasswordHash(string password, out byte[] passwordHash, out byte[] passwordSalt)
        {
            using (var hmac = new HMACSHA512())
            {
                passwordSalt = hmac.Key;
                passwordHash = hmac.ComputeHash(System.Text.Encoding.UTF8.GetBytes(password));
            }
        }

        private bool VerifyPasswordHash(string password, byte[] passwordHash, byte[] passwordSalt)
        {
            using (var hmac = new HMACSHA512(passwordSalt))
            {
                var computedHash = hmac.ComputeHash(System.Text.Encoding.UTF8.GetBytes(password));
                return computedHash.SequenceEqual(passwordHash);

            }
        }


        // GET: api/User
        //[HttpGet]
        //public async Task<ActionResult<IEnumerable<User>>> GetUser()
        //{
        //    return await _context.User.ToListAsync();
        //}

        // GET: api/User/5
        [HttpGet("{id}")]
        public async Task<ActionResult<User>> GetUser(int id)
        {
            var user = await _context.User.FindAsync(id);

            if (user == null)
            {
                return NotFound();
            }

            return user;
        }

        // PUT: api/User/5
        // To protect from overposting attacks, see https://go.microsoft.com/fwlink/?linkid=2123754
        [HttpPut("{id}")]
        public async Task<IActionResult> PutUser(int id, User user)
        {
            if (id != user.id)
            {
                return BadRequest();
            }

            _context.Entry(user).State = EntityState.Modified;

            try
            {
                await _context.SaveChangesAsync();
            }
            catch (DbUpdateConcurrencyException)
            {
                if (!UserExists(id))
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

        // POST: api/User
        // To protect from overposting attacks, see https://go.microsoft.com/fwlink/?linkid=2123754
        [HttpPost]
        public async Task<ActionResult<User>> PostUser(User user)
        {
            _context.User.Add(user);
            await _context.SaveChangesAsync();

            return CreatedAtAction("GetUser", new { id = user.id }, user);
        }

        // DELETE: api/User/5
        [HttpDelete("{id}"), Authorize(Roles = "Admin")]
        public async Task<IActionResult> DeleteUser(int id)
        {
            var user = await _context.User.FindAsync(id);
            if (user == null)
            {
                return NotFound();
            }

            _context.User.Remove(user);
            await _context.SaveChangesAsync();

            return NoContent();
        }

        private bool UserExists(int id)
        {
            return _context.User.Any(e => e.id == id);
        }

        [HttpPost("saveExperiment"), Authorize]
        public async Task<ActionResult<string>> SaveExperiment(ExperimentDTO experiment)
        {
            var username = _userService.GetUsername();
            User user = _context.User.Where(u => u.username == username).FirstOrDefault();

            if (user == null) return BadRequest("JWT is bad!");

            experiment.userId = user.id;

            var client = new MongoClient(getMongoDBConnString());
            Console.WriteLine(getMongoDBConnString());
            var database = client.GetDatabase("igrannonica");
            var collection = database.GetCollection<ExperimentDTO>("experiment");

            collection.InsertOne(experiment);    

            return Ok(experiment);
        }

        private string getMongoDBConnString()
        {
            if(_hostEnvironment.IsDevelopment())
            {
                return "mongodb://localhost:27017";
            }

            else
            {
                return "mongodb://localhost:10109";
            }
        }

        [HttpGet("getUserExperiments"), Authorize]
        public async Task<ActionResult<List<Experiment>>> GetUserExperiments()
        {
            var usernameOriginal = _userService.GetUsername();
            User user = _context.User.Where(u => u.username == usernameOriginal).FirstOrDefault();

            if (user == null) return BadRequest("JWT is bad!");

            var client = new MongoClient(getMongoDBConnString());
            var database = client.GetDatabase("igrannonica");
            var collection = database.GetCollection<Experiment>("experiment");

            List<Experiment> experiments = collection.Find(e => e.userId == user.id).ToList();

            foreach (Experiment experiment in experiments)
            {
                Models.File file = _context.File.Where(f => f.RandomFileName == experiment.fileName).FirstOrDefault();
                experiment.realName = file.FileName;
            }

            return Ok(experiments);
        }

        [HttpPost("deleteExperiment"), Authorize]
        public async Task<ActionResult<string>> DeleteExperiment(DeleteDTO obj)
        {
            var username = _userService.GetUsername();
            User user = _context.User.Where(u => u.username == username).FirstOrDefault();

            if (user == null) return BadRequest("JWT is bad!");

            var client = new MongoClient(getMongoDBConnString());
            var database = client.GetDatabase("igrannonica");
            var collection = database.GetCollection<Experiment>("experiment");

            //MongoDB.Bson.BsonDocument id = MongoDB.Bson.Serialization.BsonSerializer.Deserialize<BsonDocument>(obj.Id);

            collection.DeleteOne(e => e._id == obj.Id);

            return Ok(obj.Id);
        }
    }
}
