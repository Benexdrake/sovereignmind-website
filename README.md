# SovereignMind – Produkt- und Download-Seite

Statische Seite ohne Build-Schritt, ausgeliefert über GitHub Pages.

## Lokal ansehen

```bash
python -m http.server 8080   # im Ordner Github_Page, dann http://localhost:8080
```

## Pflege

- **Installer-Repo und Linux-Befehl:** nur in `assets/app.js` (Konstanten oben). Mit
  `Installer/README.md` abgleichen. Downloads verlinken auf das neueste Release des Installer-Repos.
- **Screenshots:** nach `assets/screenshots/` legen (nur Testdaten) und die Platzhalter in `index.html` ersetzen.
- **Offen vor Veröffentlichung:** Kontaktweg (`index.html`, Abschnitt Kontakt), Impressum und Datenschutz
  (Platzhalter).
- Keine Inhalte aus `Projects/docs` ungeprüft übernehmen (Repo ist privat).

## Veröffentlichung

Ordnerinhalt als Wurzel eines öffentlichen Repos pushen; Settings → Pages → Quelle „GitHub Actions“
(Workflow `.github/workflows/pages.yml`).

## Pakete pflegen

Die Seite `wissenspakete.html` liest `packages/index.json`. Diese Datei kommt aus dem Admin-Tool
(Release-Bundle, `Support/scripts/publish-packages.ps1`) und wird **nicht von Hand geändert**.
Neue Version = neuer Eintrag, ältere Versionen erscheinen unter „Weitere Versionen“;
`withdrawn: true` blendet einen Eintrag aus. Alle Texte werden per `textContent` ausgegeben.
