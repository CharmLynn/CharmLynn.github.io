// SaveAnswer site: language switch, browser-aware install buttons, survey submission.
// No cookies, no analytics. The only network request is the optional survey POST the visitor submits.
const SITE_CONFIG = {
  version: '1.0.20',
  chromeStore: 'https://chromewebstore.google.com/detail/saveanswer-save-ai-answer/iminapemlncanmmaadedieifgkaeoljm',
  // Fill in after the Edge Add-ons listing is approved; until then the Edge button stays disabled.
  edgeStore: '',
  // A form backend that accepts a JSON POST (e.g. Formspree). Leave empty to fall back to email.
  formEndpoint: '',
  contactEmail: 'flvictory@gmail.com',
};

(function () {
  const params = new URLSearchParams(location.search);
  const UTM_KEYS = ['utm_source', 'utm_medium', 'utm_campaign', 'utm_content', 'utm_term'];

  function withUtm(url) {
    const target = new URL(url);
    UTM_KEYS.forEach(key => {
      const value = params.get(key);
      if (value) target.searchParams.set(key, value);
    });
    return target.toString();
  }

  // ----- Language -----
  function detectLang() {
    const fromQuery = params.get('lang');
    if (fromQuery === 'zh' || fromQuery === 'en') return fromQuery;
    const saved = localStorage.getItem('sa_site_lang');
    if (saved === 'zh' || saved === 'en') return saved;
    // Default to English. Chinese users can toggle using the top-right button.
    return 'en';
  }

  function applyLang(lang) {
    document.documentElement.lang = lang === 'zh' ? 'zh-CN' : 'en';
    document.querySelectorAll('[data-title-zh]').forEach(el => {
      document.title = lang === 'zh' ? el.dataset.titleZh : el.dataset.titleEn;
    });
    document.querySelectorAll('[data-placeholder-zh]').forEach(el => {
      el.placeholder = lang === 'zh' ? el.dataset.placeholderZh : el.dataset.placeholderEn;
    });
  }

  let lang = detectLang();
  applyLang(lang);

  document.querySelectorAll('.lang-toggle').forEach(btn => {
    btn.addEventListener('click', () => {
      lang = lang === 'zh' ? 'en' : 'zh';
      localStorage.setItem('sa_site_lang', lang);
      applyLang(lang);
    });
  });

  // ----- Install buttons -----
  function detectBrowser() {
    const ua = navigator.userAgent;
    if (/Edg\//.test(ua)) return 'edge';
    if (/QQBrowser|360SE|360EE|MetaSr|LBBROWSER|2345Explorer|Quark/i.test(ua)) return 'cn-chromium';
    if (/Firefox\//.test(ua)) return 'firefox';
    if (/Safari\//.test(ua) && !/Chrome\//.test(ua)) return 'safari';
    if (/Mobi|Android|iPhone|iPad/i.test(ua)) return 'mobile';
    if (/Chrome\//.test(ua)) return 'chrome';
    return 'other';
  }

  const browser = detectBrowser();
  document.documentElement.dataset.browser = browser;

  document.querySelectorAll('[data-install="primary"]').forEach(btn => {
    if (browser === 'edge' && SITE_CONFIG.edgeStore) {
      btn.href = withUtm(SITE_CONFIG.edgeStore);
      btn.querySelectorAll('[data-store-name]').forEach(el => { el.textContent = 'Edge'; });
    } else {
      btn.href = withUtm(SITE_CONFIG.chromeStore);
    }
  });

  document.querySelectorAll('[data-install="edge"]').forEach(btn => {
    if (SITE_CONFIG.edgeStore) {
      btn.href = withUtm(SITE_CONFIG.edgeStore);
    } else {
      btn.setAttribute('aria-disabled', 'true');
      btn.removeAttribute('href');
    }
  });

  document.querySelectorAll('[data-browser-note]').forEach(note => {
    note.hidden = note.dataset.browserNote !== browser;
  });

  // ----- Survey forms (uninstall / feedback) -----
  document.querySelectorAll('form[data-survey]').forEach(form => {
    form.addEventListener('submit', async event => {
      event.preventDefault();
      const data = Object.fromEntries(new FormData(form).entries());
      data.survey = form.dataset.survey;
      data.lang = lang;
      data.version = params.get('v') || '';
      data.browser = browser;

      const thanks = document.querySelector(form.dataset.thanks);
      const done = () => {
        form.style.display = 'none';
        if (thanks) thanks.style.display = 'block';
      };

      if (SITE_CONFIG.formEndpoint) {
        try {
          await fetch(SITE_CONFIG.formEndpoint, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
            body: JSON.stringify(data),
          });
          done();
          return;
        } catch (_) {
          // Network blocked or endpoint down: fall through to email so the answer is not lost.
        }
      }

      const body = Object.entries(data).map(([key, value]) => `${key}: ${value}`).join('\n');
      location.href = `mailto:${SITE_CONFIG.contactEmail}?subject=${encodeURIComponent(`SaveAnswer ${data.survey}`)}&body=${encodeURIComponent(body)}`;
      done();
    });
  });
})();
