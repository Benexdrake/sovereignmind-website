# SovereignMind – Produkt- und Download-Seite

Statische Seite ohne Build-Schritt, ausgeliefert über GitHub Pages.

## Lokal ansehen

```bash
python -m http.server 8080   # im Ordner Github_Page, dann http://localhost:8080
```

## Pflege

- **Installationsbefehle und Repo-Name:** nur in `assets/app.js` (Konstanten oben). Mit
  `Installer/README.md` abgleichen.
- **Token-Zwang entfällt:** Token-Zeilen in `app.js` und den Abschnitt „Zugangstoken“ in `download.html` entfernen.
- **Screenshots:** nach `assets/screenshots/` legen (nur Testdaten) und die Platzhalter in `index.html` ersetzen.
- **Offen vor Veröffentlichung:** Kontaktweg (`index.html`, Abschnitt Kontakt), Impressum und Datenschutz
  (Platzhalter), macOS-Test.
- Keine Inhalte aus `Projects/docs` ungeprüft übernehmen (Repo ist privat).

## Veröffentlichung

Ordnerinhalt als Wurzel eines öffentlichen Repos pushen; Settings → Pages → Quelle „GitHub Actions“
(Workflow `.github/workflows/pages.yml`).
