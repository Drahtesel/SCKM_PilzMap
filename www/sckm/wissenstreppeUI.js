// ============================================================================
// SCKM UI-Controller: Vereinfachte Standort-Erklärung (🔍), Fachbegriff-Popover,
// Pilz-Heatmap-Leiste (🔥) & Kombiniertes Lexikon / Knowledge-Graph-Dock (📖)
// (www/sckm/wissenstreppeUI.js)
// ============================================================================

(function (root) {
    'use strict';

    const STORAGE_KEY = 'sckm_pilzmap_state_v2';

    const state = {
        panelOffen: false,
        dockOffen: false,
        dockTab: 'graph', // 'graph' | 'lexikon'
        selectedSpeciesId: 'boletus-edulis',
        focusedGraphNodeId: 'mushroom:boletus-edulis',
        currentStandort: null,
        userTrees: [],
        userIndicators: [],
        showWissenstreppeDetails: false
    };

    function loadLocalState() {
        try {
            const raw = localStorage.getItem(STORAGE_KEY);
            if (!raw) return;
            const parsed = JSON.parse(raw);
            if (parsed && parsed.selectedSpeciesId) {
                state.selectedSpeciesId = parsed.selectedSpeciesId;
                state.focusedGraphNodeId = 'mushroom:' + parsed.selectedSpeciesId;
            }
        } catch (_) {}
    }

    function saveLocalState() {
        try {
            localStorage.setItem(
                STORAGE_KEY,
                JSON.stringify({ selectedSpeciesId: state.selectedSpeciesId })
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

    // ========================================================================
    // 1. KLICKBARES FACHBEGRIFF-POPOVER (Progressive Disclosure)
    // ========================================================================
    root.zeigeSckmBegriff = function (termId) {
        const ont = root.SCKM_ONTOLOGY;
        if (!ont || !ont.GLOSSARY_TERMS || !ont.GLOSSARY_TERMS[termId]) return;
        const term = ont.GLOSSARY_TERMS[termId];

        let pop = document.getElementById('sckm-term-popover');
        if (!pop) {
            pop = document.createElement('div');
            pop.id = 'sckm-term-popover';
            pop.setAttribute('role', 'dialog');
            pop.setAttribute('aria-label', 'Fachbegriff-Erklärung');
            document.body.appendChild(pop);
        }

        pop.innerHTML =
            '<div class="sckm-pop-card">' +
            '<div class="sckm-pop-head">' +
            '<div><span class="sckm-pop-cat">' +
            term.category +
            '</span><h4>💡 ' +
            term.title +
            '</h4></div>' +
            '<button type="button" onclick="window.schliesseSckmBegriff()" title="Schließen">✕</button>' +
            '</div>' +
            '<p class="sckm-pop-def">' +
            term.shortDef +
            '</p>' +
            '<div class="sckm-pop-tip">🌲 <b>' +
            term.forestTip +
            '</b></div>' +
            '</div>';
        pop.classList.add('offen');
    };

    root.schliesseSckmBegriff = function () {
        const pop = document.getElementById('sckm-term-popover');
        if (pop) pop.classList.remove('offen');
    };

    // ========================================================================
    // 2. KOMPAKTE VORSCHAU IM KARTEN-KLICK-POPUP (Ohne Redundanz!)
    // ========================================================================
    root.baueSckmPopupBlock = function (standortDaten) {
        const eng = root.SCKM_ENGINE;
        if (!eng) return '';
        const evalRes = eng.evaluateLocationKnowledge(standortDaten, state.selectedSpeciesId);
        const top = evalRes.topResult;
        const ctx = evalRes.context;

        const top3Html = evalRes.rankings
            .slice(0, 3)
            .map(function (r) {
                return (
                    '<span style="display:inline-flex;align-items:center;gap:3px;background:#fff;border:1px solid #dceee3;border-radius:999px;padding:2px 7px;font-size:0.75em;">' +
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
            ';border-radius:10px;padding:9px 10px;margin-bottom:10px;text-align:left;">' +
            '<div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:4px;">' +
            '<span style="font-size:0.78em;font-weight:700;color:#1a7a45;">🍄 Beste Pilz-Chance hier</span>' +
            '<span style="background:' +
            top.ampelfarbe +
            ';color:#fff;font-weight:700;font-size:0.78em;padding:1px 8px;border-radius:999px;">' +
            top.score +
            '%</span>' +
            '</div>' +
            '<div style="font-size:0.88em;font-weight:700;color:#1e293b;margin-bottom:5px;">' +
            top.species.deutscherName +
            ' <span style="font-weight:400;font-size:0.86em;color:#475569;">(' +
            top.einstufung +
            ')</span></div>' +
            '<div style="display:flex;flex-wrap:wrap;gap:4px;margin-bottom:7px;">' +
            top3Html +
            '</div>' +
            '<div style="display:flex;gap:5px;">' +
            '<button type="button" onclick="window.oeffneWissenstreppePanel()" style="flex:1;padding:7px 8px;background:#1a7a45;color:#fff;border:none;border-radius:7px;font-size:0.8em;font-weight:700;cursor:pointer;">🔍 Warum ' +
            top.score +
            '%? (Erklärung)</button>' +
            '<button type="button" onclick="window.oeffneLexikonDock(\'graph\')" style="padding:7px 9px;background:#0f172a;color:#fff;border:none;border-radius:7px;font-size:0.8em;font-weight:700;cursor:pointer;" title="Im Wissensgraphen ansehen">🕸️</button>' +
            '</div>' +
            '</div>'
        );
    };

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
        renderLexikonDock();
    };

    // ========================================================================
    // 3. LUPEN-PANEL (🔍 STANDORT-ERKLÄRUNG OHNE REDUNDANZ)
    // ========================================================================
    root.toggleWissenstreppePanel = function () {
        state.panelOffen = !state.panelOffen;
        syncPanelVisibility();
        if (state.panelOffen) renderWissenstreppePanel();
    };

    root.oeffneWissenstreppePanel = function () {
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

    root.waehleSckmPilzart = function (speciesId) {
        state.selectedSpeciesId = speciesId;
        state.focusedGraphNodeId = 'mushroom:' + speciesId;
        saveLocalState();
        renderWissenstreppePanel();
        renderLexikonDock();
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
        renderLexikonDock();
    };

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
        renderLexikonDock();
    };

    root.toggleWissenstreppeDetails = function () {
        state.showWissenstreppeDetails = !state.showWissenstreppeDetails;
        renderWissenstreppePanel();
    };

    function renderWissenstreppePanel() {
        const container = document.getElementById('wissenstreppe-panel-inhalt');
        if (!container) return;

        const ont = root.SCKM_ONTOLOGY;
        const evalRes = getEvaluation();
        if (!ont || !evalRes) return;

        const hl = ont.highlightGlossaryTerms;
        const ctx = evalRes.context;
        const active = evalRes.activeResult;
        const capSvg =
            (ont.CAP_UNDERSIDE_SVGS && ont.CAP_UNDERSIDE_SVGS[active.species.capType || 'roehren']) ||
            '';

        // 1. Schnellwahl Beispiel-Orte
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

        // 2. Pilz-Auswahl-Karten (mit %-Score)
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

        // 3. Die 4 kombinierten Standort-Faktoren (Messwert + Erklärung in EINER Box statt redundant über 3 Tabs!)
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
                    hl(rule.faktor) +
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
                    hl(rule.erklaerung) +
                    '</div>' +
                    '</div>'
                );
            })
            .join('');

        // 4. Vor-Ort-Baum-Chips (Human-in-the-Loop)
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

        const koBanner = active.koReason
            ? '<div class="sckm-ko-banner">⚠️ <b>' + hl(active.koReason) + '</b></div>'
            : '';

        const rechtBanner = ctx.sammelVerbot
            ? '<div class="sckm-ko-banner">🚫 <b>Sammelverbot an diesem Ort:</b> Du bist in <b>' +
              hl(
                  ctx.verboteneZonen
                      .map(function (z) {
                          return z.art + ' ' + z.name;
                      })
                      .join(', ')
              ) +
              '</b>. Hier nur beobachten & fotografieren!</div>'
            : '<div class="sckm-ok-banner">✅ <b>Sammeln erlaubt:</b> Kein strenges Schutzgebiet – ' +
              hl('Handstraußregel') +
              ' (max. 1 kg für den Eigenbedarf) gilt.</div>';

        // 5. Optional aufklappbare Wissenstreppe (Stufe 1-4 Übersicht & Rohdaten für SCKM-Modul)
        const wissenstreppeDetailsHtml = state.showWissenstreppeDetails
            ? '<div class="sckm-wt-details">' +
              '<div class="sckm-wt-steps-list">' +
              '<div class="sckm-wt-row"><b>1. Daten (Sensorik):</b> <code>' +
              ctx.lat.toFixed(4) +
              '°N, ' +
              ctx.lng.toFixed(4) +
              '°E</code> · ISRIC <code>pH×10=' +
              Math.round(ctx.phInfo.phNum * 10) +
              '</code> · BWI <code>sbv=[' +
              ctx.bwiSbv.join(',') +
              ']</code> · Regen <code>' +
              ctx.regen7TageMm.toFixed(1) +
              'mm</code></div>' +
              '<div class="sckm-wt-row"><b>2. Information (Kontext):</b> Boden ist <b>' +
              ctx.phInfo.categoryLabel +
              '</b> (' +
              ctx.phInfo.phQuelle +
              ') · Bestand: <b>' +
              ctx.trees.join(', ') +
              '</b></div>' +
              '<div class="sckm-wt-row"><b>3. Wissen (Know-why):</b> Regel-Abgleich in der ' +
              hl('Ontologie') +
              ' ergibt <b>' +
              active.score +
              '%</b> für <b>' +
              active.species.deutscherName +
              '</b></div>' +
              '<div class="sckm-wt-row"><b>4. Handeln (Know-how):</b> ' +
              (ctx.sammelVerbot ? 'Nur Fotodokumentation (Schutzgebiet)' : 'Exkursion & Merkmale vor Ort prüfen') +
              '</div>' +
              '</div>' +
              '</div>'
            : '';

        container.innerHTML =
            // Block 0: Standort-Kopf & Beispiel-Orte
            '<div class="sckm-standort-bar">' +
            '<div class="sckm-st-title">📍 <b>' +
            ctx.ortsName +
            '</b> <small>(' +
            ctx.lat.toFixed(3) +
            '°N, ' +
            ctx.lng.toFixed(3) +
            '°E)</small></div>' +
            '<div class="sckm-st-hint">Klicke auf die Karte oder teste einen typischen Wald in BW:</div>' +
            '<div class="sckm-chip-wrap">' +
            demoButtonsHtml +
            '</div>' +
            '</div>' +
            // Hinweis auf klickbare Fachbegriffe
            '<div class="sckm-tip-strip">💡 <span>Grün markierte Begriffe (z. B. ' +
            hl('Mykorrhiza') +
            ', ' +
            hl('pH-Wert') +
            ', ' +
            hl('Zeigerpflanze') +
            ') kannst du anklicken!</span></div>' +
            // Block 1: Pilz-Auswahl
            '<div class="sckm-card">' +
            '<h4>1️⃣ Welchen Pilz möchtest du hier prüfen?</h4>' +
            '<div class="sckm-species-grid">' +
            rankingPills +
            '</div>' +
            '</div>' +
            // Block 2: Warum X%? (Kombinierte Glass-Box Erklärung ohne Redundanz)
            '<div class="sckm-card sckm-glassbox-card" style="border-top:4px solid ' +
            active.ampelfarbe +
            ';">' +
            '<div class="sckm-gb-header">' +
            '<div style="display:flex;gap:9px;align-items:center;">' +
            '<div class="sckm-cap-icon" title="Hutunterseite">' +
            capSvg +
            '</div>' +
            '<div>' +
            '<h5>🍄 ' +
            active.species.deutscherName +
            '</h5>' +
            '<div class="sckm-gb-group">' +
            hl(active.species.gruppe) +
            ' · 📅 ' +
            (active.species.saisonText || 'Sommer–Herbst') +
            '</div>' +
            '</div>' +
            '</div>' +
            '<div class="sckm-gb-total" style="background:' +
            active.ampelfarbe +
            ';">' +
            active.score +
            '%</div>' +
            '</div>' +
            '<p class="sckm-know-why"><b>Kurz erklärt:</b> ' +
            hl(active.species.knowWhySummary) +
            '</p>' +
            koBanner +
            '<h4>2️⃣ Warum ' +
            active.score +
            '% an diesem Ort? (Die 4 Faktoren)</h4>' +
            '<div class="sckm-rules-list">' +
            rulesHtml +
            '</div>' +
            // Interaktive Baum-Anpassung vor Ort
            '<div class="sckm-hitl-box">' +
            '<b>🌲 Welche Bäume siehst du vor Ort? (Klick passt die % sofort an):</b>' +
            '<div class="sckm-chip-wrap" style="margin-top:6px;">' +
            treeChips +
            '</div>' +
            '</div>' +
            '</div>' +
            // Block 3: Sicher sammeln & Handeln
            '<div class="sckm-card">' +
            '<h4>3️⃣ Sicher sammeln & Nächster Schritt</h4>' +
            rechtBanner +
            '<div class="sckm-lookalike-box">' +
            '<b>⚠️ Verwechslungs-Tipp (' +
            active.species.lookalikeWarning.name +
            '):</b>' +
            '<p>' +
            hl(active.species.lookalikeWarning.merkmale) +
            '</p>' +
            '</div>' +
            '<div style="display:flex;gap:7px;margin-top:4px;">' +
            '<button type="button" class="sckm-act-primary" style="flex:1;" onclick="window.sckmStarteRouteZuStandort(' +
            ctx.lat +
            ',' +
            ctx.lng +
            ')">🚀 Route hierhin</button>' +
            '<button type="button" class="sckm-graph-btn" style="flex:1;" onclick="window.oeffneLexikonDock(\'graph\')">🕸️ Im Wissensgraph zeigen</button>' +
            '</div>' +
            // Aufklapp-Button für die 4 Stufen der Wissenstreppe (SCKM-Theorie)
            '<button type="button" class="sckm-wt-toggle" onclick="window.toggleWissenstreppeDetails()">' +
            (state.showWissenstreppeDetails
                ? '▲ SCKM-Wissenstreppe (Stufe 1–4) & Rohdaten ausblenden'
                : '▼ SCKM-Wissenstreppe (Stufe 1–4) & Rohdaten einblenden') +
            '</button>' +
            wissenstreppeDetailsHtml +
            '</div>';
    }

    // ========================================================================
    // 4. DIREKT-MENÜ: PILZ-LEXIKON & WISSENSGRAPH (📖)
    // ========================================================================
    root.toggleKnowledgeGraphDock = function (forceOpen) {
        state.dockOffen = typeof forceOpen === 'boolean' ? forceOpen : !state.dockOffen;
        syncDockVisibility();
        if (state.dockOffen) renderLexikonDock();
    };

    root.oeffneLexikonDock = function (tabName) {
        if (tabName) state.dockTab = tabName;
        state.dockOffen = true;
        syncDockVisibility();
        renderLexikonDock();
    };

    root.setzeLexikonDockTab = function (tabName) {
        state.dockTab = tabName;
        renderLexikonDock();
    };

    function syncDockVisibility() {
        const dock = document.getElementById('knowledge-graph-dock');
        const btn = document.getElementById('lexikon-btn');
        if (dock) dock.classList.toggle('offen', state.dockOffen);
        if (btn) btn.classList.toggle('aktiv', state.dockOffen);
    }

    root.klickSckmGraphKnoten = function (nodeId) {
        state.focusedGraphNodeId = nodeId;
        if (nodeId.indexOf('mushroom:') === 0) {
            state.selectedSpeciesId = nodeId.replace('mushroom:', '');
            saveLocalState();
        }
        renderLexikonDock();
        if (state.panelOffen) renderWissenstreppePanel();
    };

    root.aktiviereKartenLayerAusGraph = function (layerId) {
        if (layerId === 'heatmap' && typeof root.toggleSckmHeatmap === 'function') {
            root.toggleSckmHeatmap(true);
            return;
        }
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

    function renderLexikonDock() {
        const container = document.getElementById('knowledge-graph-dock-inhalt');
        if (!container) return;

        const ont = root.SCKM_ONTOLOGY;
        const graphMod = root.SCKM_GRAPH;
        const evalRes = getEvaluation();
        if (!ont || !graphMod || !evalRes) return;

        const hl = ont.highlightGlossaryTerms;

        // Tab-Umschalter im Dock-Header aktualisieren
        const tabGraphBtn = document.getElementById('sckm-dock-tab-graph');
        const tabLexBtn = document.getElementById('sckm-dock-tab-lexikon');
        if (tabGraphBtn) tabGraphBtn.classList.toggle('aktiv', state.dockTab === 'graph');
        if (tabLexBtn) tabLexBtn.classList.toggle('aktiv', state.dockTab === 'lexikon');

        // --- TAB A: VISUELLER WISSENSGRAPH ---
        if (state.dockTab === 'graph') {
            const graphData = graphMod.buildKnowledgeGraph(evalRes, state.focusedGraphNodeId);
            const svgHtml = graphMod.renderKnowledgeGraphSvg(graphData);

            const focusedNode =
                graphData.nodes.find(function (n) {
                    return n.id === graphData.focusId;
                }) || graphData.nodes[0];

            const nodeMap = {};
            graphData.nodes.forEach(function (n) {
                nodeMap[n.id] = n;
            });

            const connectionsHtml = graphData.activeEdges
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
                        '</b> ' +
                        e.predicateLabel +
                        ' <b>' +
                        (o ? o.label : e.targetId) +
                        '</b>' +
                        '</span>'
                    );
                })
                .join('');

            const layerBtnLabels = {
                heatmap: '🔥 Pilz-Heatmap auf Karte einschalten',
                ph: '🧪 Boden-pH-Karte einblenden',
                bwi: '🌿 Zeigerpflanzen-Karte einblenden',
                waldrefugien: '🌲 Baumarten-Karte (ForstBW) einblenden'
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
                '<span class="sckm-kg-dot-legend">● Grün = Vorhanden am Ort (<b>' +
                evalRes.context.ortsName.split(' (')[0] +
                '</b>)</span>' +
                '<span class="sckm-kg-focus-badge">Ausgewählt: <b>' +
                (focusedNode ? focusedNode.label : '') +
                '</b> (' +
                (focusedNode ? focusedNode.categoryLabel : '') +
                ')</span>' +
                layerBtnHtml +
                '</div>' +
                (focusedNode && focusedNode.explanation
                    ? '<div class="sckm-kg-node-explain">💡 <b>' +
                      focusedNode.label +
                      ':</b> ' +
                      hl(focusedNode.explanation) +
                      '</div>'
                    : '') +
                '<div class="sckm-triples-bar">' +
                '<small>Verbindungen:</small> ' +
                connectionsHtml +
                '</div>' +
                '</div>' +
                '<div class="sckm-kg-canvas-wrap">' +
                svgHtml +
                '</div>';
            return;
        }

        // --- TAB B: EINSTEIGER-LEXIKON (PILZ-STECKBRIEFE & FACHBEGRIFFE) ---
        const speciesCardsHtml = ont.MUSHROOM_SPECIES.map(function (sp) {
            const svg =
                (ont.CAP_UNDERSIDE_SVGS && ont.CAP_UNDERSIDE_SVGS[sp.capType || 'roehren']) || '';
            return (
                '<div class="sckm-lex-card">' +
                '<div class="sckm-lex-card-top">' +
                '<div class="sckm-cap-icon">' +
                svg +
                '</div>' +
                '<div style="flex:1;">' +
                '<b>🍄 ' +
                sp.deutscherName +
                '</b> <small>(' +
                sp.wissenschaftlicherName +
                ')</small>' +
                '<div class="sckm-lex-sub">' +
                hl(sp.gruppe) +
                ' · 📅 ' +
                sp.saisonText +
                '</div>' +
                '</div>' +
                '<button type="button" class="sckm-lex-graph-jump" onclick="window.klickSckmGraphKnoten(\'mushroom:' +
                sp.id +
                '\');window.setzeLexikonDockTab(\'graph\')">🕸️ Im Graph</button>' +
                '</div>' +
                '<p class="sckm-lex-text">' +
                hl(sp.kurzsteckbrief) +
                '</p>' +
                '<div class="sckm-lex-meta">' +
                '<span>🌲 <b>Bäume:</b> ' +
                sp.requiredTrees.join(', ') +
                '</span>' +
                '<span>🧪 <b>Boden:</b> pH ' +
                sp.optimalPhMin.toFixed(1).replace('.', ',') +
                '–' +
                sp.optimalPhMax.toFixed(1).replace('.', ',') +
                '</span>' +
                '<span>🌿 <b>Zeiger:</b> ' +
                sp.indicatorPlants.join(', ') +
                '</span>' +
                '</div>' +
                '</div>'
            );
        }).join('');

        const glossaryPillsHtml = Object.keys(ont.GLOSSARY_TERMS)
            .map(function (k) {
                const t = ont.GLOSSARY_TERMS[k];
                return (
                    '<button type="button" class="sckm-lex-term-btn" onclick="window.zeigeSckmBegriff(\'' +
                    t.id +
                    '\')">💡 ' +
                    t.title +
                    '</button>'
                );
            })
            .join('');

        container.innerHTML =
            '<div class="sckm-lex-section">' +
            '<div class="sckm-lex-glossary-bar">' +
            '<b>📚 Wichtige Einsteiger-Begriffe (klicken für Erklärung):</b>' +
            '<div class="sckm-chip-wrap" style="margin-top:5px;">' +
            glossaryPillsHtml +
            '</div>' +
            '</div>' +
            '<div class="sckm-lex-grid">' +
            speciesCardsHtml +
            '</div>' +
            '</div>';
    }

    // 5. Brücke zu Route & Fund
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

    function initSckmUI() {
        loadLocalState();
        renderWissenstreppePanel();
        renderLexikonDock();
    }

    if (typeof document !== 'undefined') {
        if (document.readyState === 'loading') {
            document.addEventListener('DOMContentLoaded', initSckmUI);
        } else {
            initSckmUI();
        }
    }
})(typeof window !== 'undefined' ? window : globalThis);
