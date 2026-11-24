// ============================================================================
// SCKM Pilzwahrscheinlichkeits-Heatmap für Baden-Württemberg
// (www/sckm/heatmapLayer.js)
// Berechnet aus den lokalen BWI-2002-Waldzellen, ForstBW-Waldrefugien und
// regionalen Niederschlagswerten eine visuelle Einsteiger-Heatmap auf der Karte.
// ============================================================================

(function (root) {
    'use strict';

    let heatmapLayerGroup = null;
    let heatmapAktiv = false;
    let heatmapSpeciesFilter = 'all'; // 'all' oder Pilz-ID wie 'boletus-edulis'
    let cachedCells = null;

    // 1. Extrahiert aus den bereits geladenen Leaflet-Layern (phBodenLayer & waldLayer)
    //    oder Demo-Stützpunkten die Waldzellen für Baden-Württemberg
    function collectBwForestPoints() {
        if (cachedCells && cachedCells.length > 50) return cachedCells;

        const points = [];
        const seenKeys = new Set();

        // A) Aus BWI 2002 Bodenvegetations-Layer (Straucher und Boden Vegetation.json)
        if (root.phBodenLayer && typeof root.phBodenLayer.eachLayer === 'function') {
            root.phBodenLayer.eachLayer(function (sub) {
                function extractBwi(fl) {
                    if (!fl || !fl.getBounds || !fl.feature) return;
                    const center = fl.getBounds().getCenter();
                    const key = center.lat.toFixed(2) + '_' + center.lng.toFixed(2);
                    if (seenKeys.has(key)) return;
                    seenKeys.add(key);

                    const p = fl.feature.properties || {};
                    const sbv = [p.sbv01 || 0, p.sbv02 || 0, p.sbv03 || 0, p.sbv04 || 0];
                    const bwiScore = sbv[0] + sbv[1] + sbv[2] + sbv[3];

                    points.push({
                        lat: center.lat,
                        lng: center.lng,
                        bwiScore: bwiScore,
                        bwiSbv: sbv,
                        baumarten: null,
                        regen7TageMm: estimateRegionalRain(center.lat, center.lng),
                        ortsName: 'Waldzelle (' + center.lat.toFixed(2) + '°N, ' + center.lng.toFixed(2) + '°E)'
                    });
                }
                if (typeof sub.eachLayer === 'function') sub.eachLayer(extractBwi);
                else extractBwi(sub);
            });
        }

        // B) Ergänze die kuratierten BW-Referenz-Hotspots (falls BWI noch lädt)
        const ont = root.SCKM_ONTOLOGY;
        if (ont && Array.isArray(ont.DEMO_HABITATS_BW)) {
            ont.DEMO_HABITATS_BW.forEach(function (h) {
                points.push(Object.assign({}, h, { isHotspot: true }));
            });
        }

        if (points.length > 20) {
            cachedCells = points;
        }
        return points;
    }

    // Regionale Bodenfeuchte-Schätzung für flüssiges Rendering ohne 1.500 HTTP-Requests
    function estimateRegionalRain(lat, lng) {
        // Schwarzwald / Odenwald / Allgäu haben höhere Niederschläge als Rheinebene
        const isBlackForest = lng >= 8.0 && lng <= 8.65 && lat >= 47.65 && lat <= 48.85;
        const isSwabianAlb = lng >= 8.8 && lng <= 10.1 && lat >= 48.1 && lat <= 48.75;
        if (isBlackForest) return 26.0;
        if (isSwabianAlb) return 21.0;
        return 17.5;
    }

    function getScoreColor(score) {
        if (score >= 80) return '#16a34a'; // sattes Grün (Sehr hohe Chance)
        if (score >= 65) return '#65a30d'; // Hellgrün (Gute Chance)
        if (score >= 45) return '#eab308'; // Gelb (Mittlere Chance)
        return '#ef4444'; // Rot (Geringe Chance)
    }

    // 2. Heatmap-Layer auf der Leaflet-Karte aufbauen / aktualisieren
    function rebuildHeatmapLayer() {
        if (typeof L === 'undefined' || !root.map) return null;
        const eng = root.SCKM_ENGINE;
        if (!eng) return null;

        if (!root.map.getPane('sckmHeatmapPane')) {
            const pane = root.map.createPane('sckmHeatmapPane');
            pane.style.zIndex = 340;
            pane.classList.add('sckm-heatmap-pane');
        }

        if (!heatmapLayerGroup) {
            heatmapLayerGroup = L.layerGroup();
            root.sckmHeatmapLayer = heatmapLayerGroup;
        }
        heatmapLayerGroup.clearLayers();

        const points = collectBwForestPoints();
        // Nimm jeden 2. BWI-Punkt bei sehr großen Mengen für flüssiges Panning/Zooming
        const step = points.length > 750 ? 2 : 1;

        for (let i = 0; i < points.length; i += step) {
            const pt = points[i];
            const evalRes = eng.evaluateLocationKnowledge(
                pt,
                heatmapSpeciesFilter === 'all' ? null : heatmapSpeciesFilter
            );
            const targetRes =
                heatmapSpeciesFilter === 'all' ? evalRes.topResult : evalRes.activeResult;
            const score = targetRes ? targetRes.score : 0;

            if (score < 32 && !pt.isHotspot) continue;

            const color = getScoreColor(score);
            const radius = pt.isHotspot ? 22 : score >= 75 ? 16 : 13;
            const opacity = score >= 75 ? 0.58 : score >= 50 ? 0.44 : 0.28;

            const circle = L.circleMarker([pt.lat, pt.lng], {
                pane: 'sckmHeatmapPane',
                radius: radius,
                fillColor: color,
                fillOpacity: opacity,
                stroke: false,
                className: 'sckm-heatmap-blob',
                interactive: false
            });
            circle.addTo(heatmapLayerGroup);
        }

        return heatmapLayerGroup;
    }

    // 3. Ein-/Ausschalten der Pilz-Heatmap (über oberen Karten-Schalter oder Layer-Menü)
    root.toggleSckmHeatmap = function (forceState) {
        if (typeof L === 'undefined' || !root.map) return;
        heatmapAktiv = typeof forceState === 'boolean' ? forceState : !heatmapAktiv;

        if (heatmapAktiv) {
            cachedCells = null; // neu einlesen falls BWI inzwischen fertig geladen ist
            rebuildHeatmapLayer();
            if (heatmapLayerGroup && !root.map.hasLayer(heatmapLayerGroup)) {
                root.map.addLayer(heatmapLayerGroup);
            }
        } else if (heatmapLayerGroup && root.map.hasLayer(heatmapLayerGroup)) {
            root.map.removeLayer(heatmapLayerGroup);
        }

        // Synchronisiere sowohl den oberen Karten-Schalter als auch die Checkbox im Layer-Panel
        const pillBtn = document.getElementById('sckm-heatmap-toggle-btn');
        const bar = document.getElementById('sckm-heatmap-bar');
        const cb = document.getElementById('cb-heatmap');
        const leg = document.getElementById('legende-heatmap');

        if (pillBtn) {
            pillBtn.classList.toggle('aktiv', heatmapAktiv);
            pillBtn.setAttribute('aria-pressed', String(heatmapAktiv));
            pillBtn.innerHTML = heatmapAktiv
                ? '🔥 Pilz-Heatmap: <b>EIN</b>'
                : '🔥 Pilz-Heatmap';
        }
        if (bar) bar.classList.toggle('offen', heatmapAktiv);
        if (cb) cb.checked = heatmapAktiv;
        if (leg) leg.classList.toggle('aktiv', heatmapAktiv);
    };

    root.setzeSckmHeatmapPilz = function (speciesId) {
        heatmapSpeciesFilter = speciesId || 'all';
        if (heatmapAktiv) {
            rebuildHeatmapLayer();
        }
        if (speciesId && speciesId !== 'all' && typeof root.waehleSckmPilzart === 'function') {
            root.waehleSckmPilzart(speciesId);
        }
    };

    root.SCKM_HEATMAP = {
        rebuildHeatmapLayer: rebuildHeatmapLayer,
        toggleSckmHeatmap: root.toggleSckmHeatmap,
        setzeSckmHeatmapPilz: root.setzeSckmHeatmapPilz
    };
})(typeof window !== 'undefined' ? window : globalThis);
