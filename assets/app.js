(function () {
  'use strict';

  // Zentrale Konfiguration: Befehle und Repo nur hier pflegen.
  var INSTALLER_REPO = 'Benexdrake/sovereignmind-installer';
  var RAW = 'https://raw.githubusercontent.com/' + INSTALLER_REPO + '/main/';
  var COMMANDS = {
    windows:
      '$env:SOVEREIGNMIND_GHCR_TOKEN = "<dein-token>"\n' +
      'irm ' + RAW + 'install.ps1 | iex',
    linux:
      'export SOVEREIGNMIND_GHCR_TOKEN=<dein-token>\n' +
      'curl -fsSL ' + RAW + 'install.sh | bash',
    macos:
      'export SOVEREIGNMIND_GHCR_TOKEN=<dein-token>\n' +
      'curl -fsSL ' + RAW + 'install.sh | bash'
  };
  var SCRIPT_LINKS = {
    windows: RAW + 'install.ps1',
    linux: RAW + 'install.sh',
    macos: RAW + 'install.sh'
  };

  // Befehle in die Tabs rendern
  Object.keys(COMMANDS).forEach(function (os) {
    var code = document.querySelector('[data-cmd="' + os + '"]');
    if (code) code.textContent = COMMANDS[os];
    var link = document.querySelector('[data-script="' + os + '"]');
    if (link) link.href = SCRIPT_LINKS[os];
  });

  // Tabs
  var tabs = Array.prototype.slice.call(document.querySelectorAll('[role="tab"]'));
  function select(os, focus) {
    tabs.forEach(function (t) {
      var on = t.dataset.os === os;
      t.setAttribute('aria-selected', on ? 'true' : 'false');
      t.tabIndex = on ? 0 : -1;
      var panel = document.getElementById(t.getAttribute('aria-controls'));
      if (panel) panel.hidden = !on;
      if (on && focus) t.focus();
    });
  }
  if (tabs.length) {
    var fromHash = location.hash.replace('#', '');
    var detected = /Win/i.test(navigator.userAgent) ? 'windows'
      : /Mac/i.test(navigator.userAgent) ? 'macos' : 'linux';
    select(COMMANDS[fromHash] ? fromHash : detected, false);
    tabs.forEach(function (t, i) {
      t.addEventListener('click', function () {
        select(t.dataset.os, false);
        history.replaceState(null, '', '#' + t.dataset.os);
      });
      t.addEventListener('keydown', function (e) {
        var n = null;
        if (e.key === 'ArrowRight') n = tabs[(i + 1) % tabs.length];
        if (e.key === 'ArrowLeft') n = tabs[(i - 1 + tabs.length) % tabs.length];
        if (n) { e.preventDefault(); select(n.dataset.os, true); }
      });
    });
    window.addEventListener('hashchange', function () {
      var h = location.hash.replace('#', '');
      if (COMMANDS[h]) select(h, false);
    });
  }

  // Kopieren-Button mit Fallback auf Textauswahl
  document.querySelectorAll('[data-copy]').forEach(function (btn) {
    btn.addEventListener('click', function () {
      var code = document.querySelector('[data-cmd="' + btn.dataset.copy + '"]');
      if (!code) return;
      function done(ok) {
        var old = btn.textContent;
        btn.textContent = ok ? 'Kopiert' : 'Markiert – Strg+C';
        setTimeout(function () { btn.textContent = old; }, 1800);
      }
      function fallback() {
        var r = document.createRange();
        r.selectNodeContents(code);
        var s = window.getSelection();
        s.removeAllRanges();
        s.addRange(r);
        done(false);
      }
      if (navigator.clipboard && navigator.clipboard.writeText) {
        navigator.clipboard.writeText(code.textContent).then(function () { done(true); }, fallback);
      } else {
        fallback();
      }
    });
  });

  // Versionsanzeige (still ausblenden bei Fehler)
  var versionEls = document.querySelectorAll('[data-version]');
  if (versionEls.length && window.fetch) {
    fetch('https://api.github.com/repos/' + INSTALLER_REPO + '/releases/latest', {
      headers: { Accept: 'application/vnd.github+json' }
    })
      .then(function (r) { return r.ok ? r.json() : Promise.reject(); })
      .then(function (j) {
        if (!j || !j.tag_name) return;
        versionEls.forEach(function (el) {
          el.textContent = 'Aktuelle Version: ' + j.tag_name;
          el.hidden = false;
        });
      })
      .catch(function () { /* ausblenden */ });
  }

  // Screenshot-Galerie mit Lightbox (ohne JS bleibt die statische Auswahl mit Links auf die Originale)
  var gallery = document.querySelector('[data-gallery]');
  if (gallery) {
    var BASE = 'assets/screenshots/';
    var SHOTS = [
      ['chat', 'Chat mit Quellenbelegen'],
      ['einstellungen', 'Einstellungen'],
      ['login', 'Anmeldung'],
      ['chat-mobil', 'Chat auf dem Smartphone'],
      ['admin-nutzung', 'Admin: Nutzung'],
      ['admin-profil', 'Admin: Profil'],
      ['admin-nutzer', 'Admin: Nutzer'],
      ['admin-dokumente', 'Admin: Dokumente'],
      ['admin-unternehmen', 'Admin: Unternehmen'],
      ['admin-ki-einstellungen', 'Admin: KI-Einstellungen'],
      ['admin-connectors', 'Admin: Connectors'],
      ['admin-hardware', 'Hardware-Dashboard'],
      ['admin-support', 'Admin: Support']
    ];
    var BRANDED = ['chat', 'einstellungen', 'admin-nutzung', 'admin-profil'];
    var state = {
      variant: 'standard',
      theme: window.matchMedia && matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light'
    };
    var controls = document.querySelector('[data-gallery-controls]');
    var box = document.querySelector('[data-lightbox]');
    var lbImg = document.querySelector('[data-lb-img]');
    var lbCap = document.querySelector('[data-lb-cap]');
    var current = [];
    var index = 0;

    var src = function (id) { return BASE + state.variant + '/' + state.theme + '/' + id + '.png'; };

    function syncControls() {
      controls.querySelectorAll('button').forEach(function (x) {
        var on = x.dataset.variant === state.variant || x.dataset.theme === state.theme;
        x.setAttribute('aria-pressed', on ? 'true' : 'false');
      });
    }

    function show() {
      var s = current[index];
      lbImg.src = src(s[0]);
      lbImg.alt = s[1];
      lbCap.textContent = s[1] + ' (' + (index + 1) + ' / ' + current.length + ')';
    }
    function openBox(i) {
      index = i;
      show();
      if (box.showModal) { if (!box.open) box.showModal(); } else { box.setAttribute('open', ''); }
    }
    function closeBox() {
      if (box.close) box.close(); else box.removeAttribute('open');
    }
    function step(d) { index = (index + d + current.length) % current.length; show(); }

    function render() {
      current = SHOTS.filter(function (s) { return state.variant === 'standard' || BRANDED.indexOf(s[0]) !== -1; });
      gallery.textContent = '';
      current.forEach(function (s, i) {
        var fig = document.createElement('figure');
        fig.className = 'shot' + (s[0] === 'chat-mobil' ? ' portrait' : '');
        var b = document.createElement('button');
        b.type = 'button';
        b.setAttribute('aria-label', s[1] + ' vergrößern');
        var img = document.createElement('img');
        img.src = src(s[0]);
        img.alt = s[1];
        img.loading = 'lazy';
        b.appendChild(img);
        b.addEventListener('click', function () { openBox(i); });
        var cap = document.createElement('figcaption');
        cap.textContent = s[1];
        fig.appendChild(b);
        fig.appendChild(cap);
        gallery.appendChild(fig);
      });
    }

    controls.hidden = false;
    controls.addEventListener('click', function (e) {
      var b = e.target.closest('button');
      if (!b) return;
      if (b.dataset.variant) state.variant = b.dataset.variant;
      if (b.dataset.theme) state.theme = b.dataset.theme;
      syncControls();
      render();
    });
    box.addEventListener('click', function (e) {
      var a = e.target.dataset && e.target.dataset.lb;
      if (a === 'prev') step(-1);
      else if (a === 'next') step(1);
      else if (a === 'close' || e.target === box) closeBox();
    });
    box.addEventListener('keydown', function (e) {
      if (e.key === 'ArrowLeft') step(-1);
      if (e.key === 'ArrowRight') step(1);
    });
    syncControls();
    render();
  }
})();
