// ============================================================================
// SCKM Wissensbasis, Einsteiger-Glossar & Ontologie (www/sckm/ontology.js)
// Alle grün markierten Begriffe im Text öffnen direkt den bebilderten Eintrag
// im bestehenden Einsteiger-Lexikon (📖).
// ============================================================================

(function (root) {
    'use strict';

    // 1. Einsteiger-Glossar für klickbare Fachbegriffe (Progressive Disclosure)
    const GLOSSARY_TERMS = {
        mykorrhiza: {
            id: 'mykorrhiza',
            title: 'Mykorrhiza (Baum-Partnerschaft)',
            category: 'Ökologie',
            shortDef:
                'Viele Waldpilze (wie Steinpilz oder Pfifferling) leben unterirdisch in einer engen Lebensgemeinschaft (Symbiose) mit den Wurzeln bestimmter Bäume.',
            forestTip:
                'Praxis-Tipp: Suche im Wald zuerst nach dem richtigen Baum (z. B. Fichte oder Buche)! Ohne den Partnerbaum kann der Pilz dort nicht wachsen.'
        },
        ph_wert: {
            id: 'ph_wert',
            title: 'pH-Wert (Boden-Säure)',
            category: 'Bodenkunde',
            shortDef:
                'Der pH-Wert misst, ob der Waldboden sauer (pH < 5,5, typisch für Nadelwald & Sandstein) oder kalkhaltig/basisch (pH > 6,5, z. B. Schwäbische Alb) ist.',
            forestTip:
                'Praxis-Tipp: Steinpilze, Maronen und Pfifferlinge lieben saure Böden. Morcheln oder der giftige Satansröhrling wachsen dagegen auf Kalkboden.'
        },
        zeigerpflanze: {
            id: 'zeigerpflanze',
            title: 'Zeigerpflanze (Boden-Detektiv)',
            category: 'Pflanzen',
            shortDef:
                'Pflanzen wie die Heidelbeere oder das Heidekraut wachsen nur auf bestimmten Böden und verraten dir sofort den pH-Wert, ohne dass du messen musst.',
            forestTip:
                'Praxis-Tipp: Siehst du im Wald Heidelbeersträucher oder Drahtschmiele-Gras, ist der Boden sauer – ideal für Steinpilz, Marone und Pfifferling!'
        },
        roehrling: {
            id: 'roehrling',
            title: 'Röhrling (Schwamm unter dem Hut)',
            category: 'Pilzmerkmale',
            shortDef:
                'Röhrlinge (z. B. Steinpilz, Maronen-Röhrling) haben auf der Hutunterseite ein Polster aus feinen Röhrchen, das wie ein Badeschwamm aussieht.',
            forestTip:
                'Praxis-Tipp: Für Einsteiger die sicherste Gruppe! In Europa gibt es keinen tödlich giftigen Röhrling (meide aber Röhrlinge mit roten Poren und den bitteren Gallenröhrling).'
        },
        lamellen: {
            id: 'lamellen',
            title: 'Lamellen (Blättchen unter dem Hut)',
            category: 'Pilzmerkmale',
            shortDef:
                'Dünne, messerklingenartige Blättchen unter dem Hut (wie beim Champignon, aber auch beim giftigen Fliegenpilz oder Knollenblätterpilz).',
            forestTip:
                'Praxis-Tipp: Verwechsle niemals dünne, biegsame Lamellen mit einem Röhren-Schwamm oder den festen, gegabelten Leisten des Pfifferlings!'
        },
        leistenpilz: {
            id: 'leistenpilz',
            title: 'Leisten (Merkmal des Pfifferlings)',
            category: 'Pilzmerkmale',
            shortDef:
                'Dickliche, aderige Falten an der Hutunterseite, die am Stiel herablaufen und sich mehrfach gabeln. Sie lassen sich nicht wie Lamellen umbiegen.',
            forestTip:
                'Praxis-Tipp: Echte Leisten sind fest mit dem Hut verwachsen – so unterscheidest du den Echten Pfifferling sicher vom Falschen Pfifferling.'
        },
        bannwald: {
            id: 'bannwald',
            title: 'Bannwald & Naturschutzgebiet',
            category: 'Sammelrecht',
            shortDef:
                'Ein Bannwald ist ein Urwald von morgen, in dem die Natur komplett sich selbst überlassen bleibt. Wie im Naturschutzgebiet und Nationalpark gilt strenger Schutz.',
            forestTip:
                'Praxis-Tipp: In Bannwäldern, Naturschutzgebieten und Nationalparks ist das Pilzesammeln gesetzlich verboten (rote Zonen auf unserer Karte).'
        },
        sammelregel: {
            id: 'sammelregel',
            title: 'Handstraußregel (Eigenbedarf)',
            category: 'Sammelrecht',
            shortDef:
                'Im normalen Wald (oder Schonwald) darfst du in Baden-Württemberg Pilze in geringer Menge für den eigenen Bedarf sammeln (Richtwert: ca. 1 kg pro Person/Tag).',
            forestTip:
                'Praxis-Tipp: Nimm nur Pilze mit, die du sicher kennst, drehe sie ganz mit Stielbasis heraus und transportiere sie luftig im Korb.'
        },
        wissenstreppe: {
            id: 'wissenstreppe',
            title: 'Wissenstreppe (SCKM-Modell)',
            category: 'Wissensmanagement',
            shortDef:
                'Modell nach Klaus North: Aus Roh-Daten (1) werden durch Kontext Informationen (2), durch logische Verknüpfung Wissen/Know-why (3) und schließlich sicheres Handeln (4).',
            forestTip:
                'In unserer App siehst du genau diese Treppe: Von den Wetter-/Bodendaten zur erklärten Pilzwahrscheinlichkeit (%) bis zur Routenplanung.'
        },
        ontologie: {
            id: 'ontologie',
            title: 'Wissensgraph & Ontologie',
            category: 'Wissensmanagement',
            shortDef:
                'Ein semantisches Netzwerk, das Regeln als verknüpfte Knoten speichert (z. B. „Fichten-Steinpilz —ist Baum-Partner für→ Fichte“).',
            forestTip:
                'Klicke im Wissensgraphen auf einen Knoten (pH-Wert, Baum, Pilz oder Zeigerpflanze), um alle passenden Regionen auf der Karte aufleuchten zu lassen!'
        }
    };

    // 2. Markiert Fachbegriffe, Bäume und Zeigerpflanzen im Text und öffnet
    //    beim Klick IMMER das bebilderte Einsteiger-Lexikon beim jeweiligen Eintrag!
    const TERM_PATTERNS = [
        // Fachbegriffe
        { regex: /\b(ektomykorrhizischer Symbiose|Mykorrhiza-Partnerschaft|Mykorrhiza|Symbiose-Partner|Symbiose-Baum|Symbiose)\b/gi, id: 'term:mykorrhiza' },
        { regex: /\b(Boden-pH|pH-Wert|pH\s*[0-9],[0-9]|saurer Rohhumus|sauren Böden)\b/gi, id: 'term:ph_wert' },
        { regex: /\b(Zeigerpflanzen|Zeigerpflanze|Säurezeiger)\b/gi, id: 'term:zeigerpflanze' },
        { regex: /\b(Röhrlinge|Röhrling|Röhren-Polster|Röhrenfutter|Röhren)\b/gi, id: 'term:roehrling' },
        { regex: /\b(Lamellen)\b/gi, id: 'term:lamellen' },
        { regex: /\b(Leistenpilz|Leisten)\b/gi, id: 'term:leistenpilz' },
        { regex: /\b(Bannwald|Naturschutzgebiet|Nationalpark)\b/gi, id: 'term:bannwald' },
        { regex: /\b(Handstraußregel|Eigenbedarf)\b/gi, id: 'term:sammelregel' },
        { regex: /\b(Wissenstreppe)\b/gi, id: 'term:wissenstreppe' },
        { regex: /\b(Ontologie|Wissensgraph)\b/gi, id: 'term:ontologie' },
        // Zeigerpflanzen -> direkt zum Bild im Lexikon
        { regex: /\b(Heidelbeersträucher|Heidelbeeren|Heidelbeere)\b/gi, id: 'plant:Heidelbeere' },
        { regex: /\b(Drahtschmiele)\b/gi, id: 'plant:Drahtschmiele' },
        { regex: /\b(Preiselbeeren|Preiselbeere)\b/gi, id: 'plant:Preiselbeere' },
        { regex: /\b(Heidekraut)\b/gi, id: 'plant:Heidekraut' },
        { regex: /\b(Waldmeister)\b/gi, id: 'plant:Waldmeister' },
        { regex: /\b(Bärlauch|Baerlauch)\b/gi, id: 'plant:Baerlauch' },
        // Bäume -> direkt zum Bild im Lexikon
        { regex: /\b(Fichten|Fichte)\b/g, id: 'tree:Fichte' },
        { regex: /\b(Weißtannen|Weißtanne|Tannen|Tanne)\b/g, id: 'tree:Tanne' },
        { regex: /\b(Waldkiefern|Kiefern|Kiefer)\b/g, id: 'tree:Kiefer' },
        { regex: /\b(Buchen|Buche)\b/g, id: 'tree:Buche' },
        { regex: /\b(Eichen|Eiche)\b/g, id: 'tree:Eiche' },
        { regex: /\b(Birken|Birke)\b/g, id: 'tree:Birke' },
        { regex: /\b(Eschen|Esche)\b/g, id: 'tree:Esche' }
    ];

    function highlightGlossaryTerms(rawText) {
        if (!rawText) return '';
        let result = String(rawText);
        const placeholders = [];
        TERM_PATTERNS.forEach(function (pat) {
            result = result.replace(pat.regex, function (match) {
                const token = '___SCKM_TERM_' + placeholders.length + '___';
                placeholders.push(
                    '<button type="button" class="sckm-term" onclick="event.stopPropagation();window.oeffneLexikonEintrag(\'' +
                        pat.id +
                        '\')" title="Im bebilderten Einsteiger-Lexikon öffnen">' +
                        match +
                        '</button>'
                );
                return token;
            });
        });
        placeholders.forEach(function (html, idx) {
            result = result.replace('___SCKM_TERM_' + idx + '___', html);
        });
        return result;
    }

    // 3. Visuelle Mini-SVGs für den "Unter-dem-Hut-Check"
    const CAP_UNDERSIDE_SVGS = {
        roehren:
            '<svg viewBox="0 0 64 42" width="54" height="36" aria-hidden="true"><path d="M6 22 C6 8, 58 8, 58 22 Z" fill="#8b5a2b"/><rect x="8" y="22" width="48" height="6" rx="3" fill="#e6d690" stroke="#b5a642" stroke-width="1"/><circle cx="15" cy="25" r="1" fill="#8b7d3b"/><circle cx="21" cy="25" r="1" fill="#8b7d3b"/><circle cx="27" cy="25" r="1" fill="#8b7d3b"/><circle cx="33" cy="25" r="1" fill="#8b7d3b"/><circle cx="39" cy="25" r="1" fill="#8b7d3b"/><circle cx="45" cy="25" r="1" fill="#8b7d3b"/><circle cx="51" cy="25" r="1" fill="#8b7d3b"/><path d="M25 28 L23 40 L41 40 L39 28 Z" fill="#f5ebe0" stroke="#d5c4a1"/></svg>',
        leisten:
            '<svg viewBox="0 0 64 42" width="54" height="36" aria-hidden="true"><path d="M8 14 Q32 22 56 14 L42 30 L40 40 L24 40 L22 30 Z" fill="#f59e0b" stroke="#b45309" stroke-width="1.2"/><path d="M16 17 L25 32 M24 18 L28 35 M48 17 L39 32 M40 18 L36 35 M32 19 L32 37" stroke="#b45309" stroke-width="1.4"/></svg>',
        schwamm:
            '<svg viewBox="0 0 64 42" width="54" height="36" aria-hidden="true"><path d="M14 34 C8 28, 10 16, 18 16 C20 10, 32 8, 36 14 C42 8, 54 12, 52 22 C58 26, 54 36, 46 36 Z" fill="#fde68a" stroke="#d97706" stroke-width="1.4"/><path d="M22 22 Q28 16 32 24 M34 20 Q40 16 44 24 M24 30 Q32 24 40 30" fill="none" stroke="#d97706" stroke-width="1.3"/></svg>',
        waben:
            '<svg viewBox="0 0 64 42" width="54" height="36" aria-hidden="true"><path d="M20 26 L32 6 L44 26 Z" fill="#b45309" stroke="#78350f" stroke-width="1.2"/><circle cx="30" cy="16" r="2.2" fill="#78350f"/><circle cx="35" cy="19" r="2.2" fill="#78350f"/><circle cx="28" cy="22" r="2.2" fill="#78350f"/><rect x="27" y="26" width="10" height="14" rx="2" fill="#fef3c7" stroke="#d97706"/></svg>'
    };

    // 4. Die 4 Stufen der Beginner-Wissenstreppe (Vorlesung 06.10.2026)
    const WISSENSTREPPE_STUFEN = [
        {
            stufe: 1,
            id: 'daten',
            titel: '1. Zeichen & Daten',
            untertitel: 'Gemessene Rohwerte der Karten-Sensoren',
            wissensart: 'Syntaktische Basis',
            beschreibung:
                'Reine Zahlen und Codes aus den 5 Schnittstellen (GPS, ISRIC-pH-Pixel, BWI-Waldzelle, Open-Meteo Regen in mm).'
        },
        {
            stufe: 2,
            id: 'information',
            titel: '2. Informationen',
            untertitel: 'Was bedeuten die Werte für den Waldboden?',
            wissensart: 'Know-what (Sachwissen)',
            beschreibung:
                'Aus Messwerten werden verständliche Fakten: Saurer oder kalkhaltiger Boden, erkannte Bäume, Bodenfeuchte und Sammelrecht.'
        },
        {
            stufe: 3,
            id: 'wissen',
            titel: '3. Wissen (Warum X %?)',
            untertitel: 'Verknüpfung von Baum, Boden, Regen & Pilz',
            wissensart: 'Know-why (Erklärungswissen)',
            beschreibung:
                'Unsere Ontologie prüft 4 ökologische Regeln und erklärt transparent, warum ein Pilz an diesem Standort gute oder schlechte Chancen hat.'
        },
        {
            stufe: 4,
            id: 'handeln',
            titel: '4. Sicher Handeln',
            untertitel: 'Sammelrecht, Doppelgänger-Check & Route',
            wissensart: 'Know-how (Handlungskompetenz)',
            beschreibung:
                'Vom Wissen zur Entscheidung im Wald: Prüfe Schutzgebiete, achte auf Doppelgänger und starte deine Route.'
        }
    ];

    // 5. Boden-pH-Klassen (Spalte 1 im Wissensgraph)
    const PH_CATEGORIES = [
        {
            id: 'stark_sauer',
            label: 'Stark sauer',
            rangeText: 'pH 3,5 – 4,7',
            min: 3.0,
            max: 4.75,
            typischBw: 'Nadelwald & Sandstein (z. B. Schwarzwald)',
            einfacheErklaerung:
                'Typischer Nadelwaldboden mit Moos und Heidelbeeren. Lieblingsboden von Steinpilz, Marone und Pfifferling!'
        },
        {
            id: 'maessig_sauer',
            label: 'Mäßig sauer',
            rangeText: 'pH 4,8 – 5,7',
            min: 4.75,
            max: 5.75,
            typischBw: 'Mischwälder (z. B. Schönbuch, Odenwald)',
            einfacheErklaerung:
                'Sehr vielseitiger Waldboden in Mischwäldern – hier fühlen sich fast alle Einsteiger-Röhrlinge und Pfifferlinge wohl.'
        },
        {
            id: 'neutral',
            label: 'Schwach sauer / Neutral',
            rangeText: 'pH 5,8 – 6,7',
            min: 5.75,
            max: 6.75,
            typischBw: 'Laubmischwälder, Kraichgau & Rheinebene',
            einfacheErklaerung:
                'Milder Laubwaldboden unter Buchen und Eichen – gut für den wärmeliebenden Sommer-Steinpilz.'
        },
        {
            id: 'kalkhaltig',
            label: 'Kalkhaltig / Basisch',
            rangeText: 'pH 6,8 – 8,2',
            min: 6.75,
            max: 8.5,
            typischBw: 'Schwäbische Alb, Kaiserstuhl & Auwälder',
            einfacheErklaerung:
                'Kalkreicher Boden (oft mit Waldmeister oder Bärlauch). Hier wachsen Speisemorcheln und Sommer-Steinpilze, aber kaum Maronen.'
        }
    ];

    // 6. Baumarten-Knoten (Spalte 2 im Wissensgraph & Lexikon)
    const TREE_NODES = [
        {
            id: 'Fichte',
            label: 'Fichte',
            gruppe: 'Nadelbaum',
            erkennungsMerkmale:
                'Vierkantige, spitze Einzelnadeln rings um den Zweig (stechen beim Zugreifen) und als Ganzes herabhängende Zapfen.',
            einfacheErklaerung: 'Wichtigster Partnerbaum für Fichten-Steinpilz, Maronen-Röhrling und Pfifferling.'
        },
        {
            id: 'Tanne',
            label: 'Weißtanne',
            gruppe: 'Nadelbaum',
            erkennungsMerkmale:
                'Flache, weiche, stumpfe Nadeln mit 2 weißen Wachsstreifen auf der Unterseite; die Zapfen stehen aufrecht wie Kerzen auf dem Ast!',
            einfacheErklaerung: 'Charakterbaum des Schwarzwalds; teilt sich viele Mykorrhiza-Pilze mit der Fichte.'
        },
        {
            id: 'Kiefer',
            label: 'Kiefer',
            gruppe: 'Nadelbaum',
            erkennungsMerkmale:
                'Lange, biegsame Nadeln, die immer paarweise (zu zweit) aus einer kurzen Scheide wachsen; runde Zapfen und rötlich-plattige Rinde.',
            einfacheErklaerung: 'Einziger Wirtsbaum der Krausen Glucke und wichtiger Partner des Maronen-Röhrlings.'
        },
        {
            id: 'Buche',
            label: 'Buche',
            gruppe: 'Laubbaum',
            erkennungsMerkmale:
                'Glatte, silbergraue Rinde („Elefantenhaut“) und eiförmige Blätter mit glattem, leicht welligem Rand und geraden Seitennerven.',
            einfacheErklaerung: 'Häufigster Laubbaum in BW; Partner für Steinpilze, Sommer-Steinpilze und Pfifferlinge.'
        },
        {
            id: 'Eiche',
            label: 'Eiche',
            gruppe: 'Laubbaum',
            erkennungsMerkmale:
                'Charakteristisch gelappte (gebuchtete) Blätter, tiefgefurchte Borke und Eicheln mit kleinem Schuppen-Hütchen.',
            einfacheErklaerung: 'Wärmeliebender Laubbaum; Top-Partner für den Sommer-Steinpilz und Pfifferling.'
        },
        {
            id: 'Birke',
            label: 'Birke',
            gruppe: 'Laubbaum',
            erkennungsMerkmale:
                'Unverwechselbare weiße Rinde mit schwarzen Querstreifen sowie kleine, dreieckig-rautenförmige Blätter mit doppelt gesägtem Rand.',
            einfacheErklaerung: 'Pionierbaum auf lichten Waldböden (bekannt für Birkenpilze und Pfifferlinge).'
        },
        {
            id: 'Esche',
            label: 'Esche',
            gruppe: 'Laubbaum',
            erkennungsMerkmale:
                'Große, unpaarig gefiederte Blätter (9–13 Einzelblättchen an einer Mittelrippe) und schwarze Knospen; liebt feuchte, kalkreiche Böden.',
            einfacheErklaerung: 'Typischer Baum feuchter, kalkreicher Auwälder – das klassische Habitat der Speisemorchel.'
        }
    ];

    // 7. Zeigerpflanzen (Spalte 4 im Wissensgraph & Lexikon)
    const INDICATOR_NODES = [
        {
            id: 'Heidelbeere',
            label: 'Heidelbeere',
            bwiField: 'sbv02',
            indiziert: 'Zeigt sauren Waldboden (pH < 5,0)',
            erkennungsMerkmale:
                'Grüne, scharfkantige Zweige, weiche sommergrüne Blättchen und blauschwarze, innen dunkelrote Beeren.',
            einfacheErklaerung: 'Wo Heidelbeersträucher im Nadelwald wachsen, sind Steinpilz, Marone und Pfifferling oft nicht weit!'
        },
        {
            id: 'Drahtschmiele',
            label: 'Drahtschmiele',
            bwiField: 'sbv01',
            indiziert: 'Feines Waldgras auf saurem Boden',
            erkennungsMerkmale:
                'Büschel aus haardünnen, borstig-drahtigen Grasblättern mit silbrig glänzenden, geschlängelten Rispenästen.',
            einfacheErklaerung: 'Sehr häufiges, drahtiges Gras auf sauren Waldböden – ein verlässlicher Säurezeiger.'
        },
        {
            id: 'Preiselbeere',
            label: 'Preiselbeere',
            bwiField: 'sbv03',
            indiziert: 'Zeigt stark sauren Nadelwald',
            erkennungsMerkmale:
                'Immergrüne, derb-lederartige, glänzende Blätter mit umgerolltem Rand und leuchtend rote Beeren.',
            einfacheErklaerung: 'Immergrüner Zwergstrauch auf mageren, sauren Kiefern- und Fichtenböden.'
        },
        {
            id: 'Heidekraut',
            label: 'Heidekraut',
            bwiField: 'sbv04',
            indiziert: 'Lichter, saurer Sandboden',
            erkennungsMerkmale:
                'Winzige, dachziegelartig anliegende Schuppenblättchen und violett-rosa Blütenähren im Spätsommer/Herbst.',
            einfacheErklaerung: 'Typisch für lichte Kiefernwälder, in denen Krause Glucke und Maronen-Röhrling wachsen.'
        },
        {
            id: 'Waldmeister',
            label: 'Waldmeister',
            bwiField: null,
            indiziert: 'Zeigt kalk-/basenreichen Buchenwald',
            erkennungsMerkmale:
                '6 bis 8 lanzettliche Blätter stehen sternförmig wie ein Wagenrad (Quirl) rund um den vierkantigen Stängel.',
            einfacheErklaerung: 'Wächst auf milden bis kalkhaltigen Laubwaldböden – gut für den Sommer-Steinpilz.'
        },
        {
            id: 'Baerlauch',
            label: 'Bärlauch',
            bwiField: null,
            indiziert: 'Feuchter, kalkreicher Auwald',
            erkennungsMerkmale:
                'Breite, saftig-grüne lanzettliche Blätter, die beim Zerreiben intensiv nach Knoblauch riechen, plus weiße Sternblüten im Frühling.',
            einfacheErklaerung: 'Nach Knoblauch duftende Frühjahrspflanze – zeigt im April/Mai gute Morchel-Standorte an.'
        }
    ];

    // 8. Die 6 kontrastierenden Pilzarten (Spalte 3 im Wissensgraph & Lexikon)
    const MUSHROOM_SPECIES = [
        {
            id: 'boletus-edulis',
            deutscherName: 'Fichten-Steinpilz',
            wissenschaftlicherName: 'Boletus edulis',
            gruppe: 'Röhrling (Schwamm unter dem Hut)',
            capType: 'roehren',
            einsteigerFreundlich: true,
            essbarkeit: 'Essbar · Beliebter Einsteigerpilz',
            kurzsteckbrief:
                'Brauner Hut mit hellerem Rand, weißes bis gelbgrünes Röhren-Polster (Schwamm) unter dem Hut, kräftiger Stiel mit feinem weißem Netz.',
            requiredPhCategories: ['stark_sauer', 'maessig_sauer'],
            optimalPhMin: 4.0,
            optimalPhMax: 5.8,
            requiredTrees: ['Fichte', 'Tanne', 'Buche', 'Kiefer'],
            indicatorPlants: ['Heidelbeere', 'Drahtschmiele', 'Preiselbeere'],
            optimalRain7dMin: 12,
            optimalRain7dMax: 45,
            saisonText: 'Juli bis November',
            seasonMonths: [7, 8, 9, 10, 11],
            lookalikeWarning: {
                name: 'Gallenröhrling & junger Fliegenpilz',
                merkmale:
                    'Der bittere Gallenröhrling hat ein dunkles Stielnetz und rosa Röhren. Der giftige Fliegenpilz hat weiße Lamellen statt eines Schwamms!'
            },
            knowWhySummary:
                'Wächst in Mykorrhiza-Partnerschaft mit Fichten, Tannen oder Buchen auf sauren Böden. Nach 12–35 mm Regen in der Vorwoche sprießen die Fruchtkörper.'
        },
        {
            id: 'imleria-badia',
            deutscherName: 'Maronen-Röhrling',
            wissenschaftlicherName: 'Imleria badia',
            gruppe: 'Röhrling (Schwamm blaut auf Druck)',
            capType: 'roehren',
            einsteigerFreundlich: true,
            essbarkeit: 'Essbar · Sehr häufiger Einsteigerpilz',
            kurzsteckbrief:
                'Kastanienbrauner Hut; die gelblichen Röhren unter dem Hut verfärben sich bei Fingerdruck deutlich blaugrün. Stiel ohne Netz.',
            requiredPhCategories: ['stark_sauer', 'maessig_sauer'],
            optimalPhMin: 3.6,
            optimalPhMax: 5.4,
            requiredTrees: ['Fichte', 'Kiefer', 'Tanne'],
            indicatorPlants: ['Heidelbeere', 'Drahtschmiele', 'Preiselbeere', 'Heidekraut'],
            optimalRain7dMin: 10,
            optimalRain7dMax: 45,
            saisonText: 'August bis November',
            seasonMonths: [8, 9, 10, 11],
            lookalikeWarning: {
                name: 'Gallenröhrling',
                merkmale:
                    'Drücke leicht auf den Schwamm: Die Marone blaut, der ungenießbare Gallenröhrling blaut niemals und hat rosa Röhren.'
            },
            knowWhySummary:
                'Liebt saure Nadelwälder mit Fichten oder Kiefern, in denen Heidelbeere und Drahtschmiele als Zeigerpflanzen den Boden bedecken.'
        },
        {
            id: 'cantharellus-cibarius',
            deutscherName: 'Echter Pfifferling',
            wissenschaftlicherName: 'Cantharellus cibarius',
            gruppe: 'Leistenpilz (gegabelte Leisten)',
            capType: 'leisten',
            einsteigerFreundlich: true,
            essbarkeit: 'Essbar · Beliebter Speisepilz',
            kurzsteckbrief:
                'Dottergelber, trichterförmiger Pilz mit festen, gegabelten Leisten (keine beweglichen Lamellen!), riecht fruchtig nach Aprikose.',
            requiredPhCategories: ['stark_sauer', 'maessig_sauer'],
            optimalPhMin: 4.0,
            optimalPhMax: 5.7,
            requiredTrees: ['Fichte', 'Buche', 'Eiche', 'Kiefer'],
            indicatorPlants: ['Heidelbeere', 'Drahtschmiele'],
            optimalRain7dMin: 15,
            optimalRain7dMax: 50,
            saisonText: 'Juni bis Oktober',
            seasonMonths: [6, 7, 8, 9, 10],
            lookalikeWarning: {
                name: 'Falscher Pfifferling',
                merkmale:
                    'Der Falsche Pfifferling hat dünne, biegsame, engstehende Lamellen statt fester, aderiger Leisten.'
            },
            knowWhySummary:
                'Braucht moosige, saure Waldböden unter Fichten oder Buchen und kräftige Regenfälle (> 15 mm in 7 Tagen).'
        },
        {
            id: 'sparassis-crispa',
            deutscherName: 'Krause Glucke',
            wissenschaftlicherName: 'Sparassis crispa',
            gruppe: 'Badeschwamm-Form am Kiefernstamm',
            capType: 'schwamm',
            einsteigerFreundlich: true,
            essbarkeit: 'Essbar · Sehr leicht erkennbar',
            kurzsteckbrief:
                'Sieht aus wie ein großer, gelblicher Badeschwamm oder Blumenkohl und wächst direkt am Fuß von Kiefern.',
            requiredPhCategories: ['stark_sauer', 'maessig_sauer'],
            optimalPhMin: 3.8,
            optimalPhMax: 5.6,
            requiredTrees: ['Kiefer'],
            indicatorPlants: ['Preiselbeere', 'Heidekraut', 'Drahtschmiele'],
            optimalRain7dMin: 10,
            optimalRain7dMax: 40,
            saisonText: 'August bis November',
            seasonMonths: [8, 9, 10, 11],
            lookalikeWarning: {
                name: 'Kaum verwechselbar',
                merkmale:
                    'Durch die Badeschwamm-Form direkt am Kiefernstamm für Einsteiger einer der sichersten Speisepilze überhaupt.'
            },
            knowWhySummary:
                'Strenger Spezialist an alten Waldkiefern auf sauren Böden. Ohne Kiefer im Wald liegt die Chance nahe 0 %.'
        },
        {
            id: 'boletus-reticulatus',
            deutscherName: 'Sommer-Steinpilz',
            wissenschaftlicherName: 'Boletus reticulatus',
            gruppe: 'Röhrling (Laubwald-Steinpilz)',
            capType: 'roehren',
            einsteigerFreundlich: true,
            essbarkeit: 'Essbar · Speisepilz der Laubwälder',
            kurzsteckbrief:
                'Hellbrauner Hut (reißt bei Trockenheit oft feldrig auf), Schwamm unter dem Hut, wächst unter Buchen und Eichen.',
            requiredPhCategories: ['maessig_sauer', 'neutral', 'kalkhaltig'],
            optimalPhMin: 5.2,
            optimalPhMax: 7.4,
            requiredTrees: ['Buche', 'Eiche'],
            indicatorPlants: ['Waldmeister'],
            optimalRain7dMin: 12,
            optimalRain7dMax: 45,
            saisonText: 'Mai bis Oktober',
            seasonMonths: [5, 6, 7, 8, 9, 10],
            lookalikeWarning: {
                name: 'Satansröhrling (auf Kalk) & Gallenröhrling',
                merkmale:
                    'Auf Kalkböden unter Buchen niemals Röhrlinge mit roten Poren (giftiger Satansröhrling) sammeln!'
            },
            knowWhySummary:
                'Wächst im Gegensatz zum Fichten-Steinpilz in wärmeren Buchen- und Eichenwäldern, auch auf neutralen bis kalkhaltigen Böden.'
        },
        {
            id: 'morchella-esculenta',
            deutscherName: 'Speisemorchel',
            wissenschaftlicherName: 'Morchella esculenta',
            gruppe: 'Waben-Hut (Frühjahrs-Kalkpilz)',
            capType: 'waben',
            einsteigerFreundlich: false,
            essbarkeit: 'Essbar (nur gut gekocht, für Fortgeschrittene)',
            kurzsteckbrief:
                'Bienenwabenartiger Hut, innen komplett hohl. Wächst nur im Frühling (April/Mai) auf kalkreichen Böden.',
            requiredPhCategories: ['neutral', 'kalkhaltig'],
            optimalPhMin: 6.2,
            optimalPhMax: 8.0,
            requiredTrees: ['Esche', 'Buche', 'Eiche'],
            indicatorPlants: ['Baerlauch', 'Waldmeister'],
            optimalRain7dMin: 10,
            optimalRain7dMax: 40,
            saisonText: 'März bis Mai (Frühling)',
            seasonMonths: [3, 4, 5],
            lookalikeWarning: {
                name: 'Tödlich giftige Frühjahrslorchel',
                merkmale:
                    'Die giftige Frühjahrslorchel hat einen hirnartig gewundenen (nicht wabenförmigen) rotbraunen Hut!'
            },
            knowWhySummary:
                'Kontrast-Art für Kalkböden und Auwälder (unter Eschen bei Bärlauch). Im sauren Fichtenwald liegt ihre Chance bei 0 %.'
        }
    ];

    // 9. Kuratierte Referenz-Habitate in Baden-Württemberg für den Schnellstart
    const DEMO_HABITATS_BW = [
        {
            id: 'schwarzwald_fichte',
            ortsName: 'Nordschwarzwald (Fichten- & Tannenwald)',
            lat: 48.6118,
            lng: 8.3675,
            phWert: 4.3,
            phQuelle: 'ISRIC SoilGrids + BWI Säurezeiger',
            bwiScore: 7,
            bwiSbv: [2, 3, 1, 1],
            baumarten: ['Fichte', 'Tanne'],
            baumQuelle: 'ForstBW Waldrefugium (Fichten-Mischwald)',
            regen7TageMm: 24.5,
            temperaturC: 13.8,
            schutzgebiete: []
        },
        {
            id: 'schoenbuch_kiefer_buche',
            ortsName: 'Naturpark Schönbuch (Kiefern-Buchen-Mischwald)',
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
            ortsName: 'Schwäbische Alb (Kalk-Buchenwald)',
            lat: 48.4310,
            lng: 9.4820,
            phWert: 7.1,
            phQuelle: 'ISRIC SoilGrids (Kalkboden)',
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
            ortsName: 'Bannwald Wilder See (Schutzgebiet-Beispiel)',
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
        GLOSSARY_TERMS: GLOSSARY_TERMS,
        highlightGlossaryTerms: highlightGlossaryTerms,
        CAP_UNDERSIDE_SVGS: CAP_UNDERSIDE_SVGS,
        WISSENSTREPPE_STUFEN: WISSENSTREPPE_STUFEN,
        PH_CATEGORIES: PH_CATEGORIES,
        TREE_NODES: TREE_NODES,
        INDICATOR_NODES: INDICATOR_NODES,
        MUSHROOM_SPECIES: MUSHROOM_SPECIES,
        DEMO_HABITATS_BW: DEMO_HABITATS_BW
    };

    root.SCKM_ONTOLOGY = SCKM_ONTOLOGY;
    if (typeof module !== 'undefined' && module.exports) {
        module.exports = SCKM_ONTOLOGY;
    }
})(typeof window !== 'undefined' ? window : globalThis);
