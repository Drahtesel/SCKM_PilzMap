// ============================================================================
// SCKM UI-Controller: Beginner-Wissenstreppe & Knowledge Graph Dock
// (www/sckm/wissenstreppeUI.js)
// ============================================================================

(function (root) {
    'use strict';

    const STORAGE_KEY = 'sckm_pilzmap_state_v1';

    const state = {
        panelOffen: false,
        graphOffen: false,
        aktiveStufe: 3, // 1 = Daten, 2 = Information, 3 = Wissen (Glass-Box), 4 = Handeln
        selectedSpeciesId: 'boletus-edulis',
        focusedGraphNodeId: 'mushroom:boletus-edulis',
        currentStandort: null,
        userTrees: [],
        userIndicators: [],
        completedChecklist: {}
    };

    // Lade persistierten Lernfortschritt aus localStorage (100% lokal, kein Supabase-Schreibzugriff)
    function loadLocalState() {
        try {
            const raw = localStorage.getItem(STORAGE_KEY);
            if (!raw) return;
            const parsed = JSON.parse(raw);
            if (parsed && typeof parsed === 'object') {
                if (parsed.selectedSpeciesId) state.selectedSpeciesId = parsed.selectedSpeciesId;
                if (parsed.completedChecklist) state.completedChecklist = parsed.completedChecklist;
            }
        } catch (_) {}
    }

    function saveLocalState() {
        try {
            localStorage.setItem(
                STORAGE_KEY,
                JSON.stringify({
                    selectedSpeciesId: state.selectedSpeciesId,
                    completedChecklist: state.completedChecklist
                })
            );
        } catch (_) {}
    }

    function getEvaluation() {
        const ont = root.SCKM_ONTOLOGY;
        const eng = root.SCKM_ENGINE;
        if (!ont || !eng) return null;

        const base = state.currentStandort || ont.DEMO_HABITATS_BW[0];
        const mergedStandort = Object.assign({}, base, {
            userTrees: state.userTrees.length > 0 ? state.userTrees : null,
            userIndicators: state.userIndicators.length > 0 ? state.userIndicators : null
        });

        return eng.evaluateLocationKnowledge(mergedStandort, state.selectedSpeciesId);
    }

    // 1. Kompakte Glass-Box-Vorschau für das Leaflet-Klick-Popup in app.js
    root.baueSckmPopupBlock = function (standortDaten) {
        const eng = root.SCKM_ENGINE;
        if (!eng) return '';
        const evalRes = eng.evaluateLocationKnowledge(standortDaten, state.selectedSpeciesId);
        const top = evalRes.topResult;
        const ctx = evalRes.context;

        const verbotHint = ctx.sammelVerbot
            ? '<div style="font-size:0.74em;color:#c0392b;font-weight:700;margin-top:3px;">🚫 Achtung: Sammelverbot im Schutzgebiet (nur Beobachtung)</div>'
            : '';

        const top3Html = evalRes.rankings
            .slice(0, 3)
            .map(function (r) {
                return (
                    '<span style="display:inline-flex;align-items:center;gap:3px;background:#fff;border:1px solid #dceee3;border-radius:999px;padding:2px 7px;font-size:0.74em;">' +
                    '<b style="color:' +
                    r.ampelfarbe +
                    ';">' +
                    r.score +
                    '%</b> ' +
                    r.species.deutscherName +
                    '</span>'
                );
            })
            .join(' ');

        return (
            '<div class="sckm-popup-box" style="background:linear-gradient(135deg,#f0fdf6,#e8f8f0);border:1px solid #b8e6cc;border-left:4px solid ' +
            top.ampelfarbe +
            ';border-radius:9px;padding:8px 10px;margin-bottom:10px;text-align:left;">' +
            '<div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:4px;">' +
            '<span style="font-size:0.78em;font-weight:700;color:#1a7a45;">🪜 SCKM Pilzwahrscheinlichkeit (Glass-Box)</span>' +
            '<span style="background:' +
            top.ampelfarbe +
            ';color:#fff;font-weight:700;font-size:0.75em;padding:1px 7px;border-radius:999px;">Top: ' +
            top.score +
            '%</span>' +
            '</div>' +
            '<div style="font-size:0.83em;font-weight:700;color:#222;margin-bottom:4px;">🍄 ' +
            top.species.deutscherName +
            ' <span style="font-weight:400;font-size:0.88em;color:#555;">(' +
            top.einstufung +
            ')</span></div>' +
            '<div style="display:flex;flex-wrap:wrap;gap:4px;margin-bottom:6px;">' +
            top3Html +
            '</div>' +
            '<div style="font-size:0.74em;color:#475569;margin-bottom:6px;">' +
            '🌳 ' +
            ctx.trees.join(', ') +
            ' &nbsp;·&nbsp; 🧪 pH ' +
            ctx.phInfo.phText +
            ' &nbsp;·&nbsp; 🌧️ ' +
            ctx.regen7TageMm.toFixed(1).replace('.', ',') +
            ' mm' +
            '</div>' +
            verbotHint +
            '<div style="display:flex;gap:5px;margin-top:6px;">' +
            '<button type="button" onclick="window.oeffneWissenstreppePanel(3)" style="flex:1;padding:6px 8px;background:#1a7a45;color:#fff;border:none;border-radius:6px;font-size:0.78em;font-weight:700;cursor:pointer;">🪜 Wissenstreppe (1–4)</button>' +
            '<button type="button" onclick="window.toggleKnowledgeGraphDock(true)" style="flex:1;padding:6px 8px;background:#0f172a;color:#fff;border:none;border-radius:6px;font-size:0.78em;font-weight:700;cursor:pointer;">🕸️ Knowledge Graph</button>' +
            '</div>' +
            '</div>'
        );
    };

    // 2. Standort aus app.js (Kartenklick) übernehmen und UI synchronisieren
    root.aktualisiereSckmStandort = function (standortDaten) {
        state.currentStandort = standortDaten;
        state.userTrees = [];
        state.userIndicators = [];
        const evalRes = getEvaluation();
        if (evalRes && evalRes.topResult) {
            state.selectedSpeciesId = evalRes.topResult.species.id;
            state.focusedGraphNodeId = 'mushroom:' + state.selectedSpeciesId;
        }
        renderWissenstreppePanel();
        renderKnowledgeGraphDock();
    };

    // 3. Wissenstreppen-Drawer öffnen / schließen / Stufe wechseln
    root.toggleWissenstreppePanel = function () {
        state.panelOffen = !state.panelOffen;
        syncPanelVisibility();
        if (state.panelOffen) renderWissenstreppePanel();
    };

    root.oeffneWissenstreppePanel = function (stufeNr) {
        if (stufeNr) state.aktiveStufe = stufeNr;
        state.panelOffen = true;
        syncPanelVisibility();
        renderWissenstreppePanel();
    };

    function syncPanelVisibility() {
        const panel = document.getElementById('wissenstreppe-panel');
        const backdrop = document.getElementById('wissenstreppe-panel-backdrop');
        const btn = document.getElementById('sckm-btn');
        if (panel) panel.classList.toggle('offen', state.panelOffen);
        if (backdrop) backdrop.classList.toggle('aktiv', state.panelOffen);
        if (btn) btn.classList.toggle('aktiv', state.panelOffen);
    }

    root.setzeWissenstreppeStufe = function (stufeNr) {
        state.aktiveStufe = stufeNr;
        renderWissenstreppePanel();
    };

    root.waehleSckmPilzart = function (speciesId) {
        state.selectedSpeciesId = speciesId;
        state.focusedGraphNodeId = 'mushroom:' + speciesId;
        saveLocalState();
        renderWissenstreppePanel();
        renderKnowledgeGraphDock();
    };

    root.waehleSckmDemoHabitat = function (habitatId) {
        const ont = root.SCKM_ONTOLOGY;
        if (!ont) return;
        const found = ont.DEMO_HABITATS_BW.find(function (h) {
            return h.id === habitatId;
        });
        if (!found) return;
        state.currentStandort = Object.assign({}, found);
        state.userTrees = [];
        state.userIndicators = [];
        const evalRes = getEvaluation();
        if (evalRes && evalRes.topResult) {
            state.selectedSpeciesId = evalRes.topResult.species.id;
            state.focusedGraphNodeId = 'mushroom:' + state.selectedSpeciesId;
        }
        if (root.sckmSpringeZuKoordinate) {
            root.sckmSpringeZuKoordinate(found.lat, found.lng);
        }
        renderWissenstreppePanel();
        renderKnowledgeGraphDock();
    };

    // 4. Human-in-the-Loop: Eigene Baum- oder Zeigerpflanzen-Beobachtung vor Ort umschalten
    root.toggleSckmUserTree = function (treeId) {
        const evalRes = getEvaluation();
        const currentList =
            state.userTrees.length > 0
                ? state.userTrees.slice()
                : evalRes
                ? evalRes.context.trees.slice()
                : [];
        const idx = currentList.indexOf(treeId);
        if (idx >= 0) {
            if (currentList.length > 1) currentList.splice(idx, 1);
        } else {
            currentList.push(treeId);
        }
        state.userTrees = currentList;
        renderWissenstreppePanel();
        renderKnowledgeGraphDock();
    };

    root.toggleSckmChecklist = function (key) {
        state.completedChecklist[key] = !state.completedChecklist[key];
        saveLocalState();
        renderWissenstreppePanel();
    };

    // 5. Knowledge Graph Dock öffnen / schließen & Knoten-Klick
    root.toggleKnowledgeGraphDock = function (forceOpen) {
        state.graphOffen = typeof forceOpen === 'boolean' ? forceOpen : !state.graphOffen;
        const dock = document.getElementById('knowledge-graph-dock');
        if (dock) dock.classList.toggle('offen', state.graphOffen);
        if (state.graphOffen) renderKnowledgeGraphDock();
    };

    root.klickSckmGraphKnoten = function (nodeId) {
        state.focusedGraphNodeId = nodeId;
        if (nodeId.indexOf('mushroom:') === 0) {
            state.selectedSpeciesId = nodeId.replace('mushroom:', '');
            saveLocalState();
        }
        renderKnowledgeGraphDock();
        if (state.panelOffen) renderWissenstreppePanel();
    };

    // Schaltet aus dem Wissensgraphen heraus den zugehörigen Karten-Layer in Pilz-Hub BW ein
    root.aktiviereKartenLayerAusGraph = function (layerId) {
        const cbMap = {
            ph: 'cb-ph',
            bwi: 'cb-bwi',
            waldrefugien: 'cb-waldrefugien',
            regenmesspunkte: 'cb-regenmesspunkte',
            fundstellen: 'cb-fundstellen'
        };
        const cbId = cbMap[layerId];
        const cb = cbId ? document.getElementById(cbId) : null;
        if (cb && typeof root.toggleLayer === 'function') {
            if (!cb.checked) {
                cb.checked = true;
                root.toggleLayer(layerId, cb);
            }
        }
    };

    // 6. Rendern des Beginner-Wissenstreppen-Panels
    function renderWissenstreppePanel() {
        const container = document.getElementById('wissenstreppe-panel-inhalt');
        if (!container) return;

        const ont = root.SCKM_ONTOLOGY;
        const evalRes = getEvaluation();
        if (!ont || !evalRes) return;

        const ctx = evalRes.context;
        const active = evalRes.activeResult;
        const stufeObj =
            ont.WISSENSTREPPE_STUFEN.find(function (s) {
                return s.stufe === state.aktiveStufe;
            }) || ont.WISSENSTREPPE_STUFEN[2];

        // Standort-Auswahl (Aktueller Klick oder 4 BW-Referenz-Habitate)
        const demoButtonsHtml = ont.DEMO_HABITATS_BW.map(function (h) {
            const isSel = ctx.ortsName === h.ortsName;
            return (
                '<button type="button" class="sckm-chip ' +
                (isSel ? 'aktiv' : '') +
                '" onclick="window.waehleSckmDemoHabitat(\'' +
                h.id +
                '\')">' +
                h.ortsName.split(' (')[0] +
                '</button>'
            );
        }).join('');

        // 4 Stufen-Tabs der Wissenstreppe
        const stufenTabsHtml = ont.WISSENSTREPPE_STUFEN.map(function (s) {
            const isAkt = s.stufe === state.aktiveStufe;
            return (
                '<button type="button" class="sckm-step-tab ' +
                (isAkt ? 'aktiv' : '') +
                '" onclick="window.setzeWissenstreppeStufe(' +
                s.stufe +
                ')">' +
                '<span class="sckm-step-num">Stufe ' +
                s.stufe +
                '</span>' +
                '<span class="sckm-step-name">' +
                s.titel.split('. ')[1] +
                '</span>' +
                '</button>'
            );
        }).join('');

        let stufenInhaltHtml = '';

        // --- STUFE 1: ZEICHEN & DATEN ---
        if (state.aktiveStufe === 1) {
            stufenInhaltHtml =
                '<div class="sckm-card">' +
                '<div class="sckm-badge-row"><span class="sckm-pill">Wissenstreppe Stufe 1</span><span class="sckm-pill-muted">Syntaktische Rohdaten</span></div>' +
                '<h4>📡 Gemessene Rohdaten am Standort</h4>' +
                '<p class="sckm-desc">Ohne Kontext sind dies reine Zahlen und Codes aus den 5 angebundenen Schnittstellen von <b>Pilz-Hub BW</b>:</p>' +
                '<table class="sckm-raw-table">' +
                '<tr><th>Quelle / Sensor</th><th>Feld / Parameter</th><th>Rohwert</th></tr>' +
                '<tr><td>GPS / Karte</td><td><code>lat, lng</code></td><td><code>' +
                ctx.lat.toFixed(5) +
                ', ' +
                ctx.lng.toFixed(5) +
                '</code></td></tr>' +
                '<tr><td>ISRIC SoilGrids WMS</td><td><code>phh2o_0-5cm_mean</code></td><td><code>' +
                Math.round(ctx.phInfo.phNum * 10) +
                ' (pH×10)</code></td></tr>' +
                '<tr><td>BWI 2002 (Thünen)</td><td><code>sbv01..04</code></td><td><code>[' +
                ctx.bwiSbv.join(', ') +
                '] (Σ=' +
                (ctx.bwiScore !== null ? ctx.bwiScore : '–') +
                ')</code></td></tr>' +
                '<tr><td>Open-Meteo API</td><td><code>precipitation_sum (7d)</code></td><td><code>' +
                ctx.regen7TageMm.toFixed(1) +
                ' mm</code></td></tr>' +
                '<tr><td>ForstBW / Bestand</td><td><code>LWET_TEXT / Baum</code></td><td><code>' +
                ctx.trees.join(', ') +
                '</code></td></tr>' +
                '<tr><td>LUBW Schutzgebiete</td><td><code>SCHUTZSTAT</code></td><td><code>' +
                (ctx.schutzgebiete.length > 0
                    ? ctx.schutzgebiete
                          .map(function (s) {
                              return s.art;
                          })
                          .join(', ')
                    : 'NONE') +
                '</code></td></tr>' +
                '</table>' +
                '<button type="button" class="sckm-next-btn" onclick="window.setzeWissenstreppeStufe(2)">Weiter zu Stufe 2: Informationen ableiten →</button>' +
                '</div>';
        }

        // --- STUFE 2: INFORMATIONEN ---
        else if (state.aktiveStufe === 2) {
            const treeChips = ont.TREE_NODES.map(function (t) {
                const activeTree = ctx.trees.indexOf(t.id) !== -1;
                return (
                    '<button type="button" class="sckm-tree-chip ' +
                    (activeTree ? 'aktiv' : '') +
                    '" onclick="window.toggleSckmUserTree(\'' +
                    t.id +
                    '\')">' +
                    (activeTree ? '✅ ' : '+ ') +
                    t.label +
                    '</button>'
                );
            }).join('');

            stufenInhaltHtml =
                '<div class="sckm-card">' +
                '<div class="sckm-badge-row"><span class="sckm-pill">Wissenstreppe Stufe 2</span><span class="sckm-pill-muted">Know-what (Kontextualisierte Information)</span></div>' +
                '<h4>🔍 Ökologische & rechtliche Standort-Information</h4>' +
                '<p class="sckm-desc">Durch semantische Einordnung werden aus den Rohwerten verständliche Standort-Eigenschaften:</p>' +
                '<div class="sckm-info-grid">' +
                '<div class="sckm-info-item"><b>🧪 Boden-Milieu:</b><span>pH ' +
                ctx.phInfo.phText +
                ' → <b>' +
                ctx.phInfo.categoryLabel +
                '</b> (' +
                ctx.phInfo.phQuelle +
                ')</span></div>' +
                '<div class="sckm-info-item"><b>🌧️ Bodenfeuchte (7 Tage):</b><span><b>' +
                ctx.regen7TageMm.toFixed(1).replace('.', ',') +
                ' mm</b> → ' +
                (ctx.regen7TageMm >= 12
                    ? 'Gut durchfeuchtet (Wachstumsimpuls aktiv)'
                    : ctx.regen7TageMm >= 5
                    ? 'Mäßig feucht'
                    : 'Trockenheits-Hemmung (< 5 mm)') +
                '</span></div>' +
                '<div class="sckm-info-item"><b>🌿 BWI-Zeigerpflanzen:</b><span><b>' +
                (ctx.indicators.length > 0 ? ctx.indicators.join(', ') : 'Keine Säurezeiger') +
                '</b></span></div>' +
                '<div class="sckm-info-item"><b>🛡️ Sammelrecht-Status:</b><span style="color:' +
                (ctx.sammelVerbot ? '#c0392b;font-weight:700;' : '#1a7a45;font-weight:700;') +
                '">' +
                (ctx.sammelVerbot
                    ? '🚫 Sammelverbot (' +
                      ctx.verboteneZonen
                          .map(function (z) {
                              return z.art + ' ' + z.name;
                          })
                          .join(', ') +
                      ')'
                    : '✅ Kein strenges Schutzgebiet (Handstraußregel beachten)') +
                '</span></div>' +
                '</div>' +
                '<div class="sckm-hitl-box">' +
                '<b>🌳 Vor-Ort-Beobachtung (Human-in-the-Loop):</b>' +
                '<p>Quelle: <i>' +
                ctx.baumQuelle +
                '</i>. Welche Bäume siehst du vor Ort? Klicke zum Anpassen:</p>' +
                '<div class="sckm-chip-wrap">' +
                treeChips +
                '</div>' +
                '</div>' +
                '<button type="button" class="sckm-next-btn" onclick="window.setzeWissenstreppeStufe(3)">Weiter zu Stufe 3: Wissen & Pilzwahrscheinlichkeit →</button>' +
                '</div>';
        }

        // --- STUFE 3: WISSEN (GLASS-BOX PILZWAHRSCHEINLICHKEIT & ONTOLOGIE) ---
        else if (state.aktiveStufe === 3) {
            const rankingPills = evalRes.rankings
                .map(function (r) {
                    const isSel = r.species.id === active.species.id;
                    return (
                        '<button type="button" class="sckm-species-btn ' +
                        (isSel ? 'aktiv' : '') +
                        '" onclick="window.waehleSckmPilzart(\'' +
                        r.species.id +
                        '\')">' +
                        '<span class="sckm-sp-name">' +
                        r.species.deutscherName +
                        '</span>' +
                        '<span class="sckm-sp-score" style="background:' +
                        r.ampelfarbe +
                        ';">' +
                        r.score +
                        '%</span>' +
                        '</button>'
                    );
                })
                .join('');

            const rulesHtml = active.rules
                .map(function (rule) {
                    const icon =
                        rule.status === 'passed' ? '✅' : rule.status === 'partial' ? '⚠️' : '❌';
                    const barColor =
                        rule.status === 'passed'
                            ? '#2ca25f'
                            : rule.status === 'partial'
                            ? '#f39c12'
                            : '#e74c3c';
                    const pct = Math.round((rule.punkte / rule.gewichtMax) * 100);
                    return (
                        '<div class="sckm-rule-item">' +
                        '<div class="sckm-rule-head">' +
                        '<span>' +
                        icon +
                        ' <b>' +
                        rule.faktor +
                        '</b></span>' +
                        '<span class="sckm-rule-pts"><b>+' +
                        rule.punkte +
                        '</b> / ' +
                        rule.gewichtMax +
                        ' %</span>' +
                        '</div>' +
                        '<div class="sckm-rule-bar"><div style="width:' +
                        pct +
                        '%;background:' +
                        barColor +
                        ';"></div></div>' +
                        '<div class="sckm-rule-exp">' +
                        rule.erklaerung +
                        '</div>' +
                        '</div>'
                    );
                })
                .join('');

            const koBanner = active.koReason
                ? '<div class="sckm-ko-banner">⚠️ <b>' + active.koReason + '</b></div>'
                : '';

            stufenInhaltHtml =
                '<div class="sckm-card">' +
                '<div class="sckm-badge-row"><span class="sckm-pill">Wissenstreppe Stufe 3</span><span class="sckm-pill-muted">Know-why (Glass-Box Inferenz)</span></div>' +
                '<h4>🧠 Pilz-Ranking am Standort (Klicke eine Art für Details)</h4>' +
                '<div class="sckm-species-grid">' +
                rankingPills +
                '</div>' +
                '<div class="sckm-glassbox-card" style="border-top:4px solid ' +
                active.ampelfarbe +
                ';">' +
                '<div class="sckm-gb-header">' +
                '<div>' +
                '<h5>🍄 ' +
                active.species.deutscherName +
                ' <small>(' +
                active.species.wissenschaftlicherName +
                ')</small></h5>' +
                '<div class="sckm-gb-group">' +
                active.species.gruppe +
                ' · ' +
                active.species.essbarkeit +
                '</div>' +
                '</div>' +
                '<div class="sckm-gb-total" style="background:' +
                active.ampelfarbe +
                ';">' +
                active.score +
                '%</div>' +
                '</div>' +
                '<p class="sckm-know-why"><b>Ökologisches Know-why:</b> ' +
                active.species.knowWhySummary +
                '</p>' +
                koBanner +
                '<div class="sckm-rules-list">' +
                rulesHtml +
                '</div>' +
                '<div class="sckm-lookalike-box">' +
                '<b>☠️ Verwechslungsgefahr (Desirable Friction): ' +
                active.species.lookalikeWarning.name +
                '</b>' +
                '<p>' +
                active.species.lookalikeWarning.merkmale +
                '</p>' +
                '</div>' +
                '</div>' +
                '<div style="display:flex;gap:8px;margin-top:10px;">' +
                '<button type="button" class="sckm-graph-btn" onclick="window.toggleKnowledgeGraphDock(true)">🕸️ Im Knowledge Graph visualisieren</button>' +
                '<button type="button" class="sckm-next-btn" style="margin-top:0;flex:1;" onclick="window.setzeWissenstreppeStufe(4)">Stufe 4: Handeln →</button>' +
                '</div>' +
                '</div>';
        }

        // --- STUFE 4: HANDELN & KOMPETENZ ---
        else if (state.aktiveStufe === 4) {
            const checklistItems = [
                {
                    id: 'chk_recht',
                    label: 'Sammelrecht geprüft: Kein Naturschutzgebiet / Bannwald & max. 1 kg für den Eigenbedarf.'
                },
                {
                    id: 'chk_merkmal',
                    label:
                        'Hutunterseite geprüft: ' +
                        active.species.deutscherName +
                        ' (' +
                        active.species.gruppe +
                        ') gegen ' +
                        active.species.lookalikeWarning.name +
                        ' abgegrenzt.'
                },
                {
                    id: 'chk_korb',
                    label: 'Ganzen Pilz inkl. Stielbasis vorsichtig herausgedreht (für sichere Bestimmung bei der Pilzberatung).'
                }
            ];

            const chkHtml = checklistItems
                .map(function (c) {
                    const checked = !!state.completedChecklist[c.id];
                    return (
                        '<label class="sckm-chk-item ' +
                        (checked ? 'erledigt' : '') +
                        '">' +
                        '<input type="checkbox" ' +
                        (checked ? 'checked' : '') +
                        ' onchange="window.toggleSckmChecklist(\'' +
                        c.id +
                        '\')" />' +
                        '<span>' +
                        c.label +
                        '</span>' +
                        '</label>'
                    );
                })
                .join('');

            const actionDecisionHtml = ctx.sammelVerbot
                ? '<div class="sckm-ko-banner">🚫 <b>Handlungs-Stopp (Schutzgebiet):</b> Du befindest dich in <b>' +
                  ctx.verboteneZonen
                      .map(function (z) {
                          return z.art + ' ' + z.name;
                      })
                      .join(', ') +
                  '</b>. Hier ist das Sammeln gesetzlich verboten. Nutze diesen Standort nur zur Fotodokumentation!</div>'
                : active.score >= 60
                ? '<div class="sckm-ok-banner">✅ <b>Hohe Erfolgschance (' +
                  active.score +
                  '% für ' +
                  active.species.deutscherName +
                  '):</b> Das ökologische Profil und das Sammelrecht passen – dieser Standort lohnt sich für eine Exkursion!</div>'
                : '<div class="sckm-warn-banner">⚠️ <b>Geringe Erfolgschance (' +
                  active.score +
                  '% für ' +
                  active.species.deutscherName +
                  '):</b> Prüfe in Stufe 3 eine besser passende Pilzart (Top-Empfehlung hier: <b>' +
                  evalRes.topResult.species.deutscherName +
                  ' mit ' +
                  evalRes.topResult.score +
                  '%</b>) oder wähle ein anderes Waldgebiet.</div>';

            stufenInhaltHtml =
                '<div class="sckm-card">' +
                '<div class="sckm-badge-row"><span class="sckm-pill">Wissenstreppe Stufe 4</span><span class="sckm-pill-muted">Know-how (Kompetentes Handeln)</span></div>' +
                '<h4>🧭 Vom Wissen zur verantwortungsvollen Handlung</h4>' +
                actionDecisionHtml +
                '<div class="sckm-chk-box">' +
                '<b>🛡️ Einsteiger-Sicherheitscheck (Metacognitive Scaffolding):</b>' +
                chkHtml +
                '</div>' +
                '<div class="sckm-action-btns">' +
                '<button type="button" class="sckm-act-primary" onclick="window.sckmStarteRouteZuStandort(' +
                ctx.lat +
                ',' +
                ctx.lng +
                ')">🚀 Route zu diesem Standort planen</button>' +
                '<button type="button" class="sckm-act-secondary" onclick="window.sckmEintragenFundAmStandort(' +
                ctx.lat +
                ',' +
                ctx.lng +
                ')">🍄 Pilzfund hier dokumentieren</button>' +
                '</div>' +
                '</div>';
        }

        container.innerHTML =
            '<div class="sckm-standort-bar">' +
            '<div class="sckm-st-title">📍 <b>' +
            ctx.ortsName +
            '</b> <small>(' +
            ctx.lat.toFixed(4) +
            '°N, ' +
            ctx.lng.toFixed(4) +
            '°E)</small></div>' +
            '<div class="sckm-st-hint">Tipp: Klicke auf einen beliebigen Punkt auf der Karte oder wähle ein BW-Referenzhabitat:</div>' +
            '<div class="sckm-chip-wrap">' +
            demoButtonsHtml +
            '</div>' +
            '</div>' +
            '<div class="sckm-steps-nav" role="tablist">' +
            stufenTabsHtml +
            '</div>' +
            '<div class="sckm-step-explain">' +
            '<b>' +
            stufeObj.titel +
            ' – ' +
            stufeObj.wissensart +
            ':</b> ' +
            stufeObj.beschreibung +
            '</div>' +
            stufenInhaltHtml;
    }

    // 7. Rendern des interaktiven Knowledge-Graph-Docks
    function renderKnowledgeGraphDock() {
        const container = document.getElementById('knowledge-graph-dock-inhalt');
        if (!container) return;

        const graphMod = root.SCKM_GRAPH;
        const evalRes = getEvaluation();
        if (!graphMod || !evalRes) return;

        const graphData = graphMod.buildKnowledgeGraph(evalRes, state.focusedGraphNodeId);
        const svgHtml = graphMod.renderKnowledgeGraphSvg(graphData);

        const focusedNode =
            graphData.nodes.find(function (n) {
                return n.id === graphData.focusId;
            }) || graphData.nodes[0];

        // Erzeuge RDF-Tripel-Text für den angeklickten Knoten
        const nodeMap = {};
        graphData.nodes.forEach(function (n) {
            nodeMap[n.id] = n;
        });

        const triplesHtml = graphData.activeEdges
            .slice(0, 6)
            .map(function (e) {
                const s = nodeMap[e.sourceId];
                const o = nodeMap[e.targetId];
                const bothOk = s && o && s.isPresentAtLocation && o.isPresentAtLocation;
                return (
                    '<span class="sckm-triple-chip ' +
                    (bothOk ? 'erfuellt' : '') +
                    '">' +
                    '<b>' +
                    (s ? s.label : e.sourceId) +
                    '</b> <i>' +
                    e.predicateLabel +
                    '</i> <b>' +
                    (o ? o.label : e.targetId) +
                    '</b>' +
                    '</span>'
                );
            })
            .join('');

        const layerBtnLabels = {
            ph: '🧪 ISRIC pH-Layer auf Karte einblenden',
            bwi: '🌿 BWI-Bodenvegetations-Layer einblenden',
            waldrefugien: '🌲 ForstBW Waldrefugien-Layer einblenden',
            fundstellen: '🍄 Pilzfunde-Layer einblenden'
        };

        const layerBtnHtml =
            focusedNode && focusedNode.layerHint && layerBtnLabels[focusedNode.layerHint]
                ? '<button type="button" class="sckm-layer-link-btn" onclick="window.aktiviereKartenLayerAusGraph(\'' +
                  focusedNode.layerHint +
                  '\')">' +
                  layerBtnLabels[focusedNode.layerHint] +
                  '</button>'
                : '';

        container.innerHTML =
            '<div class="sckm-kg-topbar">' +
            '<div class="sckm-kg-meta">' +
            '<span class="sckm-kg-dot-legend">● Grün = Vorhanden am Standort (<b>' +
            evalRes.context.ortsName +
            '</b>)</span>' +
            '<span class="sckm-kg-focus-badge">Fokus-Knoten: <b>' +
            (focusedNode ? focusedNode.label : '') +
            '</b> <small>(' +
            (focusedNode ? focusedNode.ontologieTyp : '') +
            ')</small></span>' +
            layerBtnHtml +
            '</div>' +
            '<div class="sckm-triples-bar">' +
            '<small>Semantische RDF-Tripel:</small> ' +
            triplesHtml +
            '</div>' +
            '</div>' +
            '<div class="sckm-kg-canvas-wrap">' +
            svgHtml +
            '</div>';
    }

    // 8. Brücke zu den bestehenden Pilz-Hub-BW-Aktionen (Route & Fund)
    root.sckmStarteRouteZuStandort = function (lat, lng) {
        state.panelOffen = false;
        syncPanelVisibility();
        if (typeof root.setzeStart === 'function') {
            root.setzeStart(lat, lng);
        }
    };

    root.sckmEintragenFundAmStandort = function (lat, lng) {
        state.panelOffen = false;
        syncPanelVisibility();
        if (typeof root.oeffneNeuenFund === 'function') {
            root.oeffneNeuenFund(lat, lng);
        }
    };

    // Initialisierung nach DOM-Load
    function initSckmUI() {
        loadLocalState();
        renderWissenstreppePanel();
        renderKnowledgeGraphDock();
    }

    if (typeof document !== 'undefined') {
        if (document.readyState === 'loading') {
            document.addEventListener('DOMContentLoaded', initSckmUI);
        } else {
            initSckmUI();
        }
    }
})(typeof window !== 'undefined' ? window : globalThis);
