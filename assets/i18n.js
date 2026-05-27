/**
 * Prio i18n — Lightweight client-side translation loader
 * 
 * USAGE:
 * 1. Add <script src="/assets/i18n.js" defer></script> to every page
 * 2. Tag translatable elements with data-i18n="section.key"
 *    e.g. <h1 data-i18n="home.h1">First notified...</h1>
 * 3. For innerHTML (contains HTML tags): data-i18n-html="section.key"
 * 4. For attributes: data-i18n-placeholder="section.key" etc.
 * 5. Language picker links: <a href="?lang=fr" data-lang="fr">FR</a>
 * 
 * LANGUAGE RESOLUTION ORDER:
 * 1. ?lang= URL parameter (sticky — saved to localStorage)
 * 2. localStorage('prio-lang')
 * 3. navigator.language prefix (fr-FR → fr, es-MX → es)
 * 4. Fallback: 'en'
 * 
 * The Telegram bot deep-link is updated to include the lang suffix:
 *   ?start=go_en → ?start=go_fr
 */

(function () {
  'use strict';

  const SUPPORTED = ['en', 'fr', 'es'];
  const STORAGE_KEY = 'prio-lang';
  const TRANSLATIONS_PATH = '/assets/translations.json';

  // --- Language detection ---
  function detectLang() {
    // 1. URL param
    const params = new URLSearchParams(window.location.search);
    const urlLang = params.get('lang');
    if (urlLang && SUPPORTED.includes(urlLang)) {
      localStorage.setItem(STORAGE_KEY, urlLang);
      return urlLang;
    }

    // 2. localStorage
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored && SUPPORTED.includes(stored)) return stored;

    // 3. Browser language
    const browserLang = (navigator.language || '').slice(0, 2).toLowerCase();
    if (SUPPORTED.includes(browserLang)) return browserLang;

    // 4. Fallback
    return 'en';
  }

  // --- Resolve nested key like "home.h1" from translations object ---
  function resolve(obj, path) {
    return path.split('.').reduce((o, k) => (o && o[k] !== undefined ? o[k] : null), obj);
  }

  // --- Apply translations ---
  function apply(translations, lang) {
    // data-i18n → textContent
    document.querySelectorAll('[data-i18n]').forEach(el => {
      const key = el.getAttribute('data-i18n');
      const entry = resolve(translations, key);
      if (entry && entry[lang]) {
        el.textContent = entry[lang];
      }
    });

    // data-i18n-html → innerHTML (for strings with <strong>, <br> etc.)
    document.querySelectorAll('[data-i18n-html]').forEach(el => {
      const key = el.getAttribute('data-i18n-html');
      const entry = resolve(translations, key);
      if (entry && entry[lang]) {
        el.innerHTML = entry[lang];
      }
    });

    // data-i18n-title, data-i18n-placeholder, data-i18n-content (meta)
    ['title', 'placeholder', 'content', 'aria-label'].forEach(attr => {
      document.querySelectorAll(`[data-i18n-${attr}]`).forEach(el => {
        const key = el.getAttribute(`data-i18n-${attr}`);
        const entry = resolve(translations, key);
        if (entry && entry[lang]) {
          el.setAttribute(attr, entry[lang]);
        }
      });
    });

    // Update <title> tag
    const titleEntry = resolve(translations, 'seo.' + getPageId() + '_title');
    if (titleEntry && titleEntry[lang]) {
      document.title = titleEntry[lang];
    }

    // Update meta description
    const descEntry = resolve(translations, 'seo.' + getPageId() + '_description');
    if (descEntry && descEntry[lang]) {
      const meta = document.querySelector('meta[name="description"], meta[property="og:description"]');
      if (meta) meta.setAttribute('content', descEntry[lang]);
    }

    // Update Telegram deep-links: ?start=go_en → ?start=go_fr
    document.querySelectorAll('a[href*="t.me/idealistaalertbot"]').forEach(a => {
      a.href = a.href.replace(/start=go_\w{2}/, `start=go_${lang}`);
    });

    // Update internal links to carry ?lang=
    document.querySelectorAll('a[href*="getprio.io"]').forEach(a => {
      try {
        const url = new URL(a.href);
        if (!url.pathname.startsWith('/blog/')) {
          url.searchParams.set('lang', lang);
          a.href = url.toString();
        }
      } catch (e) { /* skip malformed */ }
    });

    // Mark <html> lang
    document.documentElement.lang = lang;

    // Highlight active lang in picker
    document.querySelectorAll('[data-lang]').forEach(el => {
      el.classList.toggle('active', el.getAttribute('data-lang') === lang);
    });
  }

  // --- Detect page from URL path ---
  function getPageId() {
    const path = window.location.pathname;
    if (path.includes('/go')) return 'go';
    if (path.includes('/pricing')) return 'pricing';
    if (path.includes('/about')) return 'about';
    if (path.includes('/blog')) return 'blog';
    if (path.includes('/pro')) return 'pro';
    if (path === '/es/' || path === '/es') return 'spain';
    if (path.startsWith('/es/')) return 'city';
    return 'home';
  }

  // --- Init ---
  const lang = detectLang();

  fetch(TRANSLATIONS_PATH)
    .then(r => r.json())
    .then(t => apply(t, lang))
    .catch(err => console.warn('[i18n] Failed to load translations:', err));

})();
