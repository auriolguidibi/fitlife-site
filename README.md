# FitLife — site vitrine

Page de présentation de l'application FitLife, avec le téléchargement de l'APK Android.
Site statique (HTML, CSS, JS), sans étape de construction.

- `index.html`, `styles.css`, `main.js` : la page.
- `assets/screens/` : captures de l'application (mode démo).
- `assets/qrcode.js` : générateur de QR code (qrcode-generator 1.4.4, licence MIT).
- `FitLife.apk` : l'application proposée au téléchargement.

## Mettre à jour l'application

Remplacer `FitLife.apk` par la nouvelle version, puis publier. Si l'APK est hébergé ailleurs
(par exemple une Release GitHub publique), changer `APK_URL` en haut de `main.js`.

## Tester en local

```bash
python -m http.server 8095
```

Puis ouvrir http://localhost:8095.
