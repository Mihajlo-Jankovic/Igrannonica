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
using System.Net;
using MailKit;
using MimeKit;
using MailKit.Net.Smtp;
using MailKit.Security;
using Newtonsoft.Json;

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
        


        public UserController(MySqlContext context, IConfiguration configuration, IUserService userService, IHostEnvironment hostEnvironment)
        {
            _configuration = configuration;
            _userService = userService;
            _context = context;

            _hostEnvironment = hostEnvironment;

        }


        [HttpPost("register")]
        public async Task<ActionResult<User>> Register(UserDTO request)
        {
            User user = _context.User.Where(u => u.username == request.username).FirstOrDefault();
            if(user != null)
            {
                return BadRequest(new { responseMessage = _configuration.GetSection("ResponseMessages:UsernameTaken").Value });
            }
            user = _context.User.Where(u => u.email == request.email).FirstOrDefault();
            if(user != null)
            {
                return BadRequest(new { responseMessage = _configuration.GetSection("ResponseMessages:MailTaken").Value });
            }

            Random randomNumbers = new();
            int randomNumber = randomNumbers.Next(1000, 9999);
            MimeMessage message = new();
            BodyBuilder bodyBuilder = new();

            // from
            message.From.Add(new MailboxAddress("Cortex", "cortexigrannonica@hotmail.com"));
            // to
            message.To.Add(new MailboxAddress(request.firstname, request.email));

            message.Subject = "Mail verification";
            bodyBuilder.TextBody = "Thanks for registering, please fill the following numbers into the registration form at the website " + randomNumber;
            message.Body = bodyBuilder.ToMessageBody();

            using (var client = new SmtpClient())
            {

                client.Connect("smtp-mail.outlook.com", 587, SecureSocketOptions.StartTls);
                client.Authenticate("cortexigrannonica@hotmail.com", "Cortexigrannonic;1");
                client.Send(message);
            }


            CreatePasswordHash(request.password, out byte[] passwordHash, out byte[] passwordSalt);

            this.user.id = request.id;
            this.user.firstname = request.firstname;
            this.user.lastname = request.lastname;
            this.user.email = request.email;
            this.user.passwordHash = passwordHash;
            this.user.passwordSalt = passwordSalt;
            this.user.username = request.username;
            this.user.verifiedMail = false;
            this.user.verifyNumber = randomNumber;

            _context.User.Add(this.user);
            await _context.SaveChangesAsync();

            

            return Ok(new { responseMessage = _configuration.GetSection("ResponseMessages:Success").Value });
        }

        [HttpGet("verifyMail")]
        public async Task<IActionResult> VerifyMail(int verifyNumber, string email)
        {
            User user = _context.User.Where(u => u.email == email).FirstOrDefault();
            if (user == null)
                return NotFound(new { responseMessage = "Error: Username not found!" });
            if (user.verifyNumber != verifyNumber)
                return BadRequest(new { responseMessage = "Error: Wrong number!" });
            if (user.verifiedMail == true)
                return BadRequest(new { reponseMessage = "Error: Mail already verified!" });

            user.verifiedMail = true;

            _context.User.Update(user);
            await _context.SaveChangesAsync();
            return Ok(new { responseMessage = "Succesfull registration!" });
        }


        [HttpPost("EditUserName"), Authorize]
        public async Task<ActionResult<User>> EditUserName(UpdateUserNameDTO request)
        {
            var usernameOriginal = _userService.GetUsername();
            User userOriginal = _context.User.Where(u => u.username == usernameOriginal).FirstOrDefault();
            if(userOriginal == null)
                return NotFound(new { responseMessage = _configuration.GetSection("ResponseMessages:UsernameNotFound").Value });
            if (!VerifyPasswordHash(request.password, userOriginal.passwordHash, userOriginal.passwordSalt))
                return BadRequest(new { responseMessage = _configuration.GetSection("ResponseMessages:WrongPassword").Value });
            userOriginal.firstname = request.firstname;
            userOriginal.lastname = request.lastname;

            _context.User.Update(userOriginal);
            await _context.SaveChangesAsync();

            return Ok(new { responseMessage = _configuration.GetSection("ResponseMessages:Success").Value });
        }

        [HttpPost("EditUserPassword"), Authorize]
        public async Task<ActionResult<User>> EditUserPassword(UpdateUserPasswordDTO request)
        {
            var usernameOriginal = _userService.GetUsername();
            User userOriginal = _context.User.Where(u => u.username == usernameOriginal).FirstOrDefault();
            if (userOriginal == null)
                return NotFound(new { responseMessage = _configuration.GetSection("ResponseMessages:UsernameNotFound").Value });
            if (!VerifyPasswordHash(request.oldPassword, userOriginal.passwordHash, userOriginal.passwordSalt))
                return BadRequest(new { responseMessage = _configuration.GetSection("ResponseMessages:WrongPassword").Value });
            CreatePasswordHash(request.newPassword, out byte[] newPasswordHash, out byte[] newPasswordSalt);
            userOriginal.passwordHash = newPasswordHash;
            userOriginal.passwordSalt = newPasswordSalt;

            _context.User.Update(userOriginal);
            await _context.SaveChangesAsync();

            return Ok(new { responseMessage = _configuration.GetSection("ResponseMessages:Success").Value });
        }

        [HttpGet("sendtemppasswordmail/{email}")]
        public async Task<IActionResult> SendResetPasswordMail(string email)
        {
            User user = await _context.User.Where(u => u.email == email).FirstOrDefaultAsync();

            if(user==null)
            {
                return NotFound("There is no user with this email.");
            }

            var builder = new StringBuilder(8);
            Random randomNumbers = new();
            char offset = 'a';
            int lettersOffset = 26;
            for(var i=0;i<4;i++)
            {
                var @char = (char)randomNumbers.Next(offset, offset + lettersOffset);
                builder.Append(@char);
            }
            int randomNumber = randomNumbers.Next(1000, 9999);
            builder.Append(randomNumber);
            offset = 'A';
            lettersOffset = 26;
            for (var i = 0; i < 2; i++)
            {
                var @char = (char)randomNumbers.Next(offset, offset + lettersOffset);
                builder.Append(@char);
            }
            MimeMessage message = new();
            BodyBuilder bodyBuilder = new();

            // from
            message.From.Add(new MailboxAddress("Cortex", "cortexigrannonica@hotmail.com"));
            // to
            message.To.Add(new MailboxAddress("Reset Password", email));

            message.Subject = "Password reset";
            bodyBuilder.TextBody = "To reset your password, login with this temporary password and then change it. The temporary password is valid for the next hour. " + builder.ToString();
            message.Body = bodyBuilder.ToMessageBody();

            using (var client = new SmtpClient())
            {

                client.Connect("smtp-mail.outlook.com", 587, SecureSocketOptions.StartTls);
                client.Authenticate("cortexigrannonica@hotmail.com", "Cortexigrannonic;1");
                client.Send(message);
            }

            user.tempPassword = builder.ToString();

            _context.User.Update(user);
            await _context.SaveChangesAsync();
            return Ok( new { responseMessage = "Success!", user.username});
        }

        [HttpPost("resetpassword")]
        public async Task<IActionResult> ResetPassword(UpdateUserPasswordDTO update)
        {

            User user = await _context.User.Where(u => u.tempPassword == update.oldPassword).FirstOrDefaultAsync();

            if (user == null)
            {
                return BadRequest(new { responseMessage = "Wrong password" });
            }

            CreatePasswordHash(update.newPassword, out byte[] passwordHash, out byte[] passwordSalt);

            user.passwordHash = passwordHash;
            user.passwordSalt = passwordSalt;

            _context.User.Update(user);
            await _context.SaveChangesAsync();

            return Ok(new { responseMessage = "Success!" });
        }

        [HttpGet("GetNameSurnameEmail"), Authorize]
        public ActionResult<object> GetNameSurnameEmail()
        {
            var userName = _userService.GetUsername();
            User user = _context.User.Where(u => u.username == userName).FirstOrDefault(); 
            if (user == null)
            {
                return NotFound(new { responseMessage = _configuration.GetSection("ResponseMessages:UsernameNotFound").Value });
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
            User user =  _context.User.Where(u => u.username.Equals(loginDTO.username)).FirstOrDefault();
            if (user == null || user.username.Equals(loginDTO.username) == false)
            {
                return NotFound(new { responseMessage = _configuration.GetSection("ResponseMessages:UsernameNotFound").Value });
            }
            if (!VerifyPasswordHash(loginDTO.password, user.passwordHash, user.passwordSalt))
            {
                return BadRequest(new { responseMessage = _configuration.GetSection("ResponseMessages:WrongPassword").Value });
            }
            if(user.verifiedMail == false)
            {
                return BadRequest(new { responseMessage = "Error: You have to verify your mail!" });
            }
            token.token = CreateToken(user);
            var jwt = new JwtSecurityTokenHandler().ReadJwtToken(token.token);
            return Ok(token);
        }

        [HttpGet("refreshToken/{jwtString}")]
        public async Task<ActionResult<TokenDTO>> RefreshToken(string jwtString)
        {
            ClaimsPrincipal claims = null;

            try
            {
                claims = ValidateToken(jwtString);
            }
            catch (Exception ex)
            {
                return BadRequest(new { token = _configuration.GetSection("ResponseMessages:TokenNotValid").Value });
            }

            if(claims == null)
            {
                return BadRequest(new { token = _configuration.GetSection("ResponseMessages:TokenNotValid").Value });
            }
            var username = claims.FindFirst("http://schemas.xmlsoap.org/ws/2005/05/identity/claims/name").Value;
            User user = _context.User.Where(u => u.username == username).FirstOrDefault();
            if (user == null)
            {
                return BadRequest(new { token = _configuration.GetSection("ResponseMessages:TokenNotValid").Value });
            }
            return Ok(new { token = CreateToken(user) });
        }

        private ClaimsPrincipal ValidateToken(string jwtString)
        {
            try
            {
                var jwtToken = new JwtSecurityToken(jwtString);
                if ((jwtToken == null) || (jwtToken.ValidFrom > DateTime.UtcNow) || (jwtToken.ValidTo < DateTime.UtcNow))
                    return null;
                TokenValidationParameters validationParameters = new()
                {
                    ValidateActor = false,
                    ValidateAudience = false,
                    ValidateIssuer = false,
                    ValidateLifetime = true,

                    IssuerSigningKey = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(_configuration.GetSection("AppSettings:Token").Value))
                };

                ClaimsPrincipal principal = new JwtSecurityTokenHandler().ValidateToken(jwtString, validationParameters, out _);


                return principal;
            }
            catch (Exception)
            {
                throw;
            }
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

        [HttpPost("saveExperiment"), Authorize]
        public async Task<ActionResult<string>> SaveExperiment(ExperimentDTO experiment)
        {
            var username = _userService.GetUsername();
            User user = _context.User.Where(u => u.username == username).FirstOrDefault();

            if (user == null)
                return NotFound(new { responseMessage = _configuration.GetSection("ResponseMessages:UsernameNotFound").Value });

            experiment.userId = user.id;
            experiment.username = user.username;

            var client = new MongoClient(getMongoDBConnString());
            var database = client.GetDatabase("igrannonica");

            var collection = database.GetCollection<ExperimentDTO>("experiment");

            var tmp = await collection.FindAsync(e => e.name == experiment.name && e.userId == user.id);
            var temp = tmp.FirstOrDefault();

            if(temp != null && experiment.overwrite == false)
            {
                return Ok(new { responseMessage = "There is already an experiment with the same name, do you want to overwrite it?" });
            }

            else if (temp != null && experiment.overwrite == true)
            {
                experiment._id = temp._id;
                var result = await collection.ReplaceOneAsync(e => e.name == experiment.name && e.userId == user.id, experiment);
            }
            else
            {
                collection.InsertOne(experiment);
            }

            return Ok(experiment);
        }

        private int paging(long numOfFiles, int numPerPage)
        {
            int numOfPages;

            if (numOfFiles % numPerPage != 0) { numOfPages = (int)numOfFiles / numPerPage; numOfPages++; }
            else numOfPages = (int)numOfFiles / numPerPage;

            return numOfPages;
        }

        [HttpPost("getExperimentAuthorized"), Authorize]
        public async Task<ActionResult<List<Experiment>>> GetExperimentAuthorized(PagingDTO dto)
        {
            var usernameOriginal = _userService.GetUsername();
            User user = _context.User.Where(u => u.username == usernameOriginal).FirstOrDefault();

            if (user == null)
                return NotFound(new { responseMessage = _configuration.GetSection("ResponseMessages:UsernameNotFound").Value });

            var client = new MongoClient(getMongoDBConnString());
            var database = client.GetDatabase("igrannonica");
            var collection = database.GetCollection<Experiment>("experiment");

            List<Experiment> experiments = new List<Experiment>();

            if (dto.Visibility == "public")
            {
                if (dto.NumOfPages == 0)
                {
                    var numOfFiles = collection.Count(e => e.visibility == true);
                    dto.NumOfPages = paging(numOfFiles, dto.NumPerPage);
                }

                experiments = collection.Find(e => e.visibility == true).Skip((dto.PageNum - 1) * dto.NumPerPage).Limit(dto.NumPerPage).ToList();
            }

            else
            {
                if (dto.NumOfPages == 0)
                {
                    var numOfFiles = collection.Count(e => e.userId == user.id);
                    dto.NumOfPages = paging(numOfFiles, dto.NumPerPage);
                }

                experiments = collection.Find(e => e.userId == user.id).Skip((dto.PageNum - 1) * dto.NumPerPage).Limit(dto.NumPerPage).ToList();
            }

            return Ok(new { experiments = experiments, numOfPages = dto.NumOfPages });
        }

        [HttpPost("useExperimentAuthorized"), Authorize]
        public async Task<IActionResult> UseExperimentAuthorized(Experiment experiment)
        {
            var username = _userService.GetUsername();
            User user = _context.User.Where(u => u.username == username).FirstOrDefault();

            if (user == null)
                return NotFound(new { responseMessage = "Error: Username not found!" });

            var objectId = new ObjectId();

            var success = ObjectId.TryParse(experiment._id, out objectId);
            var mongoClient = new MongoClient(getMongoDBConnString());
            var database = mongoClient.GetDatabase("igrannonica");
            var collection = database.GetCollection<Experiment>("experiment");
            var newExperiments = await collection.FindAsync(e => e._id.Equals(objectId));
            var newExperiment = await newExperiments.FirstAsync();
            if(newExperiment.username.Equals(username))
            {
                return Ok(experiment);
            }
            newExperiment._id = ObjectId.GenerateNewId().ToJson();
            newExperiment._id = newExperiment._id.Substring(10, 24);
            newExperiment.userId = user.id;
            newExperiment.username = user.username;
            newExperiment.visibility = false;
            newExperiment.date = DateTime.Now.ToString();

            var NewRandomFileName = string.Format("{0}.csv", Path.GetRandomFileName().Replace(".", string.Empty));
            HttpClient client = new HttpClient();
            client.DefaultRequestHeaders.Accept.ParseAdd("application/json");
            var endpoint = new Uri(_configuration.GetSection("PythonServerLinks:Link").Value
            + _configuration.GetSection("PythonServerPorts:FileUploadServer").Value
            + _configuration.GetSection("Endpoints:CopyFile").Value);

            var newPostJson = JsonConvert.SerializeObject(new
            {
                OldRandomFileName = newExperiment.fileName,
                NewRandomFileName
            });

            var payload = new StringContent(newPostJson, Encoding.UTF8, "application/json");
            var httpResponse = await client.PostAsync(endpoint, payload);
            var response = await httpResponse.Content.ReadAsStringAsync();

            Models.File file = new Models.File
            {
                RandomFileName = NewRandomFileName,
                DateCreated = DateTime.Now,
                FileName = newExperiment.realName,
                UserForeignKey = user.id,
                IsPublic = false
            };
            newExperiment.fileName = NewRandomFileName;


            await _context.File.AddAsync(file);
            await _context.SaveChangesAsync();


            return Ok(newExperiment);
        }

        [HttpPost("useExperimentUnauthorized")]
        public async Task<IActionResult> UseExperimentUnauthorized(Experiment experiment)
        {

            var objectId = new ObjectId();

            var success = ObjectId.TryParse(experiment._id, out objectId);
            var mongoClient = new MongoClient(getMongoDBConnString());
            var database = mongoClient.GetDatabase("igrannonica");
            var collection = database.GetCollection<Experiment>("experiment");
            var newExperiments = await collection.FindAsync(e => e._id.Equals(objectId));
            var newExperiment = await newExperiments.FirstAsync();
            newExperiment._id = ObjectId.GenerateNewId().ToJson();
            newExperiment._id = newExperiment._id.Substring(10, 24);
            newExperiment.userId = null;
            newExperiment.visibility = false;
            newExperiment.date = DateTime.Now.ToString();

            var NewRandomFileName = string.Format("{0}.csv", Path.GetRandomFileName().Replace(".", string.Empty));
            HttpClient client = new HttpClient();
            client.DefaultRequestHeaders.Accept.ParseAdd("application/json");
            var endpoint = new Uri(_configuration.GetSection("PythonServerLinks:Link").Value
            + _configuration.GetSection("PythonServerPorts:FileUploadServer").Value
            + _configuration.GetSection("Endpoints:CopyFile").Value);

            var newPostJson = JsonConvert.SerializeObject(new
            {
                OldRandomFileName = newExperiment.fileName,
                NewRandomFileName
            });

            var payload = new StringContent(newPostJson, Encoding.UTF8, "application/json");
            var httpResponse = await client.PostAsync(endpoint, payload);
            var response = await httpResponse.Content.ReadAsStringAsync();

            Models.File file = new Models.File
            {
                RandomFileName = NewRandomFileName,
                DateCreated = DateTime.Now,
                FileName = newExperiment.realName,
                UserForeignKey = null,
                IsPublic = false
            };
            newExperiment.fileName = NewRandomFileName;


            await _context.File.AddAsync(file);
            await _context.SaveChangesAsync();

            return Ok(newExperiment);
        }


        [HttpPost("getExperimentUnauthorized")]
        public async Task<ActionResult<List<Experiment>>> GetExperimentUnauthorized(PagingDTO dto)
        {
            var client = new MongoClient(getMongoDBConnString());
            var database = client.GetDatabase("igrannonica");
            var collection = database.GetCollection<Experiment>("experiment");

            if (dto.NumOfPages == 0)
            {
                var numOfFiles = collection.Count(e => e.visibility == true);
                dto.NumOfPages = paging(numOfFiles, dto.NumPerPage);
            }

            List<Experiment> experiments = collection.Find(e => e.visibility == true).Skip((dto.PageNum - 1) * dto.NumPerPage).Limit(dto.NumPerPage).ToList();

            return Ok(new { experiments = experiments, numOfPages = dto.NumOfPages });
        }


        [HttpPost("deleteExperiment"), Authorize]
        public async Task<ActionResult<string>> DeleteExperiment(DeleteDTO obj)
        {
            var username = _userService.GetUsername();
            User user = _context.User.Where(u => u.username == username).FirstOrDefault();

            if (user == null)
                return NotFound(new { responseMessage = _configuration.GetSection("ResponseMessages:UsernameNotFound").Value });

            var client = new MongoClient(getMongoDBConnString());
            var database = client.GetDatabase("igrannonica");
            var collection = database.GetCollection<Experiment>("experiment");

            //MongoDB.Bson.BsonDocument id = MongoDB.Bson.Serialization.BsonSerializer.Deserialize<BsonDocument>(obj.Id);

            collection.DeleteOne(e => e._id == obj.Id);

            return Ok(new { obj.Id });
        }

        [HttpPost("updateExperimentVisibility"), Authorize]
        public async Task<ActionResult<string>> UpdateExperimentVisibility(ExperimentVisibilityDTO request)
        {
            var username = _userService.GetUsername();
            User user = _context.User.Where(u => u.username == username).FirstOrDefault();

            if (user == null)
                return NotFound(new { responseMessage = "Error: Username not found!" });

            var client = new MongoClient(getMongoDBConnString());
            var database = client.GetDatabase("igrannonica");
            var collection = database.GetCollection<Experiment>("experiment");

            var filter = Builders<Experiment>.Filter.Eq("_id", request._id);
            var update = Builders<Experiment>.Update.Set("visibility", request.Visibility);

            var result = collection.UpdateOne(filter,update);

            if (result == null)
                return BadRequest(new
                {
                    responseMessage = "Error: The file you are trying to change doesn't belong to you!"
                });

            return Ok(new { responseMessage = "Success!" });
        }
    }
}
