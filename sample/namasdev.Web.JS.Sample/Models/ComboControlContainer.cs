using System;
using System.Web;

namespace namasdev.Web.JS.Sample.Models
{
    public class ComboControlContainer : ControlContainer
    {
        public Func<object, IHtmlString> ComboInnerHtml { get; set; }
    }
}