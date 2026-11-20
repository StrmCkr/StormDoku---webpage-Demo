/* StormDoku per-step colouring sequence reconstruction. */
(function installColouringSequenceAssignments(global) {
  const app = global.StormDokuApp = global.StormDokuApp || {};

  function create({ model, colouringNodeKey }) {
    const colouringSequenceNodes = model.colouringSequenceNodes;
    const colouringSequenceLinkLevels = model.colouringSequenceLinkLevels;
    const colouringSequenceMedusaLevels = model.colouringSequenceMedusaLevels;

    function colouringSequenceColourAssignments(record, method, levels, maxBreadth, breadth) {
      const colourLevels = new Map();
      const tokenLevels = new Map();
      const add = (map, key, value, level) => {
        if (value == null) return;
        const values = map.get(key) || new Map();
        if (!values.has(value) || level < values.get(value)) values.set(value, level);
        map.set(key, values);
      };
      const nodes = colouringSequenceNodes(record, method);
    
      if (method === 'simple') {
        for (const node of nodes) {
          const key = colouringNodeKey(node);
          const breadthColors = node.breadthColors || {};
          for (const color of node.colors || []) {
            const explicitLevel = breadthColors[color];
            add(
              colourLevels,
              key,
              color,
              Number.isFinite(Number(explicitLevel))
                ? Number(explicitLevel)
                : (levels.get(key) || 1),
            );
          }
        }
        return { colourLevels, tokenLevels };
      }
    
      if (method === 'medusaMulti') {
        // The completed report stores every parity/token reached by the full
        // walk. Reconstruct the actual breadth walk rather than using the
        // order in which visual links were serialized.
        const walk = colouringSequenceMedusaLevels(record, nodes);
        const stateLevels = walk.stateLevels;
        const linkLevels = walk.linkLevels;
        for (const [index, link] of (record.linkColours || []).entries()) {
          const linkLevel = linkLevels.get(index) || 1;
          for (const endpoint of link.endpoints || []) {
            const key = colouringNodeKey(endpoint);
            const reached = stateLevels.get(key) || new Map();
            for (let side = 0; side < (endpoint.colors || []).length; side++) {
              const color = endpoint.colors[side];
              const stateLevel = reached.get(color);
              if (!Number.isFinite(stateLevel)) continue;
              const level = Math.max(linkLevel, stateLevel);
              add(colourLevels, key, color, level);
              const token = endpoint.colourTokens?.[side];
              if (token != null) add(tokenLevels, key, token, level);
            }
          }
        }
    
        for (const node of nodes) {
          const key = colouringNodeKey(node);
          const reached = stateLevels.get(key) || new Map();
          for (const color of node.colors || []) {
            if (reached.has(color)) continue;
            // Preserve disconnected completed nodes only at the final step.
            if (breadth >= maxBreadth) {
              add(colourLevels, key, color, levels.get(key) || 1);
            }
          }
          if (breadth >= maxBreadth) {
            for (const token of node.colourTokens || []) {
              add(tokenLevels, key, token, levels.get(key) || 1);
            }
          }
        }
        return { colourLevels, tokenLevels };
      }
    
      if (method === 'multi' && !record.source) {
        const linkLevels = colouringSequenceLinkLevels(record);
        for (const [index, link] of (record.linkColours || []).entries()) {
          const level = linkLevels.get(index) || 1;
          for (const endpoint of link.endpoints || []) {
            const key = colouringNodeKey(endpoint);
            for (const color of endpoint.colors || []) add(colourLevels, key, color, level);
            for (const token of endpoint.colourTokens || []) add(tokenLevels, key, token, level);
          }
        }
        return { colourLevels, tokenLevels };
      }
    
      if (method === 'medusa') {
        // 3D-Medusa Simple is one two-colour parity walk. A node may carry
        // both colours in the completed graph, but its second colour must be
        // delayed until an opposite-parity path actually reaches it.
        const adjacency = new Map();
        for (const edge of record.edges || []) {
          if (edge.kind === 'weak-inference') continue;
          const left = edge.left?.cell == null ? null : colouringNodeKey(edge.left);
          const right = edge.right?.cell == null ? null : colouringNodeKey(edge.right);
          if (!left || !right || left === right) continue;
          if (!adjacency.has(left)) adjacency.set(left, []);
          if (!adjacency.has(right)) adjacency.set(right, []);
          adjacency.get(left).push({ key: right, flip: true });
          adjacency.get(right).push({ key: left, flip: true });
        }
        const first = nodes[0];
        if (first) {
          const firstKey = colouringNodeKey(first);
          const queue = [[firstKey, first.colors?.[0] ?? 0, 1]];
          const seen = new Set();
          while (queue.length) {
            const [key, color, level] = queue.shift();
            const stateKey = `${key}:${color}`;
            if (seen.has(stateKey)) continue;
            seen.add(stateKey);
            add(colourLevels, key, color, level);
            for (const edge of adjacency.get(key) || []) {
              queue.push([edge.key, edge.flip ? 1 - color : color, level + 1]);
            }
          }
        }
        for (const node of nodes) {
          const key = colouringNodeKey(node);
          for (const color of node.colors || []) {
            if (!colourLevels.get(key)?.has(color)) {
              // Preserve the full completed state only when the sequence has
              // reached the end. During stepping, an unreached parity stays
              // hidden instead of making the node look dual-coloured early.
              if (breadth >= maxBreadth) {
                add(colourLevels, key, color, levels.get(key) || 1);
              }
            }
          }
        }
        return { colourLevels, tokenLevels };
      }
    
      const adjacency = new Map();
      for (const edge of record.edges || []) {
        const left = edge.left?.cell == null ? null : colouringNodeKey(edge.left);
        const right = edge.right?.cell == null ? null : colouringNodeKey(edge.right);
        if (!left || !right || left === right) continue;
        if (!adjacency.has(left)) adjacency.set(left, []);
        if (!adjacency.has(right)) adjacency.set(right, []);
        adjacency.get(left).push({ key: right, flip: edge.kind !== 'overlap-extension' });
        adjacency.get(right).push({ key: left, flip: edge.kind !== 'overlap-extension' });
      }
      const first = nodes[0];
      if (first) {
        const firstKey = colouringNodeKey(first);
        const queue = [[firstKey, first.colors?.[0] ?? 0, 1]];
        const seen = new Set();
        while (queue.length) {
          const [key, color, level] = queue.shift();
          const stateKey = `${key}:${color}`;
          if (seen.has(stateKey)) continue;
          seen.add(stateKey);
          add(colourLevels, key, color, level);
          for (const edge of adjacency.get(key) || []) {
            queue.push([edge.key, edge.flip ? 1 - color : color, level + 1]);
          }
        }
      }
      for (const node of nodes) {
        const key = colouringNodeKey(node);
        if (!colourLevels.has(key)) {
          add(colourLevels, key, node.colors?.[0] ?? 0, levels.get(key) || 1);
        }
        if (breadth >= maxBreadth) {
          for (const color of node.colors || []) {
            add(colourLevels, key, color, levels.get(key) || 1);
          }
        }
      }
      return { colourLevels, tokenLevels };
    }

    return { colouringSequenceColourAssignments };
  }

  app.colouringSequenceAssignments = { create };
})(window);
