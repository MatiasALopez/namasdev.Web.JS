using System.Web.Mvc;
using System.Web.Security;

namespace namasdev.Web.JS.Sample.Controllers
{
    public class HomeController : Controller
    {
        public ActionResult Index()
        {
            return View();
        }

        public ActionResult UIControls()
        {
            return View();
        }

        public ActionResult IFrameContent1()
        {
            return View();
        }

        public ActionResult IFrameContent2()
        {
            return View();
        }

        public ActionResult UIForms()
        {
            return View();
        }

        public ActionResult Format()
        {
            return View();
        }

        public ActionResult Page()
        {
            return View();
        }

        public ActionResult Utils()
        {
            return View();
        }

        [OutputCache(NoStore = true, Duration = 0)]
        public ActionResult CheckSession()
        {
            Response.Cookies.Remove(FormsAuthentication.FormsCookieName);
            return Json(new { authenticated = User.Identity.IsAuthenticated }, JsonRequestBehavior.AllowGet);
        }

        [HttpPost]
        public ActionResult ExtendSession()
        {
            return Json(new { sucess = true });
        }

        public ActionResult SessionExpired()
        {
            if (User.Identity.IsAuthenticated)
            {
                return RedirectToAction(nameof(Index));
            }
            else
            {
                return View();
            }
        }
    }
}