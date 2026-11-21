// Screenshot scenes behind ?shot=title|play|levelup|over. Each one drives the
// real game forward (real finds, real level-clear, real game-over), so the
// frame is what genuine play looks like and the same seed always gives the
// same frame. No pixels are faked: the stager only clicks where a player
// would click — on real differences.
import { SCREEN_TITLE } from './render.js';

/**
 * Stage the named scene on `game` (the object main.js builds) and return the
 * screen that will be drawn over it.
 */
export function stageShot(name, game) {
  const { state } = game;
  if (name === 'play') {
    game.startGame();
    game.startLevel(1);
    // A real mid-level moment: two differences found, four still to find.
    game.findAt(150, 282);
    game.findAt(482, 352);
    state.timeLeft = 62;
    return { screen: state.screen };
  }
  if (name === 'levelup') {
    game.startGame();
    game.startLevel(0);
    // Play level 1 for real: click every difference, left-panel coordinates.
    const targets = [
      [92, 62], [302, 148], [472, 122], [122, 362], [432, 302],
    ];
    for (const [x, y] of targets) game.findAt(x, y);
    return { screen: state.screen };
  }
  if (name === 'over') {
    game.startGame();
    game.startLevel(0);
    game.findAt(92, 62);
    game.findAt(302, 148);
    state.timeLeft = 0;
    game.gameOver('time');
    return { screen: state.screen };
  }
  // Default: the title screen over level 1, unplayed.
  state.screen = SCREEN_TITLE;
  state.levelIndex = 0;
  return { screen: SCREEN_TITLE };
}
