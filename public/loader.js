/* eslint-disable */
(function (c) {
var d = c.getElementById('fp-app-loader').getAttribute('src');
var n = d.split('/').pop();
d = d.replace('/'+n,'/');
var s = c.createElement("script");
s.type = "text/javascript";
s.src = d + MAIN_JS_HASHED;
c.body.appendChild(s);
var cs = c.createElement("link");
cs.rel = "stylesheet";
cs.href = d + MAIN_CSS_HASHED;
c.head.appendChild(cs);
})(document);
/* eslint-enable */
