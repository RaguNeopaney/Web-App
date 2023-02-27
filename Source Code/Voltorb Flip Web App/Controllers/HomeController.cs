using Microsoft.AspNetCore.Mvc;
using System.Diagnostics;
using Voltorb_Flip_Web_App.Models;

namespace Voltorb_Flip_Web_App.Controllers
{
    public class HomeController : Controller
    {
        private readonly ILogger<HomeController> _logger;
        private readonly VoltorbflipDBContext _db;

        public HomeController(ILogger<HomeController> logger, VoltorbflipDBContext db)
        {
            _logger = logger;
            _db = db;
        }

        public IActionResult Index()
        {
            return View();
        }

        [ResponseCache(Duration = 0, Location = ResponseCacheLocation.None, NoStore = true)]
        public IActionResult Error()
        {
            return View(new ErrorViewModel { RequestId = Activity.Current?.Id ?? HttpContext.TraceIdentifier });
        }

        [HttpGet]
        public JsonResult GetHighScore()
        {
            var highScore = _db.HighscoreTable.Select(x => x.HighScore);
            if (highScore.Count() < 1)
            {
                return new JsonResult(Ok(0));
            }
            var maxhighScore = highScore.Max();
            return new JsonResult(Ok(maxhighScore));
        }

        [HttpPost]
        public JsonResult PostHighScore(string highscore)
        {
            int test = (int)Convert.ToInt64(highscore);
            var objForDB = new HighScoreboard
            {
                HighScore = test
            };
            _db.HighscoreTable.Add(objForDB);
            _db.SaveChanges();
            return new JsonResult(Ok());
        }
    }
}