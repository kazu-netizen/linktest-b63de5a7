// どの端末・どのブラウザで開いているかを判定する（index.html と out.html で共用）
window.ENV = (function () {
  var ua = navigator.userAgent;
  var q = location.search;
  var fOs = (q.match(/[?&]force_os=(ios|and)/) || [])[1];
  var fApp = (q.match(/[?&]force_app=(ig|fb|none)/) || [])[1];
  // 手で切り替えた判定は、着地画面から戻っても残す
  try {
    if (/[?&]force_os=off/.test(q)) localStorage.removeItem("iab3force");
    else if (fOs || fApp) localStorage.setItem("iab3force", (fOs || "") + "," + (fApp || ""));
    else { var f = (localStorage.getItem("iab3force") || "").split(","); fOs = f[0] || undefined; fApp = f[1] || undefined; }
  } catch (e) {}
  var ios = /iPhone|iPad|iPod/.test(ua) || (/Macintosh/.test(ua) && navigator.maxTouchPoints > 1);
  var and = /Android/.test(ua);
  var app = "";
  if (/Instagram/i.test(ua)) app = "ig";
  else if (/FBAN\/Messenger|FB_IAB\/MESSENGER|Orca-Android|MessengerLite/i.test(ua)) app = "msg";
  else if (/FBAN|FBAV|FB_IAB|FBIOS|FB4A/i.test(ua)) app = "fb";
  else if (/Barcelona|Threads/i.test(ua)) app = "threads";
  else if (/ Line\//i.test(ua)) app = "line";
  else if ((ios && !/Safari\//.test(ua)) || (and && /; wv\)/.test(ua))) app = "webview";
  if (fOs) { ios = fOs === "ios"; and = fOs === "and"; }
  if (fApp) app = fApp === "none" ? "" : fApp;
  var browser = "";
  if (!app) {
    if (/CriOS/.test(ua)) browser = "Chrome";
    else if (/FxiOS|Firefox/.test(ua)) browser = "Firefox";
    else if (/EdgiOS|EdgA/.test(ua)) browser = "Edge";
    else if (/SamsungBrowser/.test(ua)) browser = "Samsungのブラウザ";
    else if (/Chrome\//.test(ua)) browser = "Chrome";
    else if (/Safari\//.test(ua)) browser = "Safari";
    else browser = "ふつうのブラウザ";
  }
  var APP = { ig: "Instagramの中", fb: "Facebookの中", msg: "Messengerの中", threads: "Threadsの中", line: "LINEの中", webview: "アプリの中（どのアプリかは判定できず）" };
  return {
    ua: ua, ios: ios, and: and, app: app, browser: browser, forced: !!(fOs || fApp),
    osName: ios ? "iPhone" : (and ? "Android" : "パソコンなど"),
    place: app ? APP[app] : browser,
    inApp: !!app
  };
})();
