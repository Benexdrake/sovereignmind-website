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
