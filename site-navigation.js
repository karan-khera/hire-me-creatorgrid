/* CreatorGrid portfolio: same-origin soft navigation, preserving the top-level audio element.
   A full-page child iframe keeps each editorial case study self-contained.
   The audio stays in the original document, so moving between projects never reloads it. */
(() => {
  'use strict';
  const scriptURL = new URL(document.currentScript.src, location.href);
  const base = new URL('.', scriptURL);
  const homePath = base.pathname.replace(/\/?$/, '/');
  const legalPaths = new Set([
    homePath, homePath + 'brand-partnership/', homePath + 'revenue-growth/', homePath + 'product-strategy/'
  ]);
  const normalized = (p) => {
    let path = p.replace(/index\.html$/, '');
    if (!path.endsWith('/')) path += '/';
    return path;
  };
  const isInternal = (u) => u.origin === location.origin && legalPaths.has(normalized(u.pathname));
  const isModified = (e) => e.button !== 0 || e.metaKey || e.ctrlKey || e.shiftKey || e.altKey;

  // When displayed in the portfolio's content frame, leave playback to the parent.
  if (window.parent !== window) {
    document.documentElement.classList.add('embedded-page');
    document.addEventListener('click', (event) => {
      const a = event.target.closest?.('a[href]');
      if (!a || isModified(event) || a.hasAttribute('download') || (a.target && a.target !== '_self')) return;
      const u = new URL(a.href, location.href);
      if (!isInternal(u) || normalized(u.pathname) === normalized(location.pathname)) return;
      try {
        if (typeof window.parent.__portfolioNavigate === 'function') {
          event.preventDefault();
          window.parent.__portfolioNavigate(u.href, true);
        }
      } catch (_) { /* Ordinary links remain usable when embedded outside the site. */ }
    }, true);
    return;
  }

  const hostPath = normalized(location.pathname);
  const originalTitle = document.title;
  const frame = document.createElement('iframe');
  frame.className = 'portfolio-route-frame';
  frame.title = 'Portfolio page';
  frame.setAttribute('aria-label', 'Portfolio page content');
  frame.style.cssText = 'display:none;position:fixed;inset:0;width:100%;height:100%;border:0;background:#f8fafb;z-index:80';
  document.body.appendChild(frame);
  const otherContent = Array.from(document.body.children).filter((el) =>
    el !== frame && !el.classList.contains('music-dock') && el.tagName !== 'SCRIPT'
  );
  let savedScroll = window.scrollY;
  let currentPath = hostPath;
  function showRoute(url, push) {
    const u = new URL(url, location.href);
    if (!isInternal(u)) { window.location.assign(u.href); return; }
    const targetPath = normalized(u.pathname);
    if (push && u.href !== location.href) history.pushState({portfolio:true}, '', u.href);
    const frameWasVisible = frame.style.display !== 'none';
    if (targetPath === hostPath) {
      frame.style.display = 'none';
      document.body.style.overflow = '';
      otherContent.forEach((el) => { el.inert = false; });
      if (frameWasVisible) frame.src = 'about:blank';
      document.title = originalTitle;
      currentPath = targetPath;
      if (u.hash) requestAnimationFrame(() => document.getElementById(decodeURIComponent(u.hash.slice(1)))?.scrollIntoView({block:'start'}));
      else requestAnimationFrame(() => window.scrollTo({top:savedScroll,behavior:'instant'}));
      return;
    }
    if (!frameWasVisible) savedScroll = window.scrollY;
    otherContent.forEach((el) => { el.inert = true; });
    frame.style.display = 'block';
    document.body.style.overflow = 'hidden';
    if (!frameWasVisible || targetPath !== currentPath || frame.dataset.fullUrl !== u.href) {
      frame.dataset.fullUrl = u.href;
      frame.src = u.href;
    }
    currentPath = targetPath;
  }
  frame.addEventListener('load', () => {
    try { if (frame.contentDocument?.title) document.title = frame.contentDocument.title; }
    catch (_) { /* Preserve original title if a third-party frame is shown. */ }
  });
  window.__portfolioNavigate = showRoute;
  document.addEventListener('click', (event) => {
    const a = event.target.closest?.('a[href]');
    if (!a || isModified(event) || a.hasAttribute('download') || (a.target && a.target !== '_self')) return;
    const u = new URL(a.href, location.href);
    if (!isInternal(u) || (normalized(u.pathname) === hostPath && !frame.style.display.includes('block'))) return;
    event.preventDefault();
    showRoute(u.href, true);
  }, true);
  window.addEventListener('popstate', () => showRoute(location.href, false));
})();