/* StormDoku shared rating metadata. */
(function installRatingData(global) {
  const app = global.StormDokuApp = global.StormDokuApp || {};

  const ranks = Object.freeze({
    Any: -1, Lulz: 0, 'Extremely Easy': 10, 'Very Easy': 20,
    'Modestly Easy': 30, Easy: 40, Moderate: 50, Tough: 60,
    Challenging: 70, Irritating: 80, Frustrating: 90, Hard: 100,
    Demanding: 110, Expert: 120, Brutal: 130, Nightmare: 140,
    Abyssal: 150, Ascendant: 160, Transcendent: 170,
    Unknown: Number.POSITIVE_INFINITY,
  });

  const scoreBands = Object.freeze([
    { category: 'Lulz', min: 0, max: 0 },
    { category: 'Extremely Easy', min: 1, max: 1.5 },
    { category: 'Very Easy', min: 2, max: 2 },
    { category: 'Modestly Easy', min: 2.001, max: 2.999 },
    { category: 'Easy', min: 3, max: 3 },
    { category: 'Moderate', min: 3.001, max: 3.999 },
    { category: 'Tough', min: 4, max: 4 },
    { category: 'Challenging', min: 4.001, max: 4.999 },
    { category: 'Irritating', min: 5, max: 5.999 },
    { category: 'Frustrating', min: 6, max: 6.999 },
    { category: 'Hard', min: 7, max: 7.999 },
    { category: 'Demanding', min: 8, max: 8.999 },
    { category: 'Expert', min: 9, max: 9.999 },
    { category: 'Brutal', min: 10, max: 10.999 },
    { category: 'Nightmare', min: 11, max: 11.999 },
    { category: 'Abyssal', min: 12, max: 12.999 },
    { category: 'Ascendant', min: 13, max: 13.999 },
    { category: 'Transcendent', min: 14, max: 15.999 },
  ]);

  const colors = Object.freeze({
    Lulz: 'white', 'Extremely Easy': 'white', 'Very Easy': 'green',
    'Modestly Easy': 'green', Easy: 'blue', Moderate: 'blue',
    Tough: 'yellow', Challenging: 'yellow', Irritating: 'red',
    Frustrating: 'red', Hard: 'purple', Demanding: 'purple',
    Expert: 'violet', Brutal: 'violet', Nightmare: 'brown',
    Abyssal: 'brown', Ascendant: 'black', Transcendent: 'black',
    Any: 'unknown', Unknown: 'unknown',
  });

  const tags = Object.freeze([
    { category: 'Lulz', value: 0, tag: 'Last Man Standing', tech: 'last-man-standing' },
    { category: 'Extremely Easy', value: 1, tag: 'Hidden Single', tech: 'hidden-single' },
    { category: 'Extremely Easy', value: 1, tag: 'Naked Single', tech: 'naked-single' },
    { category: 'Extremely Easy', value: 1, tag: 'Box - Line Reduction', tech: 'box-line' },
    { category: 'Very Easy', value: 2, tag: 'Hidden Pair', tech: 'hidden-pair' },
    { category: 'Very Easy', value: 2, tag: 'Naked Pair', tech: 'naked-pair' },
    { category: 'Very Easy', value: 2, tag: 'X-Wing', tech: 'x-wing' },
    { category: 'Easy', value: 3, tag: 'Hidden Triple', tech: 'hidden-triple' },
    { category: 'Easy', value: 3, tag: 'Naked Triple', tech: 'naked-triple' },
    { category: 'Easy', value: 3, tag: 'SwordFish', tech: 'swordfish' },
    { category: 'Tough', value: 4, tag: 'Hidden Quad', tech: 'hidden-quad' },
    { category: 'Tough', value: 4, tag: 'Naked Quad', tech: 'naked-quad' },
    { category: 'Tough', value: 4, tag: 'JellyFish', tech: 'jellyfish' },
  ]);

  app.ratingData = Object.freeze({ ranks, scoreBands, colors, tags });
})(window);
