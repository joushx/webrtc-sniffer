let meta = document.createElement("meta");
meta.name = "X-Sniffer-ExtId";
meta.content = chrome.runtime.id;
document.head.append(meta);

var s = document.createElement('script');
s.src = chrome.extension.getURL('rtc-proxy.js');
(document.head||document.documentElement).prepend(s);