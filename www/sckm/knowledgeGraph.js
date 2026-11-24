// ============================================================================
// SCKM Interaktiver Wissensgraph / Visual Ontology (www/sckm/knowledgeGraph.js)
// Erzeugt den 4-spaltigen semantischen Wissensgraphen (Boden-pH -> Baum ->
// Pilzart -> Zeigerpflanze) mit RDF-Tripel-Erklärung und Live-Standort-Abgleich.
// ============================================================================

(function (root) {
    'use strict';

    const getOntology = function () {
        if (root.SCKM_ONTOLOGY) return root.SCKM_ONTOLOGY;
        if (typeof require === 'function') return require('./ontology.js');
        throw new Error('SCKM_ONTOLOGY nicht geladen');
    };

    // Baut Knoten (Nodes) und gerichtete Kanten (Edges / RDF-Tripel) auf
    function buildKnowledgeGraph(evaluationResult, focusedNodeId) {
        const ont = getOntology();
        const ctx = evaluationResult ? evaluationResult.context : null;
        const activeSpeciesId =
            evaluationResult && evaluationResult.activeResult
                ? evaluationResult.activeResult.species.id
                : 'boletus-edulis';

        const nodes = [];
        const edges = [];

        // Spalte 1: Boden-Milieu (pH) (x = 95)
        ont.PH_CATEGORIES.forEach(function (ph, idx) {
            const isPresent = ctx ? ctx.phInfo.categoryId === ph.id : false;
            nodes.push({
                id: 'ph:' + ph.id,
                rawId: ph.id,
                category: 'soil',
                label: ph.label,
                subLabel: ph.rangeText,
                x: 95,
                y: 48 + idx * 52,
                isPresentAtLocation: isPresent,
                layerHint: 'ph',
                ontologieTyp: 'sckm:SoilMilieu'
            });
        });

        // Spalte 2: Symbiose-Baum (x = 305)
        ont.TREE_NODES.forEach(function (tree, idx) {
            const isPresent = ctx ? ctx.trees.indexOf(tree.id) !== -1 : false;
            nodes.push({
                id: 'tree:' + tree.id,
                rawId: tree.id,
                category: 'tree',
                label: tree.label,
                subLabel: tree.gruppe,
                x: 305,
                y: 38 + idx * 33,
                isPresentAtLocation: isPresent,
                layerHint: 'waldrefugien',
                ontologieTyp: 'sckm:MycorrhizaTree'
            });
        });

        // Spalte 3: Pilzart (Regelwerk) (x = 535)
        ont.MUSHROOM_SPECIES.forEach(function (sp, idx) {
            const rankItem =
                evaluationResult && evaluationResult.rankings
                    ? evaluationResult.rankings.find(function (r) {
                          return r.species.id === sp.id;
                      })
                    : null;
            const score = rankItem ? rankItem.score : 0;
            nodes.push({
                id: 'mushroom:' + sp.id,
                rawId: sp.id,
                category: 'mushroom',
                label: sp.deutscherName,
                subLabel: score + '% Eignung',
                score: score,
                x: 535,
                y: 38 + idx * 38,
                isPresentAtLocation: score >= 65,
                isActiveSpecies: sp.id === activeSpeciesId,
                layerHint: 'fundstellen',
                ontologieTyp: 'sckm:FungalSpecies'
            });
        });

        // Spalte 4: Zeigerpflanze (Vor Ort / BWI) (x = 765)
        ont.INDICATOR_NODES.forEach(function (ind, idx) {
            const isPresent = ctx ? ctx.indicators.indexOf(ind.id) !== -1 : false;
            nodes.push({
                id: 'plant:' + ind.id,
                rawId: ind.id,
                category: 'plant',
                label: ind.label,
                subLabel: ind.bwiField ? 'BWI ' + ind.bwiField : 'Kalk-/Auwald',
                x: 765,
                y: 42 + idx * 38,
                isPresentAtLocation: isPresent,
                layerHint: 'bwi',
                ontologieTyp: 'sckm:IndicatorPlant'
            });
        });

        // Gerichtete Kanten (RDF-Tripel: Subjekt --Prädikat--> Objekt)
        ont.MUSHROOM_SPECIES.forEach(function (sp) {
            const mId = 'mushroom:' + sp.id;

            sp.requiredPhCategories.forEach(function (phId) {
                edges.push({
                    id: 'edge:ph:' + phId + '->' + mId,
                    sourceId: 'ph:' + phId,
                    targetId: mId,
                    predicate: 'sckm:hatBodenMilieu',
                    predicateLabel: 'benötigt Boden-pH',
                    mushroomId: sp.id
                });
            });

            sp.requiredTrees.forEach(function (treeId) {
                edges.push({
                    id: 'edge:tree:' + treeId + '->' + mId,
                    sourceId: 'tree:' + treeId,
                    targetId: mId,
                    predicate: 'sckm:mykorrhizaMit',
                    predicateLabel: 'bildet Symbiose mit',
                    mushroomId: sp.id
                });
            });

            sp.indicatorPlants.forEach(function (plantId) {
                edges.push({
                    id: 'edge:' + mId + '->plant:' + plantId,
                    sourceId: mId,
                    targetId: 'plant:' + plantId,
                    predicate: 'sckm:indiziertDurch',
                    predicateLabel: 'wird angezeigt durch',
                    mushroomId: sp.id
                });
            });
        });

        // Ermittle verbundene Tripel für den fokussierten Knoten (oder aktiven Zielpilz)
        const focusId = focusedNodeId || 'mushroom:' + activeSpeciesId;
        const activeEdges = edges.filter(function (e) {
            return e.sourceId === focusId || e.targetId === focusId;
        });

        return {
            nodes: nodes,
            edges: edges,
            focusId: focusId,
            activeEdges: activeEdges
        };
    }

    // Erzeugt das interaktive SVG-Markup für das Knowledge-Graph-Dock
    function renderKnowledgeGraphSvg(graphData) {
        const nodeMap = {};
        graphData.nodes.forEach(function (n) {
            nodeMap[n.id] = n;
        });

        const connectedNodeIds = {};
        connectedNodeIds[graphData.focusId] = true;
        graphData.activeEdges.forEach(function (e) {
            connectedNodeIds[e.sourceId] = true;
            connectedNodeIds[e.targetId] = true;
        });

        const categoryColors = {
            soil: { fill: '#f5f0ff', stroke: '#7c3aed', text: '#5b21b6' },
            tree: { fill: '#ecfdf5', stroke: '#059669', text: '#065f46' },
            mushroom: { fill: '#fffbeb', stroke: '#d97706', text: '#92400e' },
            plant: { fill: '#eff6ff', stroke: '#2563eb', text: '#1e40af' }
        };

        let edgesHtml = '';
        graphData.edges.forEach(function (edge) {
            const src = nodeMap[edge.sourceId];
            const dst = nodeMap[edge.targetId];
            if (!src || !dst) return;

            const isHighlighted =
                edge.sourceId === graphData.focusId || edge.targetId === graphData.focusId;
            const bothPresent = src.isPresentAtLocation && dst.isPresentAtLocation;

            const x1 = src.x + 76;
            const y1 = src.y;
            const x2 = dst.x - 76;
            const y2 = dst.y;
            const cx1 = x1 + (x2 - x1) * 0.45;
            const cx2 = x1 + (x2 - x1) * 0.55;

            const strokeColor = isHighlighted
                ? bothPresent
                    ? '#16a34a'
                    : '#d97706'
                : '#cbd5e1';
            const strokeWidth = isHighlighted ? (bothPresent ? '2.6' : '2.1') : '1.0';
            const opacity = isHighlighted ? '0.95' : '0.28';

            edgesHtml +=
                '<path d="M ' +
                x1 +
                ' ' +
                y1 +
                ' C ' +
                cx1 +
                ' ' +
                y1 +
                ', ' +
                cx2 +
                ' ' +
                y2 +
                ', ' +
                x2 +
                ' ' +
                y2 +
                '" fill="none" stroke="' +
                strokeColor +
                '" stroke-width="' +
                strokeWidth +
                '" stroke-opacity="' +
                opacity +
                '" />';
        });

        let nodesHtml = '';
        graphData.nodes.forEach(function (node) {
            const pal = categoryColors[node.category] || categoryColors.soil;
            const isFocused = node.id === graphData.focusId;
            const isConnected = !!connectedNodeIds[node.id];
            const opacity = isConnected ? '1' : '0.42';
            const strokeW = isFocused ? '2.6' : node.isPresentAtLocation ? '2.0' : '1.2';
            const strokeCol = node.isPresentAtLocation ? '#16a34a' : pal.stroke;

            const rx = node.x - 75;
            const ry = node.y - 14;

            const statusDot = node.isPresentAtLocation
                ? '<circle cx="' +
                  (node.x - 63) +
                  '" cy="' +
                  node.y +
                  '" r="4.5" fill="#16a34a"><title>Am aktuellen Standort vorhanden</title></circle>'
                : '<circle cx="' +
                  (node.x - 63) +
                  '" cy="' +
                  node.y +
                  '" r="3.5" fill="#cbd5e1"></circle>';

            nodesHtml +=
                '<g class="sckm-kg-node" role="button" tabindex="0" aria-label="Ontologie-Knoten ' +
                node.label +
                '" data-node-id="' +
                node.id +
                '" style="cursor:pointer;opacity:' +
                opacity +
                ';" onclick="window.klickSckmGraphKnoten(\'' +
                node.id +
                '\')">' +
                '<rect x="' +
                rx +
                '" y="' +
                ry +
                '" width="150" height="28" rx="8" fill="' +
                pal.fill +
                '" stroke="' +
                strokeCol +
                '" stroke-width="' +
                strokeW +
                '" />' +
                statusDot +
                '<text x="' +
                (node.x - 52) +
                '" y="' +
                (node.y - 1) +
                '" font-size="10.5" font-weight="700" fill="' +
                pal.text +
                '">' +
                node.label +
                '</text>' +
                '<text x="' +
                (node.x - 52) +
                '" y="' +
                (node.y + 9) +
                '" font-size="8.5" fill="#64748b">' +
                node.subLabel +
                '</text>' +
                '</g>';
        });

        return (
            '<svg viewBox="0 0 865 270" class="sckm-kg-svg" role="group" aria-label="Interaktiver Pilz-Wissensgraph">' +
            '<g font-size="10" font-weight="700" fill="#64748b" text-anchor="middle">' +
            '<text x="95" y="16">1. BODEN-MILIEU (pH)</text>' +
            '<text x="305" y="16">2. SYMBIOSE-BAUM</text>' +
            '<text x="535" y="16">3. PILZART (ONTOLOGIE)</text>' +
            '<text x="765" y="16">4. ZEIGERPFLANZE (BWI)</text>' +
            '</g>' +
            edgesHtml +
            nodesHtml +
            '</svg>'
        );
    }

    const SCKM_GRAPH = {
        buildKnowledgeGraph: buildKnowledgeGraph,
        renderKnowledgeGraphSvg: renderKnowledgeGraphSvg
    };

    root.SCKM_GRAPH = SCKM_GRAPH;
    if (typeof module !== 'undefined' && module.exports) {
        module.exports = SCKM_GRAPH;
    }
})(typeof window !== 'undefined' ? window : globalThis);
