/* iPhone Demo — validated sequence, vanilla JS */
(function () {
  'use strict';

  var STEPS = [
    { id: 'lock1',      ms: 1200 },
    { id: 'prio-notif',  ms: 2800 },
    { id: 'tap1',        ms: 220  },
    { id: 'telegram',    ms: 3000 },
    { id: 'tap2',        ms: 220  },
    { id: 'idealista',   ms: 3000 },
    { id: 'tap3',        ms: 220  },
    { id: 'calling',     ms: 2400 },
    { id: 'calendar',    ms: 3000 },
    { id: 'confirmed',   ms: 2400 },
    { id: 'time-warp',   ms: 2800 },
    { id: 'lock2',       ms: 800  },
    { id: 'idl-notif',   ms: 3200 },
    { id: 'badge',       ms: 4000 }
  ];
  var TOTAL = STEPS.reduce(function (a, s) { return a + s.ms; }, 0);

  var D = {
    price: '1,634',
    m2: '108',
    bed: '3',
    bath: '2',
    hood: 'La Sagrera',
    city: 'Barcelona',
    street: 'Camp De Ferro',
    floor: '7th floor',
    phone: '+34 936 172 034',
    visitDay: 'Wednesday, May 21',
    visitShort: 'Wed, May 21',
    visitTime: '10:00 AM'
  };

  /* helpers */
  function el(tag, s, txt) {
    var e = document.createElement(tag);
    if (s) e.setAttribute('style', s);
    if (txt) e.textContent = txt;
    return e;
  }
  function ap(parent, tag, s, txt) {
    var c = el(tag, s, txt);
    parent.appendChild(c);
    return c;
  }

  /* SVG: Prio icon */
  function prioIconSvg(sz) {
    sz = sz || 38;
    var s = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
    s.setAttribute('width', sz); s.setAttribute('height', sz);
    s.setAttribute('viewBox', '0 0 100 100');
    s.innerHTML =
      '<defs><linearGradient id="piG" x1="0" y1="0" x2="1" y2="1"><stop offset="0%" stop-color="#3B82F6"/><stop offset="100%" stop-color="#1D4ED8"/></linearGradient></defs>' +
      '<rect width="100" height="100" rx="22" fill="url(#piG)"/>' +
      '<path d="M28 22h14v56h-14z" fill="#fff"/>' +
      '<path d="M42 22h16c12 0 20 8 20 18s-8 18-20 18H42V22z" fill="#fff"/>' +
      '<path d="M42 30h14c7 0 12 4 12 10s-5 10-12 10H42V30z" fill="url(#piG)"/>' +
      '<path d="M52 14l18 0l0 18" stroke="#fff" stroke-width="5" fill="none" stroke-linecap="round" stroke-linejoin="round"/>' +
      '<path d="M52 32l18-18" stroke="#fff" stroke-width="5" fill="none" stroke-linecap="round"/>';
    return s;
  }

  /* SVG: Idealista icon */
  function idlIconSvg(sz) {
    sz = sz || 38;
    var s = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
    s.setAttribute('width', sz); s.setAttribute('height', sz);
    s.setAttribute('viewBox', '0 0 100 100');
    s.innerHTML =
      '<rect width="100" height="100" rx="22" fill="#c3f441"/>' +
      '<rect x="12" y="55" width="76" height="33" rx="4" fill="#1a1a1a"/>' +
      '<text x="50" y="78" text-anchor="middle" font-family="Arial,sans-serif" font-size="22" font-weight="700" fill="#c3f441">idealista</text>' +
      '<path d="M30 55V38l20-14 20 14v17H30z" fill="#1a1a1a"/>' +
      '<rect x="43" y="42" width="14" height="13" rx="1" fill="#c3f441"/>';
    return s;
  }

  /* SVG: apartment illustration */
  function aptSvg(w, h) {
    var s = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
    s.setAttribute('width', w || '100%'); s.setAttribute('height', h || '100%');
    s.setAttribute('viewBox', '0 0 400 260');
    s.setAttribute('preserveAspectRatio', 'xMidYMid slice');
    s.innerHTML =
      '<rect width="400" height="260" fill="#f4ece0"/>' +
      '<rect y="185" width="400" height="75" fill="#c4a37a"/>' +
      '<rect x="25" y="18" width="85" height="130" fill="#c5dff0" stroke="#bca888" stroke-width="4" rx="1"/>' +
      '<line x1="67" y1="18" x2="67" y2="148" stroke="#bca888" stroke-width="2.5"/>' +
      '<line x1="25" y1="83" x2="110" y2="83" stroke="#bca888" stroke-width="2.5"/>' +
      '<rect x="290" y="18" width="85" height="130" fill="#c5dff0" stroke="#bca888" stroke-width="4" rx="1"/>' +
      '<line x1="332" y1="18" x2="332" y2="148" stroke="#bca888" stroke-width="2.5"/>' +
      '<line x1="290" y1="83" x2="375" y2="83" stroke="#bca888" stroke-width="2.5"/>' +
      '<rect x="130" y="138" width="145" height="50" rx="6" fill="#6d5d4e"/>' +
      '<rect x="125" y="130" width="155" height="14" rx="6" fill="#7a6a5a"/>' +
      '<rect x="142" y="142" width="40" height="28" rx="5" fill="#d4a06a"/>' +
      '<rect x="195" y="142" width="40" height="28" rx="5" fill="#c8956a"/>' +
      '<rect x="340" y="162" width="24" height="28" rx="4" fill="#8b6f50"/>' +
      '<circle cx="352" cy="152" r="20" fill="#3d7a4a"/><circle cx="344" cy="144" r="14" fill="#4a9458"/>' +
      '<ellipse cx="200" cy="20" rx="16" ry="10" fill="#ffeaa7" opacity=".75"/>' +
      '<rect x="175" y="40" width="50" height="38" rx="2" fill="#e8d8c8" stroke="#c8b898" stroke-width="2"/>' +
      '<text x="200" y="252" text-anchor="middle" font-family="Georgia,serif" font-size="11" fill="rgba(0,0,0,.08)" font-style="italic" letter-spacing="3">idealista</text>';
    return s;
  }

  /* Night sky wallpaper */
  function wallpaper() {
    var d = el('div', 'position:absolute;inset:0');
    var s = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
    s.setAttribute('width', '100%'); s.setAttribute('height', '100%');
    s.setAttribute('viewBox', '0 0 375 812');
    s.setAttribute('preserveAspectRatio', 'xMidYMid slice');
    var stars = '';
    for (var i = 0; i < 80; i++) {
      var cx = 8 + (i * 43) % 365, cy = 6 + (i * 29) % 380;
      var r = i % 6 === 0 ? 1.8 : i % 3 === 0 ? 1.1 : 0.6;
      stars += '<circle cx="' + cx + '" cy="' + cy + '" r="' + r + '" fill="#fff" opacity="' + (0.15 + ((i * 11) % 10) / 12).toFixed(2) + '"/>';
    }
    s.innerHTML =
      '<defs><linearGradient id="dSk" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stop-color="#080c20"/><stop offset="30%" stop-color="#111830"/><stop offset="55%" stop-color="#161230"/><stop offset="80%" stop-color="#221535"/><stop offset="100%" stop-color="#150d1e"/></linearGradient></defs>' +
      '<rect width="375" height="812" fill="url(#dSk)"/>' + stars +
      '<path d="M0 480 Q60 430 130 460 Q200 380 270 440 Q330 410 375 450 L375 812 L0 812Z" fill="#080610" opacity=".65"/>';
    d.appendChild(s);
    return d;
  }

  /* Status bar */
  function statusBar(dark) {
    var c = dark ? '#000' : '#fff';
    var b = el('div', 'position:absolute;top:12px;left:0;right:0;z-index:200;display:flex;justify-content:space-between;align-items:center;padding:0 28px;font-size:14px;font-weight:600;color:' + c);
    ap(b, 'span', null, '9:41');
    ap(b, 'span');
    var r = ap(b, 'span', 'display:flex;gap:5px;align-items:center');
    var mkSvg = function (w, h, inner) {
      var sv = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
      sv.setAttribute('width', w); sv.setAttribute('height', h); sv.setAttribute('fill', 'none');
      sv.innerHTML = inner; return sv;
    };
    r.appendChild(mkSvg(16, 11, '<rect y="6" width="3" height="5" rx=".5" fill="' + c + '"/><rect x="4" y="4" width="3" height="7" rx=".5" fill="' + c + '"/><rect x="8" y="2" width="3" height="9" rx=".5" fill="' + c + '"/><rect x="12" width="3" height="11" rx=".5" fill="' + c + '"/>'));
    r.appendChild(mkSvg(15, 11, '<path d="M7.5 2C9.8 2 11.9 3 13.3 4.6l1.2-1.2C12.7 1.3 10.2 0 7.5 0S2.3 1.3.5 3.4l1.2 1.2C3.1 3 5.2 2 7.5 2z" fill="' + c + '"/><circle cx="7.5" cy="10" r="1.3" fill="' + c + '"/>'));
    r.appendChild(mkSvg(25, 12, '<rect x=".5" y=".5" width="21" height="11" rx="2" stroke="' + c + '" stroke-opacity=".3"/><rect x="1.5" y="1.5" width="19" height="9" rx="1.5" fill="' + c + '"/>'));
    return b;
  }

  /* Home bar */
  function homeBar(light) {
    return el('div', 'position:absolute;bottom:6px;left:50%;transform:translateX(-50%);width:134px;height:5px;border-radius:3px;background:' + (light ? 'rgba(255,255,255,.35)' : 'rgba(0,0,0,.18)'));
  }

  /* Tap ripple */
  function tapRipple(x, y) {
    var d = el('div', 'position:absolute;left:' + x + 'px;top:' + y + 'px;z-index:300;pointer-events:none');
    ap(d, 'div', 'width:36px;height:36px;border-radius:50%;background:rgba(255,255,255,.22);transform:translate(-50%,-50%);animation:iphTap .22s ease-out forwards');
    return d;
  }

  /* Notification card */
  function notifCard(o) {
    var w = el('div', 'background:rgba(28,28,32,.82);-webkit-backdrop-filter:blur(40px);backdrop-filter:blur(40px);border-radius:14px;padding:11px 12px;margin:0 12px;' +
      (o.anim ? 'animation:' + (o.pop ? 'iphNotifPop .6s cubic-bezier(.17,.89,.32,1.28) forwards' : 'iphNfIn .4s cubic-bezier(.32,1.48,.62,1) forwards') + ';opacity:0' : 'opacity:' + (o.dim ? '.36' : '1')));
    var row = ap(w, 'div', 'display:flex;gap:10px;align-items:flex-start');
    var iw = ap(row, 'div', 'width:38px;height:38px;border-radius:9px;overflow:hidden;flex-shrink:0;box-shadow:0 1px 4px rgba(0,0,0,.3)');
    iw.appendChild(o.icon);
    var bd = ap(row, 'div', 'flex:1;min-width:0');
    var tp = ap(bd, 'div', 'display:flex;justify-content:space-between;margin-bottom:2px');
    ap(tp, 'span', 'color:#fff;font-size:13.5px;font-weight:600', o.app);
    ap(tp, 'span', 'color:rgba(255,255,255,.35);font-size:12px', o.time);
    if (o.title) ap(bd, 'div', 'color:#fff;font-size:13px;font-weight:500;margin-bottom:1px', o.title);
    if (o.body) ap(bd, 'div', 'color:rgba(255,255,255,.7);font-size:12.5px;line-height:1.35', o.body);
    return w;
  }

  /* Lock bottom */
  function lockBottom(timeStr) {
    var d = el('div', 'position:absolute;bottom:0;left:0;right:0;text-align:center;padding-bottom:90px');
    ap(d, 'div', 'font-size:13px;color:rgba(255,255,255,.5);margin-bottom:4px', 'Thursday, May 15');
    ap(d, 'div', 'font-size:64px;font-weight:200;color:#fff;letter-spacing:-2px;line-height:1', timeStr);
    return d;
  }

  /* ===== SCREENS ===== */

  function scrLock(timeStr) {
    var d = el('div', 'position:absolute;inset:0');
    d.appendChild(wallpaper());
    d.appendChild(statusBar(false));
    d.appendChild(lockBottom(timeStr));
    d.appendChild(homeBar(true));
    return d;
  }

  function scrPrioNotif() {
    var d = scrLock('14:00');
    var nw = el('div', 'position:absolute;top:42px;left:0;right:0;z-index:210');
    nw.appendChild(notifCard({
      icon: prioIconSvg(38), app: 'Prio', time: '3 min ago', anim: true, pop: true,
      title: '⚡ New listing · Idealista',
      body: '€' + D.price + '/mo · ' + D.m2 + 'm² · ' + D.bed + ' bed\n📍 ' + D.hood + ', ' + D.city
    }));
    d.appendChild(nw);
    return d;
  }

  function scrTelegram() {
    var d = el('div', 'position:absolute;inset:0;background:#0e1621;color:#fff;font-family:inherit');
    var hdr = ap(d, 'div', 'background:#17212b;padding:38px 14px 10px;display:flex;align-items:center;gap:10px');
    ap(hdr, 'span', 'font-size:18px;color:#8b9bab', '←');
    var av = ap(hdr, 'div', 'width:34px;height:34px;border-radius:50%;background:linear-gradient(135deg,#3B82F6,#1D4ED8);display:flex;align-items:center;justify-content:center;font-size:14px;font-weight:700;color:#fff', 'P');
    var inf = ap(hdr, 'div', '');
    ap(inf, 'div', 'font-size:14px;font-weight:600;color:#fff', 'Prio Alerts');
    ap(inf, 'div', 'font-size:11px;color:#6c7883', 'bot');

    var chat = ap(d, 'div', 'padding:12px');
    var bub = ap(chat, 'div', 'background:#182533;border-radius:0 12px 12px 12px;padding:10px 12px;max-width:95%;animation:iphFadeIn .3s ease');
    ap(bub, 'div', 'font-size:13px;font-weight:600;color:#3B82F6;margin-bottom:6px', '⚡ New listing · Idealista');

    var imgW = ap(bub, 'div', 'border-radius:8px;overflow:hidden;height:120px;margin-bottom:8px;position:relative');
    imgW.appendChild(aptSvg('100%', '100%'));
    ap(imgW, 'div', 'position:absolute;bottom:4px;right:6px;background:rgba(0,0,0,.55);color:#fff;font-size:10px;padding:1px 6px;border-radius:3px', '1/43');

    ap(bub, 'div', 'font-size:13px;color:#ddd;line-height:1.6',
      '🏠 ' + D.price + ' €/mo · ' + D.m2 + 'm² · ' + D.bed + ' bed · ' + D.bath + ' bath');
    ap(bub, 'div', 'font-size:13px;color:#aaa', '📍 ' + D.hood + ', ' + D.city + ' · ' + D.floor);

    var links = ap(bub, 'div', 'margin-top:8px;display:flex;flex-direction:column;gap:4px');
    ap(links, 'div', 'color:#5b9bd5;font-size:13px;font-weight:500', '→ View listing');
    ap(links, 'div', 'color:#5b9bd5;font-size:13px', '📞 ' + D.phone);
    ap(bub, 'div', 'margin-top:8px;font-size:11px;color:#c9a34f;font-style:italic', '⚡ Received before Idealista');
    ap(chat, 'div', 'text-align:right;font-size:11px;color:#6c7883;margin-top:4px', '14:00');

    d.appendChild(homeBar(true));
    return d;
  }

  function scrIdealista() {
    var d = el('div', 'position:absolute;inset:0;background:#fff;color:#1a1a1a;font-family:inherit');
    var hdr = ap(d, 'div', 'background:#fff;padding:38px 14px 10px;display:flex;align-items:center;justify-content:space-between;border-bottom:1px solid #eee');
    var hl = ap(hdr, 'div', 'display:flex;align-items:center;gap:8px');
    ap(hl, 'span', 'font-size:16px;color:#007AFF', '‹ Telegram');
    var hr = ap(hdr, 'div', 'display:flex;gap:14px');
    ap(hr, 'span', 'font-size:16px', '❤️');
    ap(hr, 'span', 'font-size:16px', '↗');

    var imgW = ap(d, 'div', 'height:200px;overflow:hidden;position:relative');
    imgW.appendChild(aptSvg('100%', '100%'));
    ap(imgW, 'div', 'position:absolute;bottom:6px;right:8px;background:rgba(0,0,0,.55);color:#fff;font-size:11px;padding:2px 7px;border-radius:4px', '1/43');

    var info = ap(d, 'div', 'padding:12px 14px');
    ap(info, 'div', 'font-size:12px;color:#999;text-transform:uppercase;letter-spacing:.5px;margin-bottom:4px', 'Top floor for rent – ' + D.street);
    ap(info, 'div', 'font-size:22px;font-weight:700;color:#333', D.price + ' €/month');
    ap(info, 'div', 'font-size:13px;color:#666;margin-top:4px', D.m2 + ' m² · ' + D.bed + ' bed · ' + D.bath + ' bath · ' + D.floor);
    ap(info, 'div', 'font-size:13px;color:#999;margin-top:2px', D.hood + ', ' + D.city);

    var tags = ap(info, 'div', 'display:flex;gap:6px;margin-top:10px;flex-wrap:wrap');
    ['A/C', 'Furnished', 'Terrace'].forEach(function (t) {
      ap(tags, 'span', 'background:#f0f0f0;color:#555;font-size:11px;padding:3px 8px;border-radius:4px;font-weight:500', t);
    });

    var btns = ap(info, 'div', 'display:flex;gap:8px;margin-top:14px');
    ap(btns, 'div', 'flex:1;background:#f0f0f0;color:#333;text-align:center;padding:11px;border-radius:8px;font-size:14px;font-weight:600', '💬 Chat');
    ap(btns, 'div', 'flex:1;background:#b3006c;color:#fff;text-align:center;padding:11px;border-radius:8px;font-size:14px;font-weight:600', '📞 Call');

    d.appendChild(homeBar(false));
    return d;
  }

  function scrCalling() {
    var d = el('div', 'position:absolute;inset:0;background:linear-gradient(180deg,#1a1a2e 0%,#16213e 50%,#0f3460 100%);display:flex;flex-direction:column;align-items:center;justify-content:center;color:#fff;font-family:inherit');
    var iconW = ap(d, 'div', 'width:72px;height:72px;border-radius:50%;background:rgba(179,0,108,.15);display:flex;align-items:center;justify-content:center;margin-bottom:16px;animation:iphCallGlow 2s infinite');
    ap(iconW, 'span', 'font-size:32px', '🏠');
    ap(d, 'div', 'font-size:18px;font-weight:600;margin-bottom:4px', D.phone);
    ap(d, 'div', 'font-size:14px;color:rgba(255,255,255,.5);margin-bottom:6px', D.hood + ', ' + D.city);
    ap(d, 'div', 'font-size:13px;color:rgba(255,255,255,.6);animation:iphPulse 1.5s infinite', 'Calling...');

    var row = ap(d, 'div', 'display:flex;gap:24px;margin-top:36px');
    ap(row, 'div', 'width:50px;height:50px;border-radius:50%;background:rgba(255,255,255,.1);display:flex;align-items:center;justify-content:center;font-size:18px', '🔇');
    ap(row, 'div', 'width:56px;height:56px;border-radius:50%;background:#e53935;display:flex;align-items:center;justify-content:center;font-size:22px;transform:rotate(135deg)', '📞');
    ap(row, 'div', 'width:50px;height:50px;border-radius:50%;background:rgba(255,255,255,.1);display:flex;align-items:center;justify-content:center;font-size:18px', '🔊');

    d.appendChild(homeBar(true));
    return d;
  }

  function scrCalendar() {
    var d = el('div', 'position:absolute;inset:0;background:#f2f2f7;color:#1a1a1a;font-family:inherit');
    var hdr = ap(d, 'div', 'background:#f2f2f7;padding:38px 14px 10px;display:flex;align-items:center;gap:10px');
    ap(hdr, 'span', 'font-size:16px;color:#007AFF', 'Cancel');
    ap(hdr, 'span', 'flex:1;text-align:center;font-size:16px;font-weight:600;color:#1a1a1a', 'New Event');
    ap(hdr, 'span', 'font-size:16px;color:#007AFF;font-weight:600', 'Add');

    var body = ap(d, 'div', 'padding:14px');
    var f1 = ap(body, 'div', 'background:#fff;border-radius:10px;padding:12px;margin-bottom:10px');
    ap(f1, 'div', 'font-size:15px;color:#333;font-weight:500', '🏠 Apartment visit – ' + D.hood);

    var f2 = ap(body, 'div', 'background:#fff;border-radius:10px;padding:12px;margin-bottom:10px');
    ap(f2, 'div', 'font-size:13px;color:#999;margin-bottom:6px', '📍 ' + D.street + ', ' + D.hood);
    ap(f2, 'div', 'font-size:14px;color:#333;font-weight:500', D.visitShort + ' · ' + D.visitTime);

    /* Mini calendar */
    var cal = ap(body, 'div', 'background:#fff;border-radius:10px;padding:12px;margin-bottom:10px');
    ap(cal, 'div', 'font-size:14px;font-weight:600;color:#333;margin-bottom:8px;text-align:center', 'May 2026');
    var hd = ap(cal, 'div', 'display:grid;grid-template-columns:repeat(7,1fr);text-align:center;font-size:10px;color:#999;margin-bottom:4px');
    ['M', 'T', 'W', 'T', 'F', 'S', 'S'].forEach(function (x) { ap(hd, 'span', null, x); });
    var gr = ap(cal, 'div', 'display:grid;grid-template-columns:repeat(7,1fr);text-align:center;font-size:12px;gap:2px');
    /* May 2026 starts on Friday (col 5, 0-indexed 4) */
    for (var blank = 0; blank < 4; blank++) ap(gr, 'span', 'color:transparent', '.');
    for (var day = 1; day <= 31; day++) {
      if (day === 21) {
        ap(gr, 'span', 'background:#007AFF;color:#fff;border-radius:50%;width:24px;height:24px;display:flex;align-items:center;justify-content:center;margin:0 auto;font-weight:600', '21');
      } else if (day <= 15) {
        ap(gr, 'span', 'color:#bbb', '' + day);
      } else {
        ap(gr, 'span', 'color:#333', '' + day);
      }
    }

    d.appendChild(homeBar(false));
    return d;
  }

  function scrConfirmed() {
    var d = el('div', 'position:absolute;inset:0;background:#fff;display:flex;flex-direction:column;align-items:center;justify-content:center;font-family:inherit');
    var circ = ap(d, 'div', 'width:72px;height:72px;border-radius:50%;background:#ecfdf5;display:flex;align-items:center;justify-content:center;margin-bottom:18px;animation:iphCheckPop .5s cubic-bezier(.17,.89,.32,1.28) forwards');
    var sv = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
    sv.setAttribute('width', '36'); sv.setAttribute('height', '36'); sv.setAttribute('fill', 'none');
    sv.innerHTML = '<path d="M8 18l8 8 12-16" stroke="#10b981" stroke-width="3.5" stroke-linecap="round" stroke-linejoin="round" stroke-dasharray="40" stroke-dashoffset="40" style="animation:iphDrawCheck .6s .3s ease forwards"/>';
    circ.appendChild(sv);
    ap(d, 'div', 'font-size:18px;font-weight:700;color:#111;margin-bottom:6px', 'Visit Confirmed');
    ap(d, 'div', 'font-size:14px;color:#555', D.visitDay + ' · ' + D.visitTime);
    d.appendChild(homeBar(false));
    return d;
  }

  function scrTimeWarp() {
    var d = el('div', 'position:absolute;inset:0;background:rgba(0,0,0,.92);display:flex;flex-direction:column;align-items:center;justify-content:center;z-index:250;animation:iphFadeIn .6s ease;font-family:inherit');
    /* SVG clock */
    var sv = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
    sv.setAttribute('width', '56'); sv.setAttribute('height', '56'); sv.setAttribute('viewBox', '0 0 56 56');
    sv.innerHTML =
      '<circle cx="28" cy="28" r="26" stroke="rgba(255,255,255,.3)" stroke-width="2" fill="none"/>' +
      '<line x1="28" y1="28" x2="28" y2="12" stroke="#fff" stroke-width="2.5" stroke-linecap="round"/>' +
      '<line x1="28" y1="28" x2="40" y2="28" stroke="rgba(255,255,255,.6)" stroke-width="2" stroke-linecap="round" style="transform-origin:28px 28px;animation:iphClockSpin 2s linear infinite"/>' +
      '<circle cx="28" cy="28" r="2.5" fill="#fff"/>';
    var svW = ap(d, 'div', 'margin-bottom:20px');
    svW.appendChild(sv);
    ap(d, 'div', 'font-size:15px;color:rgba(255,255,255,.5);margin-bottom:6px;letter-spacing:2px', '14:00 → 14:05');
    ap(d, 'div', 'font-size:22px;font-weight:700;color:#fff;text-transform:uppercase;letter-spacing:3px', '5 minutes later');
    return d;
  }

  function scrIdlNotif() {
    var d = scrLock('14:05');
    /* Prio notif dimmed */
    var n1 = el('div', 'position:absolute;top:42px;left:0;right:0;z-index:210');
    n1.appendChild(notifCard({
      icon: prioIconSvg(38), app: 'Prio', time: '5m ago', anim: false, dim: true,
      title: '⚡ New listing — ' + D.hood,
      body: D.price + '€ · ' + D.m2 + 'm² · ' + D.bed + ' bed'
    }));
    d.appendChild(n1);
    /* Idealista notif */
    var n2 = el('div', 'position:absolute;top:122px;left:0;right:0;z-index:211');
    n2.appendChild(notifCard({
      icon: idlIconSvg(38), app: 'idealista', time: 'now', anim: true, pop: true,
      title: 'New listing in your area',
      body: D.hood + ' — ' + D.price + '€/month'
    }));
    d.appendChild(n2);
    return d;
  }

  function scrBadge() {
    var d = scrLock('14:05');
    /* Prio dimmed */
    var n1 = el('div', 'position:absolute;top:42px;left:0;right:0;z-index:210');
    n1.appendChild(notifCard({
      icon: prioIconSvg(38), app: 'Prio', time: '5m ago', anim: false, dim: true,
      title: '⚡ New listing — ' + D.hood,
      body: D.price + '€ · ' + D.m2 + 'm² · ' + D.bed + ' bed'
    }));
    d.appendChild(n1);
    /* Idealista */
    var n2 = el('div', 'position:absolute;top:122px;left:0;right:0;z-index:211');
    n2.appendChild(notifCard({
      icon: idlIconSvg(38), app: 'idealista', time: 'now', anim: false,
      title: 'New listing in your area',
      body: D.hood + ' — ' + D.price + '€/month'
    }));
    d.appendChild(n2);
    /* Badge */
    var bw = el('div', 'position:absolute;bottom:100px;left:50%;transform:translateX(-50%);z-index:260;animation:iphBadgePop .6s cubic-bezier(.17,.89,.32,1.28) forwards;opacity:0');
    var bi = ap(bw, 'div', 'background:#fff;border-radius:16px;padding:12px 20px;text-align:center;box-shadow:0 4px 20px rgba(0,0,0,.3)');
    ap(bi, 'div', 'font-size:24px;margin-bottom:4px', '✅');
    ap(bi, 'div', 'font-size:14px;font-weight:700;color:#111', 'You already called');
    ap(bi, 'div', 'font-size:12px;color:#666;margin-top:2px', 'Visit booked May 21 · 5 min ahead');
    d.appendChild(bw);
    return d;
  }

  /* ===== LABELS ===== */
  var LABELS = {
    'prio-notif': '⚡ Prio detects a new listing',
    'telegram':   'Opening in Telegram',
    'idealista':  'Viewing on Idealista',
    'calling':    'Calling the landlord',
    'calendar':   'Booking a visit',
    'confirmed':  'Visit confirmed ✓',
    'idl-notif':  'Idealista finally sends its alert',
    'badge':      "You're already 5 min ahead"
  };

  /* ===== RENDER ===== */
  function render(container) {
    container.innerHTML = '';

    var phone = el('div', 'position:relative;width:280px;height:600px;border-radius:40px;overflow:hidden;background:#000;box-shadow:0 20px 60px rgba(0,0,0,.25),0 0 0 2px rgba(255,255,255,.08);margin:0 auto;font-family:-apple-system,BlinkMacSystemFont,"SF Pro Display","Segoe UI",Roboto,sans-serif;-webkit-font-smoothing:antialiased');
    var notch = el('div', 'position:absolute;top:0;left:50%;transform:translateX(-50%);width:120px;height:28px;background:#000;border-radius:0 0 18px 18px;z-index:300');
    phone.appendChild(notch);

    var screen = el('div', 'position:absolute;inset:0;overflow:hidden');
    phone.appendChild(screen);

    var progW = el('div', 'position:absolute;bottom:0;left:0;right:0;height:3px;background:rgba(255,255,255,.1);z-index:300');
    var progB = el('div', 'height:100%;width:0%;background:linear-gradient(90deg,#3B82F6,#8B5CF6);transition:width .1s linear;border-radius:0 2px 2px 0');
    progW.appendChild(progB);
    phone.appendChild(progW);

    var caption = el('div', 'text-align:center;margin-top:14px;min-height:22px;font-size:13px;color:var(--color-text-muted,#999);font-weight:500;transition:opacity .3s');

    container.appendChild(phone);
    container.appendChild(caption);

    /* state */
    var playing = false, rafId = null, startT = null, lastStep = '';

    function buildScreen(sid) {
      screen.innerHTML = '';
      var s;
      switch (sid) {
        case 'lock1':     s = scrLock('14:00'); break;
        case 'prio-notif': s = scrPrioNotif(); break;
        case 'tap1':      s = scrPrioNotif(); s.appendChild(tapRipple(140, 90)); break;
        case 'telegram':  s = scrTelegram(); s.appendChild(statusBar(false)); break;
        case 'tap2':      s = scrTelegram(); s.appendChild(statusBar(false)); s.appendChild(tapRipple(140, 280)); break;
        case 'idealista': s = scrIdealista(); s.appendChild(statusBar(true)); break;
        case 'tap3':      s = scrIdealista(); s.appendChild(statusBar(true)); s.appendChild(tapRipple(140, 430)); break;
        case 'calling':   s = scrCalling(); s.appendChild(statusBar(false)); break;
        case 'calendar':  s = scrCalendar(); s.appendChild(statusBar(true)); break;
        case 'confirmed': s = scrConfirmed(); s.appendChild(statusBar(true)); break;
        case 'time-warp': s = scrConfirmed(); s.appendChild(scrTimeWarp()); break;
        case 'lock2':     s = scrLock('14:05'); break;
        case 'idl-notif': s = scrIdlNotif(); break;
        case 'badge':     s = scrBadge(); break;
        default:          s = scrLock('14:00');
      }
      while (s.firstChild) screen.appendChild(s.firstChild);
    }

    function tick(now) {
      if (!startT) startT = now;
      var elapsed = now - startT;
      progB.style.width = (Math.min(elapsed / TOTAL, 1) * 100) + '%';
      var acc = 0, cur = STEPS[0].id;
      for (var i = 0; i < STEPS.length; i++) {
        acc += STEPS[i].ms;
        if (elapsed < acc) { cur = STEPS[i].id; break; }
        if (i === STEPS.length - 1) cur = STEPS[i].id;
      }
      if (cur !== lastStep) {
        lastStep = cur;
        buildScreen(cur);
        caption.textContent = LABELS[cur] || '';
        caption.style.opacity = LABELS[cur] ? '1' : '0';
      }
      if (elapsed < TOTAL) rafId = requestAnimationFrame(tick);
      else playing = false;
    }

    function play() {
      if (playing) return;
      playing = true; startT = null; lastStep = '';
      rafId = requestAnimationFrame(tick);
    }
    function stop() { if (rafId) cancelAnimationFrame(rafId); playing = false; }

    buildScreen('lock1');
    return { play: play, stop: stop };
  }

  /* ===== BOOT ===== */
  function boot() {
    var target = document.getElementById('iphone-demo');
    if (!target || target.children.length > 0) return;
    var demo = render(target);
    var hasPlayed = false;

    var obs = new IntersectionObserver(function (entries) {
      entries.forEach(function (e) {
        if (e.isIntersecting && !hasPlayed) { hasPlayed = true; demo.play(); }
      });
    }, { threshold: 0.3 });
    obs.observe(target);

    target.style.cursor = 'pointer';
    target.addEventListener('click', function () {
      demo.stop(); hasPlayed = true;
      demo = render(target); demo.play();
    });
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', boot);
  } else {
    boot();
  }
})();
