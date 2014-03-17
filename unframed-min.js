!function(){function n(n,t){var e=this.events[n];if(void 0===e)this.events[n]=[t];else{if(!(e.indexOf(t)<0))throw n+" identical listener added";e.push(t)}}function t(n,t){console.log(n+" "+JSON.stringify(t))}function e(n,t){var e=this.events[n];if(void 0===e)throw n+" "+JSON.stringify(t);this.trace(n,t),e.forEach(function(n){n.apply(this,[t])})}function o(n){this.name=n,this.events={}}function i(n){return document.addEventListener?(document.addEventListener("DOMContentLoaded",function(){n.emit("DOM Ready")}),window.addEventListener("beforeunload",function(){n.emit("DOM Unload")})):(document.attachEvent("onreadystatechange",function(){"interactive"===document.readyState&&n.emit("DOM Ready")}),window.attachEvent("onbeforeunload",function(){n.emit("DOM Unload")})),n}function r(n){return i(new o(n))}function a(n){Object.keys(n).forEach(function(t){o.prototype[t]=n[t]})}function c(n){return window.localStorage.getItem([this.name,n].join("/"))}function s(n){return window.localStorage.removeItem([this.name,n].join("/"))}function u(n,t){return window.localStorage.setItem([this.name,n].join("/"),t)}function d(n){return JSON.parse(window.localStorage.getItem([this.name,n].join("/")))}function f(n,t){return window.localStorage.setItem([this.name,n].join("/"),JSON.stringify(t))}function l(){function n(n){0==n.key.indexOf(path)&&t.emit("localStorage",{key:n.key.substring(pathLen),oldValue:n.oldValue,newValue:n.newValue})}var t=this;path=t.name+"/",pathLeng=path.length,window.addEventListener?window.addEventListener("storage",n,!1):window.attachEvent("onstorage",function(){n(window.event)}),t.localStorage=function(){throw"localStorage called twice on "+this.name}}function h(n,t){t(n.status,n.responseText)}function w(n,t,e,o,i,r,a,c){var s=t+" "+e;if(void 0===n.xhrs&&(n.xhrs={}),n.xhrs[s]===!0)throw["XHR resource is busy:",t,e].join(" ");n.xhrs[s]=!0;var u=new XMLHttpRequest;void 0===c&&(c=function(o,i){n.emit([o,t,e].join(" "),i)}),void 0==r&&(r=h),u.onreadystatechange=function(){4===this.readyState&&(delete n.xhrs[s],r(this,c))},u.open(t,e,!0),void 0!==a&&0==u.timeout&&(u.timeout=a,u.ontimeout=function(){delete n.xhrs[s],c("TIMEOUT")}),void 0!==o&&Object.keys(o).forEach(function(n){u.setRequestHeader(n,o[n])}),u.send(i),u=null}function p(n,t,e,o,i,r,a){return w(this,n,t,e,o,i,r,a)}function m(n){var t=[];return Object.keys(n,function(e){t.push([encodeURIComponent(e),encodeURIComponent(n[e].toString()).replace("%20","+")].join("="))}),t.join("&")}function v(n,t){return void 0===t?n:[n,m(t)].join("&")}function g(n,t,e,o,i){return w(this,"GET",v(n,t),e,null,h,o,i)}function y(n,t,e,o){return w(this,"POST",n,{"Content-Type":"application/x-www-form-urlencoded"},m(t),S,e,o)}function S(n,t){var e;try{e=JSON.parse(n.responseText)}catch(o){e={jsonError:o.toString(),responseText:n.responseText}}t(n.status,e)}function x(n,t,e,o){return w(this,"GET",v(n,t),{Accept:"application/json, */*"},null,S,e,o)}function O(n,t,e,o){return w(this,"POST",n,{Accept:"application/json, */*","Content-Type":"application/json; charset=UTF-8"},JSON.stringify(t),S,e,o)}o.prototype={link:n,emit:e,trace:t},r.extend=a,r.trace=function(n){o.prototype.trace=n?t:function(){}},window.unframed=r,window.unframed.extend({localLoad:c,localSave:u,localRemove:s,saveJson:f,loadJson:d,localStorage:l}),window.unframed.extend({xhrSend:p,xhrGetJson:x,xhrPostJson:O,xhrGetText:g,xhrPostForm:y})}();