using System;
using System.Web;

namespace namasdev.Web.JS.Sample.Models
{
    public class ControlContainer
    {
        public string Id { get; set; }
        public string CssClass { get; set; }
        public string Title { get; set; }
        public Func<object, IHtmlString> PreMainHtml { get; set; }
        public Func<object, IHtmlString> MainHtml { get; set; }
        public Func<object, IHtmlString> PostMainHtml { get; set; }
    }
}