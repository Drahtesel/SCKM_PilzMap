# Projektbeschreibung: PilzMap („Pilz-Hub BW“ & „Pilzlotse“)

> **Instanz-Hinweis:** Dieses Verzeichnis (`PilzMap_Eigen`) ist eine eigenständige lokale Instanz von `https://github.com/BlackTeaWonder/PilzMap.git`. Das Original-Remote wurde auf `upstream` umbenannt und für `git push` gesperrt (`DISABLED_ORIGINAL_REPO_UNTOUCHED`), sodass das Gruppen-Repository garantiert unangetastet bleibt.

---

## 1. Kurzüberblick

**PilzMap** besteht aus zwei gekoppelten Teilprojekten für Pilzsammler:innen in **Baden-Württemberg**:
1. **Pilz-Hub BW ([`www/`](file:///c:/Studium/9.Semester/Supported/SCKM/PilzMap_Eigen/www/index.html)):** Eine kartenbasierte Web- und Android-App (Capacitor) zur Standortanalyse, Routenplanung, Live-GPS-Aufzeichnung und Cloud-gestützten Dokumentation eigener Pilzfunde.
2. **Pilzlotse ([`landingpage/`](file:///c:/Studium/9.Semester/Supported/SCKM/PilzMap_Eigen/landingpage/index.html)):** Eine „Fake-Door“-Landingpage mit interaktiver App-Vorschau (Ausschnitt Tübingen/Schönbuch) und Google-Apps-Script-Warteliste ([`warteliste.gs`](file:///c:/Studium/9.Semester/Supported/SCKM/PilzMap_Eigen/landingpage/backend/warteliste.gs)) zur Validierung einer geführten Einsteiger-Pilztour.

---

## 2. Tech-Stack & Architektur

| Bereich | Technologie / Dateien |
| :--- | :--- |
| **Frontend (App)** | Vanilla HTML5, CSS3 ([`www/style.css`](file:///c:/Studium/9.Semester/Supported/SCKM/PilzMap_Eigen/www/style.css)) und JavaScript ([`www/app.js`](file:///c:/Studium/9.Semester/Supported/SCKM/PilzMap_Eigen/www/app.js), ~2.330 Zeilen Monolith) ohne Build-Bundler |
| **Karten & GIS** | **Leaflet 1.9.4**, **Turf.js v6** (Point-in-Polygon für Schutzgebiete & Distanzberechnung), **Proj4js** (`EPSG:25832` & `EPSG:31467` $\rightarrow$ `WGS84`), **Leaflet Routing Machine** + **GraphHopper API** |
| **Backend & Auth** | **Supabase** (E-Mail/Passwort-Login, Postgres-Tabellen `pilze` & `wanderrouten`, Cloud-Storage-Bucket `pilzfotos`), plus `localStorage` für den geparkten Auto-Standort |
| **Mobile (Android)** | **Capacitor 8** (`de.pilzhub.app`) inkl. eigenem nativem Java-Plugin ([`LocationPlugin.java`](file:///c:/Studium/9.Semester/Supported/SCKM/PilzMap_Eigen/android/app/src/main/java/de/pilzhub/app/LocationPlugin.java)) und Foreground-Service ([`LocationForegroundService.java`](file:///c:/Studium/9.Semester/Supported/SCKM/PilzMap_Eigen/android/app/src/main/java/de/pilzhub/app/LocationForegroundService.java)) für Standby-GPS-Tracking |
| **CI/CD** | GitHub Actions: [`.github/workflows/deploy.yml`](file:///c:/Studium/9.Semester/Supported/SCKM/PilzMap_Eigen/.github/workflows/deploy.yml) (GitHub Pages) & [`.github/workflows/build-apk.yml`](file:///c:/Studium/9.Semester/Supported/SCKM/PilzMap_Eigen/.github/workflows/build-apk.yml) (automatischer Android-APK-Build & GitHub Release) |

---

## 3. Kernfunktionen von Pilz-Hub BW

### A. Ökologische & rechtliche Karten-Layer (Baden-Württemberg)
- **5 Basiskarten:** OpenStreetMap, OpenTopoMap, CyclOSM, Esri Satellit, Esri Topo-Atlas (außerhalb der BW-Landesgrenze abgedunkelt).
- **Wald & Baumarten:** ForstBW-Waldrefugien ([`ForstBW_Waldrefugien_-38784724193262813.geojson`](file:///c:/Studium/9.Semester/Supported/SCKM/PilzMap_Eigen/www/ForstBW_Waldrefugien_-38784724193262813.geojson)), farblich klassifiziert nach Hauptbaumart (Buche, Fichte, Kiefer, Tanne, Eiche usw.).
- **Schutzgebiete & Sammelverbots-Erkennung:** Lokale GeoJSON-Bestände für Naturschutzgebiete ([`naturschutzgebiet.json`](file:///c:/Studium/9.Semester/Supported/SCKM/PilzMap_Eigen/www/naturschutzgebiet.json)), Nationalparks ([`nationalpark.json`](file:///c:/Studium/9.Semester/Supported/SCKM/PilzMap_Eigen/www/nationalpark.json)) und Waldschutzgebiete ([`waldschutzgebiete.json`](file:///c:/Studium/9.Semester/Supported/SCKM/PilzMap_Eigen/www/waldschutzgebiete.json)). Beim Klick auf die Karte oder bei der Routenplanung prüft Turf.js automatisch, ob dort ein Sammelverbot (NSG, Nationalpark, Bannwald) gilt.
- **Bodenanalyse:**
  - *BWI 2002 Bodenvegetation* ([`Straucher und Boden Vegetation.json`](file:///c:/Studium/9.Semester/Supported/SCKM/PilzMap_Eigen/www/Straucher%20und%20Boden%20Vegetation.json)): Aggregiert Säurezeiger (Drahtschmiele, Heidelbeere, Preiselbeere, Heidekraut) als Proxy für den Boden-pH.
  - *ISRIC SoilGrids WMS*: Raster-Overlay und punktuelle `GetFeatureInfo`-Abfrage des pH-Werts in 0–5 cm Tiefe.
- **Wetter & Bodenfeuchte:** Live-Niederschlagsradar (DWD WMS), 7-Tage-Regensummen an 50 BW-Stationen sowie punktuelle Temperatur-, Wind- und 7-Tage-Regenabfrage via Open-Meteo API.

### B. Fundbuch, Routenplanung & GPS-Tracking
- **Pilzfunde (CRUD):** Eingeloggte Nutzer:innen können per Rechtsklick/Popup Fundorte mit Name/Notiz, Genießbarkeit (*Essbar*, *Ungenießbar*, *Giftig*, *Unbekannt*), Funddatum und bis zu 3 Fotos in Supabase speichern, bearbeiten und filtern.
- **Fußgänger-Routing & Live-Aufzeichnung:** Berechnung von Wanderrouten (Start, Zwischenstopps, Ziel) über GraphHopper inkl. Distanz, Gehzeit, Höhenmetern und prozentualem Schutzgebietsanteil. Während einer Live-GPS-Aufzeichnung eingetragene Pilzfunde werden automatisch über `route_id` mit der gespeicherten Tour verknüpft.
- **Parkplatz-Merker:** Speichert den eigenen Auto-Standort lokal im `localStorage` und berechnet auf Knopfdruck den Rückweg zum Fahrzeug.

---

## 4. Einordnung in den SCKM-Vorlesungskontext

Im Abgleich mit den Vorlesungsinhalten ([`2026-11-17-Social Collab Vorlesungszusammenfassungen.pdf`](file:///c:/Studium/9.Semester/Supported/SCKM/2026-11-17-Social%20Collab%20Vorlesungszusammenfassungen.pdf)) zeigt die Analyse:

- **Starke Daten- & Informationsschicht (Wissenstreppe Stufe 1–2):** `PilzMap` integriert zahlreiche Umwelt-, Wetter- und Geodatenquellen (DWD, Open-Meteo, ISRIC, BWI, LUBW/ForstBW) sowie ein persönliches Cloud-Fundbuch.
- **Fehlende explizite Wissensrepräsentation (Stufe 3 – *Know-why* / Symbolische KI):** Die ökologische Verknüpfung (z. B. *welcher Pilz braucht welchen Baum-Symbionten, welchen pH-Bereich und wie hängt das mit den BWI-Zeigerpflanzen zusammen?*) muss aktuell komplett im Kopf der Nutzer:innen stattfinden. Es gibt noch keine Ontologie, keinen Wissensgraphen (RDF/OWL/Graph) und keine regelbasierte Inferenz.
- **Kollaboration & Wissensreifung (SECI / Knowledge Maturing / Co-Creation):** Funde und Routen sind bisher rein benutzerbezogen (`user_id` in Supabase) ohne geteilte Wissensartefakte, Community-Validierung oder didaktische Lernunterstützung (*Metacognitive Scaffolding* / *Boundary Objects*).
