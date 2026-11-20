/* Build the shared technique profile used by interactive Next and Run All. */
(function installInteractiveProfile(global) {
  const app = global.StormDokuApp = global.StormDokuApp || {};

  function create({ generationTechniqueProfile, currentSolverMoveTypes, getContext }) {
    function build() {
      const context = getContext();
      const profile = generationTechniqueProfile('Unfathomable') || {};
      const configuredDigits = Number(context.alsDofMaxDigits);
      const configuredAuxiliary = Number(context.alsDofMaxAuxiliary);
      const configuredDepth = Math.min(8, Math.max(2, Number(context.chainDepth) || 8));
      const configuredStrongTypes = context.chainStrongTypes
        .map((element, index) => element.checked ? index : null)
        .filter(index => index !== null);
      return {
        ...profile,
        // Run All/Next use the same hierarchy as rating, while the checkboxes
        // still control which techniques are enabled interactively.
        moveTypes: [...new Set([...currentSolverMoveTypes(),
          'chromatic', 'chromatic-als', 'als-hydra'])],
        interactiveMaxDepth: configuredDepth,
        interactiveStrongLinkTypes: configuredStrongTypes,
        interactiveIncludeAls: context.chainAlsRccEnabled,
        interactiveIncludeAhs: context.chainAhsEnabled,
        alsMaxDigits: Number.isInteger(configuredDigits)
          ? Math.min(9, Math.max(2, configuredDigits))
          : 5,
        alsMaxAuxiliary: Number.isInteger(configuredAuxiliary)
          ? Math.min(9, Math.max(1, configuredAuxiliary))
          : 5,
      };
    }

    return { build };
  }

  app.interactiveProfile = { create };
})(window);
