// ============================================================================
// SCKM Wissensbasis & Ontologie (www/sckm/ontology.js)
// Verbindet Vorlesungskonzepte (Wissenstreppe nach North, Know-what/why/how,
// Symbolische KI / RDF-Tripel) mit den echten BW-Geodaten aus Pilz-Hub BW.
// ============================================================================

(function (root) {
    'use strict';

    // 1. Die 4 Stufen der Beginner-Wissenstreppe (Vorlesung 06.10.2026)
    const WISSENSTREPPE_STUFEN = [
        {
            stufe: 1,
            id: 'daten',
            titel: '1. Zeichen & Daten',
            untertitel: 'Syntaktische Rohwerte am Standort',
            wissensart: 'Syntaktische Basis (Messwerte)',
            beschreibung:
                'Auf der untersten Stufe der Wissenstreppe stehen isolierte Rohdaten und Messwerte der Karten-APIs (Koordinaten, ISRIC-Rasterpixel, BWI-Inventurcodes sbv01–04, Open-Meteo Niederschlag in mm).'
        },
        {
            stufe: 2,
            id: 'information',
            titel: '2. Informationen',
            untertitel: 'Daten im ökologischen & rechtlichen Kontext',
            wissensart: 'Know-what (Sachwissen)',
            beschreibung:
                'Durch Bedeutung und Einordnung werden aus Rohdaten Informationen: Welches Boden-Milieu (pH) herrscht vor? Welche Baumarten und Säurezeiger-Pflanzen wachsen hier? Ist der Boden feucht genug und gilt ein Sammelverbot?'
        },
        {
            stufe: 3,
            id: 'wissen',
            titel: '3. Wissen (Glass-Box & Graph)',
            untertitel: 'Vernetztes Know-why & transparente Pilzwahrscheinlichkeit',
            wissensart: 'Know-why (Erklärungswissen)',
            beschreibung:
                'Wissen entsteht durch die logische Vernetzung der Informationen über unsere Ontologie: Warum passt dieser Standort zu einem bestimmten Speisepilz? Jede Regel (Baum-Symbiose, pH-Wert, 7-Tage-Regen, Zeigerpflanzen) wird transparent aufgeschlüsselt.'
        },
        {
            stufe: 4,
            id: 'handeln',
            titel: '4. Handeln & Kompetenz',
            untertitel: 'Vom Wissen zur sicheren Entscheidung im Wald',
            wissensart: 'Know-how (Handlungskompetenz)',
            beschreibung:
                'Wissen wird erst durch situationsadäquates Handeln wirksam: Prüfe das Sammelrecht, beachte die Verwechslungsgefahr (Desirable Friction), plane deine Route oder dokumentiere deinen Fund.'
        }
    ];

    // 2. Boden-pH-Klassen (Ontologie-Knoten Spalte 1)
    const PH_CATEGORIES = [
        {
            id: 'stark_sauer',
            label: 'Stark sauer',
            rangeText: 'pH 3,5 – 4,7',
            min: 3.0,
            max: 4.75,
            typischBw: 'Hochschwarzwald, Kristallin & Buntsandstein'
        },
        {
            id: 'maessig_sauer',
            label: 'Mäßig sauer',
            rangeText: 'pH 4,8 – 5,7',
            min: 4.75,
            max: 5.75,
            typischBw: 'Nadel-/Mischwälder (Schönbuch, Mittlerer Schwarzwald)'
        },
        {
            id: 'neutral',
            label: 'Schwach sauer / Neutral',
            rangeText: 'pH 5,8 – 6,7',
            min: 5.75,
            max: 6.75,
            typischBw: 'Laubmischwälder, Kraichgau & Rheinebene'
        },
        {
            id: 'kalkhaltig',
            label: 'Kalkhaltig / Basisch',
            rangeText: 'pH 6,8 – 8,2',
            min: 6.75,
            max: 8.5,
            typischBw: 'Schwäbische Alb, Kaiserstuhl, Schönberg & Auwälder'
        }
    ];

    // 3. Baumarten-Knoten (Ontologie-Knoten Spalte 2)
    const TREE_NODES = [
        { id: 'Fichte', label: 'Fichte', gruppe: 'Nadelwald' },
        { id: 'Tanne', label: 'Weißtanne', gruppe: 'Nadelwald' },
        { id: 'Kiefer', label: 'Kiefer', gruppe: 'Nadelwald' },
        { id: 'Buche', label: 'Buche', gruppe: 'Laubwald' },
        { id: 'Eiche', label: 'Eiche', gruppe: 'Laubwald' },
        { id: 'Birke', label: 'Birke', gruppe: 'Laubwald' },
        { id: 'Esche', label: 'Esche', gruppe: 'Laubwald' }
    ];

    // 4. Zeigerpflanzen & Feuchte-Indikatoren (Ontologie-Knoten Spalte 4)
    const INDICATOR_NODES = [
        {
            id: 'Heidelbeere',
            label: 'Heidelbeere',
            bwiField: 'sbv02',
            indiziert: 'Saurer Rohhumus (pH < 5,0)'
        },
        {
            id: 'Drahtschmiele',
            label: 'Drahtschmiele',
            bwiField: 'sbv01',
            indiziert: 'Saurer, nährstoffarmer Waldboden'
        },
        {
            id: 'Preiselbeere',
            label: 'Preiselbeere',
            bwiField: 'sbv03',
            indiziert: 'Stark saurer Nadelwaldboden'
        },
        {
            id: 'Heidekraut',
            label: 'Heidekraut',
            bwiField: 'sbv04',
            indiziert: 'Lichter, saurer Sand-/Moorboden'
        },
        {
            id: 'Waldmeister',
            label: 'Waldmeister',
            bwiField: null,
            indiziert: 'Basenreicher, kalkhaltiger Buchenwald'
        },
        {
            id: 'Baerlauch',
            label: 'Bärlauch',
            bwiField: null,
            indiziert: 'Feuchter, kalk-/nährstoffreicher Auwald'
        }
    ];

    // 5. Die 6 kontrastierenden Pilzarten (Ontologie-Knoten Spalte 3)
    const MUSHROOM_SPECIES = [
        {
            id: 'boletus-edulis',
            deutscherName: 'Fichten-Steinpilz',
            wissenschaftlicherName: 'Boletus edulis',
            gruppe: 'Röhrling (Schwamm unter dem Hut)',
            einsteigerFreundlich: true,
            essbarkeit: 'Essbar (Speisepilz)',
            kurzsteckbrief:
                'Beliebtester Einsteiger-Röhrling: Brauner Hut, weißes bis gelbgrünes Röhrenfutter, verdickter Stiel mit feinem weißem Netz.',
            requiredPhCategories: ['stark_sauer', 'maessig_sauer'],
            optimalPhMin: 4.0,
            optimalPhMax: 5.8,
            requiredTrees: ['Fichte', 'Tanne', 'Buche', 'Kiefer'],
            indicatorPlants: ['Heidelbeere', 'Drahtschmiele', 'Preiselbeere'],
            optimalRain7dMin: 12,
            optimalRain7dMax: 45,
            seasonMonths: [7, 8, 9, 10, 11],
            lookalikeWarning: {
                name: 'Gallenröhrling & Fliegenpilz',
                merkmale:
                    'Gallenröhrling hat ein dunkles grobes Stielnetz, rosa Röhren und schmeckt extrem bitter (ungiftig, aber ungenießbar). Junge Fliegenpilze im Ei-Stadium haben Lamellen statt Röhren!'
            },
            knowWhySummary:
                'Lebt in ektomykorrhizischer Symbiose vor allem mit Fichten, Tannen und Buchen auf sauren bis mäßig sauren Böden. Nach 12–35 mm Regen in den Vorwochen bildet das Myzel kräftige Fruchtkörper.'
        },
        {
            id: 'imleria-badia',
            deutscherName: 'Maronen-Röhrling',
            wissenschaftlicherName: 'Imleria badia',
            gruppe: 'Röhrling (blaut auf Druck)',
            einsteigerFreundlich: true,
            essbarkeit: 'Essbar (Speisepilz)',
            kurzsteckbrief:
                'Kastanienbrauner Hut, blassgelbe Röhren, die auf Fingerdruck deutlich blaugrün anlaufen; Stiel ohne Netz.',
            requiredPhCategories: ['stark_sauer', 'maessig_sauer'],
            optimalPhMin: 3.6,
            optimalPhMax: 5.4,
            requiredTrees: ['Fichte', 'Kiefer', 'Tanne'],
            indicatorPlants: ['Heidelbeere', 'Drahtschmiele', 'Preiselbeere', 'Heidekraut'],
            optimalRain7dMin: 10,
            optimalRain7dMax: 45,
            seasonMonths: [8, 9, 10, 11],
            lookalikeWarning: {
                name: 'Gallenröhrling & Rotfußröhrling',
                merkmale:
                    'Die Röhren des Maronen-Röhrlings blauen bei Druck deutlich; der bittere Gallenröhrling blaut niemals und hat rosa Poren.'
            },
            knowWhySummary:
                'Typischer Säureliebhaber der Nadelwälder (Schwarzwald, Schönbuch): Wo Heidelbeere und Drahtschmiele unter Fichten oder Kiefern wachsen, findet der Maronen-Röhrling sein optimales Substrat.'
        },
        {
            id: 'cantharellus-cibarius',
            deutscherName: 'Echter Pfifferling',
            wissenschaftlicherName: 'Cantharellus cibarius',
            gruppe: 'Leistenpilz (Aderige Leisten statt Lamellen)',
            einsteigerFreundlich: true,
            essbarkeit: 'Essbar (Speisepilz)',
            kurzsteckbrief:
                'Dottergelber Fruchtkörper mit am Stiel herablaufenden, gegabelten Leisten (keine dünnen Lamellen!), riecht fruchtig nach Aprikose.',
            requiredPhCategories: ['stark_sauer', 'maessig_sauer'],
            optimalPhMin: 4.0,
            optimalPhMax: 5.7,
            requiredTrees: ['Fichte', 'Buche', 'Eiche', 'Kiefer'],
            indicatorPlants: ['Heidelbeere', 'Drahtschmiele'],
            optimalRain7dMin: 15,
            optimalRain7dMax: 50,
            seasonMonths: [6, 7, 8, 9, 10],
            lookalikeWarning: {
                name: 'Falscher Pfifferling & Ölbaumpilz',
                merkmale:
                    'Der Falsche Pfifferling hat dünne, engstehende, biegsame Lamellen (keine aderigen Leisten) und gelboranges Fleisch.'
            },
            knowWhySummary:
                'Benötigt magere, saure Waldböden (pH 4,0–5,6) unter Fichten oder Buchen sowie ausreichend Sommer-/Herbstfeuchte (> 15 mm 7-Tage-Regen).'
        },
        {
            id: 'sparassis-crispa',
            deutscherName: 'Krause Glucke',
            wissenschaftlicherName: 'Sparassis crispa',
            gruppe: 'Porling / Badeschwamm-Optik am Kiefernstamm',
            einsteigerFreundlich: true,
            essbarkeit: 'Essbar (Speisepilz)',
            kurzsteckbrief:
                'Großer, krauser, badeschwamm- oder blumenkohlartiger Fruchtkörper, der ausschließlich direkt am Fuß von Kiefern wächst.',
            requiredPhCategories: ['stark_sauer', 'maessig_sauer'],
            optimalPhMin: 3.8,
            optimalPhMax: 5.6,
            requiredTrees: ['Kiefer'],
            indicatorPlants: ['Preiselbeere', 'Heidekraut', 'Drahtschmiele'],
            optimalRain7dMin: 10,
            optimalRain7dMax: 40,
            seasonMonths: [8, 9, 10, 11],
            lookalikeWarning: {
                name: 'Breitblättrige Glucke (an Tanne/Eiche)',
                merkmale:
                    'Durch die einzigartige Badeschwamm-Form am Fuß alter Waldkiefern für Einsteiger kaum mit Giftpilzen verwechselbar.'
            },
            knowWhySummary:
                'Strenger Spezialist (Wurzelparasit) an alten Waldkiefern auf sauren Böden. Ohne Kiefer im Bestand liegt die Wahrscheinlichkeit nahe 0 %.'
        },
        {
            id: 'boletus-reticulatus',
            deutscherName: 'Sommer-Steinpilz',
            wissenschaftlicherName: 'Boletus reticulatus',
            gruppe: 'Röhrling (Laubwald & wärmeliebend)',
            einsteigerFreundlich: true,
            essbarkeit: 'Essbar (Speisepilz)',
            kurzsteckbrief:
                'Hellbrauner, oft feldrig aufreißender Hut und durchgehendes Stielnetz; wächst im Gegensatz zum Fichten-Steinpilz unter Laubbäumen auf weniger sauren bis kalkhaltigen Böden.',
            requiredPhCategories: ['maessig_sauer', 'neutral', 'kalkhaltig'],
            optimalPhMin: 5.2,
            optimalPhMax: 7.4,
            requiredTrees: ['Buche', 'Eiche'],
            indicatorPlants: ['Waldmeister'],
            optimalRain7dMin: 12,
            optimalRain7dMax: 45,
            seasonMonths: [5, 6, 7, 8, 9, 10],
            lookalikeWarning: {
                name: 'Satansröhrling (auf Kalk) & Gallenröhrling',
                merkmale:
                    'Auf Kalkböden unter Buchen kommt der giftige Satansröhrling vor (blutrote Röhrenmündungen, weißgrauer Hut) – niemals Röhrlinge mit roten Poren sammeln!'
            },
            knowWhySummary:
                'Bevorzugt wärmebegünstigte Buchen- und Eichenwälder auf neutralen bis kalkhaltigen Böden (z. B. Schwäbische Alb, Vorbergzone, Schönbuch-Laubwälder).'
        },
        {
            id: 'morchella-esculenta',
            deutscherName: 'Speisemorchel',
            wissenschaftlicherName: 'Morchella esculenta',
            gruppe: 'Schlauchpilz (Frühjahrs-Kalkzeiger)',
            einsteigerFreundlich: false,
            essbarkeit: 'Essbar (nur gut erhitzt!)',
            kurzsteckbrief:
                'Bienenwabenartig gekammerter Hut, innen komplett hohl. Wächst nur im Frühjahr (April/Mai) auf kalkreichen Auwald- und Eschenstandorten.',
            requiredPhCategories: ['neutral', 'kalkhaltig'],
            optimalPhMin: 6.2,
            optimalPhMax: 8.0,
            requiredTrees: ['Esche', 'Buche', 'Eiche'],
            indicatorPlants: ['Baerlauch', 'Waldmeister'],
            optimalRain7dMin: 10,
            optimalRain7dMax: 40,
            seasonMonths: [3, 4, 5],
            lookalikeWarning: {
                name: 'Giftige Frühjahrslorchel (Gyromitra esculenta)',
                merkmale:
                    'Die tödlich giftige Frühjahrslorchel hat einen hirnartig gewundenen (nicht wabenförmigen) rotbraunen Hut und wächst meist im sauren Kiefernwald!'
            },
            knowWhySummary:
                'Kontrast-Art für den Wissensgraphen: Zeigt Einsteigern sofort, warum im sauren Fichtenwald (pH < 5) die Wahrscheinlichkeit für Kalk-/Auwaldpilze auf 0 % fällt.'
        }
    ];

    // 6. Kuratierte Referenz-Habitate in Baden-Württemberg für den Beginner-Schnellstart
    const DEMO_HABITATS_BW = [
        {
            id: 'schwarzwald_fichte',
            ortsName: 'Nordschwarzwald (ForstBW Fichten-Refugium)',
            lat: 48.6118,
            lng: 8.3675,
            phWert: 4.3,
            phQuelle: 'ISRIC SoilGrids + BWI Säurezeiger',
            bwiScore: 7,
            bwiSbv: [2, 3, 1, 1], // Drahtschmiele, Heidelbeere, Preiselbeere, Heidekraut
            baumarten: ['Fichte', 'Tanne'],
            baumQuelle: 'ForstBW Waldrefugium (Fichten-Mischwald)',
            regen7TageMm: 24.5,
            temperaturC: 13.8,
            schutzgebiete: []
        },
        {
            id: 'schoenbuch_kiefer_buche',
            ortsName: 'Naturpark Schönbuch (Kiefern-/Buchen-Mischwald)',
            lat: 48.5620,
            lng: 9.0450,
            phWert: 5.1,
            phQuelle: 'ISRIC SoilGrids (0–5 cm)',
            bwiScore: 4,
            bwiSbv: [1, 2, 1, 0],
            baumarten: ['Kiefer', 'Buche', 'Eiche'],
            baumQuelle: 'ForstBW / BWI Mischbestand',
            regen7TageMm: 18.2,
            temperaturC: 15.1,
            schutzgebiete: [{ art: 'Schonwald', name: 'Schönbuch-Schonwald' }]
        },
        {
            id: 'alb_kalk_buche',
            ortsName: 'Schwäbische Alb / Schönberg (Kalk-Buchenwald)',
            lat: 48.4310,
            lng: 9.4820,
            phWert: 7.1,
            phQuelle: 'ISRIC SoilGrids (Kalkverwitterung)',
            bwiScore: 0,
            bwiSbv: [0, 0, 0, 0],
            baumarten: ['Buche', 'Eiche', 'Esche'],
            baumQuelle: 'ForstBW Buchen-Mischwald',
            regen7TageMm: 21.0,
            temperaturC: 14.5,
            schutzgebiete: []
        },
        {
            id: 'bannwald_sammelverbot',
            ortsName: 'Bannwald Schwarzwald (Schutzgebiets-Beispiel)',
            lat: 48.5550,
            lng: 8.2350,
            phWert: 4.1,
            phQuelle: 'ISRIC SoilGrids',
            bwiScore: 8,
            bwiSbv: [2, 3, 2, 1],
            baumarten: ['Fichte', 'Tanne'],
            baumQuelle: 'ForstBW Bannwald',
            regen7TageMm: 29.0,
            temperaturC: 11.4,
            schutzgebiete: [{ art: 'Bannwald', name: 'Bannwald Wilder See' }]
        }
    ];

    const SCKM_ONTOLOGY = {
        WISSENSTREPPE_STUFEN,
        PH_CATEGORIES,
        TREE_NODES,
        INDICATOR_NODES,
        MUSHROOM_SPECIES,
        DEMO_HABITATS_BW
    };

    root.SCKM_ONTOLOGY = SCKM_ONTOLOGY;
    if (typeof module !== 'undefined' && module.exports) {
        module.exports = SCKM_ONTOLOGY;
    }
})(typeof window !== 'undefined' ? window : globalThis);
