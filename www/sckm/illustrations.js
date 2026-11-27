// ============================================================================
// SCKM Schematische Merkmals-Illustrationen (www/sckm/illustrations.js)
// Hebt die Erkennungs-Eigenheiten aller 6 Pilzarten, 7 Baumarten,
// 6 Zeigerpflanzen und 10 Fachbegriffe für Einsteiger visuell hervor.
// ============================================================================

(function (root) {
    'use strict';

    const SVGS = {
        // ====================================================================
        // A. DIE 6 PILZARTEN (Schematische Erkennungsmerkmale)
        // ====================================================================
        'boletus-edulis':
            '<svg viewBox="0 0 120 84" class="sckm-ill-svg" aria-label="Schema Fichten-Steinpilz">' +
            '<rect width="120" height="84" rx="10" fill="#fffbeb"/>' +
            '<!-- Brauner Hut mit weißem Rand -->' +
            '<path d="M18 36 C18 12, 82 12, 82 36 Z" fill="#8b5a2b" stroke="#fde68a" stroke-width="1.5"/>' +
            '<!-- Gelbgrüner Röhren-Schwamm -->' +
            '<rect x="21" y="36" width="58" height="8" rx="3" fill="#d9f99d" stroke="#65a30d" stroke-width="1.2"/>' +
            '<line x1="28" y1="36" x2="28" y2="44" stroke="#65a30d" stroke-width="0.9"/>' +
            '<line x1="36" y1="36" x2="36" y2="44" stroke="#65a30d" stroke-width="0.9"/>' +
            '<line x1="44" y1="36" x2="44" y2="44" stroke="#65a30d" stroke-width="0.9"/>' +
            '<line x1="52" y1="36" x2="52" y2="44" stroke="#65a30d" stroke-width="0.9"/>' +
            '<line x1="60" y1="36" x2="60" y2="44" stroke="#65a30d" stroke-width="0.9"/>' +
            '<line x1="68" y1="36" x2="68" y2="44" stroke="#65a30d" stroke-width="0.9"/>' +
            '<!-- Bauchiger Stiel mit feinem weißem Netz -->' +
            '<path d="M39 44 C34 56, 33 74, 41 78 L59 78 C67 74, 66 56, 61 44 Z" fill="#f5ebe0" stroke="#b08968" stroke-width="1.2"/>' +
            '<path d="M41 48 L48 53 L56 48 M40 54 L49 59 L58 54 M44 45 L44 57 M54 45 L54 57" fill="none" stroke="#ffffff" stroke-width="1.1"/>' +
            '<!-- Merkmal-Labels -->' +
            '<text x="85" y="27" font-size="7.5" font-weight="700" fill="#78350f">Brauner Hut</text>' +
            '<text x="83" y="42" font-size="7.5" font-weight="700" fill="#3f6212">← Schwamm</text>' +
            '<text x="68" y="62" font-size="7.5" font-weight="700" fill="#78350f">← Weißes Netz</text>' +
            '</svg>',

        'imleria-badia':
            '<svg viewBox="0 0 120 84" class="sckm-ill-svg" aria-label="Schema Maronen-Röhrling">' +
            '<rect width="120" height="84" rx="10" fill="#eff6ff"/>' +
            '<!-- Kastanienbrauner Hut -->' +
            '<path d="M18 36 C18 14, 78 14, 78 36 Z" fill="#5c2c16" stroke="#3b1a0b" stroke-width="1.2"/>' +
            '<!-- Röhrenfutter + Blauen auf Druck -->' +
            '<rect x="21" y="36" width="52" height="8" rx="3" fill="#fef08a" stroke="#ca8a04" stroke-width="1.1"/>' +
            '<ellipse cx="56" cy="40" rx="11" ry="4" fill="#1d4ed8"/>' +
            '<!-- Schlanker Stiel ohne Netz -->' +
            '<path d="M40 44 L38 77 L56 77 L54 44 Z" fill="#e6ccb2" stroke="#9c6644" stroke-width="1.2"/>' +
            '<text x="77" y="26" font-size="7.5" font-weight="700" fill="#5c2c16">Kastanienhut</text>' +
            '<text x="75" y="42" font-size="7.5" font-weight="700" fill="#1d4ed8">← Blaut bei</text>' +
            '<text x="82" y="50" font-size="7.5" font-weight="700" fill="#1d4ed8">Fingerdruck!</text>' +
            '<text x="60" y="68" font-size="7.2" font-weight="600" fill="#64748b">Stiel ohne Netz</text>' +
            '</svg>',

        'cantharellus-cibarius':
            '<svg viewBox="0 0 120 84" class="sckm-ill-svg" aria-label="Schema Echter Pfifferling">' +
            '<rect width="120" height="84" rx="10" fill="#fefce8"/>' +
            '<!-- Dottergelber Trichter mit herablaufenden, gegabelten Leisten -->' +
            '<path d="M14 22 Q46 34 78 22 Q64 46 56 54 L54 77 L38 77 L36 54 Q28 46 14 22 Z" fill="#facc15" stroke="#ca8a04" stroke-width="1.5"/>' +
            '<!-- Gegabelte Leisten -->' +
            '<path d="M23 26 L39 52 M29 27 L39 45 M69 26 L53 52 M63 27 L53 45 M46 29 L46 56 M38 28 L43 44 M54 28 L49 44" stroke="#b45309" stroke-width="1.4" fill="none"/>' +
            '<text x="72" y="38" font-size="7.5" font-weight="700" fill="#b45309">← Gegabelte</text>' +
            '<text x="79" y="46" font-size="7.5" font-weight="700" fill="#b45309">Leisten (fest)</text>' +
            '<text x="60" y="68" font-size="7.2" font-weight="700" fill="#854d0e">Aprikosen-Duft</text>' +
            '</svg>',

        'sparassis-crispa':
            '<svg viewBox="0 0 120 84" class="sckm-ill-svg" aria-label="Schema Krause Glucke">' +
            '<rect width="120" height="84" rx="10" fill="#fffbeb"/>' +
            '<!-- Kiefernstamm links -->' +
            '<rect x="10" y="8" width="18" height="70" rx="2" fill="#9a3412"/>' +
            '<path d="M14 14 L24 22 M13 34 L25 40 M15 54 L24 62" stroke="#431407" stroke-width="1.3"/>' +
            '<!-- Blumenkohl-/Badeschwamm-Fruchtkörper am Stammfuß -->' +
            '<path d="M26 72 C22 60, 26 44, 36 44 C38 34, 52 32, 58 40 C66 32, 82 38, 78 52 C86 58, 80 74, 68 74 Z" fill="#fde68a" stroke="#d97706" stroke-width="1.5"/>' +
            '<path d="M36 54 Q42 46 48 54 M50 48 Q58 42 64 50 M40 64 Q48 56 56 64 M58 62 Q66 54 72 62" fill="none" stroke="#b45309" stroke-width="1.3"/>' +
            '<text x="32" y="22" font-size="7.5" font-weight="700" fill="#9a3412">← Kiefernstamm</text>' +
            '<text x="42" y="32" font-size="7.5" font-weight="700" fill="#b45309">Badeschwamm-Form</text>' +
            '</svg>',

        'boletus-reticulatus':
            '<svg viewBox="0 0 120 84" class="sckm-ill-svg" aria-label="Schema Sommer-Steinpilz">' +
            '<rect width="120" height="84" rx="10" fill="#fdf8f6"/>' +
            '<!-- Hellbrauner Hut mit feldrigen Trockenrissen -->' +
            '<path d="M18 36 C18 13, 80 13, 80 36 Z" fill="#b07d4f" stroke="#78350f" stroke-width="1.3"/>' +
            '<path d="M34 19 L39 27 L32 31 M52 17 L48 26 L57 30 M64 21 L60 29" fill="none" stroke="#fef3c7" stroke-width="1.3"/>' +
            '<rect x="21" y="36" width="56" height="7" rx="3" fill="#ecfccb" stroke="#65a30d" stroke-width="1.1"/>' +
            '<path d="M39 43 C35 56, 35 73, 41 77 L57 77 C63 73, 63 56, 59 43 Z" fill="#e6ccb2" stroke="#9c6644" stroke-width="1.2"/>' +
            '<path d="M41 48 L49 54 L57 48 M40 58 L49 64 L58 58 M41 68 L49 73 L57 68" fill="none" stroke="#78350f" stroke-width="0.9"/>' +
            '<text x="76" y="22" font-size="7.3" font-weight="700" fill="#78350f">← Feldrige</text>' +
            '<text x="83" y="30" font-size="7.3" font-weight="700" fill="#78350f">Hut-Risse</text>' +
            '<text x="64" y="62" font-size="7.3" font-weight="700" fill="#15803d">Laubwald (Buche)</text>' +
            '</svg>',

        'morchella-esculenta':
            '<svg viewBox="0 0 120 84" class="sckm-ill-svg" aria-label="Schema Speisemorchel">' +
            '<rect width="120" height="84" rx="10" fill="#fff7ed"/>' +
            '<!-- Bienenwaben-Hut -->' +
            '<path d="M28 46 C24 22, 36 10, 48 10 C60 10, 72 22, 68 46 Z" fill="#d97706" stroke="#78350f" stroke-width="1.4"/>' +
            '<!-- Waben-Kammern -->' +
            '<polygon points="40,18 46,16 49,22 43,25" fill="#92400e" stroke="#fde68a" stroke-width="1"/>' +
            '<polygon points="51,18 57,20 56,26 50,25" fill="#92400e" stroke="#fde68a" stroke-width="1"/>' +
            '<polygon points="35,28 42,27 44,34 37,35" fill="#92400e" stroke="#fde68a" stroke-width="1"/>' +
            '<polygon points="46,28 53,28 54,35 46,36" fill="#92400e" stroke="#fde68a" stroke-width="1"/>' +
            '<polygon points="56,29 62,31 60,38 55,36" fill="#92400e" stroke="#fde68a" stroke-width="1"/>' +
            '<polygon points="40,38 48,38 48,44 39,44" fill="#92400e" stroke="#fde68a" stroke-width="1"/>' +
            '<!-- Hohler Stiel -->' +
            '<rect x="40" y="46" width="16" height="30" rx="3" fill="#fef3c7" stroke="#b45309" stroke-width="1.2"/>' +
            '<rect x="45" y="49" width="6" height="24" rx="2" fill="#ffffff" stroke="#d97706" stroke-dasharray="2,2"/>' +
            '<text x="72" y="25" font-size="7.5" font-weight="700" fill="#92400e">← Bienenwaben</text>' +
            '<text x="60" y="60" font-size="7.5" font-weight="700" fill="#b45309">← Innen komplett</text>' +
            '<text x="68" y="68" font-size="7.5" font-weight="700" fill="#b45309">hohl (Frühling)</text>' +
            '</svg>',

        // ====================================================================
        // B. DIE 7 SYMBIOSE-BAUMARTEN (Nadel-/Blatt- & Zapfen-Schema)
        // ====================================================================
        Fichte:
            '<svg viewBox="0 0 120 84" class="sckm-ill-svg" aria-label="Schema Fichte">' +
            '<rect width="120" height="84" rx="10" fill="#ecfdf5"/>' +
            '<!-- Zweig mit spitzen Einzelnadeln ringsum -->' +
            '<line x1="12" y1="26" x2="72" y2="26" stroke="#78350f" stroke-width="2.2"/>' +
            '<path d="M18 26 L14 14 M24 26 L20 14 M30 26 L26 14 M36 26 L32 14 M42 26 L38 14 M48 26 L44 14 M54 26 L50 14 M18 26 L14 38 M24 26 L20 38 M30 26 L26 38 M36 26 L32 38 M42 26 L38 38" stroke="#15803d" stroke-width="1.6"/>' +
            '<!-- Hängender Zapfen! -->' +
            '<path d="M62 26 C55 38, 56 64, 62 74 C68 64, 69 38, 62 26 Z" fill="#92400e" stroke="#451a03" stroke-width="1.2"/>' +
            '<path d="M58 40 Q62 45 66 40 M57 50 Q62 55 67 50 M58 60 Q62 65 66 60" fill="none" stroke="#fde68a" stroke-width="0.9"/>' +
            '<text x="12" y="54" font-size="7.4" font-weight="700" fill="#065f46">Spitze Einzelnadeln</text>' +
            '<text x="12" y="63" font-size="7.2" fill="#047857">(stechen beim Greifen)</text>' +
            '<text x="72" y="48" font-size="7.5" font-weight="700" fill="#92400e">← Zapfen</text>' +
            '<text x="79" y="57" font-size="7.5" font-weight="700" fill="#92400e">hängt nach</text>' +
            '<text x="79" y="66" font-size="7.5" font-weight="700" fill="#92400e">unten!</text>' +
            '</svg>',

        Tanne:
            '<svg viewBox="0 0 120 84" class="sckm-ill-svg" aria-label="Schema Weißtanne">' +
            '<rect width="120" height="84" rx="10" fill="#ecfdf5"/>' +
            '<!-- Zweig unten -->' +
            '<line x1="12" y1="54" x2="76" y2="54" stroke="#78350f" stroke-width="2.2"/>' +
            '<!-- Flache gescheitelte Nadeln mit 2 weißen Streifen -->' +
            '<path d="M18 54 L16 40 M25 54 L23 40 M32 54 L30 40 M39 54 L37 40 M18 54 L16 68 M25 54 L23 68 M32 54 L30 68 M39 54 L37 68" stroke="#047857" stroke-width="2.4" stroke-linecap="round"/>' +
            '<path d="M18 54 L16 68 M25 54 L23 68 M32 54 L30 68" stroke="#e2e8f0" stroke-width="0.9" stroke-dasharray="2,1"/>' +
            '<!-- Aufrecht stehender Zapfen! -->' +
            '<path d="M62 54 C55 42, 56 18, 62 10 C68 18, 69 42, 62 54 Z" fill="#a16207" stroke="#451a03" stroke-width="1.2"/>' +
            '<text x="72" y="24" font-size="7.5" font-weight="700" fill="#92400e">← Zapfen steht</text>' +
            '<text x="79" y="33" font-size="7.5" font-weight="700" fill="#92400e">aufrecht!</text>' +
            '<text x="44" y="74" font-size="7.3" font-weight="700" fill="#065f46">Flache Nadeln (2 weiße Streifen)</text>' +
            '</svg>',

        Kiefer:
            '<svg viewBox="0 0 120 84" class="sckm-ill-svg" aria-label="Schema Waldkiefer">' +
            '<rect width="120" height="84" rx="10" fill="#f0fdf4"/>' +
            '<!-- Lange Nadeln immer paarweise (2er-Bündel) -->' +
            '<rect x="18" y="48" width="6" height="8" rx="1" fill="#78350f"/>' +
            '<path d="M21 48 C14 26, 12 14, 8 10 M21 48 C28 26, 32 14, 38 10" fill="none" stroke="#15803d" stroke-width="1.8"/>' +
            '<rect x="44" y="48" width="6" height="8" rx="1" fill="#78350f"/>' +
            '<path d="M47 48 C40 26, 38 14, 34 10 M47 48 C54 26, 58 14, 64 10" fill="none" stroke="#15803d" stroke-width="1.8"/>' +
            '<!-- Runder Kiefernzapfen -->' +
            '<path d="M78 38 C70 46, 72 64, 80 68 C88 64, 90 46, 82 38 Z" fill="#78350f" stroke="#451a03" stroke-width="1.2"/>' +
            '<text x="10" y="72" font-size="7.5" font-weight="700" fill="#166534">Lange Nadeln immer zu zweit (Paar)</text>' +
            '<text x="66" y="25" font-size="7.4" font-weight="700" fill="#9a3412">Wirtsbaum der</text>' +
            '<text x="66" y="34" font-size="7.4" font-weight="700" fill="#9a3412">Krausen Glucke</text>' +
            '</svg>',

        Buche:
            '<svg viewBox="0 0 120 84" class="sckm-ill-svg" aria-label="Schema Rotbuche">' +
            '<rect width="120" height="84" rx="10" fill="#f0fdf4"/>' +
            '<!-- Ovales Buchenblatt mit glattem/leicht welligem Rand & geraden Seitennerven -->' +
            '<path d="M16 54 C18 24, 42 12, 66 20 C60 46, 42 64, 16 54 Z" fill="#22c55e" stroke="#15803d" stroke-width="1.5"/>' +
            '<path d="M12 57 L64 21 M28 46 L25 32 M38 39 L36 24 M48 32 L48 20 M28 46 L42 50 M38 39 L52 42" fill="none" stroke="#14532d" stroke-width="1.1"/>' +
            '<text x="68" y="32" font-size="7.5" font-weight="700" fill="#14532d">← Glatter, leicht</text>' +
            '<text x="74" y="41" font-size="7.5" font-weight="700" fill="#14532d">welliger Rand</text>' +
            '<text x="14" y="73" font-size="7.4" font-weight="700" fill="#475569">Silbergraue, glatte Rinde</text>' +
            '</svg>',

        Eiche:
            '<svg viewBox="0 0 120 84" class="sckm-ill-svg" aria-label="Schema Eiche">' +
            '<rect width="120" height="84" rx="10" fill="#f0fdf4"/>' +
            '<!-- Typisch gebuchtetes Eichenblatt -->' +
            '<path d="M14 44 C18 36, 24 42, 26 32 C28 22, 36 30, 42 20 C48 12, 58 20, 62 28 C58 36, 50 34, 48 44 C44 52, 34 46, 30 54 C24 58, 18 50, 14 44 Z" fill="#16a34a" stroke="#14532d" stroke-width="1.4"/>' +
            '<!-- Eichel mit Becher -->' +
            '<ellipse cx="82" cy="52" rx="7" ry="10" fill="#a16207" stroke="#78350f" stroke-width="1.2"/>' +
            '<path d="M74 45 Q82 38 90 45 L88 49 L76 49 Z" fill="#78350f"/>' +
            '<text x="65" y="22" font-size="7.5" font-weight="700" fill="#14532d">← Gebuchtetes</text>' +
            '<text x="72" y="30" font-size="7.5" font-weight="700" fill="#14532d">Blatt (Lappen)</text>' +
            '<text x="68" y="73" font-size="7.4" font-weight="700" fill="#78350f">Eichel mit Hütchen</text>' +
            '</svg>',

        Birke:
            '<svg viewBox="0 0 120 84" class="sckm-ill-svg" aria-label="Schema Birke">' +
            '<rect width="120" height="84" rx="10" fill="#f8fafc"/>' +
            '<!-- Weißer Stamm mit schwarzen Streifen -->' +
            '<rect x="12" y="10" width="16" height="64" rx="2" fill="#ffffff" stroke="#94a3b8" stroke-width="1.2"/>' +
            '<path d="M13 22 L23 24 M16 38 L27 36 M12 54 L22 56" stroke="#1e293b" stroke-width="2.2"/>' +
            '<!-- Dreieckig-rautenförmiges Blatt -->' +
            '<polygon points="42,46 58,18 74,46 58,58" fill="#4ade80" stroke="#15803d" stroke-width="1.4"/>' +
            '<text x="34" y="72" font-size="7.5" font-weight="700" fill="#1e293b">Weiße Rinde &amp; Dreiecksblatt</text>' +
            '</svg>',

        Esche:
            '<svg viewBox="0 0 120 84" class="sckm-ill-svg" aria-label="Schema Esche">' +
            '<rect width="120" height="84" rx="10" fill="#f0fdf4"/>' +
            '<!-- Unpaarig gefiedertes Blatt (7 Einzelblättchen) -->' +
            '<line x1="14" y1="42" x2="72" y2="42" stroke="#15803d" stroke-width="1.6"/>' +
            '<ellipse cx="28" cy="28" rx="5" ry="9" fill="#22c55e" stroke="#15803d"/>' +
            '<ellipse cx="44" cy="28" rx="5" ry="9" fill="#22c55e" stroke="#15803d"/>' +
            '<ellipse cx="60" cy="28" rx="5" ry="9" fill="#22c55e" stroke="#15803d"/>' +
            '<ellipse cx="28" cy="56" rx="5" ry="9" fill="#22c55e" stroke="#15803d"/>' +
            '<ellipse cx="44" cy="56" rx="5" ry="9" fill="#22c55e" stroke="#15803d"/>' +
            '<ellipse cx="60" cy="56" rx="5" ry="9" fill="#22c55e" stroke="#15803d"/>' +
            '<ellipse cx="76" cy="42" rx="9" ry="5" fill="#22c55e" stroke="#15803d"/>' +
            '<text x="74" y="22" font-size="7.4" font-weight="700" fill="#14532d">Gefiedertes Blatt</text>' +
            '<text x="74" y="68" font-size="7.3" font-weight="700" fill="#0369a1">Auwald / Morchel</text>' +
            '</svg>',

        // ====================================================================
        // C. DIE 6 ZEIGERPFLANZEN (Boden-Detektive)
        // ====================================================================
        Heidelbeere:
            '<svg viewBox="0 0 120 84" class="sckm-ill-svg" aria-label="Schema Heidelbeere">' +
            '<rect width="120" height="84" rx="10" fill="#eff6ff"/>' +
            '<!-- Grüne kantige Zweige -->' +
            '<path d="M18 72 L38 40 L64 22 M38 40 L24 22" fill="none" stroke="#16a34a" stroke-width="2.4"/>' +
            '<!-- Ovale sommergrüne Blätter -->' +
            '<ellipse cx="24" cy="22" rx="8" ry="5" fill="#4ade80" stroke="#15803d"/>' +
            '<ellipse cx="64" cy="22" rx="8" ry="5" fill="#4ade80" stroke="#15803d"/>' +
            '<!-- Blauschwarze Beeren -->' +
            '<circle cx="44" cy="48" r="7" fill="#1e3a8a" stroke="#172554" stroke-width="1.2"/>' +
            '<circle cx="56" cy="38" r="6.5" fill="#1e40af" stroke="#172554" stroke-width="1.2"/>' +
            '<text x="68" y="42" font-size="7.5" font-weight="700" fill="#1e3a8a">← Blaue Beere &amp;</text>' +
            '<text x="75" y="51" font-size="7.5" font-weight="700" fill="#15803d">grüne Zweige</text>' +
            '<text x="14" y="76" font-size="7.4" font-weight="700" fill="#991b1b">Top-Säurezeiger (pH &lt; 5)</text>' +
            '</svg>',

        Preiselbeere:
            '<svg viewBox="0 0 120 84" class="sckm-ill-svg" aria-label="Schema Preiselbeere">' +
            '<rect width="120" height="84" rx="10" fill="#fff1f2"/>' +
            '<path d="M18 70 L46 28" fill="none" stroke="#78350f" stroke-width="2"/>' +
            '<!-- Derbe, lederartige Blätter -->' +
            '<ellipse cx="26" cy="44" rx="9" ry="5" fill="#15803d" stroke="#052e16" stroke-width="1.3"/>' +
            '<ellipse cx="42" cy="24" rx="9" ry="5" fill="#15803d" stroke="#052e16" stroke-width="1.3"/>' +
            '<!-- Rote Beeren-Traube -->' +
            '<circle cx="48" cy="46" r="6" fill="#dc2626" stroke="#7f1d1d"/>' +
            '<circle cx="58" cy="42" r="6" fill="#ef4444" stroke="#7f1d1d"/>' +
            '<circle cx="53" cy="54" r="6" fill="#b91c1c" stroke="#7f1d1d"/>' +
            '<text x="67" y="34" font-size="7.5" font-weight="700" fill="#991b1b">← Rote Beeren</text>' +
            '<text x="67" y="45" font-size="7.4" font-weight="700" fill="#14532d">Leder-Blätter</text>' +
            '<text x="14" y="76" font-size="7.3" font-weight="700" fill="#78350f">Stark saurer Nadelwald</text>' +
            '</svg>',

        Drahtschmiele:
            '<svg viewBox="0 0 120 84" class="sckm-ill-svg" aria-label="Schema Drahtschmiele">' +
            '<rect width="120" height="84" rx="10" fill="#f0fdf4"/>' +
            '<!-- Büschel aus haardünnen, drahtigen Halmen -->' +
            '<path d="M36 74 Q22 50 14 34 M38 74 Q30 46 26 24 M40 74 Q42 44 44 14 M42 74 Q54 48 62 28 M44 74 Q60 56 70 42" fill="none" stroke="#15803d" stroke-width="1.5"/>' +
            '<!-- Geschlängelte silbrige Rispenäste -->' +
            '<path d="M44 14 Q36 18 32 14 M44 20 Q52 24 56 20" fill="none" stroke="#a16207" stroke-width="1.2"/>' +
            '<text x="64" y="24" font-size="7.5" font-weight="700" fill="#14532d">← Haardünne,</text>' +
            '<text x="71" y="33" font-size="7.5" font-weight="700" fill="#14532d">drahtige Halme</text>' +
            '<text x="58" y="68" font-size="7.3" font-weight="700" fill="#92400e">Säurezeiger-Gras</text>' +
            '</svg>',

        Heidekraut:
            '<svg viewBox="0 0 120 84" class="sckm-ill-svg" aria-label="Schema Heidekraut">' +
            '<rect width="120" height="84" rx="10" fill="#fdf4ff"/>' +
            '<path d="M30 74 L36 14 M48 74 L56 18" fill="none" stroke="#15803d" stroke-width="1.8"/>' +
            '<!-- Violett-rosa Blütenähren -->' +
            '<circle cx="35" cy="20" r="3.5" fill="#c026d3"/><circle cx="34" cy="28" r="3.5" fill="#d946ef"/><circle cx="33" cy="36" r="3.5" fill="#a21caf"/><circle cx="32" cy="44" r="3.5" fill="#d946ef"/>' +
            '<circle cx="55" cy="24" r="3.5" fill="#c026d3"/><circle cx="53" cy="32" r="3.5" fill="#d946ef"/><circle cx="52" cy="40" r="3.5" fill="#a21caf"/>' +
            '<text x="65" y="30" font-size="7.5" font-weight="700" fill="#86198f">← Lila Blütenähre</text>' +
            '<text x="65" y="42" font-size="7.3" font-weight="700" fill="#15803d">Schuppen-Blättchen</text>' +
            '<text x="14" y="76" font-size="7.3" font-weight="700" fill="#701a75">Saurer Sand-/Kiefernwald</text>' +
            '</svg>',

        Waldmeister:
            '<svg viewBox="0 0 120 84" class="sckm-ill-svg" aria-label="Schema Waldmeister">' +
            '<rect width="120" height="84" rx="10" fill="#f0fdf4"/>' +
            '<!-- Sternförmiger Blattquirl (8 Blätter wie ein Wagenrad) -->' +
            '<g transform="translate(42,44)">' +
            '<ellipse cx="0" cy="-18" rx="4" ry="11" fill="#22c55e" stroke="#15803d"/>' +
            '<ellipse cx="0" cy="18" rx="4" ry="11" fill="#22c55e" stroke="#15803d"/>' +
            '<ellipse cx="-18" cy="0" rx="11" ry="4" fill="#22c55e" stroke="#15803d"/>' +
            '<ellipse cx="18" cy="0" rx="11" ry="4" fill="#22c55e" stroke="#15803d"/>' +
            '<ellipse cx="-13" cy="-13" rx="9" ry="3.5" transform="rotate(45 -13 -13)" fill="#4ade80" stroke="#15803d"/>' +
            '<ellipse cx="13" cy="13" rx="9" ry="3.5" transform="rotate(45 13 13)" fill="#4ade80" stroke="#15803d"/>' +
            '<ellipse cx="13" cy="-13" rx="9" ry="3.5" transform="rotate(-45 13 -13)" fill="#4ade80" stroke="#15803d"/>' +
            '<ellipse cx="-13" cy="13" rx="9" ry="3.5" transform="rotate(-45 -13 13)" fill="#4ade80" stroke="#15803d"/>' +
            '<circle cx="0" cy="0" r="3" fill="#14532d"/>' +
            '</g>' +
            '<text x="72" y="28" font-size="7.5" font-weight="700" fill="#14532d">← Sternförmiger</text>' +
            '<text x="79" y="37" font-size="7.5" font-weight="700" fill="#14532d">Blattquirl</text>' +
            '<text x="72" y="64" font-size="7.4" font-weight="700" fill="#1d4ed8">Kalk-/Buchenzeiger</text>' +
            '</svg>',

        Baerlauch:
            '<svg viewBox="0 0 120 84" class="sckm-ill-svg" aria-label="Schema Bärlauch">' +
            '<rect width="120" height="84" rx="10" fill="#ecfdf5"/>' +
            '<!-- Breite, lanzettliche Blätter + weißer Blütenstern -->' +
            '<path d="M24 72 C14 48, 20 24, 34 14 C40 30, 36 52, 24 72 Z" fill="#22c55e" stroke="#15803d" stroke-width="1.3"/>' +
            '<path d="M36 72 C34 48, 46 26, 60 18 C62 36, 50 56, 36 72 Z" fill="#4ade80" stroke="#15803d" stroke-width="1.3"/>' +
            '<circle cx="72" cy="24" r="9" fill="#ffffff" stroke="#cbd5e1"/>' +
            '<text x="64" y="48" font-size="7.5" font-weight="700" fill="#14532d">Knoblauch-Duft</text>' +
            '<text x="64" y="59" font-size="7.4" font-weight="700" fill="#0369a1">Kalk-Auwald (Morchel)</text>' +
            '</svg>',

        // ====================================================================
        // D. DIE 10 FACHBEGRIFFE (Schematische Erklär-Grafiken)
        // ====================================================================
        mykorrhiza:
            '<svg viewBox="0 0 120 84" class="sckm-ill-svg" aria-label="Schema Mykorrhiza">' +
            '<rect width="120" height="84" rx="10" fill="#ecfdf5"/>' +
            '<!-- Baum links, Pilz rechts, verbunden unter der Erde -->' +
            '<line x1="8" y1="50" x2="112" y2="50" stroke="#78350f" stroke-width="1.5" stroke-dasharray="3,2"/>' +
            '<polygon points="28,10 14,36 42,36" fill="#16a34a"/>' +
            '<rect x="25" y="36" width="6" height="14" fill="#78350f"/>' +
            '<path d="M78 36 C78 24, 102 24, 102 36 Z" fill="#8b5a2b"/>' +
            '<rect x="87" y="36" width="6" height="14" fill="#f5ebe0" stroke="#b08968"/>' +
            '<!-- Unterirdisches Wurzel-Hyphen-Austauschnetz -->' +
            '<path d="M28 50 Q40 68 58 64 M90 50 Q76 68 58 64" fill="none" stroke="#d97706" stroke-width="2.2"/>' +
            '<circle cx="58" cy="64" r="5" fill="#22c55e" stroke="#ffffff" stroke-width="1.5"/>' +
            '<text x="34" y="78" font-size="7.5" font-weight="700" fill="#065f46">Wurzel-Pilz-Tauschhandel</text>' +
            '</svg>',

        ph_wert:
            '<svg viewBox="0 0 120 84" class="sckm-ill-svg" aria-label="Schema pH-Skala">' +
            '<rect width="120" height="84" rx="10" fill="#f8fafc"/>' +
            '<defs><linearGradient id="phGrad" x1="0" y1="0" x2="1" y2="0"><stop offset="0%" stop-color="#dc2626"/><stop offset="50%" stop-color="#22c55e"/><stop offset="100%" stop-color="#2563eb"/></linearGradient></defs>' +
            '<rect x="12" y="28" width="96" height="14" rx="7" fill="url(#phGrad)"/>' +
            '<text x="12" y="22" font-size="7.5" font-weight="700" fill="#b91c1c">Sauer (pH 4)</text>' +
            '<text x="68" y="22" font-size="7.5" font-weight="700" fill="#1d4ed8">Kalk (pH 7,5)</text>' +
            '<text x="12" y="56" font-size="7.2" font-weight="700" fill="#991b1b">🍄 Steinpilz/Marone</text>' +
            '<text x="66" y="68" font-size="7.2" font-weight="700" fill="#1e40af">🍄 Speisemorchel</text>' +
            '</svg>',

        zeigerpflanze:
            '<svg viewBox="0 0 120 84" class="sckm-ill-svg" aria-label="Schema Zeigerpflanze">' +
            '<rect width="120" height="84" rx="10" fill="#f0fdf4"/>' +
            '<circle cx="38" cy="40" r="18" fill="#dcfce7" stroke="#16a34a" stroke-width="2"/>' +
            '<circle cx="38" cy="38" r="6" fill="#1e3a8a"/>' +
            '<line x1="51" y1="53" x2="66" y2="68" stroke="#15803d" stroke-width="3.5" stroke-linecap="round"/>' +
            '<text x="62" y="34" font-size="7.5" font-weight="700" fill="#14532d">Pflanze verrät</text>' +
            '<text x="62" y="44" font-size="7.5" font-weight="700" fill="#14532d">den Boden-pH</text>' +
            '</svg>',

        roehrling:
            '<svg viewBox="0 0 120 84" class="sckm-ill-svg" aria-label="Schema Röhrling Schwamm">' +
            '<rect width="120" height="84" rx="10" fill="#fffbeb"/>' +
            '<path d="M16 36 C16 14, 76 14, 76 36 Z" fill="#8b5a2b"/>' +
            '<rect x="18" y="36" width="56" height="10" rx="3" fill="#fde047" stroke="#ca8a04" stroke-width="1.3"/>' +
            '<circle cx="28" cy="41" r="1.6" fill="#854d0e"/><circle cx="36" cy="41" r="1.6" fill="#854d0e"/><circle cx="44" cy="41" r="1.6" fill="#854d0e"/><circle cx="52" cy="41" r="1.6" fill="#854d0e"/><circle cx="60" cy="41" r="1.6" fill="#854d0e"/>' +
            '<text x="16" y="64" font-size="7.8" font-weight="700" fill="#15803d">✅ Schwamm aus Röhrchen</text>' +
            '<text x="16" y="74" font-size="7.2" fill="#475569">(Einsteiger-sicherste Gruppe)</text>' +
            '</svg>',

        lamellen:
            '<svg viewBox="0 0 120 84" class="sckm-ill-svg" aria-label="Schema Lamellen">' +
            '<rect width="120" height="84" rx="10" fill="#fff1f2"/>' +
            '<path d="M16 34 C16 14, 76 14, 76 34 Z" fill="#dc2626"/>' +
            '<circle cx="32" cy="24" r="2.2" fill="#fff"/><circle cx="48" cy="20" r="2.2" fill="#fff"/><circle cx="60" cy="26" r="2.2" fill="#fff"/>' +
            '<!-- Dünne Lamellen-Blättchen -->' +
            '<path d="M20 34 L20 44 M25 34 L25 44 M30 34 L30 44 M35 34 L35 44 M40 34 L40 44 M45 34 L45 44 M50 34 L50 44 M55 34 L55 44 M60 34 L60 44 M65 34 L65 44 M70 34 L70 44" stroke="#991b1b" stroke-width="1.2"/>' +
            '<text x="14" y="62" font-size="7.6" font-weight="700" fill="#991b1b">⚠️ Dünne Blättchen (Lamellen)</text>' +
            '<text x="14" y="73" font-size="7.1" fill="#881337">Vorsicht: Hier gibt es Giftpilze!</text>' +
            '</svg>',

        leistenpilz:
            '<svg viewBox="0 0 120 84" class="sckm-ill-svg" aria-label="Schema Leisten">' +
            '<rect width="120" height="84" rx="10" fill="#fefce8"/>' +
            '<path d="M20 26 L44 50 M28 26 L38 38 M68 26 L44 50 M60 26 L50 38 M44 26 L44 54" stroke="#d97706" stroke-width="2.4" stroke-linecap="round"/>' +
            '<text x="14" y="68" font-size="7.5" font-weight="700" fill="#b45309">Feste, gegabelte Adern (Leisten)</text>' +
            '</svg>',

        bannwald:
            '<svg viewBox="0 0 120 84" class="sckm-ill-svg" aria-label="Schema Bannwald">' +
            '<rect width="120" height="84" rx="10" fill="#fef2f2"/>' +
            '<polygon points="60,10 92,24 84,64 60,76 36,64 28,24" fill="#fee2e2" stroke="#dc2626" stroke-width="2"/>' +
            '<text x="60" y="48" font-size="14" font-weight="700" text-anchor="middle" fill="#991b1b">🚫</text>' +
            '<text x="60" y="64" font-size="7.5" font-weight="700" text-anchor="middle" fill="#991b1b">Sammelverbot</text>' +
            '</svg>',

        sammelregel:
            '<svg viewBox="0 0 120 84" class="sckm-ill-svg" aria-label="Schema Handstraußregel">' +
            '<rect width="120" height="84" rx="10" fill="#f0fdf4"/>' +
            '<path d="M32 38 L88 38 L80 68 L40 68 Z" fill="#d97706" stroke="#78350f" stroke-width="1.5"/>' +
            '<path d="M42 38 C42 18, 78 18, 78 38" fill="none" stroke="#78350f" stroke-width="2"/>' +
            '<text x="60" y="57" font-size="8" font-weight="700" text-anchor="middle" fill="#fff">Max. 1 kg</text>' +
            '</svg>',

        wissenstreppe:
            '<svg viewBox="0 0 120 84" class="sckm-ill-svg" aria-label="Schema Wissenstreppe">' +
            '<rect width="120" height="84" rx="10" fill="#f0fdf4"/>' +
            '<rect x="12" y="58" width="22" height="14" rx="2" fill="#bbf7d0"/>' +
            '<rect x="36" y="44" width="22" height="28" rx="2" fill="#86efac"/>' +
            '<rect x="60" y="30" width="22" height="42" rx="2" fill="#4ade80"/>' +
            '<rect x="84" y="16" width="24" height="56" rx="2" fill="#16a34a"/>' +
            '<text x="14" y="54" font-size="6.8" font-weight="700" fill="#14532d">1.Daten</text>' +
            '<text x="38" y="40" font-size="6.8" font-weight="700" fill="#14532d">2.Info</text>' +
            '<text x="60" y="26" font-size="6.8" font-weight="700" fill="#14532d">3.Wissen</text>' +
            '<text x="82" y="12" font-size="6.8" font-weight="700" fill="#14532d">4.Handeln</text>' +
            '</svg>',

        ontologie:
            '<svg viewBox="0 0 120 84" class="sckm-ill-svg" aria-label="Schema Ontologie und Wissensgraph">' +
            '<rect width="120" height="84" rx="10" fill="#eff6ff"/>' +
            '<line x1="28" y1="24" x2="60" y2="42" stroke="#16a34a" stroke-width="2"/>' +
            '<line x1="28" y1="60" x2="60" y2="42" stroke="#7c3aed" stroke-width="2"/>' +
            '<line x1="60" y1="42" x2="92" y2="42" stroke="#2563eb" stroke-width="2"/>' +
            '<circle cx="28" cy="24" r="11" fill="#ecfdf5" stroke="#16a34a" stroke-width="1.8"/>' +
            '<circle cx="28" cy="60" r="11" fill="#f5f0ff" stroke="#7c3aed" stroke-width="1.8"/>' +
            '<circle cx="60" cy="42" r="13" fill="#fffbeb" stroke="#d97706" stroke-width="2"/>' +
            '<circle cx="92" cy="42" r="11" fill="#eff6ff" stroke="#2563eb" stroke-width="1.8"/>' +
            '<text x="28" y="27" font-size="6.5" font-weight="700" text-anchor="middle" fill="#065f46">Baum</text>' +
            '<text x="28" y="63" font-size="6.5" font-weight="700" text-anchor="middle" fill="#5b21b6">pH</text>' +
            '<text x="60" y="45" font-size="7" font-weight="700" text-anchor="middle" fill="#92400e">Pilz</text>' +
            '<text x="92" y="45" font-size="6.2" font-weight="700" text-anchor="middle" fill="#1e40af">Zeiger</text>' +
            '</svg>'
    };

    function getSvg(id) {
        return SVGS[id] || SVGS.roehrling;
    }

    const SCKM_ILLUSTRATIONS = {
        SVGS: SVGS,
        getSvg: getSvg
    };

    root.SCKM_ILLUSTRATIONS = SCKM_ILLUSTRATIONS;
    if (typeof module !== 'undefined' && module.exports) {
        module.exports = SCKM_ILLUSTRATIONS;
    }
})(typeof window !== 'undefined' ? window : globalThis);
