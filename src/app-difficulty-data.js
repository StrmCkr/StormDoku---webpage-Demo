+/* StormDoku shared difficulty data. */
(function installDifficultyInfoData(global) {
  const app = global.StormDokuApp = global.StormDokuApp || {};
      const DIFFICULTY_TABLE_GROUPS = Object.freeze([
        {
          category: 'ANY', score: '—', items: [
            ['Any target', 'No restriction'],
          ],
        },
        {
          category: 'LULZ', score: '0', items: [
            ['Last Man Standing', '0'],
          ],
        },
        {
          category: 'EXTREMELY EASY', score: '1', items: [
            ['Hidden Single', '1'],
            ['Naked Single', '1'],
            ['Box-Line Reduction', '1'],
          ],
        },
        {
          category: 'VERY EASY', score: '2', items: [
            ['Hidden Pair', '2'],
            ['Naked Pair', '2'],
            ['X-Wing', '2'],
          ],
        },
        {
          category: 'MODESTLY EASY', score: '2.125 to 2.75', items: [
            ['X-Chain depth 2, open', '2.25 + link modifiers'],
            ['Skyscraper', '2.25 + link modifiers'],
            ['2-String Kite', '2.25 + link modifiers'],
            ['Finned X-Wing', '2.25 + link modifiers'],
            ['Sashimi X-Wing', '2.25 + link modifiers'],
            ['Empty Rectangle', '2.25 + link modifiers'],
            ['Franken 2x2 Fish K0', '2.125'],
            ['Mutant 2x2 Fish K0', '2.25'],
            ['Franken 2x2+K1 Fish', '2.375'],
            ['Mutant 2x2+K1 Fish', '2.50'],
            ['Franken 2x2+K2 Fish', '2.625'],
            ['Mutant 2x2+K2 Fish', '2.75'],
          ],
        },
        {
          category: 'EASY', score: '3', items: [
            ['Hidden Triple', '3'],
            ['Naked Triple', '3'],
            ['Swordfish', '3'],
          ],
        },
        {
          category: 'MODERATE', score: '3.125 to 3.75', items: [
            ['X-Chains depth 3, types 0-3, including L(1)/ERI subclasses', '3.25 + link modifiers'],
            ['XY-Chain depth 3', '3.25 + link modifiers'],
            ['B.A.R.N.S. size 3, XYZ Wing/Ring', '3.25 + ALS_RCC modifiers'],
            ['L(2,3), W, S, M, H(1,2,3), Strong Wing/Ring depth 3', '3.25 + link modifiers'],
            ['Franken 3x3 Fish K0', '3.125'],
            ['Mutant 3x3 Fish K0', '3.25'],
            ['Franken 3x3+K1 Fish', '3.375'],
            ['Mutant 3x3+K1 Fish', '3.50'],
            ['Franken 3x3+K2 Fish', '3.625'],
            ['Mutant 3x3+K2 Fish', '3.75'],
          ],
        },
        {
          category: 'TOUGH', score: '4', items: [
            ['Hidden Quad', '4'],
            ['Naked Quad', '4'],
            ['Jellyfish', '4'],
          ],
        },
        {
          category: 'CHALLENGING', score: '4.125 to 4.75', items: [
            ['X-Chain depth 4', '4.25 + link modifiers'],
            ['B.A.R.N.S. transport, size 3', '4.75 + link modifiers'],
            ['B.A.R.N.S./WXYZ, size 4', '4.25 + ALS_RCC modifiers'],
            ['XY-Chain depth 4', '4.25 + link modifiers'],
            ['Hidden XY-Chain depth 4', '4.25 + link modifiers'],
            ['Ordinary AIC depth 4, including Inversion Wings/Rings', '4.25 + link modifiers'],
            ['Franken 4x4 Fish K0', '4.125'],
            ['Mutant 4x4 Fish K0', '4.25'],
            ['Franken 4x4+K1 Fish', '4.375'],
            ['Mutant 4x4+K1 Fish', '4.50'],
            ['Franken 4x4+K2 Fish', '4.625'],
            ['Mutant 4x4+K2 Fish', '4.75'],
          ],
        },
        {
          category: 'IRRITATING', score: '5 to 5.75', items: [
            ['Hidden Quintuple (off by default)', '5'],
            ['Naked Quintuple (off by default)', '5'],
            ['Basic 5x5 Fish (off by default)', '5'],
            ['X-Chains depth 5', '5'],
            ['XY-Chain depth 5', '5.25 + link modifiers'],
            ['Hidden XY-Chain depth 5', '5.25 + link modifiers'],
            ['Ordinary AIC depth 5, including permitted Inversion Wings/Rings', '5.25 + link modifiers'],
            ['Transport WXYZ Wings/Rings', '5 + link modifiers'],
            ['B.A.R.N.S. size 5, VWXYZ Wings/Rings', '5 + ALS_RCC modifiers'],
            ['Franken/Mutant 5x5 Fish K0 (off by default)', '5.125'],
          ],
        },
        {
          category: 'FRUSTRATING', score: '6 to 6.75', items: [
            ['Hidden Sextuple (off by default)', '6'],
            ['Naked Sextuple (off by default)', '6'],
            ['Basic 6x6 Fish (off by default)', '6'],
            ['X-Chains depth 6', '6 + link modifiers'],
            ['XY-Chain depth 6', '6 + link modifiers'],
            ['Hidden XY-Chain depth 6', '6 + link modifiers'],
            ['AIC depth 6, including ALS_RCC/AHS_RCC', '6 + link / ALS_RCC / AHS_RCC modifiers'],
            ['Transport B.A.R.N.S. size 5', '6 + link modifiers'],
            ['B.A.R.N.S. size 6, UVWXYZ Wings/Rings', '6 + ALS_RCC modifiers'],
            ['Franken 6x6 Fish K0', '6.125'],
            ['Mutant 6x6 Fish K0', '6.25'],
            ['Transport W-Wing/Ring', '6.5'],
          ],
        },
        {
          category: 'HARD', score: '7 to 7.75', items: [
            ['Hidden Septuple (off by default)', '7'],
            ['Naked Septuple (off by default)', '7'],
            ['Basic 7x7 Fish (off by default)', '7'],
            ['ALS-XZ, full engine, depth 2', '7 + link / ALS_RCC modifiers'],
            ['AHS-XZ, full engine, depth 2', '7 + link / AHS_RCC modifiers'],
            ['ALC-XZ, full engine, depth 2', '7 + link / ALS_RCC / AHS_RCC modifiers'],
            ['Full-depth X-Chains', '7.25 + link modifiers'],
            ['Full-depth XY-Chains', '7.25 + link modifiers'],
            ['Full-depth Hidden XY-Chains', '7.25 + link modifiers'],
            ['Full-depth ordinary AIC', '7.25 + link modifiers'],
  
            ['Franken 7x7 Fish K0', '7.125'],
            ['Mutant 7x7 Fish K0', '7.25'],
          ],
        },
        {
          category: 'DEMANDING', score: '8 to 8.5', items: [
            ['Hidden Octuple (off by default)', '8'],
            ['Naked Octuple (off by default)', '8'],
            ['Named ALS Wings/Rings, AIC depth 3', '8 + link / ALS_RCC modifiers'],
            ['Named AHS Wings/Rings, AIC depth 3', '8 + link / AHS_RCC modifiers'],
            ['Named ALC Wings/Rings, AIC depth 3', '8 + link / ALS_RCC / AHS_RCC modifiers'],
            ['Transport ALS-XZ', '8 + link / ALS_RCC modifiers'],
            ['Transport AHS-XZ', '8 + link / AHS_RCC modifiers'],
            ['Transport ALC-XZ', '8 + link / ALS_RCC / AHS_RCC modifiers'],
            ['ALS-XY, unrestricted, depth 3', '8 + link / ALS_RCC modifiers'],
            ['AHS-XY, depth 3', '8 + link / AHS_RCC modifiers'],
            ['ALC-XY, depth 3', '8.5 + link / ALS_RCC / AHS_RCC modifiers'],
          ],
        },
        {
          category: 'EXPERT', score: '9 to 9.5', items: [
            ['Hidden Nontuple (off by default)', '9'],
            ['Naked Nontuple (off by default)', '9'],
            ['Transport ALS-XY', '9 + link / ALS_RCC modifiers'],
            ['Transport AHS-XY', '9 + link / AHS_RCC modifiers'],
            ['Transport ALC-XY', '9 + link / ALS_RCC / AHS_RCC modifiers'],
          ],
        },
        {
          category: 'BRUTAL', score: '10 to 10.5', items: [
            ['ALS Chains, full scope beyond depth 3', '10 + link / ALS_RCC modifiers'],
            ['AHS Chains, full scope beyond depth 3', '10 + link / AHS_RCC modifiers'],
            ['ALC Chains, full scope beyond depth 3', '10.5 + link / ALS_RCC / AHS_RCC modifiers'],
          ],
        },
        {
          category: 'NIGHTMARE', score: '11 to 11.5', items: [
            ['Full AIC, beyond depth 3', '11 + link / ALS_RCC / AHS_RCC modifiers'],
          ],
        },
        {
          category: 'ABYSSAL', score: '12 to 12.999', items: [
            ['ALS-DOF, progressively scaled DOF/digits', '12 + 0.25 * (DOF - 1)'],
            ['DDS ring, progressively scaled DOF/digits', 'ALS-DOF + 0.5'],
            ['ADDS, progressively scaled DOF/digits', 'DDS + 0.25'],
            ['AHS-DOF, progressively scaled DOF/cells', '12.25 + 0.25 * (DOF - 1)'],
            ['ALC-DOF, progressively scaled mixed roots', '12.5 + scaling'],
          ],
        },
        {
          category: 'ASCENDANT', score: '13 to 13.999', items: [
            ['MSLS, scaled multi-sector locked sets', '13 + link / cover modifiers'],
          ],
        },
        {
          category: 'TRANSCENDENT', score: '14 to 15.999', items: [
            ['ALS-DOF Chaining, progressively scaled depth/digits/DOF', '14+'],
            ['AHS-DOF Chain, extended scope', '14+'],
          ],
        },
        {
          category: 'UNKNOWN', score: '—', items: [
            ['Unsolved', '—'],
            ['Unclassified', '—'],
          ],
        },
      ]);
  app.difficultyInfoData = { groups: DIFFICULTY_TABLE_GROUPS };
})(window);

