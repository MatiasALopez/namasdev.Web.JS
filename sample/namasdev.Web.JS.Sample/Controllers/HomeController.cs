using System.Linq;
using System.Web.Mvc;
using System.Web.Security;

using namasdev.Web.JS.Sample.ViewModels.UIForms;

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

        [HttpPost]
        public ActionResult UIForms(UIFormsViewModel model)
        {
            System.Threading.Thread.Sleep(1000);
            return View();
        }

        [HttpPost,
        ValidateAntiForgeryToken]
        public ActionResult AjaxPost()
        {
            return Json(Request.Form);
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

        public ActionResult GetSelectpickerAjaxItems(string q)
        {
            var items = Enumerable.Range(1, 10)
                .Select(i => new { value = $"{q.Replace(" ", "")}_{i}", text = $"{q} {i}" })
                .ToArray();
            return Json(items, JsonRequestBehavior.AllowGet);
        }

        public ActionResult GetComboItems(
            bool fail = false)
        {
            System.Threading.Thread.Sleep(1000);
            if (fail)
            {
                return Json(new { error = "Items not available." }, JsonRequestBehavior.AllowGet);
            }

            var items = Enumerable.Range(1, 10)
                .Select(i => new SelectListItem { Value = i.ToString(), Text = i.ToString() })
                .ToArray();
            return Json(new { items }, JsonRequestBehavior.AllowGet);
        }

        public ActionResult GetComboItemsCustomProperties(
            bool fail = false)
        {
            System.Threading.Thread.Sleep(1000);
            if (fail)
            {
                return Json(new { ErrorMessage = "Users not available." }, JsonRequestBehavior.AllowGet);
            }

            var items = Enumerable.Range(1, 10)
                .Select(i => new { ID = i.ToString(), Name = $"Name {i}", Checked = i == 5 })
                .ToArray();
            return Json(new { Users = items }, JsonRequestBehavior.AllowGet);
        }

        public ActionResult GetComboCascadeItems(
            string parent1 = null, 
            string parent2 = null,
            bool fail = false)
        {
            System.Threading.Thread.Sleep(1000);

            if (fail)
            {
                return Json(new { ErrorMessage = "Items not available." }, JsonRequestBehavior.AllowGet);
            }

            var items = new SelectListItem[0];

            if (!string.IsNullOrWhiteSpace(parent1))
            {
                items = Enumerable.Range(1, 10)
                    .Select(i => new SelectListItem 
                    { 
                        Value = $"{parent1}{(!string.IsNullOrWhiteSpace(parent2) ? $"_{parent2}" : "")}_{i}", 
                        Text = $"P{parent1}{(!string.IsNullOrWhiteSpace(parent2) ? $" - PP{parent2}" : "")} - C{i}" 
                    })
                    .ToArray();
            }
            
            return Json(new { items }, JsonRequestBehavior.AllowGet);
        }

        public ActionResult GetComboCascadeItemsCustomProperties(
            string parent1 = null,
            string parent2 = null,
            bool fail = false)
        {
            System.Threading.Thread.Sleep(1000);

            if (fail)
            {
                return Json(new { ErrorMessage = "Users not available." }, JsonRequestBehavior.AllowGet);
            }

            var items =
                !string.IsNullOrWhiteSpace(parent1)
                ? Enumerable.Range(1, 10)
                    .Select(i => new
                    {
                        ID = $"{parent1}{(!string.IsNullOrWhiteSpace(parent2) ? $"_{parent2}" : "")}_{i}",
                        Name = $"P{parent1}{(!string.IsNullOrWhiteSpace(parent2) ? $" - PP{parent2}" : "")} - Name {i}",
                        Checked = i % 3 == 0
                    })
                    .ToArray()
                : new object[0];

            return Json(new { Users = items }, JsonRequestBehavior.AllowGet);
        }
    }
}