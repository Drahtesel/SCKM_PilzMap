// ============================================================================
// SCKM Waldkanten-getreue Pilzwahrscheinlichkeits-Karte (www/sckm/heatmapLayer.js)
// Arbeitet exakt wie im ersten Prototyp mit echten Wald-Polygonen (0 % Stadt-
// Überdeckung, skaliert sauber beim Rein-/Rauszoomen) und bewertet immer eine
// konkrete Ziel-Pilzart, sodass grüne, gelbe und rote Wälder klar kontrastieren.
// ============================================================================

(function (root) {
    'use strict';

    let polygonLayerGroup = null;
    let glowLayerGroup = null;
    let masterGroup = null;

    let heatmapAktiv = false;
    let activeSpeciesId = 'boletus-edulis'; // Konkrete Pilzart statt "Alle=immer grün"
    let displayMode = 'hybrid'; // 'hybrid' | 'parzellen' | 'heatmap'

    let freiburgData = null;
    let forstBwData = null;
    let isLoadingData = false;

    // 1. Geologisches Boden-pH-Modell für Baden-Württemberg (LGRB-Vereinfachung),
    //    damit ForstBW-Waldpolygone realistische pH-Kontraste (Sauer vs. Kalk) haben
    function estimateBwGeologicalPh(lat, lng, mainTree) {
        // Hoch- und Nordschwarzwald (Kristallin / Buntsandstein -> stark sauer)
        if (lng >= 8.05 && lng <= 8.55 && lat >= 47.7 && lat <= 48.85) {
            return 4.3;
        }
        // Odenwald (Buntsandstein -> sauer)
        if (lng >= 8.65 && lng <= 9.15 && lat >= 49.4 && lat <= 49.75) {
            return 4.5;
        }
        // Schwäbische Alb (Jurakalk -> kalkhaltig / basisch!)
        if (lng >= 8.75 && lng <= 10.25 && lat >= 48.05 && lat <= 48.75 && (lat - 48.05) < (lng - 8.5) * 0.55) {
            return 7.1;
        }
        // Kaiserstuhl / Vorbergzone / Markgräflerland / Kraichgau (Löss & Kalk)
        if ((lng >= 7.55 && lng <= 7.82 && lat >= 47.75 && lat <= 48.18) || (lat >= 49.05 && lat <= 49.35 && lng >= 8.55 && lng <= 9.0)) {
            return 7.0;
        }
        // Oberrhein-Auwälder
        if (lng >= 7.55 && lng <= 8.45 && lat >= 47.8 && lat <= 49.4 && mainTree === 'Esche') {
            return 6.8;
        }
        // Baumarten-Einfluss auf den Oberboden-Humus (Nadelstreu versauert den Oberboden)
        if (mainTree === 'Kiefer' || mainTree === 'Fichte' || mainTree === 'Tanne') {
            return 4.6;
        }
        if (mainTree === 'Esche') {
            return 6.7;
        }
        // Mittlerer Neckar / Schönbuch / Keuperbergland
        return 5.4;
    }

    function parseForstBwTrees(lwetText) {
        if (!lwetText) return ['Buche'];
        const t = lwetText.toLowerCase();
        const list = [];
        if (t.indexOf('fichte') !== -1) list.push('Fichte');
        if (t.indexOf('kiefer') !== -1 || t.indexOf('föhre') !== -1) list.push('Kiefer');
        if (t.indexOf('tanne') !== -1) list.push('Tanne');
        if (t.indexOf('buche') !== -1) list.push('Buche');
        if (t.indexOf('eiche') !== -1) list.push('Eiche');
        if (t.indexOf('esche') !== -1 || t.indexOf('buntlaub') !== -1 || t.indexOf('erle') !== -1) list.push('Esche');
        if (t.indexOf('birke') !== -1) list.push('Birke');
        if (list.length === 0) list.push('Buche');
        return list;
    }

    function normalizeFreiburgTrees(dominantTrees) {
        if (!Array.isArray(dominantTrees)) return ['Fichte', 'Buche'];
        return dominantTrees.map(function (t) {
            if (t === 'Weißtanne') return 'Tanne';
            if (t === 'Stieleiche' || t === 'Hainbuche') return 'Eiche';
            return t;
        });
    }

    function getPolygonCenter(geometry) {
        if (!geometry || !geometry.coordinates) return { lat: 48.0, lng: 7.85 };
        let ring = geometry.coordinates[0];
        if (geometry.type === 'MultiPolygon' && ring && ring[0]) {
            ring = ring[0];
        }
        if (!Array.isArray(ring) || ring.length === 0) return { lat: 48.0, lng: 7.85 };
        let sumLat = 0;
        let sumLng = 0;
        let count = 0;
        for (let i = 0; i < ring.length; i++) {
            const pt = ring[i];
            if (Array.isArray(pt) && pt.length >= 2) {
                sumLng += pt[0];
                sumLat += pt[1];
                count++;
            }
        }
        return count > 0 ? { lat: sumLat / count, lng: sumLng / count } : { lat: 48.0, lng: 7.85 };
    }

    // 4-stufige Ampelskala exakt wie im ersten Prototyp (Grün / Gelb / Orange / Rot)
    function getSuitabilityColor(score) {
        if (score >= 75) return '#16a34a'; // Grün: Sehr hohe Eignung
        if (score >= 50) return '#eab308'; // Gelb: Mittlere Eignung
        if (score >= 25) return '#f97316'; // Orange: Schwache Eignung
        return '#dc2626'; // Rot: Ungeeignet / Ausgeschlossen
    }

    // Baut das Standort-Objekt für ein einzelnes Wald-Polygon
    function buildStandortFromFeature(feature, sourceType) {
        const p = feature.properties || {};

        if (sourceType === 'freiburg') {
            const trees = normalizeFreiburgTrees(p.dominantTrees);
            const ph = typeof p.soilPh === 'number' ? p.soilPh : 5.0;
            const bwiScore = ph < 4.5 ? 7 : ph < 5.2 ? 3 : 0;
            const bwiSbv = ph < 4.5 ? [2, 3, 1, 0] : ph < 5.2 ? [0, 1, 0, 0] : [0, 0, 0, 0];
            const isSouthSlope = p.aspect === 'S' || p.aspect === 'SW' || p.aspect === 'SO';
            const rain =
                p.waterRetention === 'high' && !isSouthSlope
                    ? 24.0
                    : p.waterRetention === 'low' || isSouthSlope
                    ? 4.2
                    : 10.5;

            return {
                ortsName: p.name + ' · ' + (p.subregion || 'Freiburg'),
                lat: p.centerLat || 47.99,
                lng: p.centerLon || 7.85,
                phWert: ph,
                phQuelle: 'LGRB BW Geologie (' + (p.soilSubstrate || 'Waldboden') + ')',
                bwiScore: bwiScore,
                bwiSbv: bwiSbv,
                baumarten: trees,
                baumQuelle: 'OSM Waldbestand (' + trees.join(', ') + ')',
                regen7TageMm: rain,
                areaHa: p.areaHa || null,
                elevationM: p.elevationM || null,
                aspect: p.aspect || null,
                schutzgebiete: []
            };
        }

        // ForstBW Waldpolygon
        const center = getPolygonCenter(feature.geometry);
        const trees = parseForstBwTrees(p.LWET_TEXT);
        const ph = estimateBwGeologicalPh(center.lat, center.lng, trees[0]);
        const bwiScore = ph < 4.6 ? 7 : ph < 5.5 ? 4 : 0;
        const bwiSbv =
            trees[0] === 'Kiefer'
                ? [1, 1, 2, 2]
                : ph < 4.6
                ? [2, 3, 1, 0]
                : ph < 5.5
                ? [1, 1, 0, 0]
                : [0, 0, 0, 0];
        const rain = center.lng < 8.55 && center.lat < 48.85 ? 23.5 : 17.5;

        return {
            ortsName: (p.LWET_TEXT ? p.LWET_TEXT.split(' ')[0] : 'Waldgebiet') + ' (ForstBW #' + (p.OBJECTID || '') + ')',
            lat: center.lat,
            lng: center.lng,
            phWert: ph,
            phQuelle: 'LGRB / ISRIC Boden-Milieu',
            bwiScore: bwiScore,
            bwiSbv: bwiSbv,
            baumarten: trees,
            baumQuelle: 'ForstBW Waldkartierung (' + (p.LWET_TEXT || trees.join(', ')) + ')',
            regen7TageMm: rain,
            schutzgebiete: []
        };
    }

    // 2. Lädt die 75 Freiburger Detail-Waldparzellen + ForstBW-Waldpolygone
    function ensureForestGeoJsonLoaded(callback) {
        if (freiburgData && forstBwData) {
            callback();
            return;
        }
        if (isLoadingData) return;
        isLoadingData = true;

        Promise.all([
            fetch('sckm/freiburg_habitats.geojson')
                .then(function (r) {
                    return r.json();
                })
                .catch(function () {
                    return { type: 'FeatureCollection', features: [] };
                }),
            fetch('ForstBW_Waldrefugien_-38784724193262813.geojson')
                .then(function (r) {
                    return r.json();
                })
                .catch(function () {
                    return { type: 'FeatureCollection', features: [] };
                })
        ]).then(function (results) {
            freiburgData = results[0];
            forstBwData = results[1];
            isLoadingData = false;
            callback();
        });
    }

    // 3. Rendert die echten Waldpolygone im gewählten Modus (Hybrid / Waldparzellen / Heatmap)
    function rebuildHeatmapLayer() {
        if (typeof L === 'undefined' || !root.map) return;
        const eng = root.SCKM_ENGINE;
        if (!eng) return;

        ensureForestGeoJsonLoaded(function () {
            if (!root.map.getPane('sckmGlowPane')) {
                const gp = root.map.createPane('sckmGlowPane');
                gp.style.zIndex = 410;
                gp.style.pointerEvents = 'none';
            }
            if (!root.map.getPane('sckmPolygonPane')) {
                const pp = root.map.createPane('sckmPolygonPane');
                pp.style.zIndex = 420;
            }

            if (!masterGroup) {
                masterGroup = L.layerGroup();
                polygonLayerGroup = L.layerGroup().addTo(masterGroup);
                glowLayerGroup = L.layerGroup().addTo(masterGroup);
                root.sckmHeatmapLayer = masterGroup;
            }
            if (heatmapAktiv && !root.map.hasLayer(masterGroup)) {
                root.map.addLayer(masterGroup);
            }

            polygonLayerGroup.clearLayers();
            glowLayerGroup.clearLayers();

            const showGlow = displayMode === 'hybrid' || displayMode === 'heatmap';
            const showCrispBorders = displayMode === 'hybrid' || displayMode === 'parzellen';

            let stats = { green: 0, yellow: 0, red: 0, total: 0 };

            function addFeatureCollection(fc, sourceType) {
                if (!fc || !Array.isArray(fc.features)) return;

                L.geoJSON(fc, {
                    pane: 'sckmPolygonPane',
                    style: function (feature) {
                        const st = buildStandortFromFeature(feature, sourceType);
                        const evalRes = eng.evaluateLocationKnowledge(st, activeSpeciesId);
                        const res = evalRes.activeResult;
                        const color = getSuitabilityColor(res.score);

                        if (sourceType === 'freiburg') {
                            stats.total++;
                            if (res.score >= 75) stats.green++;
                            else if (res.score >= 50) stats.yellow++;
                            else stats.red++;
                        }

                        if (displayMode === 'heatmap') {
                            return {
                                fillColor: color,
                                fillOpacity: 0.72,
                                color: color,
                                weight: 3,
                                opacity: 0.65,
                                className: 'sckm-heatmap-glow-path'
                            };
                        }

                        return {
                            fillColor: color,
                            fillOpacity: displayMode === 'hybrid' ? 0.55 : 0.65,
                            color: showCrispBorders ? '#0f172a' : color,
                            weight: sourceType === 'freiburg' ? 1.4 : 1.0,
                            opacity: showCrispBorders ? 0.65 : 0.3
                        };
                    },
                    onEachFeature: function (feature, layer) {
                        layer.on('click', function (e) {
                            if (e && e.originalEvent) {
                                L.DomEvent.stopPropagation(e.originalEvent);
                            }
                            const st = buildStandortFromFeature(feature, sourceType);
                            if (typeof root.aktualisiereSckmStandort === 'function') {
                                root.aktualisiereSckmStandort(st);
                            }
                            const popupHtml =
                                typeof root.baueSckmPopupBlock === 'function'
                                    ? '<div style="font-family:\'Segoe UI\',Tahoma,sans-serif;min-width:255px;padding:2px;">' +
                                      '<div style="font-weight:700;font-size:0.95em;color:#0f172a;margin-bottom:6px;">🌲 ' +
                                      st.ortsName +
                                      '</div>' +
                                      root.baueSckmPopupBlock(st) +
                                      '</div>'
                                    : st.ortsName;
                            L.popup()
                                .setLatLng(e.latlng || [st.lat, st.lng])
                                .setContent(popupHtml)
                                .openOn(root.map);
                        });
                    }
                }).addTo(polygonLayerGroup);

                // Weicher Heatmap-Untergrund für den Hybrid-Modus (exakt wie im alten Prototyp)
                if (showGlow && displayMode === 'hybrid' && sourceType === 'freiburg') {
                    L.geoJSON(fc, {
                        pane: 'sckmGlowPane',
                        interactive: false,
                        style: function (feature) {
                            const st = buildStandortFromFeature(feature, sourceType);
                            const evalRes = eng.evaluateLocationKnowledge(st, activeSpeciesId);
                            const color = getSuitabilityColor(evalRes.activeResult.score);
                            return {
                                fillColor: color,
                                fillOpacity: 0.42,
                                color: color,
                                weight: 4,
                                opacity: 0.45,
                                className: 'sckm-heatmap-glow-path'
                            };
                        }
                    }).addTo(glowLayerGroup);
                }
            }

            // 1. Lade die 75 feingranularen Freiburger OSM-Waldparzellen
            addFeatureCollection(freiburgData, 'freiburg');
            // 2. Lade die ForstBW-Waldpolygone für das restliche Baden-Württemberg
            addFeatureCollection(forstBwData, 'forstbw');

            updateHeatmapStatsBadge(stats);
        });
    }

    function updateHeatmapStatsBadge(stats) {
        const badge = document.getElementById('sckm-hm-stats');
        if (!badge || !stats || stats.total === 0) return;
        badge.innerHTML =
            'Freiburg (75 Wälder): <b style="color:#16a34a;">' +
            stats.green +
            ' Sehr gut</b> · <b style="color:#d97706;">' +
            stats.yellow +
            ' Mittel</b> · <b style="color:#dc2626;">' +
            stats.red +
            ' Gering</b>';
    }

    // 4. Steuerung: Ein/Aus, Pilzart wechseln, Darstellungsmodus wechseln, nach Freiburg zoomen
    root.toggleSckmHeatmap = function (forceState, zoomToFreiburgOnOpen) {
        if (typeof L === 'undefined' || !root.map) return;
        const warAus = !heatmapAktiv;
        heatmapAktiv = typeof forceState === 'boolean' ? forceState : !heatmapAktiv;

        if (heatmapAktiv) {
            rebuildHeatmapLayer();
            if (masterGroup && !root.map.hasLayer(masterGroup)) {
                root.map.addLayer(masterGroup);
            }
            // Beim erstmaligen Einschalten direkt auf die 75 detaillierten Freiburger
            // Waldparzellen zoomen (wie im ersten Prototyp), damit der Nutzer sofort
            // die sauberen grün/gelb/roten Waldgrenzen ohne Stadtüberdeckung sieht!
            if (warAus && zoomToFreiburgOnOpen !== false && root.map.getZoom() < 11) {
                root.map.setView([47.992, 7.855], 12);
            }
        } else if (masterGroup && root.map.hasLayer(masterGroup)) {
            root.map.removeLayer(masterGroup);
        }

        const pillBtn = document.getElementById('sckm-heatmap-toggle-btn');
        const bar = document.getElementById('sckm-heatmap-bar');
        const cb = document.getElementById('cb-heatmap');
        const leg = document.getElementById('legende-heatmap');

        if (pillBtn) {
            pillBtn.classList.toggle('aktiv', heatmapAktiv);
            pillBtn.setAttribute('aria-pressed', String(heatmapAktiv));
            pillBtn.innerHTML = heatmapAktiv
                ? '🔥 Pilz-Karte: <b>EIN</b>'
                : '🔥 Pilz-Karte (Wälder)';
        }
        if (bar) bar.classList.toggle('offen', heatmapAktiv);
        if (cb) cb.checked = heatmapAktiv;
        if (leg) leg.classList.toggle('aktiv', heatmapAktiv);
    };

    root.setzeSckmHeatmapPilz = function (speciesId, skipPanelSync) {
        activeSpeciesId = speciesId || 'boletus-edulis';
        const sel = document.getElementById('sckm-heatmap-select');
        if (sel && sel.value !== activeSpeciesId) {
            sel.value = activeSpeciesId;
        }
        if (heatmapAktiv) {
            rebuildHeatmapLayer();
        }
        if (!skipPanelSync && typeof root.waehleSckmPilzart === 'function') {
            root.waehleSckmPilzart(activeSpeciesId, true);
        }
    };

    root.setzeSckmHeatmapModus = function (mode) {
        displayMode = mode || 'hybrid';
        ['hybrid', 'parzellen', 'heatmap'].forEach(function (m) {
            const btn = document.getElementById('sckm-hm-mode-' + m);
            if (btn) btn.classList.toggle('aktiv', m === displayMode);
        });
        if (heatmapAktiv) {
            rebuildHeatmapLayer();
        }
    };

    root.zoomSckmFreiburg = function () {
        if (!root.map) return;
        if (!heatmapAktiv) {
            root.toggleSckmHeatmap(true, false);
        }
        root.map.setView([47.992, 7.855], 12);
    };

    root.SCKM_HEATMAP = {
        rebuildHeatmapLayer: rebuildHeatmapLayer,
        toggleSckmHeatmap: root.toggleSckmHeatmap,
        setzeSckmHeatmapPilz: root.setzeSckmHeatmapPilz,
        setzeSckmHeatmapModus: root.setzeSckmHeatmapModus
    };
})(typeof window !== 'undefined' ? window : globalThis);
