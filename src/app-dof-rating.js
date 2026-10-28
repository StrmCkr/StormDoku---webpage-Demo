/* StormDoku ALS/AHS DOF rating helpers. */
(function installDofRating(global) {
  const app = global.StormDokuApp = global.StormDokuApp || {};

  function alsDofScore(step) {
    const dof = Math.max(1, Number(step?.size ?? step?.primaryA?.dof ?? 1));
    const dofShift = 0.25 * Math.max(0, dof - 1);
    if (step?.mode === 'almost-dds') return 12 + dofShift + 0.75;
    if (step?.mode === 'dds') return 12 + dofShift + (step.isRing ? 0.5 : 0);
    return 12 + dofShift + (step?.isRing ? 0.5 : 0);
  }

  function alsDofMoveKey(result) {
    if (result?.mode === 'dds') return 'dds';
    if (result?.mode === 'almost-dds') return 'adds';
    return 'als-dof';
  }

  function alsDofMoveEnabled(result, enabledTypes) {
    return enabledTypes.has(alsDofMoveKey(result));
  }

  app.dofRating = { alsDofScore, alsDofMoveKey, alsDofMoveEnabled };
})(window);
