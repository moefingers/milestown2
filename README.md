# MilestOWN 2

[See Version 1](https://github.com/moefingers/UNLV-MilestO-W-N) for local multiplayer.

This repository is hopefully the front and backend for MilestOWN 2. More notes will follow.

[Hosted on Render.com!](https://milestown2.onrender.com/)

[And a backup frontend on GitHub Pages](https://moefingers.github.io/milestown2/)

## Development note: running `npm run deploy` in either `/frontend` or `/` directory will do the following:
- **Do not run these commands**, these are not instructions.
- This is a description of what running `npm run deploy` does.
- *temporarily* add `base: '/milestown2/'` to vite.config.js
- run `npm run build`
- run `npm run gh-pages -d dist`
- remove `base: '/milestown2/'` from vite.config.js
- run `npm run build` (without base in vite.config.js)
- delete `backend/dist`
- copy `frontend/dist` to `backend/dist` (so the host will read commits from the build)

## Getting up and running:
- `npm install` in main directory will install dependencies in BOTH frontend and backend
- `npm run frontend` in main directory will run the vite app with live changes.
- `npm run preview` in main directory will build and run the vite app locally in a production-style environment.

- `npm run backend` in main directory will run the backend app in a production-style environment.
- `npm run backendpreview` in main directory will run the backend with `nodemon`.

## Other important notes:
- Please use localhost for development cors to work propery. I'd include 127.0.0.1 but it's not necessary and I don't think it's appropriate to dedicate many lines of code to simply accept multiple local addresses unrelated to production.

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
imported and formatted maps with each map as {name, map, spawns}