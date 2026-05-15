/* ============================================
   iPhone Demo — "Faster than push alerts"
   Vanilla JS, auto-play on scroll via IntersectionObserver
   ============================================ */

(function () {
  'use strict';

  var STEPS = [
    { id: 'lock1',     ms: 800  },
    { id: 'prio-notif',ms: 2400 },
    { id: 'tap1',      ms: 180  },
    { id: 'telegram',  ms: 2200 },
    { id: 'tap2',      ms: 180  },
    { id: 'idealista', ms: 2200 },
    { id: 'tap3',      ms: 180  },
    { id: 'calling',   ms: 2000 },
    { id: 'calendar',  ms: 2600 },
    { id: 'confirmed', ms: 2000 },
    { id: 'time-warp', ms: 2600 },
    { id: 'lock2',     ms: 500  },
    { id: 'idl-notif', ms: 2800 },
    { id: 'badge',     ms: 3600 }
  ];
  var TOTAL = STEPS.reduce(function (a, s) { return a + s.ms; }, 0);

  /* ---- SVG icons (inline) ---- */

  function prioIcon(s) {
    s = s || 36;
    var svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
    svg.setAttribute('width', s);
    svg.setAttribute('height', s);
    svg.setAttribute('viewBox', '0 0 100 100');
    svg.innerHTML =
      '<defs><linearGradient id="pG" x1="0" y1="0" x2="1" y2="1"><stop offset="0%" stop-color="#3B82F6"/><stop offset="100%" stop-color="#1D4ED8"/></linearGradient></defs>' +
      '<rect width="100" height="100" rx="22" fill="url(#pG)"/>' +
      '<path d="M28 22h14v56h-14z" fill="#fff"/>' +
      '<path d="M42 22h16c12 0 20 8 20 18s-8 18-20 18H42V22z" fill="#fff"/>' +
      '<path d="M42 30h14c7 0 12 4 12 10s-5 10-12 10H42V30z" fill="url(#pG)"/>' +
      '<path d="M52 14l18 0l0 18" stroke="#fff" stroke-width="5" fill="none" stroke-linecap="round" stroke-linejoin="round"/>' +
      '<path d="M52 32l18-18" stroke="#fff" stroke-width="5" fill="none" stroke-linecap="round"/>';
    return svg;
  }

  function telegramIcon(s) {
    s = s || 36;
    var svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
    svg.setAttribute('width', s);
    svg.setAttribute('height', s);
    svg.setAttribute('viewBox', '0 0 100 100');
    svg.innerHTML =
      '<rect width="100" height="100" rx="22" fill="#27A7E7"/>' +
      '<path d="M25 50l8.5 4.2 3.2 10.3c.4 1.2 1.8 1.6 2.8.8l4.6-3.8 9 6.6c1 .8 2.5.2 2.7-1l7-34c.3-1.3-.9-2.4-2.1-1.9L24.6 47.5c-1.5.6-1.5 2.1.4 2.5z" fill="#fff"/>' +
      '<path d="M38 54l-.6 8.5 4.4-3.8" fill="#b0d4f1"/>' +
      '<path d="M38 54l15-11.5c.6-.4 1.2.3.7.8L40.2 55.8l-.8 6.6" fill="#d2e7f9"/>';
    return svg;
  }

  function idealistaIcon(s) {
    s = s || 36;
    var svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
    svg.setAttribute('width', s);
    svg.setAttribute('height', s);
    svg.setAttribute('viewBox', '0 0 100 100');
    svg.innerHTML =
      '<rect width="100" height="100" rx="22" fill="#FFE100"/>' +
      '<path d="M30 65V42l20-14 20 14v23H30z" fill="#1a1a1a"/>' +
      '<rect x="43" y="50" width="14" height="15" rx="2" fill="#FFE100"/>';
    return svg;
  }

  /* ---- Apartment illustration (full) ---- */
  function aptFull(h) {
    h = h || 245;
    var d = el('div', {
      style: 'height:' + h + 'px;position:relative;overflow:hidden'
    });
    var svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
    svg.setAttribute('width', '100%');
    svg.setAttribute('height', '100%');
    svg.setAttribute('viewBox', '0 0 400 260');
    svg.setAttribute('preserveAspectRatio', 'xMidYMid slice');
    svg.innerHTML =
      '<rect width="400" height="260" fill="#f4ece0"/>' +
      '<rect y="185" width="400" height="75" fill="#c4a37a"/>' +
      [0,40,80,120,160,200,240,280,320,360].map(function(x){return '<rect x="'+x+'" y="185" width="38" height="75" fill="'+(x%80===0?'#b8976e':'#c4a37a')+'" stroke="#b08a64" stroke-width=".3"/>';}).join('') +
      '<rect x="25" y="18" width="85" height="130" fill="#c5dff0" stroke="#bca888" stroke-width="4" rx="1"/>' +
      '<line x1="67" y1="18" x2="67" y2="148" stroke="#bca888" stroke-width="2.5"/>' +
      '<line x1="25" y1="83" x2="110" y2="83" stroke="#bca888" stroke-width="2.5"/>' +
      '<rect x="27" y="20" width="38" height="61" fill="#aed4ee" opacity=".5"/>' +
      '<rect x="69" y="20" width="38" height="61" fill="#a4cce8" opacity=".5"/>' +
      '<rect x="290" y="18" width="85" height="130" fill="#c5dff0" stroke="#bca888" stroke-width="4" rx="1"/>' +
      '<line x1="332" y1="18" x2="332" y2="148" stroke="#bca888" stroke-width="2.5"/>' +
      '<line x1="290" y1="83" x2="375" y2="83" stroke="#bca888" stroke-width="2.5"/>' +
      [18,103,283,368].map(function(x){return '<rect x="'+x+'" y="12" width="14" height="142" fill="#e8ddd0" rx="2" opacity=".8"/>';}).join('') +
      '<rect x="130" y="138" width="145" height="50" rx="6" fill="#6d5d4e"/>' +
      '<rect x="125" y="130" width="155" height="14" rx="6" fill="#7a6a5a"/>' +
      '<rect x="122" y="130" width="22" height="58" rx="5" fill="#7a6a5a"/>' +
      '<rect x="260" y="130" width="22" height="58" rx="5" fill="#7a6a5a"/>' +
      '<rect x="142" y="142" width="40" height="28" rx="5" fill="#d4a06a"/>' +
      '<rect x="195" y="142" width="40" height="28" rx="5" fill="#c8956a"/>' +
      '<rect x="155" y="196" width="95" height="6" rx="2" fill="#4a3a2d"/>' +
      '<rect x="165" y="202" width="4" height="16" fill="#4a3a2d"/>' +
      '<rect x="236" y="202" width="4" height="16" fill="#4a3a2d"/>' +
      '<rect x="180" y="192" width="24" height="4" rx="1" fill="#c0392b"/>' +
      '<rect x="340" y="162" width="24" height="28" rx="4" fill="#8b6f50"/>' +
      '<circle cx="352" cy="152" r="20" fill="#3d7a4a"/><circle cx="344" cy="144" r="14" fill="#4a9458"/><circle cx="360" cy="148" r="12" fill="#357a42"/>' +
      '<line x1="200" y1="0" x2="200" y2="14" stroke="#888" stroke-width="1.5"/>' +
      '<ellipse cx="200" cy="20" rx="16" ry="10" fill="#ffeaa7" opacity=".75"/>' +
      '<ellipse cx="200" cy="20" rx="10" ry="6" fill="#fff8dc"/>' +
      '<rect x="175" y="40" width="50" height="38" rx="2" fill="#e8d8c8" stroke="#c8b898" stroke-width="2"/>' +
      '<rect x="180" y="45" width="40" height="28" fill="#d4c4b0"/>' +
      '<circle cx="195" cy="55" r="6" fill="#e8c898"/>' +
      '<path d="M180 68 L195 56 L205 62 L220 52 L220 73 L180 73Z" fill="#a8c4a0" opacity=".5"/>';
    d.appendChild(svg);
    var badge = el('div', {
      style: 'position:absolute;bottom:8px;right:10px;background:rgba(0,0,0,.55);color:#fff;font-size:11px;padding:2px 7px;border-radius:4px;font-weight:500'
    }, '1/43');
    d.appendChild(badge);
    return d;
  }

  function aptThumb(h) {
    h = h || 130;
    var d = el('div', { style: 'height:' + h + 'px;overflow:hidden' });
    var svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
    svg.setAttribute('width', '100%');
    svg.setAttribute('height', '100%');
    svg.setAttribute('viewBox', '0 0 320 130');
    svg.setAttribute('preserveAspectRatio', 'xMidYMid slice');
    svg.innerHTML =
      '<rect width="320" height="130" fill="#f4ece0"/>' +
      '<rect y="95" width="320" height="35" fill="#c4a37a"/>' +
      '<rect x="15" y="10" width="55" height="70" fill="#c5dff0" stroke="#bca888" stroke-width="2.5"/>' +
      '<line x1="42" y1="10" x2="42" y2="80" stroke="#bca888" stroke-width="1.5"/>' +
      '<rect x="250" y="10" width="55" height="70" fill="#c5dff0" stroke="#bca888" stroke-width="2.5"/>' +
      '<rect x="90" y="65" width="100" height="32" rx="5" fill="#6d5d4e"/>' +
      '<rect x="86" y="60" width="108" height="10" rx="4" fill="#7a6a5a"/>' +
      '<rect x="110" y="68" width="28" height="18" rx="3" fill="#d4a06a"/>' +
      '<rect x="150" y="68" width="28" height="18" rx="3" fill="#c8956a"/>' +
      '<circle cx="280" cy="75" r="14" fill="#3d7a4a"/>' +
      '<ellipse cx="160" cy="10" rx="12" ry="7" fill="#ffeaa7" opacity=".6"/>';
    d.appendChild(svg);
    return d;
  }

  /* ---- DOM helper ---- */
  function el(tag, attrs, text) {
    var e = document.createElement(tag);
    if (attrs) {
      Object.keys(attrs).forEach(function (k) {
        if (k === 'style' && typeof attrs[k] === 'string') e.setAttribute('style', attrs[k]);
        else e.setAttribute(k, attrs[k]);
      });
    }
    if (text) e.textContent = text;
    return e;
  }

  function setS(e, styles) {
    Object.keys(styles).forEach(function (k) { e.style[k] = styles[k]; });
  }

  /* ---- Night sky wallpaper ---- */
  function wallpaper() {
    var d = el('div', { style: 'position:absolute;inset:0' });
    var svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
    svg.setAttribute('width', '100%');
    svg.setAttribute('height', '100%');
    svg.setAttribute('viewBox', '0 0 375 812');
    svg.setAttribute('preserveAspectRatio', 'xMidYMid slice');
    var stars = '';
    for (var i = 0; i < 90; i++) {
      var cx = 8 + (i * 43) % 365;
      var cy = 6 + (i * 29) % 380;
      var r = i % 6 === 0 ? 1.8 : i % 3 === 0 ? 1.1 : 0.6;
      var op = (0.15 + ((i * 11) % 10) / 12).toFixed(2);
      stars += '<circle cx="' + cx + '" cy="' + cy + '" r="' + r + '" fill="#fff" opacity="' + op + '"/>';
    }
    svg.innerHTML =
      '<defs>' +
        '<linearGradient id="demoSk" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stop-color="#080c20"/><stop offset="30%" stop-color="#111830"/><stop offset="55%" stop-color="#161230"/><stop offset="80%" stop-color="#221535"/><stop offset="100%" stop-color="#150d1e"/></linearGradient>' +
        '<radialGradient id="demoGl" cx="50%" cy="22%"><stop offset="0%" stop-color="#a090cc" stop-opacity=".08"/><stop offset="100%" stop-color="transparent"/></radialGradient>' +
      '</defs>' +
      '<rect width="375" height="812" fill="url(#demoSk)"/>' +
      '<ellipse cx="187" cy="160" rx="180" ry="90" fill="url(#demoGl)"/>' +
      stars +
      '<path d="M0 480 Q60 430 130 460 Q200 380 270 440 Q330 410 375 450 L375 812 L0 812Z" fill="#080610" opacity=".65"/>';
    d.appendChild(svg);
    return d;
  }

  /* ---- Status bar ---- */
  function statusBar(dark) {
    var c = dark ? '#000' : '#fff';
    var bar = el('div', {
      style: 'position:absolute;top:12px;left:0;right:0;z-index:200;display:flex;justify-content:space-between;align-items:center;padding:0 28px;font-size:14px;font-weight:600;color:' + c
    });
    bar.appendChild(el('span', {}, 'Movistar'));
    bar.appendChild(el('span'));
    var right = el('span', { style: 'display:flex;gap:5px;align-items:center' });
    var s1 = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
    s1.setAttribute('width', '16'); s1.setAttribute('height', '11'); s1.setAttribute('fill', 'none');
    s1.innerHTML = '<rect y="6" width="3" height="5" rx=".5" fill="' + c + '"/><rect x="4" y="4" width="3" height="7" rx=".5" fill="' + c + '"/><rect x="8" y="2" width="3" height="9" rx=".5" fill="' + c + '"/><rect x="12" width="3" height="11" rx=".5" fill="' + c + '"/>';
    var s2 = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
    s2.setAttribute('width', '15'); s2.setAttribute('height', '11'); s2.setAttribute('fill', 'none');
    s2.innerHTML = '<path d="M7.5 2C9.8 2 11.9 3 13.3 4.6l1.2-1.2C12.7 1.3 10.2 0 7.5 0S2.3 1.3.5 3.4l1.2 1.2C3.1 3 5.2 2 7.5 2z" fill="' + c + '"/><circle cx="7.5" cy="10" r="1.3" fill="' + c + '"/>';
    var s3 = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
    s3.setAttribute('width', '25'); s3.setAttribute('height', '12'); s3.setAttribute('fill', 'none');
    s3.innerHTML = '<rect x=".5" y=".5" width="21" height="11" rx="2" stroke="' + c + '" stroke-opacity=".3"/><rect x="1.5" y="1.5" width="19" height="9" rx="1.5" fill="' + c + '"/>';
    right.appendChild(s1); right.appendChild(s2); right.appendChild(s3);
    bar.appendChild(right);
    return bar;
  }

  /* ---- Tap ripple ---- */
  function tapEl(x, y) {
    var d = el('div', {
      style: 'position:absolute;left:' + x + 'px;top:' + y + 'px;z-index:300;pointer-events:none'
    });
    var c = el('div', {
      style: 'width:36px;height:36px;border-radius:50%;background:rgba(255,255,255,.18);transform:translate(-50%,-50%);animation:iphTap .22s ease-out forwards'
    });
    d.appendChild(c);
    return d;
  }

  /* ---- Notification card ---- */
  function notif(opts) {
    var wrap = el('div', {
      style: 'background:rgba(28,28,32,.82);-webkit-backdrop-filter:blur(40px);backdrop-filter:blur(40px);border-radius:14px;padding:11px 12px;margin:0 12px;' +
        (opts.anim ? ('animation:' + (opts.pop ? 'iphNotifPop .6s cubic-bezier(.17,.89,.32,1.28) forwards' : 'iphNfIn .4s cubic-bezier(.32,1.48,.62,1) forwards') + ';opacity:0') : ('opacity:' + (opts.dim ? '.36' : '1')))
    });
    var row = el('div', { style: 'display:flex;gap:10px;align-items:flex-start' });
    var iconWrap = el('div', { style: 'width:38px;height:38px;border-radius:9px;overflow:hidden;flex-shrink:0;box-shadow:0 1px 4px rgba(0,0,0,.3)' });
    iconWrap.appendChild(opts.icon);
    row.appendChild(iconWrap);
    var body = el('div', { style: 'flex:1' });
    var top = el('div', { style: 'display:flex;justify-content:space-between;margin-bottom:2px' });
    top.appendChild(el('span', { style: 'color:#fff;font-size:13.5px;font-weight:600' }, opts.app));
    top.appendChild(el('span', { style: 'color:rgba(255,255,255,.35);font-size:12px' }, opts.time));
    body.appendChild(top);
    if (opts.title) {
      body.appendChild(el('div', { style: 'color:#fff;font-size:13.5px;font-weight:500;margin-bottom:1px' }, opts.title));
    }
    body.appendChild(el('div', { style: 'color:rgba(255,255,255,.78);font-size:13px;line-height:1.4' }, opts.body));
    row.appendChild(body);
    wrap.appendChild(row);
    return wrap;
  }

  /* ---- Home bar indicator ---- */
  function homeBar(light) {
    var d = el('div', { style: 'position:absolute;bottom:6px;left:50%;transform:translateX(-50%);width:134px;height:5px;border-radius:3px;background:' + (light ? 'rgba(255,255,255,.35)' : 'rgba(0,0,0,.2)') });
    return d;
  }

  /* ---- Lock bottom (time + date) ---- */
  function lockBottom(timeStr) {
    var d = el('div', { style: 'position:absolute;bottom:0;left:0;right:0;text-align:center;padding-bottom:90px' });
    d.appendChild(el('div', { style: 'font-size:13px;color:rgba(255,255,255,.5);margin-bottom:4px' }, 'Thursday, May 15'));
    d.appendChild(el('div', { style: 'font-size:64px;font-weight:200;color:#fff;letter-spacing:-2px;line-height:1' }, timeStr));
    return d;
  }

  /* ---- Screen: Telegram chat ---- */
  function screenTelegram() {
    var d = el('div', { style: 'position:absolute;inset:0;background:#0e1621;color:#fff;font-family:inherit' });
    // header
    var hdr = el('div', { style: 'background:#17212b;padding:38px 14px 10px;display:flex;align-items:center;gap:10px' });
    hdr.appendChild(el('span', { style: 'font-size:18px' }, '←'));
    var avatar = el('div', { style: 'width:34px;height:34px;border-radius:50%;background:linear-gradient(135deg,#3B82F6,#1D4ED8);display:flex;align-items:center;justify-content:center;font-size:14px;font-weight:700;color:#fff' }, 'P');
    hdr.appendChild(avatar);
    var info = el('div');
    info.appendChild(el('div', { style: 'font-size:14px;font-weight:600' }, 'Prio Alerts'));
    info.appendChild(el('div', { style: 'font-size:11px;color:#6c7883' }, 'bot'));
    hdr.appendChild(info);
    d.appendChild(hdr);
    // chat area
    var chat = el('div', { style: 'padding:14px' });
    var bubble = el('div', { style: 'background:#182533;border-radius:12px;padding:10px 12px;max-width:92%;animation:iphFadeIn .3s ease' });
    bubble.appendChild(el('div', { style: 'font-size:13px;font-weight:600;color:#3B82F6;margin-bottom:6px' }, '⚡ New listing detected'));
    // photo placeholder
    var photo = aptThumb(130);
    setS(photo, { borderRadius: '8px', overflow: 'hidden', marginBottom: '8px' });
    bubble.appendChild(photo);
    bubble.appendChild(el('div', { style: 'font-size:13px;line-height:1.5;color:#ddd' }, '🏠 Eixample, Barcelona'));
    bubble.appendChild(el('div', { style: 'font-size:13px;color:#ddd' }, '💰 1,150€/month · 65m² · 2 bed'));
    bubble.appendChild(el('div', { style: 'margin-top:8px' }));
    var link = el('div', { style: 'background:#1D4ED8;color:#fff;text-align:center;padding:8px;border-radius:8px;font-size:13px;font-weight:600;margin-top:6px' }, 'View on Idealista →');
    bubble.appendChild(link);
    chat.appendChild(bubble);
    // time
    chat.appendChild(el('div', { style: 'text-align:right;font-size:11px;color:#6c7883;margin-top:4px' }, '14:00'));
    d.appendChild(chat);
    d.appendChild(homeBar(true));
    return d;
  }

  /* ---- Screen: Idealista listing ---- */
  function screenIdealista() {
    var d = el('div', { style: 'position:absolute;inset:0;background:#fff;color:#1a1a1a;font-family:inherit' });
    // header
    var hdr = el('div', { style: 'background:#fff;padding:38px 14px 10px;display:flex;align-items:center;justify-content:space-between;border-bottom:1px solid #eee' });
    var left = el('div', { style: 'display:flex;align-items:center;gap:8px' });
    left.appendChild(el('span', { style: 'font-size:18px;color:#333' }, '←'));
    left.appendChild(el('span', { style: 'font-size:15px;font-weight:700;color:#1a1a1a' }, 'idealista'));
    hdr.appendChild(left);
    var right = el('div', { style: 'display:flex;gap:14px' });
    right.appendChild(el('span', { style: 'font-size:18px' }, '❤️'));
    right.appendChild(el('span', { style: 'font-size:18px' }, '↗'));
    hdr.appendChild(right);
    d.appendChild(hdr);
    // photo
    d.appendChild(aptFull(200));
    // details
    var info = el('div', { style: 'padding:12px 14px' });
    info.appendChild(el('div', { style: 'font-size:22px;font-weight:700;color:#333' }, '1,150 €/month'));
    info.appendChild(el('div', { style: 'font-size:13px;color:#666;margin-top:4px' }, '65 m² · 2 bed · 1 bath · 3rd floor'));
    info.appendChild(el('div', { style: 'font-size:13px;color:#999;margin-top:2px' }, 'Eixample, Barcelona'));
    // CTA
    var cta = el('div', { style: 'background:#1D9E75;color:#fff;text-align:center;padding:12px;border-radius:8px;font-size:15px;font-weight:700;margin-top:12px' }, '📞 Contact landlord');
    info.appendChild(cta);
    d.appendChild(info);
    d.appendChild(homeBar(false));
    return d;
  }

  /* ---- Screen: Calling ---- */
  function screenCalling() {
    var d = el('div', { style: 'position:absolute;inset:0;background:linear-gradient(180deg,#1a1a2e 0%,#16213e 50%,#0f3460 100%);display:flex;flex-direction:column;align-items:center;justify-content:center;color:#fff;font-family:inherit' });
    d.appendChild(el('div', { style: 'font-size:13px;color:rgba(255,255,255,.6);margin-bottom:8px;animation:iphPulse 1.5s infinite' }, 'calling…'));
    d.appendChild(el('div', { style: 'font-size:22px;font-weight:600;margin-bottom:4px' }, 'Property Owner'));
    d.appendChild(el('div', { style: 'font-size:14px;color:rgba(255,255,255,.5);margin-bottom:30px' }, '+34 612 345 678'));
    // avatar
    var av = el('div', { style: 'width:80px;height:80px;border-radius:50%;background:rgba(255,255,255,.1);display:flex;align-items:center;justify-content:center;font-size:32px;margin-bottom:40px' }, '👤');
    d.appendChild(av);
    // buttons row
    var row = el('div', { style: 'display:flex;gap:28px' });
    var hangup = el('div', { style: 'width:60px;height:60px;border-radius:50%;background:#E91E63;display:flex;align-items:center;justify-content:center;font-size:24px;animation:iphCallGlow 2s infinite' }, '📞');
    var speaker = el('div', { style: 'width:50px;height:50px;border-radius:50%;background:rgba(255,255,255,.12);display:flex;align-items:center;justify-content:center;font-size:18px' }, '🔊');
    var mute = el('div', { style: 'width:50px;height:50px;border-radius:50%;background:rgba(255,255,255,.12);display:flex;align-items:center;justify-content:center;font-size:18px' }, '🔇');
    row.appendChild(mute); row.appendChild(hangup); row.appendChild(speaker);
    d.appendChild(row);
    d.appendChild(homeBar(true));
    return d;
  }

  /* ---- Screen: Calendar ---- */
  function screenCalendar() {
    var d = el('div', { style: 'position:absolute;inset:0;background:#fff;color:#1a1a1a;font-family:inherit' });
    // header
    var hdr = el('div', { style: 'background:#fff;padding:38px 14px 10px;display:flex;align-items:center;gap:10px;border-bottom:1px solid #eee' });
    hdr.appendChild(el('span', { style: 'font-size:16px;color:#007AFF' }, 'Cancel'));
    hdr.appendChild(el('span', { style: 'flex:1;text-align:center;font-size:16px;font-weight:600' }, 'New Event'));
    hdr.appendChild(el('span', { style: 'font-size:16px;color:#007AFF;font-weight:600' }, 'Add'));
    d.appendChild(hdr);
    var body = el('div', { style: 'padding:16px' });
    // title field
    var field = el('div', { style: 'background:#f5f5f5;border-radius:10px;padding:12px;margin-bottom:12px' });
    field.appendChild(el('div', { style: 'font-size:15px;color:#333;font-weight:500' }, '🏠 Visit — Eixample apt'));
    body.appendChild(field);
    // date/time
    var dt = el('div', { style: 'background:#f5f5f5;border-radius:10px;padding:12px;margin-bottom:12px' });
    var r1 = el('div', { style: 'display:flex;justify-content:space-between;margin-bottom:8px' });
    r1.appendChild(el('span', { style: 'font-size:14px;color:#333' }, 'Starts'));
    r1.appendChild(el('span', { style: 'font-size:14px;color:#007AFF' }, 'Today, 18:00'));
    dt.appendChild(r1);
    var r2 = el('div', { style: 'display:flex;justify-content:space-between' });
    r2.appendChild(el('span', { style: 'font-size:14px;color:#333' }, 'Ends'));
    r2.appendChild(el('span', { style: 'font-size:14px;color:#007AFF' }, 'Today, 18:30'));
    dt.appendChild(r2);
    body.appendChild(dt);
    // location
    var loc = el('div', { style: 'background:#f5f5f5;border-radius:10px;padding:12px;margin-bottom:12px' });
    loc.appendChild(el('div', { style: 'font-size:14px;color:#333' }, '📍 Eixample, Barcelona'));
    body.appendChild(loc);
    // alert
    var alert = el('div', { style: 'background:#f5f5f5;border-radius:10px;padding:12px' });
    alert.appendChild(el('div', { style: 'font-size:14px;color:#333' }, '🔔 Alert — 30 min before'));
    body.appendChild(alert);
    d.appendChild(body);
    d.appendChild(homeBar(false));
    return d;
  }

  /* ---- Screen: Confirmed ---- */
  function screenConfirmed() {
    var d = el('div', { style: 'position:absolute;inset:0;background:#fff;display:flex;flex-direction:column;align-items:center;justify-content:center;font-family:inherit' });
    var circle = el('div', { style: 'width:72px;height:72px;border-radius:50%;background:#ecfdf5;display:flex;align-items:center;justify-content:center;margin-bottom:18px;animation:iphCheckPop .5s cubic-bezier(.17,.89,.32,1.28) forwards' });
    var svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
    svg.setAttribute('width', '36'); svg.setAttribute('height', '36'); svg.setAttribute('fill', 'none');
    svg.innerHTML = '<path d="M8 18l8 8 12-16" stroke="#10b981" stroke-width="3.5" stroke-linecap="round" stroke-linejoin="round" stroke-dasharray="40" stroke-dashoffset="40" style="animation:iphDrawCheck .6s .3s ease forwards"/>';
    circle.appendChild(svg);
    d.appendChild(circle);
    d.appendChild(el('div', { style: 'font-size:18px;font-weight:700;color:#111;margin-bottom:6px' }, 'Visit Confirmed'));
    d.appendChild(el('div', { style: 'font-size:14px;color:#666' }, 'Today at 18:00 · Eixample'));
    d.appendChild(el('div', { style: 'font-size:13px;color:#999;margin-top:2px' }, 'You’re the first to book.'));
    d.appendChild(homeBar(false));
    return d;
  }

  /* ---- Screen: Time warp overlay ---- */
  function screenTimeWarp() {
    var d = el('div', { style: 'position:absolute;inset:0;background:rgba(0,0,0,.92);display:flex;flex-direction:column;align-items:center;justify-content:center;z-index:250;animation:iphFadeIn .6s ease;font-family:inherit' });
    d.appendChild(el('div', { style: 'font-size:40px;margin-bottom:16px;animation:iphSpin 2s linear infinite' }, '⏳'));
    d.appendChild(el('div', { style: 'font-size:22px;font-weight:700;color:#fff;margin-bottom:6px' }, '5 minutes later…'));
    d.appendChild(el('div', { style: 'font-size:14px;color:rgba(255,255,255,.5)' }, 'Everyone else gets notified now'));
    return d;
  }

  /* ---- "Too late" badge ---- */
  function badgeOverlay() {
    var d = el('div', { style: 'position:absolute;bottom:100px;left:50%;transform:translateX(-50%);z-index:260;animation:iphBadgePop .6s cubic-bezier(.17,.89,.32,1.28) forwards;opacity:0' });
    var inner = el('div', { style: 'background:linear-gradient(135deg,#dc2626,#b91c1c);color:#fff;padding:10px 22px;border-radius:20px;font-size:14px;font-weight:700;white-space:nowrap;box-shadow:0 4px 20px rgba(220,38,38,.4)' }, '⏰ Too late — you’re 5 min ahead’);
    d.appendChild(inner);
    return d;
  }

  /* ============================================
     Main render function
     ============================================ */
  function render(container) {
    container.innerHTML = '';

    /* phone frame */
    var phone = el('div', {
      style: 'position:relative;width:280px;height:572px;border-radius:40px;overflow:hidden;background:#000;box-shadow:0 20px 60px rgba(0,0,0,.25),0 0 0 2px rgba(255,255,255,.08);margin:0 auto;font-family:-apple-system,BlinkMacSystemFont,"SF Pro Display","Segoe UI",Roboto,sans-serif'
    });
    /* notch */
    var notch = el('div', {
      style: 'position:absolute;top:0;left:50%;transform:translateX(-50%);width:120px;height:28px;background:#000;border-radius:0 0 18px 18px;z-index:300'
    });
    phone.appendChild(notch);

    /* screen container */
    var screen = el('div', {
      style: 'position:absolute;inset:0;overflow:hidden'
    });
    phone.appendChild(screen);

    /* progress bar */
    var progressWrap = el('div', { style: 'position:absolute;bottom:0;left:0;right:0;height:3px;background:rgba(255,255,255,.1);z-index:300' });
    var progressBar = el('div', { style: 'height:100%;width:0%;background:linear-gradient(90deg,#3B82F6,#8B5CF6);transition:width .1s linear;border-radius:0 2px 2px 0' });
    progressWrap.appendChild(progressBar);
    phone.appendChild(progressWrap);

    /* caption under phone */
    var caption = el('div', { style: 'text-align:center;margin-top:14px;min-height:22px;font-size:13px;color:#666;font-weight:500;transition:opacity .3s' });

    container.appendChild(phone);
    container.appendChild(caption);

    /* ---- State machine ---- */
    var playing = false;
    var rafId = null;
    var startT = null;

    function buildScreen(stepId) {
      screen.innerHTML = '';
      switch (stepId) {
        case 'lock1':
          screen.appendChild(wallpaper());
          screen.appendChild(statusBar(false));
          screen.appendChild(lockBottom('14:00'));
          screen.appendChild(homeBar(true));
          break;

        case 'prio-notif':
          screen.appendChild(wallpaper());
          screen.appendChild(statusBar(false));
          screen.appendChild(lockBottom('14:00'));
          var nWrap = el('div', { style: 'position:absolute;top:42px;left:0;right:0;z-index:210' });
          nWrap.appendChild(notif({
            icon: prioIcon(38),
            app: 'Prio',
            time: 'now',
            title: '⚡ New listing — Eixample',
            body: '1,150€ · 65m² · 2 bed',
            anim: true,
            pop: false
          }));
          screen.appendChild(nWrap);
          screen.appendChild(homeBar(true));
          break;

        case 'tap1':
          screen.appendChild(wallpaper());
          screen.appendChild(statusBar(false));
          screen.appendChild(lockBottom('14:00'));
          var nWrap1 = el('div', { style: 'position:absolute;top:42px;left:0;right:0;z-index:210' });
          nWrap1.appendChild(notif({
            icon: prioIcon(38),
            app: 'Prio',
            time: 'now',
            title: '⚡ New listing — Eixample',
            body: '1,150€ · 65m² · 2 bed',
            anim: false
          }));
          screen.appendChild(nWrap1);
          screen.appendChild(tapEl(140, 90));
          screen.appendChild(homeBar(true));
          break;

        case 'telegram':
          screen.appendChild(screenTelegram());
          screen.appendChild(statusBar(false));
          break;

        case 'tap2':
          screen.appendChild(screenTelegram());
          screen.appendChild(statusBar(false));
          screen.appendChild(tapEl(140, 360));
          break;

        case 'idealista':
          screen.appendChild(screenIdealista());
          screen.appendChild(statusBar(true));
          break;

        case 'tap3':
          screen.appendChild(screenIdealista());
          screen.appendChild(statusBar(true));
          screen.appendChild(tapEl(140, 460));
          break;

        case 'calling':
          screen.appendChild(screenCalling());
          screen.appendChild(statusBar(false));
          break;

        case 'calendar':
          screen.appendChild(screenCalendar());
          screen.appendChild(statusBar(true));
          break;

        case 'confirmed':
          screen.appendChild(screenConfirmed());
          screen.appendChild(statusBar(true));
          break;

        case 'time-warp':
          screen.appendChild(screenConfirmed());
          screen.appendChild(screenTimeWarp());
          break;

        case 'lock2':
          screen.appendChild(wallpaper());
          screen.appendChild(statusBar(false));
          screen.appendChild(lockBottom('14:05'));
          screen.appendChild(homeBar(true));
          break;

        case 'idl-notif':
          screen.appendChild(wallpaper());
          screen.appendChild(statusBar(false));
          screen.appendChild(lockBottom('14:05'));
          // old prio notif dimmed
          var nOld = el('div', { style: 'position:absolute;top:42px;left:0;right:0;z-index:210' });
          nOld.appendChild(notif({
            icon: prioIcon(38),
            app: 'Prio',
            time: '5m ago',
            title: '⚡ New listing — Eixample',
            body: '1,150€ · 65m² · 2 bed',
            anim: false,
            dim: true
          }));
          screen.appendChild(nOld);
          // idealista notif
          var nIdl = el('div', { style: 'position:absolute;top:120px;left:0;right:0;z-index:211' });
          nIdl.appendChild(notif({
            icon: idealistaIcon(38),
            app: 'idealista',
            time: 'now',
            title: 'New listing in your area',
            body: 'Eixample — 1,150€/month',
            anim: true,
            pop: true
          }));
          screen.appendChild(nIdl);
          screen.appendChild(homeBar(true));
          break;

        case 'badge':
          screen.appendChild(wallpaper());
          screen.appendChild(statusBar(false));
          screen.appendChild(lockBottom('14:05'));
          var nOld2 = el('div', { style: 'position:absolute;top:42px;left:0;right:0;z-index:210' });
          nOld2.appendChild(notif({
            icon: prioIcon(38),
            app: 'Prio',
            time: '5m ago',
            title: '⚡ New listing — Eixample',
            body: '1,150€ · 65m² · 2 bed',
            anim: false,
            dim: true
          }));
          screen.appendChild(nOld2);
          var nIdl2 = el('div', { style: 'position:absolute;top:120px;left:0;right:0;z-index:211' });
          nIdl2.appendChild(notif({
            icon: idealistaIcon(38),
            app: 'idealista',
            time: 'now',
            title: 'New listing in your area',
            body: 'Eixample — 1,150€/month',
            anim: false
          }));
          screen.appendChild(nIdl2);
          screen.appendChild(badgeOverlay());
          screen.appendChild(homeBar(true));
          break;
      }
    }

    var labels = {
      'prio-notif': '⚡ Prio detects a new listing',
      'telegram': 'Opening in Telegram',
      'idealista': 'Viewing on Idealista',
      'calling': 'Calling the landlord',
      'calendar': 'Booking a visit',
      'confirmed': 'Visit confirmed ✓',
      'idl-notif': 'Idealista finally sends its alert',
      ‘badge’: ‘Too late — you’re 5 min ahead’
    };

    var lastStep = '';

    function tick(now) {
      if (!startT) startT = now;
      var elapsed = now - startT;
      var pct = Math.min(elapsed / TOTAL, 1);
      progressBar.style.width = (pct * 100) + '%';

      // find current step
      var acc = 0, curStep = STEPS[0].id;
      for (var i = 0; i < STEPS.length; i++) {
        acc += STEPS[i].ms;
        if (elapsed < acc) { curStep = STEPS[i].id; break; }
        if (i === STEPS.length - 1) curStep = STEPS[i].id;
      }

      if (curStep !== lastStep) {
        lastStep = curStep;
        buildScreen(curStep);
        caption.textContent = labels[curStep] || '';
        caption.style.opacity = labels[curStep] ? '1' : '0';
      }

      if (elapsed < TOTAL) {
        rafId = requestAnimationFrame(tick);
      } else {
        playing = false;
      }
    }

    function play() {
      if (playing) return;
      playing = true;
      startT = null;
      lastStep = '';
      rafId = requestAnimationFrame(tick);
    }

    function stop() {
      if (rafId) cancelAnimationFrame(rafId);
      playing = false;
    }

    // initial state
    buildScreen('lock1');

    return { play: play, stop: stop };
  }

  /* ---- Init on DOMContentLoaded ---- */
  document.addEventListener('DOMContentLoaded', function () {
    var target = document.getElementById('iphone-demo');
    if (!target) return;

    var demo = render(target);
    var hasPlayed = false;

    var observer = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting && !hasPlayed) {
          hasPlayed = true;
          demo.play();
        }
      });
    }, { threshold: 0.3 });

    observer.observe(target);

    // replay on click
    target.style.cursor = 'pointer';
    target.addEventListener('click', function () {
      demo.stop();
      hasPlayed = true;
      demo = render(target);
      demo.play();
    });
  });

})();
