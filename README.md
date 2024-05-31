# MilestOWN 2

[See Version 1](https://github.com/moefingers/UNLV-MilestO-W-N) for local multiplayer.

This repository is hopefully the front and backend for MilestOWN 2. More notes will follow.

## important notes
- To deploy to gh-pages, before running `npm run deploy` in either `/frontend` or `/` directory, please uncomment `// base: '/milestown2/'` in `/frontend/vite.config.js`


The rough outline is to have a...

- backend - exploring render? - for now db will be stored on server
  - serving data like maps, levels, pickups
  - hosting games
  - accepting and validating movements and actions in the game and proctoring each game


- frontend - maybe gh pages?
  - consumes data like maps, levels, pickups
  - client for game
  - sends movements in the game to be evaluated and accepted by backend


## log