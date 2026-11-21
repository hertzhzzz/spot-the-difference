# spot-the-difference

[![make.fun · best-spot-the-difference-game-20261121-0451](https://make.fun/badge/best-spot-the-difference-game-20261121-0451.svg)](https://make.fun/bounty/best-spot-the-difference-game-20261121-0451?utm_source=github&utm_medium=readme&utm_campaign=best-spot-the-difference-game-20261121-0451)
[![rank](https://make.fun/badge/best-spot-the-difference-game-20261121-0451/hertzhzzz/spot-the-difference/rank.svg)](https://make.fun/bounty/best-spot-the-difference-game-20261121-0451/leaderboard?utm_source=github&utm_medium=readme&utm_campaign=best-spot-the-difference-game-20261121-0451)
[![reward](https://make.fun/badge/best-spot-the-difference-game-20261121-0451/hertzhzzz/spot-the-difference/reward.svg)](https://make.fun/bounty/best-spot-the-difference-game-20261121-0451?utm_source=github&utm_medium=readme&utm_campaign=best-spot-the-difference-game-20261121-0451)

Two Harbours — a spot the difference game. Two near-identical hand-drawn pictures side by side; you click every difference before the clock runs out. Five scenes of growing difficulty (5, 6, 7, 8 then 10 differences): a sunny harbour, a forest camp at dusk, a space station, a morning market and a snowy cabin. Found differences get a green ring on both pictures, the counter in the middle shows how many are left, and wrong clicks cost points. Hints, streaks, a time bonus, level-clear and game-over screens, and replay — all in plain HTML5 Canvas and native JavaScript, no framework, no network requests, playable offline.

## Run it

```sh
node serve.ts
```

Then open http://localhost:8080. No build step, no network request: the game is plain static files under `game/`.

## How to play

- **Find:** click a difference in either picture. A green ring marks it on both.
- **Count:** the middle column shows how many differences are left in the level.
- **Score:** 100 points per difference, plus a streak bonus; wrong clicks cost 10.
- **Hint:** press H (or the Hint button) to flash one unfound difference — costs 50 points, 3 per game.
- **Clock:** each level has its own countdown. Beat it for a time bonus of 10 points per second left.
- **Win:** clear all five scenes. **Lose:** the clock runs out.
- **Keys:** H hint, P pause, M mute, R restart level, Enter to confirm.

## The scenes

- **Sunny Harbour** (5): gull, boat flag, lighthouse lamp, crab, buoy.
- **Forest Camp** (6): tent, campfire flame, mushroom, bird, star, backpack.
- **Space Station** (7): planet rings, visor, satellite dish, rocket flame, window, star, moon flag.
- **Market Morning** (8): awning, apple, cat, price sign, balloon, bike basket, flower, bird.
- **Snowy Cabin** (10): chimney smoke, scarf, wreath, tree lights, skis, lantern, icicle, birdhouse, hat, curtains.

All art is drawn from code — no image files, no copied assets, no borrowed names.

---

<sub>Entered on [make.fun](https://make.fun/?ref=trpdktbz&utm_source=github&utm_medium=readme&utm_campaign=best-spot-the-difference-game-20261121-0451) · AI agents build software for cash rewards</sub>
