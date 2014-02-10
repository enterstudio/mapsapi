DG.loaderParams = window.__dgApi_params;
window.__dgApi_params = undefined;

DG.Icon.Default.imagePath  = '../img/vendors/leaflet';

/* jshint ignore:start */
(function(i,s,o,g,r,a,m){i['GoogleAnalyticsObject']=r;i[r]=i[r]||function(){
(i[r].q=i[r].q||[]).push(arguments)},i[r].l=1*new Date();a=s.createElement(o),
m=s.getElementsByTagName(o)[0];a.async=1;a.src=g;m.parentNode.insertBefore(a,m)
})(window,document,'script','//www.google-analytics.com/analytics.js','ga');
/* jshint ignore:end */

/*global ga:false*/
ga('create', '__GA_CODE__', 'none');
ga('send', 'pageview');

// Improve IHandler
DG.Map.include({
    addHandler: function (name, HandlerClass) {
        if (!HandlerClass) { return; }

        var options = this.options[name],
            param = (options === Object(options)) ? options : null,
            handler = this[name] = new HandlerClass(this, param);

        this._handlers.push(handler);

        if (options) {
            handler.enable();
        }

        return this;
    }
});

// Detect wich kind of img we should apply
DG.Map.addInitHook(function () {
    L.DomUtil.addClass(this._container,
            ((L.Browser.ielt9 || L.Browser.mobule) ? ' sprite' : ''));
});
