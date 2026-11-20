/* StormDoku per-step difficulty rating. */
(function installStepRating(global) {
  const app = global.StormDokuApp = global.StormDokuApp || {};

  function create({
    alsDofScore, ratingCategoryForValue, ratingDefinition, ratingForChain,
    unknownRating, ratingTags, fishScoreForSize,
  }) {
    const RATING_TAGS = ratingTags;

    function ratingForStep(step) {
      const tech = String(step?.tech || '');
      if (tech === 'chain') return ratingForChain(step.chain || step, step);
      if (tech === 'als-dof') {
        const score = alsDofScore(step);
        const category = ratingCategoryForValue(score);
        const label = step.mode === 'almost-dds'
          ? 'Almost DDS'
          : step.mode === 'dds'
            ? 'DDS'
            : 'ALS - DOF';
        return {
          ...ratingDefinition(category, score, `${label}${step.isRing ? ' Ring' : ''}`),
          hardestMove: step.desc || '',
        };
      }
      if (tech === 'als-hydra') {
        const score = 19 + Math.max(0, (step?.hydraRecord?.participants || []).length - 1) * 0.25;
        return {
          ...ratingDefinition(ratingCategoryForValue(score), score, 'ALS - Hydra'),
          hardestMove: step.desc || '',
        };
      }
      if (tech === 'non-colourable-chromatic-graph'
        || tech === 'non-colourable-chromatic-graph-als') {
        const record = step?.chromaticRecord || {};
        const k = Math.max(2, Number(record.k) || 2);
        const kModifier = (k - 2) * 0.125;
        const alsFormModifier = ({
          1: 0.125,
          '2a': 0.25,
          '2b': 0.375,
          '2c': 0.5,
          distributed: 0.625,
        })[record.type] || 0;
        const score = Number((17 + kModifier + alsFormModifier).toFixed(3));
        return {
          ...ratingDefinition(ratingCategoryForValue(score), score,
            record.source === 'ALS-DOF-0/1' || record.alsNodes
              ? 'Non-Colourable Chromatic Graphs - ALS'
              : 'Non-Colourable Chromatic Graphs'),
          hardestMove: step.desc || '',
        };
      }
      if (tech === 'ahs-dof') {
        const dof = Math.max(1, Number(step?.size ?? step?.record?.dof ?? 1));
        const score = 13.25 + (0.25 * Math.max(0, dof - 1)) + (step?.isRing ? 0.5 : 0);
        return {
          ...ratingDefinition(ratingCategoryForValue(score), score,
            `AHS - DOF${step?.isRing ? ' Ring' : ''}`),
          hardestMove: step.desc || '',
        };
      }
      if (tech === 'ahs-dof-chain') {
        const score = 15 + (step?.isRing ? 0.5 : 0);
        return {
          ...ratingDefinition(ratingCategoryForValue(score), score,
            `AHS - DOF Chain${step?.isRing ? ' Ring' : ''}`),
          hardestMove: step.desc || '',
        };
      }
      if (tech === 'als-dof-chain') {
        const score = 15 + (step?.isRing ? 0.5 : 0);
        return {
          ...ratingDefinition(ratingCategoryForValue(score), score,
            `ALS - DOF Chain${step?.isRing ? ' Ring' : ''}`),
          hardestMove: step.desc || '',
        };
      }
      if (tech === 'msls') {
        return {
          ...ratingDefinition('Ascendant', 14, 'MSLS'),
          hardestMove: step.desc || '',
        };
      }
      const direct = RATING_TAGS.find(definition => definition.tech === tech);
      if (direct) {
        return {
          rank: direct.rank,
          value: direct.value,
          tag: direct.tag,
          category: direct.category,
          hardestMove: step.desc || '',
        };
      }
    
      if (tech === 'pointing' || tech === 'claiming' || tech === 'non-consecutive-line' || tech === 'non-consecutive-eri' || tech === 'non-consecutive-als' || tech === 'non-consecutive-als-dof' || tech === 'non-consecutive-als-dof-peer') {
        return {
          ...ratingDefinition('Extremely Easy', 1, 'Box - Line Reduction'),
          hardestMove: step.desc || '',
        };
      }
    
      const subsetMatch = /^(hidden|naked)-(single|pair|triple|quad|quintuple|sextuple|septuple|octuple|nontuple)$/i.exec(tech);
      if (subsetMatch) {
        const kind = subsetMatch[1].toLowerCase();
        const names = {
          single: ['Hidden Single', 'Naked Single'],
          pair: ['Hidden Pair', 'Naked Pair'],
          triple: ['Hidden Triple', 'Naked Triple'],
          quad: ['Hidden Quad', 'Naked Quad'],
          quintuple: ['Hidden Quintuple', 'Naked Quintuple'],
          sextuple: ['Hidden Sextuple', 'Naked Sextuple'],
          septuple: ['Hidden Septuple', 'Naked Septuple'],
          octuple: ['Hidden Octuple', 'Naked Octuple'],
          nontuple: ['Hidden Nontuple', 'Naked Nontuple'],
        }[subsetMatch[2].toLowerCase()];
        const size = {
          single: 1,
          pair: 2,
          triple: 3,
          quad: 4,
          quintuple: 5,
          sextuple: 6,
          septuple: 7,
          octuple: 8,
          nontuple: 9,
        }[subsetMatch[2].toLowerCase()] || 0;
        if (size > 0) {
          const value = size === 1 ? 1 : size;
          return {
            ...ratingDefinition(ratingCategoryForValue(value), value,
              names[kind === 'hidden' ? 0 : 1]),
            hardestMove: step.desc || '',
          };
        }
      }
    
      if (tech === 'fish') {
        const size = Number(step?.size);
        const k = Number(step?.k || 0);
        const fishCategory = step?.category || 'Basic';
        const value = fishScoreForSize(size, k, fishCategory);
        if (value !== null && Number.isFinite(value)) {
          const category = ratingCategoryForValue(value);
          const shape = fishCategory === 'Basic' && k === 0
            ? ({ 2: 'X-Wing', 3: 'SwordFish', 4: 'JellyFish' }[size] || `${size}x${size} Fish`)
            : `${fishCategory} ${size}x${size}+K${k} Fish`;
          return {
            ...ratingDefinition(category, value, shape),
            hardestMove: step.desc || '',
          };
        }
      }
    
      return unknownRating(step?.desc || '');
    }

    return { ratingForStep };
  }

  app.stepRating = { create };
})(window);
