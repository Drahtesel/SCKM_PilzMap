// ============================================================================
// SCKM Glass-Box Inferenz-Engine (www/sckm/inferenceEngine.js)
// Berechnet aus den Live-Standortdaten eines Kartenklicks in Pilz-Hub BW
// (ISRIC-pH, BWI-2002-Zeigerpflanzen, ForstBW-Baumart, 7-Tage-Regen,
// Schutzgebiete) eine 100 % durchsichtige Pilzwahrscheinlichkeit (0-100 %)
// und strukturiert die Erklärung entlang der 4 Stufen der Wissenstreppe.
// ============================================================================

(function (root) {
    'use strict';

    const getOntology = function () {
        if (root.SCKM_ONTOLOGY) return root.SCKM_ONTOLOGY;
        if (typeof require === 'function') return require('./ontology.js');
        throw new Error('SCKM_ONTOLOGY nicht geladen');
    };

    // 1. pH-Wert mit Fallback-Kaskade ermitteln (ISRIC -> BWI-Säurezeiger -> Standard 5.4)
    function resolvePhInfo(rawStandort) {
        const ont = getOntology();
        let phNum = null;
        let phQuelle = 'Standard-Schätzung (Baden-Württemberg Mittelwert)';
        let isFallback = true;

        if (rawStandort && rawStandort.phWert !== null && rawStandort.phWert !== undefined && rawStandort.phWert !== '') {
            const parsed = parseFloat(String(rawStandort.phWert).replace(',', '.'));
            if (!Number.isNaN(parsed) && parsed >= 2.5 && parsed <= 9.5) {
                phNum = Math.round(parsed * 10) / 10;
                phQuelle = rawStandort.phQuelle || 'ISRIC SoilGrids WMS (0–5 cm Tiefe)';
                isFallback = false;
            }
        }

        // Fallback auf lokale BWI-2002-Säurezeiger (sbv01..04), falls ISRIC-WMS keinen Pixelwert liefert
        if (phNum === null && rawStandort && typeof rawStandort.bwiScore === 'number') {
            const s = rawStandort.bwiScore;
            if (s >= 8) phNum = 3.9;
            else if (s >= 6) phNum = 4.3;
            else if (s >= 4) phNum = 4.8;
            else if (s >= 2) phNum = 5.3;
            else phNum = 6.2;
            phQuelle = 'BWI 2002 Säurezeiger-Ableitung (Score ' + s + ')';
            isFallback = false;
        }

        if (phNum === null) {
            phNum = 5.3;
        }

        const cat =
            ont.PH_CATEGORIES.find(function (c) {
                return phNum >= c.min && phNum < c.max;
            }) || ont.PH_CATEGORIES[1];

        return {
            phNum: phNum,
            phText: phNum.toFixed(1).replace('.', ','),
            categoryId: cat.id,
            categoryLabel: cat.label,
            rangeText: cat.rangeText,
            phQuelle: phQuelle,
            isFallback: isFallback
        };
    }

    // 2. Baumarten mit 3-stufiger Kaskade ermitteln:
    //    (A) Nutzer-Beobachtung vor Ort (Human-in-the-Loop) + ForstBW Waldrefugium
    //    (B) BWI-Zelle / Waldbestands-Heuristik anhand Boden-pH
    function resolveTreesInfo(rawStandort, phInfo) {
        const erkannteBaeume = new Set();
        let baumQuelle = 'Boden-pH-Bestandsheuristik ( vor Ort per Klick anpassbar)';

        if (rawStandort && Array.isArray(rawStandort.baumarten) && rawStandort.baumarten.length > 0) {
            rawStandort.baumarten.forEach(function (b) {
                if (b && b !== 'Andere' && b !== 'Mischwald') erkannteBaeume.add(b);
                if (b === 'Mischwald') {
                    erkannteBaeume.add('Buche');
                    erkannteBaeume.add('Fichte');
                }
            });
            baumQuelle = rawStandort.baumQuelle || 'ForstBW Waldrefugien-Layer';
        }

        // Ergänze Nutzer-Übersteuerung (Human-in-the-Loop Chips im Panel)
        if (rawStandort && Array.isArray(rawStandort.userTrees) && rawStandort.userTrees.length > 0) {
            erkannteBaeume.clear();
            rawStandort.userTrees.forEach(function (b) {
                erkannteBaeume.add(b);
            });
            baumQuelle = 'Eigene Vor-Ort-Beobachtung (Human-in-the-Loop)';
        }

        // Falls außerhalb eines ForstBW-Waldrefugiums geklickt wurde und noch keine Baumart gesetzt ist:
        if (erkannteBaeume.size === 0) {
            if (phInfo.phNum < 4.7) {
                erkannteBaeume.add('Fichte');
                erkannteBaeume.add('Tanne');
                erkannteBaeume.add('Kiefer');
                baumQuelle = 'BWI/Standort-Ableitung (Saurer Nadel-/Mischwald)';
            } else if (phInfo.phNum < 5.8) {
                erkannteBaeume.add('Fichte');
                erkannteBaeume.add('Buche');
                erkannteBaeume.add('Kiefer');
                baumQuelle = 'BWI/Standort-Ableitung (Mäßig saurer Mischwald)';
            } else {
                erkannteBaeume.add('Buche');
                erkannteBaeume.add('Eiche');
                erkannteBaeume.add('Esche');
                baumQuelle = 'BWI/Standort-Ableitung (Neutraler/kalkhaltiger Laubwald)';
            }
        }

        return {
            trees: Array.from(erkannteBaeume),
            baumQuelle: baumQuelle
        };
    }

    // 3. Zeigerpflanzen aus BWI-2002-Zelle (sbv01..04) + pH-Kontext + Nutzer-Beobachtung ermitteln
    function resolveIndicatorsInfo(rawStandort, phInfo) {
        const plants = new Set();
        const sbv = (rawStandort && Array.isArray(rawStandort.bwiSbv)) ? rawStandort.bwiSbv : [0, 0, 0, 0];

        if (sbv[0] > 0) plants.add('Drahtschmiele');
        if (sbv[1] > 0) plants.add('Heidelbeere');
        if (sbv[2] > 0) plants.add('Preiselbeere');
        if (sbv[3] > 0) plants.add('Heidekraut');

        // Falls keine BWI-Zelle getroffen oder Kalkstandort:
        if (plants.size === 0) {
            if (phInfo.phNum < 5.2) {
                plants.add('Heidelbeere');
                plants.add('Drahtschmiele');
            } else if (phInfo.phNum >= 6.4) {
                plants.add('Waldmeister');
                plants.add('Baerlauch');
            }
        }

        if (rawStandort && Array.isArray(rawStandort.userIndicators) && rawStandort.userIndicators.length > 0) {
            rawStandort.userIndicators.forEach(function (p) {
                plants.add(p);
            });
        }

        return Array.from(plants);
    }

    // 4. Einzelne Pilzart transparent bewerten (Glass-Box Regelwerk)
    function evaluateSpeciesForLocation(species, context) {
        const rules = [];

        // --- REGEL 1: Mykorrhiza-Baumpartner (Max. 35 Punkte) ---
        const matchingTrees = species.requiredTrees.filter(function (t) {
            return context.trees.indexOf(t) !== -1;
        });
        const isPrimaryTreeMatch =
            context.trees.length > 0 && species.requiredTrees.indexOf(context.trees[0]) !== -1;
        let treePoints = 0;
        let treeStatus = 'failed';
        let treeExplanation = '';

        if (matchingTrees.length > 0 && isPrimaryTreeMatch) {
            treePoints = 35;
            treeStatus = 'passed';
            treeExplanation =
                'Hauptbaumart passt optimal (' +
                matchingTrees.join(', ') +
                ' gefunden · benötigt: ' +
                species.requiredTrees.join(' oder ') +
                ').';
        } else if (matchingTrees.length > 0) {
            treePoints = 21;
            treeStatus = 'partial';
            treeExplanation =
                'Symbiose-Partner als Nebenbaumart im Mischbestand vorhanden (' +
                matchingTrees.join(', ') +
                ' · Hauptbaumart ist ' +
                context.trees[0] +
                ').';
        } else {
            treePoints = 0;
            treeStatus = 'failed';
            treeExplanation =
                'Kein passender Symbiose-Baum erkannt (Standort: ' +
                (context.trees.join(', ') || 'keine') +
                ' · ' +
                species.deutscherName +
                ' benötigt zwingend: ' +
                species.requiredTrees.join(', ') +
                ').';
        }

        rules.push({
            id: 'rule_tree',
            faktor: '1. Baum-Symbiose (Mykorrhiza)',
            gewichtMax: 35,
            punkte: treePoints,
            status: treeStatus,
            kurzwert: matchingTrees.length > 0 ? matchingTrees.join(', ') : 'Fehlt (' + species.requiredTrees.join('/') + ')',
            erklaerung: treeExplanation
        });

        // --- REGEL 2: Boden-Milieu / pH-Wert (Max. 25 Punkte) ---
        const ph = context.phInfo.phNum;
        const inOptimalPh = ph >= species.optimalPhMin && ph <= species.optimalPhMax;
        const inCategoryPh = species.requiredPhCategories.indexOf(context.phInfo.categoryId) !== -1;
        const phDist = ph < species.optimalPhMin ? species.optimalPhMin - ph : ph > species.optimalPhMax ? ph - species.optimalPhMax : 0;

        let phPoints = 0;
        let phStatus = 'failed';
        let phExplanation = '';

        if (inOptimalPh || inCategoryPh) {
            phPoints = 25;
            phStatus = 'passed';
            phExplanation =
                'Boden-pH ' +
                context.phInfo.phText +
                ' (' +
                context.phInfo.categoryLabel +
                ') liegt genau im Idealbereich von pH ' +
                species.optimalPhMin.toFixed(1).replace('.', ',') +
                '–' +
                species.optimalPhMax.toFixed(1).replace('.', ',') +
                '.';
        } else if (phDist <= 0.6) {
            phPoints = 13;
            phStatus = 'partial';
            phExplanation =
                'Boden-pH ' +
                context.phInfo.phText +
                ' liegt im Grenzbereich (Optimal für ' +
                species.deutscherName +
                ': pH ' +
                species.optimalPhMin.toFixed(1).replace('.', ',') +
                '–' +
                species.optimalPhMax.toFixed(1).replace('.', ',') +
                ').';
        } else {
            phPoints = 0;
            phStatus = 'failed';
            phExplanation =
                'Boden-pH ' +
                context.phInfo.phText +
                ' (' +
                context.phInfo.categoryLabel +
                ') passt nicht zum benötigten Milieu (pH ' +
                species.optimalPhMin.toFixed(1).replace('.', ',') +
                '–' +
                species.optimalPhMax.toFixed(1).replace('.', ',') +
                ').';
        }

        rules.push({
            id: 'rule_ph',
            faktor: '2. Boden-pH & Geologie',
            gewichtMax: 25,
            punkte: phPoints,
            status: phStatus,
            kurzwert: 'pH ' + context.phInfo.phText + ' (' + context.phInfo.categoryLabel + ')',
            erklaerung: phExplanation
        });

        // --- REGEL 3: Bodenfeuchte / 7-Tage-Regen (Max. 25 Punkte) ---
        const rain = context.regen7TageMm;
        let rainPoints = 0;
        let rainStatus = 'failed';
        let rainExplanation = '';

        if (rain >= species.optimalRain7dMin && rain <= species.optimalRain7dMax) {
            rainPoints = 25;
            rainStatus = 'passed';
            rainExplanation =
                'Optimale Bodenfeuchte: ' +
                rain.toFixed(1).replace('.', ',') +
                ' mm Regen in den letzten 7 Tagen (Idealbereich: ' +
                species.optimalRain7dMin +
                '–' +
                species.optimalRain7dMax +
                ' mm).';
        } else if (rain >= 5 && rain < species.optimalRain7dMin) {
            rainPoints = 14;
            rainStatus = 'partial';
            rainExplanation =
                'Mäßige Bodenfeuchte (' +
                rain.toFixed(1).replace('.', ',') +
                ' mm in 7 Tagen). Für einen starken Schub sind ≥ ' +
                species.optimalRain7dMin +
                ' mm ideal.';
        } else if (rain > species.optimalRain7dMax) {
            rainPoints = 18;
            rainStatus = 'partial';
            rainExplanation =
                'Sehr nasser Boden (' +
                rain.toFixed(1).replace('.', ',') +
                ' mm in 7 Tagen) – gut für das Myzel, aber ältere Fruchtkörper können schneller schimmeln.';
        } else {
            rainPoints = 4;
            rainStatus = 'failed';
            rainExplanation =
                'Zu trocken: Nur ' +
                rain.toFixed(1).replace('.', ',') +
                ' mm Regen in den letzten 7 Tagen (< 5 mm hemmt die Fruchtkörperbildung stark).';
        }

        rules.push({
            id: 'rule_rain',
            faktor: '3. 7-Tage-Niederschlag (Wetter-Impuls)',
            gewichtMax: 25,
            punkte: rainPoints,
            status: rainStatus,
            kurzwert: rain.toFixed(1).replace('.', ',') + ' mm / 7 Tage',
            erklaerung: rainExplanation
        });

        // --- REGEL 4: Zeigerpflanzen & Mikrohabitat (Max. 15 Punkte) ---
        const matchingPlants = species.indicatorPlants.filter(function (p) {
            return context.indicators.indexOf(p) !== -1;
        });
        let plantPoints = 0;
        let plantStatus = 'failed';
        let plantExplanation = '';

        if (matchingPlants.length >= 2) {
            plantPoints = 15;
            plantStatus = 'passed';
            plantExplanation =
                'Starke Zeigerpflanzen-Bestätigung vor Ort: ' + matchingPlants.join(', ') + ' zeigen genau das benötigte Bodenmilieu an.';
        } else if (matchingPlants.length === 1) {
            plantPoints = 11;
            plantStatus = 'passed';
            plantExplanation =
                'Zeigerpflanze ' + matchingPlants[0] + ' bestätigt das passende Mikrohabitat.';
        } else {
            plantPoints = 0;
            plantStatus = 'failed';
            plantExplanation =
                'Keine typischen Zeigerpflanzen (' + species.indicatorPlants.join(', ') + ') für diese Art am Standort nachgewiesen.';
        }

        rules.push({
            id: 'rule_plants',
            faktor: '4. BWI-Zeigerpflanzen (Bodenvegetation)',
            gewichtMax: 15,
            punkte: plantPoints,
            status: plantStatus,
            kurzwert: matchingPlants.length > 0 ? matchingPlants.join(', ') : 'Keine Übereinstimmung',
            erklaerung: plantExplanation
        });

        // --- Gesamtpunktzahl & Biologische KO-Regel ---
        // Wenn der Pflicht-Symbiosebaum komplett fehlt (z. B. Krause Glucke ohne Kiefer),
        // wird der Gesamtscore biologisch auf max. 18 % gedeckelt (Glass-Box Transparenz!).
        const rawSum = treePoints + phPoints + rainPoints + plantPoints;
        let finalScore = rawSum;
        let koReason = null;

        if (treePoints === 0) {
            finalScore = Math.min(rawSum, 18);
            koReason =
                'Biologische Ausschlussregel (Deckelung auf max. 18 %): Ohne Mykorrhiza-/Wirtsbaum (' +
                species.requiredTrees.join(' oder ') +
                ') kann ' +
                species.deutscherName +
                ' trotz passendem Wetter keine Fruchtkörper bilden.';
        } else if (phPoints === 0) {
            finalScore = Math.min(rawSum, 30);
            koReason =
                'Boden-Ausschlussregel (Deckelung auf max. 30 %): Der pH-Wert (' +
                context.phInfo.phText +
                ') weicht zu stark vom benötigten Bodenmilieu ab.';
        }

        let ampelfarbe = '#e74c3c'; // rot (< 35 %)
        let einstufung = 'Geringe Eignung / Ausgeschlossen';
        if (finalScore >= 75) {
            ampelfarbe = '#2ca25f'; // grün
            einstufung = 'Sehr hohe Habitat-Eignung';
        } else if (finalScore >= 45) {
            ampelfarbe = '#f39c12'; // gelb/orange
            einstufung = 'Mittlere Habitat-Eignung';
        }

        return {
            species: species,
            score: finalScore,
            rawSum: rawSum,
            ampelfarbe: ampelfarbe,
            einstufung: einstufung,
            koReason: koReason,
            matchingTrees: matchingTrees,
            matchingPlants: matchingPlants,
            rules: rules
        };
    }

    // 5. Hauptfunktion: Kompletten Standort entlang der 4 Stufen der Wissenstreppe auswerten
    function evaluateLocationKnowledge(rawStandort, selectedSpeciesId) {
        const ont = getOntology();
        const standort = rawStandort || ont.DEMO_HABITATS_BW[0];

        const phInfo = resolvePhInfo(standort);
        const treesInfo = resolveTreesInfo(standort, phInfo);
        const indicators = resolveIndicatorsInfo(standort, phInfo);
        const regen7TageMm =
            typeof standort.regen7TageMm === 'number' && !Number.isNaN(standort.regen7TageMm)
                ? standort.regen7TageMm
                : 18.0;
        const schutzgebiete = Array.isArray(standort.schutzgebiete) ? standort.schutzgebiete : [];
        const verboteneZonen = schutzgebiete.filter(function (s) {
            return s.art === 'Naturschutzgebiet' || s.art === 'Nationalpark' || s.art === 'Bannwald';
        });
        const sammelVerbot = verboteneZonen.length > 0;

        const context = {
            ortsName: standort.ortsName || 'Ausgewählter Standort (BW)',
            lat: Number(standort.lat || 48.55),
            lng: Number(standort.lng || 8.75),
            phInfo: phInfo,
            trees: treesInfo.trees,
            baumQuelle: treesInfo.baumQuelle,
            indicators: indicators,
            bwiScore: typeof standort.bwiScore === 'number' ? standort.bwiScore : null,
            bwiSbv: Array.isArray(standort.bwiSbv) ? standort.bwiSbv : [0, 0, 0, 0],
            regen7TageMm: regen7TageMm,
            temperaturC: standort.temperaturC !== undefined ? standort.temperaturC : null,
            schutzgebiete: schutzgebiete,
            sammelVerbot: sammelVerbot,
            verboteneZonen: verboteneZonen
        };

        // Alle 6 Pilzarten bewerten & absteigend nach Score sortieren
        const rankings = ont.MUSHROOM_SPECIES.map(function (sp) {
            return evaluateSpeciesForLocation(sp, context);
        }).sort(function (a, b) {
            return b.score - a.score;
        });

        const activeResult =
            rankings.find(function (r) {
                return r.species.id === selectedSpeciesId;
            }) || rankings[0];

        return {
            context: context,
            rankings: rankings,
            topResult: rankings[0],
            activeResult: activeResult
        };
    }

    const SCKM_ENGINE = {
        resolvePhInfo: resolvePhInfo,
        resolveTreesInfo: resolveTreesInfo,
        resolveIndicatorsInfo: resolveIndicatorsInfo,
        evaluateLocationKnowledge: evaluateLocationKnowledge
    };

    root.SCKM_ENGINE = SCKM_ENGINE;
    if (typeof module !== 'undefined' && module.exports) {
        module.exports = SCKM_ENGINE;
    }
})(typeof window !== 'undefined' ? window : globalThis);
