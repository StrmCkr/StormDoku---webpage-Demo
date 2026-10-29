/* StormDoku solver-ranking adapter. */
(function installSolverRanking(global) {
  const app = global.StormDokuApp = global.StormDokuApp || {};

  function create({ chainScoring, solverTieOrder, alsDofMoveKey, chainMoveTieKey, chainComplexityRank, ratingForStep }) {
    function directMoveTieKey(step) {
      return chainScoring.directMoveTieKey(step, alsDofMoveKey);
    }

    function moveTieOrder(chain, step) {
      return chainScoring.moveTieOrder(chain, step, chainMoveTieKey, directMoveTieKey, solverTieOrder);
    }

    function solverMovePriority(chain, step, searchDepth, reportIndex) {
      return chainScoring.solverMovePriority(
        chain, step, searchDepth, reportIndex, ratingForStep, moveTieOrder, chainComplexityRank,
      );
    }

    function directMovePriority(step) {
      return chainScoring.directMovePriority(step, ratingForStep, currentStep => moveTieOrder(null, currentStep));
    }

    function chooseBestSolverMove(choices = []) {
      return chainScoring.chooseBestSolverMove(
        choices,
        choice => solverMovePriority(choice.chain, choice.step, choice.step?.chainLength, choice.index),
        directMovePriority,
      );
    }

    function isHigherPriorityMove(candidate, current) {
      return chainScoring.isHigherPriorityMove(candidate, current);
    }

    return {
      directMoveTieKey,
      moveTieOrder,
      solverMovePriority,
      directMovePriority,
      chooseBestSolverMove,
      isHigherPriorityMove,
    };
  }

  app.solverRanking = { create };
})(window);
