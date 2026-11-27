// ============================================================================
// SCKM UI-Controller: Vereinfachte Standort-Erklärung (🔍),
// Graph -> Karte Regionen-Hervorhebung ("Regionen leuchten auf") &
// Schematisch illustriertes Einsteiger-Lexikon (📖) mit Direkt-Verknüpfung
// (www/sckm/wissenstreppeUI.js)
// ============================================================================

(function (root) {
    'use strict';

    const STORAGE_KEY = 'sckm_pilzmap_state_v2';

    const state = {
        panelOffen: false,
        dockOffen: false,
        dockTab: 'graph', // 'graph' | 'lexikon'
        lexikonFilter: 'all', // 'all' | 'mushroom' | 'tree' | 'plant' | 'term'
        highlightedLexikonId: null, // z.B. 'term:mykorrhiza', 'tree:Fichte', 'plant:Heidelbeere', 'mushroom:boletus-edulis'
        selectedSpeciesId: 'boletus-edulis',
        focusedGraphNodeId: 'mushroom:boletus-edulis',
        activeMapHighlightNodeId: null,
        activeMapHighlightSummary: null,
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
    // 1. VEREINHEITLICHTE LEXIKON-VERKNÜPFUNG (Klick auf .sckm-term öffnet Lexikon)
    // ========================================================================
    function normalizeLexikonEntryId(rawId) {
        if (!rawId) return 'term:mykorrhiza';
        const str = String(rawId);
        if (
            str.indexOf('term:') === 0 ||
            str.indexOf('tree:') === 0 ||
            str.indexOf('plant:') === 0 ||
            str.indexOf('mushroom:') === 0
        ) {
            return str;
        }
        const ont = root.SCKM_ONTOLOGY;
        if (ont) {
            if (ont.GLOSSARY_TERMS && ont.GLOSSARY_TERMS[str]) return 'term:' + str;
            if (
                ont.TREE_NODES &&
                ont.TREE_NODES.some(function (t) {
                    return t.id === str;
                })
            ) {
                return 'tree:' + str;
            }
            if (
                ont.INDICATOR_NODES &&
                ont.INDICATOR_NODES.some(function (p) {
                    return p.id === str;
                })
            ) {
                return 'plant:' + str;
            }
            if (
                ont.MUSHROOM_SPECIES &&
                ont.MUSHROOM_SPECIES.some(function (m) {
                    return m.id === str;
                })
            ) {
                return 'mushroom:' + str;
            }
        }
        return 'term:' + str;
    }

    root.oeffneLexikonEintrag = function (entryId) {
        const normId = normalizeLexikonEntryId(entryId);
        const catPrefix = normId.split(':')[0]; // 'term' | 'tree' | 'plant' | 'mushroom'

        state.dockOffen = true;
        state.dockTab = 'lexikon';
        // Wenn aktueller Filter nicht passt, auf 'all' schalten, damit die Karte garantiert sichtbar ist
        if (state.lexikonFilter !== 'all' && state.lexikonFilter !== catPrefix) {
            state.lexikonFilter = 'all';
        }
        state.highlightedLexikonId = normId;
        syncDockVisibility();
        renderLexikonDock();

        setTimeout(function () {
            const cardEl = document.getElementById('sckm-lex-' + normId.replace(':', '-'));
            if (cardEl && typeof cardEl.scrollIntoView === 'function') {
                cardEl.scrollIntoView({ behavior: 'smooth', block: 'center' });
            }
        }, 40);
    };

    // Rückwärtskompatibler Alias: öffnet jetzt ebenfalls direkt das integrierte Einsteiger-Lexikon
    root.zeigeSckmBegriff = function (termId) {
        root.oeffneLexikonEintrag('term:' + termId);
    };

    root.schliesseSckmBegriff = function () {
        const pop = document.getElementById('sckm-term-popover');
        if (pop) pop.classList.remove('offen');
    };

    root.setzeLexikonFilter = function (filterName) {
        state.lexikonFilter = filterName || 'all';
        renderLexikonDock();
    };

    // ========================================================================
    // 2. INTERAKTION WISSENSGRAPH -> KARTE ("Regionen leuchten auf")
    // ========================================================================
    function matchBwiCellForPh(props, phCatId) {
        const score =
            (props.sbv01 || 0) + (props.sbv02 || 0) + (props.sbv03 || 0) + (props.sbv04 || 0);
        if (phCatId === 'stark_sauer') return score >= 7;
        if (phCatId === 'maessig_sauer') return score >= 5 && score <= 6;
        if (phCatId === 'neutral') return score >= 3 && score <= 4;
        if (phCatId === 'kalkhaltig') return score <= 2;
        return false;
    }

    function matchBwiCellForPlant(props, plantId) {
        const score =
            (props.sbv01 || 0) + (props.sbv02 || 0) + (props.sbv03 || 0) + (props.sbv04 || 0);
        if (plantId === 'Drahtschmiele') return (props.sbv01 || 0) >= 1;
        if (plantId === 'Heidelbeere') return (props.sbv02 || 0) >= 2;
        if (plantId === 'Preiselbeere') return (props.sbv03 || 0) >= 1;
        if (plantId === 'Heidekraut') return (props.sbv04 || 0) >= 2;
        if (plantId === 'Waldmeister') return score <= 2 && (props.sbv12 || 0) >= 2;
        if (plantId === 'Baerlauch') {
            return score <= 1 && (props.sbv12 || 0) >= 2 && (props.sbv13 || 0) >= 1;
        }
        return false;
    }

    function matchBwiCellForTree(props, treeId) {
        const score =
            (props.sbv01 || 0) + (props.sbv02 || 0) + (props.sbv03 || 0) + (props.sbv04 || 0);
        if (treeId === 'Fichte') return score >= 6 && (props.sbv02 || 0) >= 2;
        if (treeId === 'Tanne') return score >= 5 && score <= 8 && (props.sbv02 || 0) >= 1;
        if (treeId === 'Kiefer') return (props.sbv03 || 0) >= 1 && (props.sbv04 || 0) >= 1;
        if (treeId === 'Buche') return score >= 2 && score <= 5 && (props.sbv12 || 0) >= 2;
        if (treeId === 'Eiche') return score >= 2 && score <= 4 && (props.sbv13 || 0) >= 1;
        if (treeId === 'Birke') return (props.sbv04 || 0) >= 2 && (props.sbv01 || 0) >= 1;
        if (treeId === 'Esche') return score <= 2 && (props.sbv13 || 0) >= 2;
        return false;
    }

    function matchBwiCellForMushroom(props, species) {
        if (!species) return false;
        const phOk = (species.requiredPhCategories || []).some(function (catId) {
            return matchBwiCellForPh(props, catId);
        });
        if (!phOk) return false;
        const plantOk = (species.indicatorPlants || []).some(function (pId) {
            return matchBwiCellForPlant(props, pId);
        });
        const treeOk = (species.requiredTrees || []).some(function (tId) {
            return matchBwiCellForTree(props, tId);
        });
        return plantOk || treeOk;
    }

    function defaultBwiStyle(feature) {
        const p = (feature && feature.properties) || {};
        const score = (p.sbv01 || 0) + (p.sbv02 || 0) + (p.sbv03 || 0) + (p.sbv04 || 0);
        let farbe;
        if (score >= 8) farbe = '#d7191c';
        else if (score >= 6) farbe = '#fdae61';
        else if (score >= 4) farbe = '#ffffbf';
        else if (score >= 2) farbe = '#a6d96a';
        else farbe = '#1a9641';
        return { fillColor: farbe, color: '#555', weight: 0.4, fillOpacity: 0.65 };
    }

    function defaultWaldStyle(feature) {
        const p = (feature && feature.properties) || {};
        const baumFn = root._waldBaumart || function () { return 'Andere'; };
        const farbeFn = root.getBaumartFarbe || function () { return '#2d6b1a'; };
        const art = baumFn(p.LWET_TEXT);
        const farbe = farbeFn(art);
        return { color: farbe, fillColor: farbe, weight: 1.2, fillOpacity: 0.45 };
    }

    root.hebeGraphKnotenAufKarteHervor = function (nodeId) {
        const ont = root.SCKM_ONTOLOGY;
        if (!ont || !nodeId || !root.map) return null;

        const parts = String(nodeId).split(':');
        const type = parts[0];
        const rawId = parts[1];

        let bwiMatches = 0;
        let waldMatches = 0;
        let highlightColor = '#16a34a';
        let labelText = rawId;

        if (type === 'ph') {
            const phNode = ont.PH_CATEGORIES.find(function (c) {
                return c.id === rawId;
            });
            highlightColor = (phNode && phNode.color) || '#e04040';
            labelText = phNode ? phNode.label : rawId;
        } else if (type === 'plant') {
            const plNode = ont.INDICATOR_NODES.find(function (p) {
                return p.id === rawId;
            });
            const plantColors = {
                Heidelbeere: '#1d4ed8',
                Preiselbeere: '#dc2626',
                Drahtschmiele: '#16a34a',
                Heidekraut: '#c026d3',
                Waldmeister: '#15803d',
                Baerlauch: '#0d9488'
            };
            highlightColor = plantColors[rawId] || '#16a34a';
            labelText = plNode ? plNode.label : rawId;
        } else if (type === 'tree') {
            const trNode = ont.TREE_NODES.find(function (t) {
                return t.id === rawId;
            });
            highlightColor = (root.getBaumartFarbe && root.getBaumartFarbe(rawId)) || '#15803d';
            labelText = trNode ? trNode.label : rawId;
        } else if (type === 'mushroom') {
            const spNode = ont.MUSHROOM_SPECIES.find(function (m) {
                return m.id === rawId;
            });
            highlightColor = '#16a34a';
            labelText = spNode ? spNode.deutscherName : rawId;
        }

        const spObj =
            type === 'mushroom'
                ? ont.MUSHROOM_SPECIES.find(function (m) {
                      return m.id === rawId;
                  })
                : null;

        // 1. BWI-2002 Rasterzellen (4.563 Zellen in ganz Baden-Württemberg) filtern & aufleuchten lassen
        if (root.phBodenLayer) {
            if (!root.map.hasLayer(root.phBodenLayer)) {
                root.map.addLayer(root.phBodenLayer);
            }
            const cbBwi = document.getElementById('cb-bwi');
            if (cbBwi) cbBwi.checked = true;

            root.phBodenLayer.eachLayer(function (geoJsonGroup) {
                if (typeof geoJsonGroup.eachLayer !== 'function') return;
                geoJsonGroup.eachLayer(function (cellLayer) {
                    const props = (cellLayer.feature && cellLayer.feature.properties) || {};
                    let isMatch = false;
                    if (type === 'ph') isMatch = matchBwiCellForPh(props, rawId);
                    else if (type === 'plant') isMatch = matchBwiCellForPlant(props, rawId);
                    else if (type === 'tree') isMatch = matchBwiCellForTree(props, rawId);
                    else if (type === 'mushroom') isMatch = matchBwiCellForMushroom(props, spObj);

                    if (isMatch) {
                        bwiMatches++;
                        cellLayer.setStyle({
                            fillColor: highlightColor,
                            color: '#ffffff',
                            weight: 0.9,
                            fillOpacity: type === 'tree' ? 0.62 : 0.78
                        });
                        if (typeof cellLayer.bringToFront === 'function') {
                            cellLayer.bringToFront();
                        }
                    } else {
                        cellLayer.setStyle({
                            fillColor: '#94a3b8',
                            color: 'transparent',
                            weight: 0,
                            fillOpacity: 0.04
                        });
                    }
                });
            });
        }

        // 2. ForstBW Waldrefugien-Polygone (4.905 Waldflächen) bei Baum- oder Pilzknoten hervorheben
        if (root.waldLayer) {
            if (type === 'tree' || type === 'mushroom') {
                if (!root.map.hasLayer(root.waldLayer)) {
                    root.map.addLayer(root.waldLayer);
                }
                const cbWald = document.getElementById('cb-waldrefugien');
                if (cbWald) cbWald.checked = true;

                const baumFn =
                    root._waldBaumart ||
                    function (txt) {
                        return txt || '';
                    };
                const targetTrees =
                    type === 'tree'
                        ? [rawId]
                        : spObj && spObj.requiredTrees
                        ? spObj.requiredTrees
                        : [];

                root.waldLayer.eachLayer(function (geoJsonGroup) {
                    if (typeof geoJsonGroup.eachLayer !== 'function') return;
                    geoJsonGroup.eachLayer(function (polyLayer) {
                        const props = (polyLayer.feature && polyLayer.feature.properties) || {};
                        const art = baumFn(props.LWET_TEXT);
                        const lwetLower = String(props.LWET_TEXT || '').toLowerCase();
                        const isTreeMatch = targetTrees.some(function (tId) {
                            return art === tId || lwetLower.indexOf(tId.toLowerCase()) !== -1;
                        });
                        if (isTreeMatch) {
                            waldMatches++;
                            polyLayer.setStyle({
                                fillColor: '#15803d',
                                color: '#facc15',
                                weight: 2.4,
                                fillOpacity: 0.88
                            });
                            if (typeof polyLayer.bringToFront === 'function') {
                                polyLayer.bringToFront();
                            }
                        } else {
                            polyLayer.setStyle({
                                fillColor: '#94a3b8',
                                color: 'transparent',
                                weight: 0,
                                fillOpacity: 0.03
                            });
                        }
                    });
                });
            }
        }

        state.activeMapHighlightNodeId = nodeId;
        state.activeMapHighlightSummary = {
            nodeId: nodeId,
            label: labelText,
            color: highlightColor,
            bwiMatches: bwiMatches,
            waldMatches: waldMatches
        };
        return state.activeMapHighlightSummary;
    };

    root.setzeKartenHervorhebungZurueck = function () {
        state.activeMapHighlightNodeId = null;
        state.activeMapHighlightSummary = null;

        if (root.phBodenLayer) {
            root.phBodenLayer.eachLayer(function (geoJsonGroup) {
                if (typeof geoJsonGroup.eachLayer !== 'function') return;
                geoJsonGroup.eachLayer(function (cellLayer) {
                    cellLayer.setStyle(defaultBwiStyle(cellLayer.feature));
                });
            });
            if (root.map && root.map.hasLayer(root.phBodenLayer)) {
                root.map.removeLayer(root.phBodenLayer);
            }
            const cbBwi = document.getElementById('cb-bwi');
            if (cbBwi) cbBwi.checked = false;
        }

        if (root.waldLayer) {
            root.waldLayer.eachLayer(function (geoJsonGroup) {
                if (typeof geoJsonGroup.eachLayer !== 'function') return;
                geoJsonGroup.eachLayer(function (polyLayer) {
                    polyLayer.setStyle(defaultWaldStyle(polyLayer.feature));
                });
            });
            if (root.map && root.map.hasLayer(root.waldLayer)) {
                root.map.removeLayer(root.waldLayer);
            }
            const cbWald = document.getElementById('cb-waldrefugien');
            if (cbWald) cbWald.checked = false;
        }

        renderLexikonDock();
    };

    // ========================================================================
    // 3. KOMPAKTE VORSCHAU IM KARTEN-KLICK-POPUP (Ohne Redundanz!)
    // ========================================================================
    root.baueSckmPopupBlock = function (standortDaten) {
        const eng = root.SCKM_ENGINE;
        if (!eng) return '';
        const evalRes = eng.evaluateLocationKnowledge(standortDaten, state.selectedSpeciesId);
        const top = evalRes.topResult;

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
    // 4. LUPEN-PANEL (🔍 STANDORT-ERKLÄRUNG OHNE REDUNDANZ)
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

        // 3. Die 4 kombinierten Standort-Faktoren
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

        // 5. Optional aufklappbare Wissenstreppe
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
            '<div class="sckm-tip-strip">💡 <span>Klicke auf grün markierte Begriffe (z. B. ' +
            hl('Mykorrhiza') +
            ', ' +
            hl('Fichte') +
            ', ' +
            hl('Heidelbeere') +
            ') – es öffnet sich direkt der bebilderte Eintrag im <b>📖 Einsteiger-Lexikon</b>!</span></div>' +
            '<div class="sckm-card">' +
            '<h4>1️⃣ Welchen Pilz möchtest du hier prüfen?</h4>' +
            '<div class="sckm-species-grid">' +
            rankingPills +
            '</div>' +
            '</div>' +
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
            '<div class="sckm-hitl-box">' +
            '<b>🌲 Welche Bäume siehst du vor Ort? (Klick passt die % sofort an):</b>' +
            '<div class="sckm-chip-wrap" style="margin-top:6px;">' +
            treeChips +
            '</div>' +
            '</div>' +
            '</div>' +
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
            '<button type="button" class="sckm-act-primary" style="flex:1;" onclick="window.oeffneLexikonEintrag(\'mushroom:' +
            active.species.id +
            '\')">📖 Im Bild-Lexikon zeigen</button>' +
            '<button type="button" class="sckm-graph-btn" style="flex:1;" onclick="window.oeffneLexikonDock(\'graph\');window.klickSckmGraphKnoten(\'mushroom:' +
            active.species.id +
            '\')">🕸️ Regionen im Graph & Karte</button>' +
            '</div>' +
            '<button type="button" class="sckm-wt-toggle" onclick="window.toggleWissenstreppeDetails()">' +
            (state.showWissenstreppeDetails
                ? '▲ SCKM-Wissenstreppe (Stufe 1–4) & Rohdaten ausblenden'
                : '▼ SCKM-Wissenstreppe (Stufe 1–4) & Rohdaten einblenden') +
            '</button>' +
            wissenstreppeDetailsHtml +
            '</div>';
    }

    // ========================================================================
    // 5. DIREKT-MENÜ: BEBILDERTES PILZ-LEXIKON & WISSENSGRAPH (📖)
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
        // Interaktion Graph -> Karte: Passende Regionen in Baden-Württemberg leuchten auf!
        root.hebeGraphKnotenAufKarteHervor(nodeId);
        renderLexikonDock();
        if (state.panelOffen) renderWissenstreppePanel();
    };

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

    function renderLexikonDock() {
        const container = document.getElementById('knowledge-graph-dock-inhalt');
        if (!container) return;

        const ont = root.SCKM_ONTOLOGY;
        const graphMod = root.SCKM_GRAPH;
        const illMod = root.SCKM_ILLUSTRATIONS;
        const evalRes = getEvaluation();
        if (!ont || !graphMod || !evalRes) return;

        const hl = ont.highlightGlossaryTerms;
        const getSvg = function (id) {
            return illMod && typeof illMod.getSvg === 'function' ? illMod.getSvg(id) : '';
        };

        // Tab-Umschalter im Dock-Header aktualisieren
        const tabGraphBtn = document.getElementById('sckm-dock-tab-graph');
        const tabLexBtn = document.getElementById('sckm-dock-tab-lexikon');
        if (tabGraphBtn) tabGraphBtn.classList.toggle('aktiv', state.dockTab === 'graph');
        if (tabLexBtn) tabLexBtn.classList.toggle('aktiv', state.dockTab === 'lexikon');

        // --- TAB A: VISUELLER WISSENSGRAPH (MIT KARTEN-HERVORHEBUNG) ---
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

            const hlSummary = state.activeMapHighlightSummary;
            const mapHighlightBannerHtml = hlSummary
                ? '<div class="sckm-map-hl-banner">' +
                  '<span>✨ <b>Auf Karte hervorgehoben:</b> Regionen für <b>' +
                  hlSummary.label +
                  '</b> leuchten auf (' +
                  hlSummary.bwiMatches +
                  ' BWI-Waldzellen' +
                  (hlSummary.waldMatches > 0
                      ? ' + ' + hlSummary.waldMatches + ' ForstBW-Bestände'
                      : '') +
                  ')</span>' +
                  '<button type="button" class="sckm-map-hl-reset" onclick="window.setzeKartenHervorhebungZurueck()">↺ Karten-Filter zurücksetzen</button>' +
                  '</div>'
                : '<div class="sckm-map-hl-banner" style="background:#f8fafc;border-color:#cbd5e1;color:#334155;">' +
                  '<span>👆 <b>Tipp:</b> Klicke unten im Graphen auf einen <b>pH-Wert</b>, <b>Baum</b>, <b>Pilz</b> oder eine <b>Zeigerpflanze</b> – die passenden Regionen in BW leuchten sofort auf der Karte auf!</span>' +
                  '<button type="button" class="sckm-layer-link-btn" onclick="window.klickSckmGraphKnoten(\'' +
                  (focusedNode ? focusedNode.id : 'mushroom:boletus-edulis') +
                  '\')">✨ Aktuellen Knoten auf Karte zeigen</button>' +
                  '</div>';

            const lexJumpId =
                focusedNode && focusedNode.id.indexOf('ph:') === 0
                    ? 'term:ph_wert'
                    : focusedNode
                    ? focusedNode.id
                    : 'mushroom:boletus-edulis';

            container.innerHTML =
                '<div class="sckm-kg-topbar">' +
                mapHighlightBannerHtml +
                '<div class="sckm-kg-meta">' +
                '<span class="sckm-kg-dot-legend">● Grün = Vorhanden am gewählten Ort (<b>' +
                evalRes.context.ortsName.split(' (')[0] +
                '</b>)</span>' +
                '<span class="sckm-kg-focus-badge">Knoten: <b>' +
                (focusedNode ? focusedNode.label : '') +
                '</b> (' +
                (focusedNode ? focusedNode.categoryLabel : '') +
                ')</span>' +
                '<button type="button" class="sckm-layer-link-btn" onclick="window.oeffneLexikonEintrag(\'' +
                lexJumpId +
                '\')">📖 Im Bild-Lexikon ansehen</button>' +
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

        // --- TAB B: SCHEMATISCH ILLUSTRIERTES EINSTEIGER-LEXIKON (KLAR IN 4 KATEGORIEN UNTERTEILT) ---
        const mushroomCards = ont.MUSHROOM_SPECIES.map(function (sp) {
            const entryKey = 'mushroom:' + sp.id;
            const isHighlighted = state.highlightedLexikonId === entryKey;
            return (
                '<div id="sckm-lex-mushroom-' +
                sp.id +
                '" class="sckm-lex-card ' +
                (isHighlighted ? 'hervorgehoben' : '') +
                '">' +
                '<div class="sckm-lex-card-top">' +
                '<div class="sckm-ill-box" title="Schematische Erkennungsmerkmale: ' +
                sp.deutscherName +
                '">' +
                getSvg(sp.id) +
                '</div>' +
                '<div class="sckm-lex-card-head">' +
                '<span class="sckm-lex-badge kat-mushroom">🍄 Pilzart</span>' +
                '<h5 class="sckm-lex-title">' +
                sp.deutscherName +
                ' <small>(' +
                sp.wissenschaftlicherName +
                ')</small></h5>' +
                '<div class="sckm-lex-sub">' +
                hl(sp.gruppe) +
                ' · 📅 ' +
                sp.saisonText +
                '</div>' +
                '<div class="sckm-lex-trait-box">🔎 <b>Merkmale:</b> ' +
                hl(sp.kurzsteckbrief) +
                '</div>' +
                '</div>' +
                '</div>' +
                '<div class="sckm-lex-meta">' +
                '<span>🌲 <b>Bäume:</b> ' +
                hl(sp.requiredTrees.join(', ')) +
                ' · 🧪 <b>pH:</b> ' +
                sp.optimalPhMin.toFixed(1).replace('.', ',') +
                '–' +
                sp.optimalPhMax.toFixed(1).replace('.', ',') +
                ' · 🌿 <b>Zeiger:</b> ' +
                hl(sp.indicatorPlants.join(', ').replace(/Baerlauch/g, 'Bärlauch')) +
                '</span>' +
                '<button type="button" class="sckm-lex-graph-jump" onclick="window.setzeLexikonDockTab(\'graph\');window.klickSckmGraphKnoten(\'mushroom:' +
                sp.id +
                '\')">✨ Auf Karte &amp; Graph</button>' +
                '</div>' +
                '</div>'
            );
        });

        const treeCards = ont.TREE_NODES.map(function (tr) {
            const entryKey = 'tree:' + tr.id;
            const isHighlighted = state.highlightedLexikonId === entryKey;
            return (
                '<div id="sckm-lex-tree-' +
                tr.id +
                '" class="sckm-lex-card ' +
                (isHighlighted ? 'hervorgehoben' : '') +
                '">' +
                '<div class="sckm-lex-card-top">' +
                '<div class="sckm-ill-box" title="Schematische Erkennungsmerkmale: ' +
                tr.label +
                '">' +
                getSvg(tr.id) +
                '</div>' +
                '<div class="sckm-lex-card-head">' +
                '<span class="sckm-lex-badge kat-tree">🌲 Baum-Partner (' +
                (tr.gruppe || 'Waldbaum') +
                ')</span>' +
                '<h5 class="sckm-lex-title">' +
                tr.label +
                '</h5>' +
                '<div class="sckm-lex-trait-box">🔎 <b>So erkennst du ihn:</b> ' +
                hl(tr.erkennungsMerkmale || tr.einfacheErklaerung) +
                '</div>' +
                '<p class="sckm-lex-text"><b>Pilz-Bedeutung:</b> ' +
                hl(tr.einfacheErklaerung) +
                '</p>' +
                '</div>' +
                '</div>' +
                '<div class="sckm-lex-meta">' +
                '<span>🗺️ ForstBW-Bestände &amp; BWI-Waldzellen in BW</span>' +
                '<button type="button" class="sckm-lex-graph-jump" onclick="window.setzeLexikonDockTab(\'graph\');window.klickSckmGraphKnoten(\'tree:' +
                tr.id +
                '\')">✨ Auf Karte &amp; Graph</button>' +
                '</div>' +
                '</div>'
            );
        });

        const plantCards = ont.INDICATOR_NODES.map(function (pl) {
            const entryKey = 'plant:' + pl.id;
            const isHighlighted = state.highlightedLexikonId === entryKey;
            return (
                '<div id="sckm-lex-plant-' +
                pl.id +
                '" class="sckm-lex-card ' +
                (isHighlighted ? 'hervorgehoben' : '') +
                '">' +
                '<div class="sckm-lex-card-top">' +
                '<div class="sckm-ill-box" title="Schematische Erkennungsmerkmale: ' +
                pl.label +
                '">' +
                getSvg(pl.id) +
                '</div>' +
                '<div class="sckm-lex-card-head">' +
                '<span class="sckm-lex-badge kat-plant">🌿 Zeigerpflanze</span>' +
                '<h5 class="sckm-lex-title">' +
                pl.label +
                '</h5>' +
                '<div class="sckm-lex-sub">' +
                (pl.indiziert || pl.indikatorFuer || 'Boden-Zeigerpflanze') +
                '</div>' +
                '<div class="sckm-lex-trait-box">🔎 <b>So erkennst du sie:</b> ' +
                hl(pl.erkennungsMerkmale || pl.einfacheErklaerung) +
                '</div>' +
                '</div>' +
                '</div>' +
                '<div class="sckm-lex-meta">' +
                '<span><b>Boden-Hinweis:</b> ' +
                hl(pl.einfacheErklaerung) +
                '</span>' +
                '<button type="button" class="sckm-lex-graph-jump" onclick="window.setzeLexikonDockTab(\'graph\');window.klickSckmGraphKnoten(\'plant:' +
                pl.id +
                '\')">✨ Auf Karte &amp; Graph</button>' +
                '</div>' +
                '</div>'
            );
        });

        const termCards = Object.keys(ont.GLOSSARY_TERMS).map(function (k) {
            const t = ont.GLOSSARY_TERMS[k];
            const entryKey = 'term:' + t.id;
            const isHighlighted = state.highlightedLexikonId === entryKey;
            return (
                '<div id="sckm-lex-term-' +
                t.id +
                '" class="sckm-lex-card ' +
                (isHighlighted ? 'hervorgehoben' : '') +
                '">' +
                '<div class="sckm-lex-card-top">' +
                '<div class="sckm-ill-box" title="Schematische Darstellung: ' +
                t.title +
                '">' +
                getSvg(t.id) +
                '</div>' +
                '<div class="sckm-lex-card-head">' +
                '<span class="sckm-lex-badge kat-term">💡 ' +
                t.category +
                '</span>' +
                '<h5 class="sckm-lex-title">' +
                t.title +
                '</h5>' +
                '<p class="sckm-lex-text">' +
                hl(t.shortDef) +
                '</p>' +
                '<div class="sckm-lex-trait-box">🌲 <b>' +
                hl(t.forestTip) +
                '</b></div>' +
                '</div>' +
                '</div>' +
                '</div>'
            );
        });

        const categorySections = [
            {
                id: 'mushroom',
                icon: '🍄',
                title: '1. Einsteiger-Speisepilze (' + mushroomCards.length + ')',
                desc: 'Die 6 wichtigsten Speisepilze in Baden-Württemberg mit ihren sicheren Erkennungsmerkmalen, Partnerbäumen und Bodenansprüchen.',
                cards: mushroomCards
            },
            {
                id: 'tree',
                icon: '🌲',
                title: '2. Symbiose- & Partnerbäume (' + treeCards.length + ')',
                desc: 'Da viele Speisepilze in einer Mykorrhiza-Partnerschaft mit bestimmten Bäumen leben, findest du den Pilz nur, wenn du seinen Partnerbaum erkennst.',
                cards: treeCards
            },
            {
                id: 'plant',
                icon: '🌿',
                title: '3. Zeigerpflanzen – Deine Boden-Detektive (' + plantCards.length + ')',
                desc: 'Zeigerpflanzen verraten dir direkt beim Waldeinstieg ohne Messgerät, ob der Waldboden sauer (Steinpilz/Marone) oder kalkhaltig (Speisemorchel) ist.',
                cards: plantCards
            },
            {
                id: 'term',
                icon: '💡',
                title: '4. Wichtige Fachbegriffe einfach erklärt (' + termCards.length + ')',
                desc: 'Grundbegriffe aus Ökologie, Pilzbestimmung, Sammelrecht und Wissensmanagement (SCKM) auf einen Blick.',
                cards: termCards
            }
        ];

        const totalCount =
            mushroomCards.length + treeCards.length + plantCards.length + termCards.length;

        const visibleSectionsHtml = categorySections
            .filter(function (sec) {
                return state.lexikonFilter === 'all' || state.lexikonFilter === sec.id;
            })
            .map(function (sec) {
                return (
                    '<div class="sckm-lex-cat-block" id="sckm-lex-sec-' +
                    sec.id +
                    '">' +
                    '<div class="sckm-lex-cat-header">' +
                    '<div>' +
                    '<h4>' +
                    sec.icon +
                    ' ' +
                    sec.title +
                    '</h4>' +
                    '<p>' +
                    sec.desc +
                    '</p>' +
                    '</div>' +
                    '</div>' +
                    '<div class="sckm-lex-grid">' +
                    sec.cards.join('') +
                    '</div>' +
                    '</div>'
                );
            })
            .join('');

        const filterButtons = [
            { id: 'all', label: 'Alle Kategorien (' + totalCount + ')' },
            { id: 'mushroom', label: '🍄 1. Pilzarten (' + mushroomCards.length + ')' },
            { id: 'tree', label: '🌲 2. Bäume (' + treeCards.length + ')' },
            { id: 'plant', label: '🌿 3. Zeigerpflanzen (' + plantCards.length + ')' },
            { id: 'term', label: '💡 4. Fachbegriffe (' + termCards.length + ')' }
        ]
            .map(function (f) {
                return (
                    '<button type="button" class="sckm-lex-filter-btn ' +
                    (state.lexikonFilter === f.id ? 'aktiv' : '') +
                    '" onclick="window.setzeLexikonFilter(\'' +
                    f.id +
                    '\')">' +
                    f.label +
                    '</button>'
                );
            })
            .join('');

        container.innerHTML =
            '<div class="sckm-lex-section">' +
            '<div class="sckm-lex-filter-bar">' +
            '<div class="sckm-lex-filter-pills">' +
            filterButtons +
            '</div>' +
            '<small style="color:#166534;font-weight:600;">🔎 Große schematische Grafiken zeigen die Erkennungsmerkmale auf einen Blick</small>' +
            '</div>' +
            '<div class="sckm-lex-categories-wrap">' +
            visibleSectionsHtml +
            '</div>' +
            '</div>';
    }

    // 6. Brücke zu Route & Fund
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
