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
})();
