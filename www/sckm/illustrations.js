// ============================================================================
// SCKM Schematische Merkmals-Illustrationen (www/sckm/illustrations.js)
// Großzügige ViewBox (168 × 98), damit alle Beschriftungen & Pfeile komplett
// ohne Abschneiden und mit hoher Lesbarkeit dargestellt werden.
// ============================================================================

(function (root) {
    'use strict';

    const SVGS = {
        // ====================================================================
        // A. DIE 6 PILZARTEN (Schematische Erkennungsmerkmale)
        // ====================================================================
        'boletus-edulis':
            '<svg viewBox="0 0 168 98" class="sckm-ill-svg" aria-label="Schema Fichten-Steinpilz">' +
            '<rect width="168" height="98" rx="10" fill="#fffbeb"/>' +
            '<!-- Brauner Hut mit weißem Rand -->' +
            '<path d="M16 40 C16 13, 84 13, 84 40 Z" fill="#8b5a2b" stroke="#fde68a" stroke-width="1.8"/>' +
            '<!-- Gelbgrüner Röhren-Schwamm -->' +
            '<rect x="19" y="40" width="62" height="9" rx="3" fill="#d9f99d" stroke="#65a30d" stroke-width="1.2"/>' +
            '<line x1="27" y1="40" x2="27" y2="49" stroke="#65a30d" stroke-width="0.9"/>' +
            '<line x1="36" y1="40" x2="36" y2="49" stroke="#65a30d" stroke-width="0.9"/>' +
            '<line x1="45" y1="40" x2="45" y2="49" stroke="#65a30d" stroke-width="0.9"/>' +
            '<line x1="54" y1="40" x2="54" y2="49" stroke="#65a30d" stroke-width="0.9"/>' +
            '<line x1="63" y1="40" x2="63" y2="49" stroke="#65a30d" stroke-width="0.9"/>' +
            '<line x1="72" y1="40" x2="72" y2="49" stroke="#65a30d" stroke-width="0.9"/>' +
            '<!-- Bauchiger Stiel mit feinem weißem Netz -->' +
            '<path d="M39 49 C33 62, 32 82, 41 87 L59 87 C68 82, 67 62, 61 49 Z" fill="#f5ebe0" stroke="#b08968" stroke-width="1.3"/>' +
            '<path d="M41 54 L50 60 L58 54 M39 61 L50 67 L60 61 M44 50 L44 65 M55 50 L55 65" fill="none" stroke="#ffffff" stroke-width="1.3"/>' +
            '<!-- Merkmal-Labels (vollständig im Rahmen) -->' +
            '<text x="88" y="25" font-size="7.8" font-weight="700" fill="#78350f">← Brauner Hut</text>' +
            '<text x="95" y="35" font-size="7.2" font-weight="600" fill="#92400e">(heller Rand)</text>' +
            '<text x="85" y="48" font-size="7.8" font-weight="700" fill="#3f6212">← Röhren-Schwamm</text>' +
            '<text x="68" y="70" font-size="7.8" font-weight="700" fill="#78350f">← Weißes Stielnetz</text>' +
            '</svg>',

        'imleria-badia':
            '<svg viewBox="0 0 168 98" class="sckm-ill-svg" aria-label="Schema Maronen-Röhrling">' +
            '<rect width="168" height="98" rx="10" fill="#eff6ff"/>' +
            '<!-- Kastanienbrauner Hut -->' +
            '<path d="M16 40 C16 15, 80 15, 80 40 Z" fill="#5c2c16" stroke="#3b1a0b" stroke-width="1.3"/>' +
            '<!-- Röhrenfutter + Blauen auf Druck -->' +
            '<rect x="19" y="40" width="56" height="9" rx="3" fill="#fef08a" stroke="#ca8a04" stroke-width="1.1"/>' +
            '<ellipse cx="57" cy="44.5" rx="12" ry="4.5" fill="#1d4ed8"/>' +
            '<!-- Schlanker Stiel ohne Netz -->' +
            '<path d="M40 49 L38 86 L56 86 L54 49 Z" fill="#e6ccb2" stroke="#9c6644" stroke-width="1.2"/>' +
            '<text x="84" y="27" font-size="8.2" font-weight="700" fill="#5c2c16">← Kastanienhut</text>' +
            '<text x="80" y="44" font-size="8.2" font-weight="700" fill="#1d4ed8">← Blaut sofort bei</text>' +
            '<text x="89" y="54" font-size="8.2" font-weight="700" fill="#1d4ed8">Fingerdruck!</text>' +
            '<text x="64" y="76" font-size="7.8" font-weight="700" fill="#475569">← Stiel ohne Netz</text>' +
            '</svg>',

        'cantharellus-cibarius':
            '<svg viewBox="0 0 168 98" class="sckm-ill-svg" aria-label="Schema Echter Pfifferling">' +
            '<rect width="168" height="98" rx="10" fill="#fefce8"/>' +
            '<!-- Dottergelber Trichter mit herablaufenden, gegabelten Leisten -->' +
            '<path d="M12 24 Q46 37 80 24 Q65 51 56 60 L54 86 L38 86 L36 60 Q27 51 12 24 Z" fill="#facc15" stroke="#ca8a04" stroke-width="1.5"/>' +
            '<!-- Gegabelte Leisten -->' +
            '<path d="M22 28 L39 58 M28 29 L39 50 M70 28 L53 58 M64 29 L53 50 M46 31 L46 62 M38 30 L43 49 M54 30 L49 49" stroke="#b45309" stroke-width="1.5" fill="none"/>' +
            '<text x="82" y="25" font-size="7.6" font-weight="700" fill="#854d0e">Dottergelber Trichter</text>' +
            '<text x="72" y="45" font-size="7.8" font-weight="700" fill="#b45309">← Gegabelte Leisten</text>' +
            '<text x="80" y="55" font-size="7.3" font-weight="600" fill="#b45309">(feste Adern)</text>' +
            '<text x="62" y="77" font-size="7.6" font-weight="700" fill="#854d0e">🍑 Aprikosen-Duft</text>' +
            '</svg>',

        'sparassis-crispa':
            '<svg viewBox="0 0 168 98" class="sckm-ill-svg" aria-label="Schema Krause Glucke">' +
            '<rect width="168" height="98" rx="10" fill="#fffbeb"/>' +
            '<!-- Kiefernstamm links -->' +
            '<rect x="10" y="10" width="18" height="78" rx="2" fill="#9a3412"/>' +
            '<path d="M14 16 L24 25 M13 38 L25 45 M15 60 L24 68" stroke="#431407" stroke-width="1.3"/>' +
            '<!-- Blumenkohl-/Badeschwamm-Fruchtkörper am Stammfuß -->' +
            '<path d="M26 82 C22 68, 26 50, 38 50 C40 38, 56 36, 63 45 C72 36, 90 42, 85 58 C94 65, 88 84, 74 84 Z" fill="#fde68a" stroke="#d97706" stroke-width="1.6"/>' +
            '<path d="M38 60 Q45 51 52 60 M54 54 Q63 47 70 56 M42 72 Q52 63 60 72 M63 70 Q72 61 79 70" fill="none" stroke="#b45309" stroke-width="1.3"/>' +
            '<text x="34" y="23" font-size="8.2" font-weight="700" fill="#9a3412">← Am Kiefernstamm-Fuß</text>' +
            '<text x="93" y="57" font-size="8.2" font-weight="700" fill="#b45309">← Wie ein</text>' +
            '<text x="93" y="67" font-size="8.2" font-weight="700" fill="#b45309">Badeschwamm</text>' +
            '<text x="93" y="77" font-size="7.4" font-weight="600" fill="#92400e">(Blumenkohl)</text>' +
            '</svg>',

        'boletus-reticulatus':
            '<svg viewBox="0 0 168 98" class="sckm-ill-svg" aria-label="Schema Sommer-Steinpilz">' +
            '<rect width="168" height="98" rx="10" fill="#fdf8f6"/>' +
            '<!-- Hellbrauner Hut mit feldrigen Trockenrissen -->' +
            '<path d="M16 40 C16 14, 82 14, 82 40 Z" fill="#b07d4f" stroke="#78350f" stroke-width="1.4"/>' +
            '<path d="M32 20 L38 29 L30 34 M52 18 L48 28 L58 33 M66 22 L61 31" fill="none" stroke="#fef3c7" stroke-width="1.4"/>' +
            '<rect x="19" y="40" width="60" height="8" rx="3" fill="#ecfccb" stroke="#65a30d" stroke-width="1.1"/>' +
            '<path d="M39 48 C34 62, 34 81, 41 86 L57 86 C64 81, 64 62, 59 48 Z" fill="#e6ccb2" stroke="#9c6644" stroke-width="1.2"/>' +
            '<path d="M41 54 L49 60 L57 54 M40 65 L49 71 L58 65 M41 76 L49 81 L57 76" fill="none" stroke="#78350f" stroke-width="1"/>' +
            '<text x="84" y="25" font-size="8.2" font-weight="700" fill="#78350f">← Feldrige Risse</text>' +
            '<text x="93" y="35" font-size="7.4" font-weight="600" fill="#92400e">in der Huthaut</text>' +
            '<text x="68" y="65" font-size="8.0" font-weight="700" fill="#78350f">← Bräunliches Netz</text>' +
            '<text x="68" y="80" font-size="8.0" font-weight="700" fill="#15803d">🌳 Unter Buche/Eiche</text>' +
            '</svg>',

        'morchella-esculenta':
            '<svg viewBox="0 0 168 98" class="sckm-ill-svg" aria-label="Schema Speisemorchel">' +
            '<rect width="168" height="98" rx="10" fill="#fff7ed"/>' +
            '<!-- Bienenwaben-Hut -->' +
            '<path d="M26 52 C22 25, 35 11, 48 11 C61 11, 74 25, 70 52 Z" fill="#d97706" stroke="#78350f" stroke-width="1.5"/>' +
            '<!-- Waben-Kammern -->' +
            '<polygon points="39,20 46,18 49,25 42,28" fill="#92400e" stroke="#fde68a" stroke-width="1"/>' +
            '<polygon points="51,20 58,22 57,29 50,28" fill="#92400e" stroke="#fde68a" stroke-width="1"/>' +
            '<polygon points="33,31 41,30 43,38 35,39" fill="#92400e" stroke="#fde68a" stroke-width="1"/>' +
            '<polygon points="46,31 53,31 54,39 46,40" fill="#92400e" stroke="#fde68a" stroke-width="1"/>' +
            '<polygon points="57,32 63,35 61,43 55,40" fill="#92400e" stroke="#fde68a" stroke-width="1"/>' +
            '<polygon points="39,42 48,42 48,49 38,49" fill="#92400e" stroke="#fde68a" stroke-width="1"/>' +
            '<!-- Hohler Stiel -->' +
            '<rect x="39" y="52" width="18" height="34" rx="3" fill="#fef3c7" stroke="#b45309" stroke-width="1.3"/>' +
            '<rect x="45" y="55" width="6" height="28" rx="2" fill="#ffffff" stroke="#d97706" stroke-dasharray="2,2"/>' +
            '<text x="76" y="27" font-size="8.2" font-weight="700" fill="#92400e">← Bienenwaben-Hut</text>' +
            '<text x="64" y="66" font-size="8.2" font-weight="700" fill="#b45309">← Innen komplett hohl</text>' +
            '<text x="64" y="78" font-size="7.6" font-weight="700" fill="#0369a1">🌸 Frühling (Kalkboden)</text>' +
            '</svg>',

        // ====================================================================
        // B. DIE 7 SYMBIOSE-BAUMARTEN (Nadel-/Blatt- & Zapfen-Schema)
        // ====================================================================
        Fichte:
            '<svg viewBox="0 0 168 98" class="sckm-ill-svg" aria-label="Schema Fichte">' +
            '<rect width="168" height="98" rx="10" fill="#ecfdf5"/>' +
            '<!-- Zweig mit spitzen Einzelnadeln ringsum (links, klar getrennt vom Zapfen rechts) -->' +
            '<line x1="12" y1="26" x2="96" y2="26" stroke="#78350f" stroke-width="2.4"/>' +
            '<path d="M18 26 L14 12 M26 26 L22 12 M34 26 L30 12 M42 26 L38 12 M50 26 L46 12 M58 26 L54 12 M66 26 L62 12 M18 26 L14 40 M26 26 L22 40 M34 26 L30 40 M42 26 L38 40 M50 26 L46 40 M58 26 L54 40" stroke="#15803d" stroke-width="1.7"/>' +
            '<!-- Hängender Zapfen rechts bei x=88 -->' +
            '<path d="M88 26 C80 40, 81 70, 88 82 C95 70, 96 40, 88 26 Z" fill="#92400e" stroke="#451a03" stroke-width="1.3"/>' +
            '<path d="M83 42 Q88 47 93 42 M82 54 Q88 59 94 54 M83 66 Q88 71 93 66" fill="none" stroke="#fde68a" stroke-width="1"/>' +
            '<text x="10" y="58" font-size="7.6" font-weight="700" fill="#065f46">Spitze Einzelnadeln</text>' +
            '<text x="10" y="69" font-size="7.2" fill="#047857">(stechen beim</text>' +
            '<text x="10" y="79" font-size="7.2" fill="#047857">Zugreifen!)</text>' +
            '<text x="100" y="48" font-size="7.8" font-weight="700" fill="#92400e">← Zapfen</text>' +
            '<text x="106" y="59" font-size="7.8" font-weight="700" fill="#92400e">hängt nach</text>' +
            '<text x="106" y="70" font-size="7.8" font-weight="700" fill="#92400e">unten!</text>' +
            '</svg>',

        Tanne:
            '<svg viewBox="0 0 168 98" class="sckm-ill-svg" aria-label="Schema Weißtanne">' +
            '<rect width="168" height="98" rx="10" fill="#ecfdf5"/>' +
            '<!-- Zweig unten -->' +
            '<line x1="12" y1="58" x2="84" y2="58" stroke="#78350f" stroke-width="2.4"/>' +
            '<!-- Flache gescheitelte Nadeln mit 2 weißen Streifen -->' +
            '<path d="M18 58 L16 42 M26 58 L24 42 M34 58 L32 42 M42 58 L40 42 M18 58 L16 74 M26 58 L24 74 M34 58 L32 74 M42 58 L40 74" stroke="#047857" stroke-width="2.6" stroke-linecap="round"/>' +
            '<path d="M18 58 L16 74 M26 58 L24 74 M34 58 L32 74" stroke="#e2e8f0" stroke-width="1" stroke-dasharray="2,1"/>' +
            '<!-- Aufrecht stehender Zapfen! -->' +
            '<path d="M68 58 C60 44, 61 18, 68 10 C75 18, 76 44, 68 58 Z" fill="#a16207" stroke="#451a03" stroke-width="1.3"/>' +
            '<text x="80" y="28" font-size="8.0" font-weight="700" fill="#92400e">← Zapfen steht</text>' +
            '<text x="89" y="39" font-size="8.0" font-weight="700" fill="#92400e">aufrecht!</text>' +
            '<text x="14" y="88" font-size="7.6" font-weight="700" fill="#065f46">Flache Nadeln (2 weiße Streifen unten)</text>' +
            '</svg>',

        Kiefer:
            '<svg viewBox="0 0 168 98" class="sckm-ill-svg" aria-label="Schema Waldkiefer">' +
            '<rect width="168" height="98" rx="10" fill="#f0fdf4"/>' +
            '<!-- Lange Nadeln immer paarweise (2er-Bündel) -->' +
            '<rect x="20" y="54" width="7" height="9" rx="1" fill="#78350f"/>' +
            '<path d="M23.5 54 C15 30, 12 16, 8 11 M23.5 54 C32 30, 36 16, 42 11" fill="none" stroke="#15803d" stroke-width="2"/>' +
            '<rect x="50" y="54" width="7" height="9" rx="1" fill="#78350f"/>' +
            '<path d="M53.5 54 C45 30, 42 16, 38 11 M53.5 54 C62 30, 66 16, 72 11" fill="none" stroke="#15803d" stroke-width="2"/>' +
            '<!-- Runder Kiefernzapfen -->' +
            '<path d="M88 42 C79 51, 81 71, 90 76 C99 71, 101 51, 92 42 Z" fill="#78350f" stroke="#451a03" stroke-width="1.3"/>' +
            '<text x="12" y="84" font-size="8.0" font-weight="700" fill="#166534">Lange Nadeln immer zu zweit (Paar)</text>' +
            '<text x="80" y="25" font-size="8.0" font-weight="700" fill="#9a3412">Wirtsbaum der</text>' +
            '<text x="80" y="35" font-size="8.0" font-weight="700" fill="#9a3412">Krausen Glucke</text>' +
            '</svg>',

        Buche:
            '<svg viewBox="0 0 168 98" class="sckm-ill-svg" aria-label="Schema Rotbuche">' +
            '<rect width="168" height="98" rx="10" fill="#f0fdf4"/>' +
            '<!-- Ovales Buchenblatt mit glattem/leicht welligem Rand & geraden Seitennerven -->' +
            '<path d="M16 62 C18 28, 46 14, 74 23 C67 52, 46 72, 16 62 Z" fill="#22c55e" stroke="#15803d" stroke-width="1.6"/>' +
            '<path d="M12 65 L72 24 M30 52 L26 36 M41 44 L39 27 M53 36 L53 23 M30 52 L46 57 M41 44 L57 48" fill="none" stroke="#14532d" stroke-width="1.2"/>' +
            '<text x="78" y="36" font-size="8.2" font-weight="700" fill="#14532d">← Glatter, leicht</text>' +
            '<text x="87" y="47" font-size="8.2" font-weight="700" fill="#14532d">welliger Rand</text>' +
            '<text x="14" y="84" font-size="8.0" font-weight="700" fill="#475569">Silbergraue, glatte Rinde</text>' +
            '</svg>',

        Eiche:
            '<svg viewBox="0 0 168 98" class="sckm-ill-svg" aria-label="Schema Eiche">' +
            '<rect width="168" height="98" rx="10" fill="#f0fdf4"/>' +
            '<!-- Typisch gebuchtetes Eichenblatt -->' +
            '<path d="M14 50 C19 41, 26 48, 28 36 C30 25, 39 34, 46 22 C53 13, 64 22, 69 31 C64 40, 55 38, 53 50 C48 59, 37 52, 32 61 C25 66, 19 57, 14 50 Z" fill="#16a34a" stroke="#14532d" stroke-width="1.5"/>' +
            '<!-- Eichel mit Becher -->' +
            '<ellipse cx="96" cy="58" rx="8" ry="11" fill="#a16207" stroke="#78350f" stroke-width="1.3"/>' +
            '<path d="M87 50 Q96 42 105 50 L103 55 L89 55 Z" fill="#78350f"/>' +
            '<text x="74" y="25" font-size="8.2" font-weight="700" fill="#14532d">← Gebuchtetes</text>' +
            '<text x="83" y="35" font-size="8.2" font-weight="700" fill="#14532d">Blatt (Lappen)</text>' +
            '<text x="72" y="84" font-size="8.0" font-weight="700" fill="#78350f">Eichel mit Hütchen</text>' +
            '</svg>',

        Birke:
            '<svg viewBox="0 0 168 98" class="sckm-ill-svg" aria-label="Schema Birke">' +
            '<rect width="168" height="98" rx="10" fill="#f8fafc"/>' +
            '<!-- Weißer Stamm mit schwarzen Streifen -->' +
            '<rect x="14" y="12" width="18" height="74" rx="2" fill="#ffffff" stroke="#94a3b8" stroke-width="1.3"/>' +
            '<path d="M15 26 L27 28 M18 44 L31 42 M14 62 L26 64" stroke="#1e293b" stroke-width="2.4"/>' +
            '<!-- Dreieckig-rautenförmiges Blatt -->' +
            '<polygon points="48,50 66,18 84,50 66,64" fill="#4ade80" stroke="#15803d" stroke-width="1.5"/>' +
            '<text x="90" y="36" font-size="8.0" font-weight="700" fill="#15803d">← Rauten-/Drei-</text>' +
            '<text x="98" y="46" font-size="8.0" font-weight="700" fill="#15803d">ecksblatt</text>' +
            '<text x="38" y="75" font-size="7.6" font-weight="700" fill="#1e293b">← Weiße Rinde mit</text>' +
            '<text x="46" y="85" font-size="7.6" font-weight="700" fill="#1e293b">schwarzen Streifen</text>' +
            '</svg>',

        Esche:
            '<svg viewBox="0 0 168 98" class="sckm-ill-svg" aria-label="Schema Esche">' +
            '<rect width="168" height="98" rx="10" fill="#f0fdf4"/>' +
            '<!-- Unpaarig gefiedertes Blatt (7 Einzelblättchen) -->' +
            '<line x1="14" y1="48" x2="78" y2="48" stroke="#15803d" stroke-width="1.8"/>' +
            '<ellipse cx="28" cy="32" rx="5.5" ry="10" fill="#22c55e" stroke="#15803d"/>' +
            '<ellipse cx="46" cy="32" rx="5.5" ry="10" fill="#22c55e" stroke="#15803d"/>' +
            '<ellipse cx="64" cy="32" rx="5.5" ry="10" fill="#22c55e" stroke="#15803d"/>' +
            '<ellipse cx="28" cy="64" rx="5.5" ry="10" fill="#22c55e" stroke="#15803d"/>' +
            '<ellipse cx="46" cy="64" rx="5.5" ry="10" fill="#22c55e" stroke="#15803d"/>' +
            '<ellipse cx="64" cy="64" rx="5.5" ry="10" fill="#22c55e" stroke="#15803d"/>' +
            '<ellipse cx="82" cy="48" rx="10" ry="5.5" fill="#22c55e" stroke="#15803d"/>' +
            '<text x="95" y="34" font-size="8.2" font-weight="700" fill="#14532d">← Gefiedertes</text>' +
            '<text x="104" y="44" font-size="8.2" font-weight="700" fill="#14532d">Blatt (9–13)</text>' +
            '<text x="95" y="68" font-size="7.8" font-weight="700" fill="#0369a1">Auwald / Morchel</text>' +
            '</svg>',

        // ====================================================================
        // C. DIE 6 ZEIGERPFLANZEN (Boden-Detektive)
        // ====================================================================
        Heidelbeere:
            '<svg viewBox="0 0 168 98" class="sckm-ill-svg" aria-label="Schema Heidelbeere">' +
            '<rect width="168" height="98" rx="10" fill="#eff6ff"/>' +
            '<!-- Grüne kantige Zweige -->' +
            '<path d="M18 80 L40 44 L66 24 M40 44 L25 24" fill="none" stroke="#16a34a" stroke-width="2.6"/>' +
            '<!-- Ovale sommergrüne Blätter -->' +
            '<ellipse cx="25" cy="24" rx="9" ry="5.5" fill="#4ade80" stroke="#15803d"/>' +
            '<ellipse cx="66" cy="24" rx="9" ry="5.5" fill="#4ade80" stroke="#15803d"/>' +
            '<!-- Blauschwarze Beeren -->' +
            '<circle cx="45" cy="54" r="7.5" fill="#1e3a8a" stroke="#172554" stroke-width="1.3"/>' +
            '<circle cx="58" cy="42" r="7" fill="#1e40af" stroke="#172554" stroke-width="1.3"/>' +
            '<text x="70" y="42" font-size="7.8" font-weight="700" fill="#1e3a8a">← Blaue Beeren &amp;</text>' +
            '<text x="78" y="53" font-size="7.8" font-weight="700" fill="#15803d">grüne Zweige</text>' +
            '<text x="16" y="88" font-size="7.8" font-weight="700" fill="#991b1b">Top-Säurezeiger (pH &lt; 5,0)</text>' +
            '</svg>',

        Preiselbeere:
            '<svg viewBox="0 0 168 98" class="sckm-ill-svg" aria-label="Schema Preiselbeere">' +
            '<rect width="168" height="98" rx="10" fill="#fff1f2"/>' +
            '<path d="M18 78 L46 30" fill="none" stroke="#78350f" stroke-width="2.2"/>' +
            '<!-- Derbe, lederartige Blätter -->' +
            '<ellipse cx="26" cy="48" rx="10" ry="5.5" fill="#15803d" stroke="#052e16" stroke-width="1.4"/>' +
            '<ellipse cx="42" cy="26" rx="10" ry="5.5" fill="#15803d" stroke="#052e16" stroke-width="1.4"/>' +
            '<!-- Rote Beeren-Traube -->' +
            '<circle cx="48" cy="50" r="6.5" fill="#dc2626" stroke="#7f1d1d"/>' +
            '<circle cx="59" cy="46" r="6.5" fill="#ef4444" stroke="#7f1d1d"/>' +
            '<circle cx="54" cy="59" r="6.5" fill="#b91c1c" stroke="#7f1d1d"/>' +
            '<text x="70" y="34" font-size="7.8" font-weight="700" fill="#991b1b">← Rote Beeren</text>' +
            '<text x="70" y="48" font-size="7.6" font-weight="700" fill="#14532d">← Immergrünes,</text>' +
            '<text x="78" y="58" font-size="7.6" font-weight="700" fill="#14532d">derbes Lederblatt</text>' +
            '<text x="16" y="88" font-size="7.8" font-weight="700" fill="#78350f">Stark saurer Nadelwald</text>' +
            '</svg>',

        Drahtschmiele:
            '<svg viewBox="0 0 168 98" class="sckm-ill-svg" aria-label="Schema Drahtschmiele">' +
            '<rect width="168" height="98" rx="10" fill="#f0fdf4"/>' +
            '<!-- Büschel aus haardünnen, drahtigen Halmen -->' +
            '<path d="M38 84 Q23 56 14 38 M40 84 Q31 52 27 26 M42 84 Q44 50 46 15 M44 84 Q57 54 66 32 M46 84 Q64 64 74 48" fill="none" stroke="#15803d" stroke-width="1.7"/>' +
            '<!-- Geschlängelte silbrige Rispenäste -->' +
            '<path d="M46 15 Q37 20 33 15 M46 22 Q55 27 59 22" fill="none" stroke="#a16207" stroke-width="1.3"/>' +
            '<text x="68" y="28" font-size="7.8" font-weight="700" fill="#14532d">← Haardünne, drahtig-</text>' +
            '<text x="76" y="39" font-size="7.8" font-weight="700" fill="#14532d">borstige Gras-Halme</text>' +
            '<text x="68" y="76" font-size="7.8" font-weight="700" fill="#92400e">Säurezeiger-Waldgras</text>' +
            '</svg>',

        Heidekraut:
            '<svg viewBox="0 0 168 98" class="sckm-ill-svg" aria-label="Schema Heidekraut">' +
            '<rect width="168" height="98" rx="10" fill="#fdf4ff"/>' +
            '<path d="M30 82 L36 15 M50 82 L58 19" fill="none" stroke="#15803d" stroke-width="2"/>' +
            '<!-- Violett-rosa Blütenähren -->' +
            '<circle cx="35" cy="22" r="4" fill="#c026d3"/><circle cx="34" cy="31" r="4" fill="#d946ef"/><circle cx="33" cy="40" r="4" fill="#a21caf"/><circle cx="32" cy="49" r="4" fill="#d946ef"/>' +
            '<circle cx="57" cy="26" r="4" fill="#c026d3"/><circle cx="55" cy="35" r="4" fill="#d946ef"/><circle cx="54" cy="44" r="4" fill="#a21caf"/>' +
            '<text x="68" y="30" font-size="7.8" font-weight="700" fill="#86198f">← Lila Blütenähre</text>' +
            '<text x="68" y="45" font-size="7.6" font-weight="700" fill="#15803d">← Winzige</text>' +
            '<text x="76" y="55" font-size="7.6" font-weight="700" fill="#15803d">Schuppenblätter</text>' +
            '<text x="16" y="88" font-size="7.8" font-weight="700" fill="#701a75">Saurer Sand- &amp; Kiefernwald</text>' +
            '</svg>',

        Waldmeister:
            '<svg viewBox="0 0 168 98" class="sckm-ill-svg" aria-label="Schema Waldmeister">' +
            '<rect width="168" height="98" rx="10" fill="#f0fdf4"/>' +
            '<!-- Sternförmiger Blattquirl (8 Blätter wie ein Wagenrad) -->' +
            '<g transform="translate(44,50)">' +
            '<ellipse cx="0" cy="-20" rx="4.5" ry="12" fill="#22c55e" stroke="#15803d"/>' +
            '<ellipse cx="0" cy="20" rx="4.5" ry="12" fill="#22c55e" stroke="#15803d"/>' +
            '<ellipse cx="-20" cy="0" rx="12" ry="4.5" fill="#22c55e" stroke="#15803d"/>' +
            '<ellipse cx="20" cy="0" rx="12" ry="4.5" fill="#22c55e" stroke="#15803d"/>' +
            '<ellipse cx="-14" cy="-14" rx="10" ry="3.8" transform="rotate(45 -14 -14)" fill="#4ade80" stroke="#15803d"/>' +
            '<ellipse cx="14" cy="14" rx="10" ry="3.8" transform="rotate(45 14 14)" fill="#4ade80" stroke="#15803d"/>' +
            '<ellipse cx="14" cy="-14" rx="10" ry="3.8" transform="rotate(-45 14 -14)" fill="#4ade80" stroke="#15803d"/>' +
            '<ellipse cx="-14" cy="14" rx="10" ry="3.8" transform="rotate(-45 -14 14)" fill="#4ade80" stroke="#15803d"/>' +
            '<circle cx="0" cy="0" r="3.2" fill="#14532d"/>' +
            '</g>' +
            '<text x="76" y="34" font-size="7.8" font-weight="700" fill="#14532d">← Sternförmiger</text>' +
            '<text x="84" y="45" font-size="7.8" font-weight="700" fill="#14532d">Blattquirl (6–8er)</text>' +
            '<text x="76" y="72" font-size="7.8" font-weight="700" fill="#1d4ed8">Kalk- &amp; Buchenzeiger</text>' +
            '</svg>',

        Baerlauch:
            '<svg viewBox="0 0 168 98" class="sckm-ill-svg" aria-label="Schema Bärlauch">' +
            '<rect width="168" height="98" rx="10" fill="#ecfdf5"/>' +
            '<!-- Breite, lanzettliche Blätter + weißer Blütenstern -->' +
            '<path d="M22 82 C12 54, 18 26, 34 15 C40 34, 36 58, 22 82 Z" fill="#22c55e" stroke="#15803d" stroke-width="1.4"/>' +
            '<path d="M36 82 C34 54, 47 28, 62 19 C64 40, 51 64, 36 82 Z" fill="#4ade80" stroke="#15803d" stroke-width="1.4"/>' +
            '<circle cx="76" cy="27" r="10" fill="#ffffff" stroke="#cbd5e1"/>' +
            '<text x="90" y="30" font-size="7.8" font-weight="700" fill="#334155">← Weiße Blüte</text>' +
            '<text x="66" y="52" font-size="7.8" font-weight="700" fill="#14532d">🧄 Starker</text>' +
            '<text x="78" y="62" font-size="7.8" font-weight="700" fill="#14532d">Knoblauch-Duft!</text>' +
            '<text x="66" y="78" font-size="7.6" font-weight="700" fill="#0369a1">Feuchter Kalk-Auwald</text>' +
            '</svg>',

        // ====================================================================
        // D. DIE 10 FACHBEGRIFFE (Schematische Erklär-Grafiken)
        // ====================================================================
        mykorrhiza:
            '<svg viewBox="0 0 168 98" class="sckm-ill-svg" aria-label="Schema Mykorrhiza">' +
            '<rect width="168" height="98" rx="10" fill="#ecfdf5"/>' +
            '<!-- Baum links, Pilz rechts, verbunden unter der Erde -->' +
            '<line x1="10" y1="56" x2="158" y2="56" stroke="#78350f" stroke-width="1.6" stroke-dasharray="3,2"/>' +
            '<polygon points="36,12 18,41 54,41" fill="#16a34a"/>' +
            '<rect x="33" y="41" width="6" height="15" fill="#78350f"/>' +
            '<path d="M108 41 C108 26, 138 26, 138 41 Z" fill="#8b5a2b"/>' +
            '<rect x="120" y="41" width="6" height="15" fill="#f5ebe0" stroke="#b08968"/>' +
            '<!-- Unterirdisches Wurzel-Hyphen-Austauschnetz -->' +
            '<path d="M36 56 Q56 76 80 71 M123 56 Q104 76 80 71" fill="none" stroke="#d97706" stroke-width="2.4"/>' +
            '<circle cx="80" cy="71" r="5.5" fill="#22c55e" stroke="#ffffff" stroke-width="1.5"/>' +
            '<text x="84" y="88" text-anchor="middle" font-size="8.2" font-weight="700" fill="#065f46">Wurzel-Pilz-Tauschhandel (Symbiose)</text>' +
            '</svg>',

        ph_wert:
            '<svg viewBox="0 0 168 98" class="sckm-ill-svg" aria-label="Schema pH-Skala">' +
            '<rect width="168" height="98" rx="10" fill="#f8fafc"/>' +
            '<defs><linearGradient id="phGrad" x1="0" y1="0" x2="1" y2="0"><stop offset="0%" stop-color="#dc2626"/><stop offset="50%" stop-color="#22c55e"/><stop offset="100%" stop-color="#2563eb"/></linearGradient></defs>' +
            '<rect x="14" y="34" width="140" height="15" rx="7.5" fill="url(#phGrad)"/>' +
            '<text x="14" y="26" font-size="8.2" font-weight="700" fill="#b91c1c">Sauer (pH 3,8–5)</text>' +
            '<text x="96" y="26" font-size="8.2" font-weight="700" fill="#1d4ed8">Kalk (pH 6,5–8)</text>' +
            '<text x="14" y="66" font-size="8.0" font-weight="700" fill="#991b1b">🍄 Steinpilz / Marone</text>' +
            '<text x="86" y="80" font-size="8.0" font-weight="700" fill="#1e40af">🍄 Speisemorchel</text>' +
            '</svg>',

        zeigerpflanze:
            '<svg viewBox="0 0 168 98" class="sckm-ill-svg" aria-label="Schema Zeigerpflanze">' +
            '<rect width="168" height="98" rx="10" fill="#f0fdf4"/>' +
            '<circle cx="42" cy="46" r="20" fill="#dcfce7" stroke="#16a34a" stroke-width="2.2"/>' +
            '<circle cx="42" cy="44" r="6.5" fill="#1e3a8a"/>' +
            '<line x1="56" y1="60" x2="72" y2="76" stroke="#15803d" stroke-width="3.8" stroke-linecap="round"/>' +
            '<text x="76" y="38" font-size="8.2" font-weight="700" fill="#14532d">Pflanze verrät dir</text>' +
            '<text x="76" y="50" font-size="8.2" font-weight="700" fill="#14532d">den Boden-pH vor Ort</text>' +
            '</svg>',

        roehrling:
            '<svg viewBox="0 0 168 98" class="sckm-ill-svg" aria-label="Schema Röhrling Schwamm">' +
            '<rect width="168" height="98" rx="10" fill="#fffbeb"/>' +
            '<path d="M22 40 C22 15, 92 15, 92 40 Z" fill="#8b5a2b"/>' +
            '<rect x="25" y="40" width="64" height="11" rx="3" fill="#fde047" stroke="#ca8a04" stroke-width="1.4"/>' +
            '<circle cx="35" cy="45.5" r="1.8" fill="#854d0e"/><circle cx="45" cy="45.5" r="1.8" fill="#854d0e"/><circle cx="55" cy="45.5" r="1.8" fill="#854d0e"/><circle cx="65" cy="45.5" r="1.8" fill="#854d0e"/><circle cx="75" cy="45.5" r="1.8" fill="#854d0e"/>' +
            '<text x="16" y="70" font-size="8.4" font-weight="700" fill="#15803d">✅ Schwamm aus Röhrchen</text>' +
            '<text x="16" y="83" font-size="7.8" fill="#475569">(Einsteiger-sicherste Pilzgruppe)</text>' +
            '</svg>',

        lamellen:
            '<svg viewBox="0 0 168 98" class="sckm-ill-svg" aria-label="Schema Lamellen">' +
            '<rect width="168" height="98" rx="10" fill="#fff1f2"/>' +
            '<path d="M22 38 C22 15, 92 15, 92 38 Z" fill="#dc2626"/>' +
            '<circle cx="40" cy="26" r="2.5" fill="#fff"/><circle cx="57" cy="22" r="2.5" fill="#fff"/><circle cx="72" cy="28" r="2.5" fill="#fff"/>' +
            '<!-- Dünne Lamellen-Blättchen -->' +
            '<path d="M26 38 L26 49 M32 38 L32 49 M38 38 L38 49 M44 38 L44 49 M50 38 L50 49 M56 38 L56 49 M62 38 L62 49 M68 38 L68 49 M74 38 L74 49 M80 38 L80 49 M86 38 L86 49" stroke="#991b1b" stroke-width="1.3"/>' +
            '<text x="16" y="69" font-size="8.2" font-weight="700" fill="#991b1b">⚠️ Dünne Blättchen (Lamellen)</text>' +
            '<text x="16" y="82" font-size="7.6" fill="#881337">Vorsicht: Hier gibt es Giftpilze!</text>' +
            '</svg>',

        leistenpilz:
            '<svg viewBox="0 0 168 98" class="sckm-ill-svg" aria-label="Schema Leisten">' +
            '<rect width="168" height="98" rx="10" fill="#fefce8"/>' +
            '<path d="M28 26 L56 56 M38 26 L49 41 M84 26 L56 56 M74 26 L63 41 M56 26 L56 60" stroke="#d97706" stroke-width="2.6" stroke-linecap="round"/>' +
            '<text x="16" y="78" font-size="8.2" font-weight="700" fill="#b45309">Feste, gegabelte Adern (Leisten)</text>' +
            '</svg>',

        bannwald:
            '<svg viewBox="0 0 168 98" class="sckm-ill-svg" aria-label="Schema Bannwald">' +
            '<rect width="168" height="98" rx="10" fill="#fef2f2"/>' +
            '<polygon points="84,12 122,28 112,74 84,86 56,74 46,28" fill="#fee2e2" stroke="#dc2626" stroke-width="2.2"/>' +
            '<text x="84" y="54" font-size="16" font-weight="700" text-anchor="middle" fill="#991b1b">🚫</text>' +
            '<text x="84" y="72" font-size="8.2" font-weight="700" text-anchor="middle" fill="#991b1b">Sammelverbot</text>' +
            '</svg>',

        sammelregel:
            '<svg viewBox="0 0 168 98" class="sckm-ill-svg" aria-label="Schema Handstraußregel">' +
            '<rect width="168" height="98" rx="10" fill="#f0fdf4"/>' +
            '<path d="M36 40 L132 40 L120 74 L48 74 Z" fill="#b45309" stroke="#78350f" stroke-width="1.6"/>' +
            '<path d="M56 40 C56 16, 112 16, 112 40" fill="none" stroke="#78350f" stroke-width="2.4"/>' +
            '<text x="84" y="61" font-size="9.2" font-weight="700" text-anchor="middle" fill="#ffffff">Max. 1 kg</text>' +
            '<text x="84" y="88" font-size="7.8" font-weight="700" text-anchor="middle" fill="#14532d">Eigenbedarf pro Tag</text>' +
            '</svg>',

        wissenstreppe:
            '<svg viewBox="0 0 168 98" class="sckm-ill-svg" aria-label="Schema Wissenstreppe">' +
            '<rect width="168" height="98" rx="10" fill="#f0fdf4"/>' +
            '<rect x="14" y="66" width="30" height="18" rx="2" fill="#bbf7d0"/>' +
            '<rect x="48" y="50" width="30" height="34" rx="2" fill="#86efac"/>' +
            '<rect x="82" y="34" width="30" height="50" rx="2" fill="#4ade80"/>' +
            '<rect x="116" y="18" width="36" height="66" rx="2" fill="#16a34a"/>' +
            '<text x="16" y="61" font-size="7.6" font-weight="700" fill="#14532d">1.Daten</text>' +
            '<text x="50" y="45" font-size="7.6" font-weight="700" fill="#14532d">2.Info</text>' +
            '<text x="82" y="29" font-size="7.6" font-weight="700" fill="#14532d">3.Wissen</text>' +
            '<text x="115" y="13" font-size="7.6" font-weight="700" fill="#14532d">4.Handeln</text>' +
            '</svg>',

        ontologie:
            '<svg viewBox="0 0 168 98" class="sckm-ill-svg" aria-label="Schema Ontologie und Wissensgraph">' +
            '<rect width="168" height="98" rx="10" fill="#eff6ff"/>' +
            '<line x1="36" y1="28" x2="84" y2="49" stroke="#16a34a" stroke-width="2.2"/>' +
            '<line x1="36" y1="70" x2="84" y2="49" stroke="#7c3aed" stroke-width="2.2"/>' +
            '<line x1="84" y1="49" x2="132" y2="49" stroke="#2563eb" stroke-width="2.2"/>' +
            '<circle cx="36" cy="28" r="14" fill="#ecfdf5" stroke="#16a34a" stroke-width="2"/>' +
            '<circle cx="36" cy="70" r="14" fill="#f5f0ff" stroke="#7c3aed" stroke-width="2"/>' +
            '<circle cx="84" cy="49" r="16" fill="#fffbeb" stroke="#d97706" stroke-width="2.2"/>' +
            '<circle cx="132" cy="49" r="14" fill="#eff6ff" stroke="#2563eb" stroke-width="2"/>' +
            '<text x="36" y="31" font-size="7.6" font-weight="700" text-anchor="middle" fill="#065f46">Baum</text>' +
            '<text x="36" y="73" font-size="7.6" font-weight="700" text-anchor="middle" fill="#5b21b6">pH</text>' +
            '<text x="84" y="52" font-size="8.2" font-weight="700" text-anchor="middle" fill="#92400e">Pilz</text>' +
            '<text x="132" y="52" font-size="7.4" font-weight="700" text-anchor="middle" fill="#1e40af">Zeiger</text>' +
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
