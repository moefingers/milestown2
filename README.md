# MilestOWN 2

[See Version 1](https://github.com/moefingers/UNLV-MilestO-W-N) for local multiplayer.

This repository is hopefully the front and backend for MilestOWN 2. More notes will follow.

[Hosted on Render.com!](https://milestown2.onrender.com/)

[And a backup frontend on GitHub Pages](https://moefingers.github.io/milestown2/)

# Index:
- [API Documentation](#backend-api-documentation) 
- [Development notes](#development-notes) 
  - [Cross-origin resource sharing](#cross-origin-resource-sharing-cors)
  - [Getting up and running](#getting-up-and-running)




# Backend API Documentation

# `GET '/'`
### Returns index.html, frontend. \
Format of response: `<!DOCTYPE html>`

# `GET '/*'`
### Returns 404 fragment with link to home.

# `GET '/healthz'`
### Returns `200 OK`

# `GET '/maps'`
### Returns maps.json
Format of response: `[{...}, {name, map, spawns}]`

# `GET '/maps/:nameOrIndex'`
### Returns one map by name or index
Example request by index: `GET /maps/0` \
Example request by name: `GET /maps/4x2` \
Format of response: `{name, map, spawns}`

# `POST '/maps'`
### Store one or many maps
Format of request for one map: `{name, map, spawns}` \
Format of request for many maps: `[..., {name, map, spawns}]` \
Format of **(200 OK)** response: 

    { 
        "message": "here are the results of your post request",
        "mapStatuses": [
            {...},
            {
                "map": "test1",
                "message": "created successfully",
                "link": "<base>/maps/test7" || 
            }
        ]
    }
# `GET '/aesthetics'`
Returns aesthetics.json

# `GET '/lobby'`
Returns lobbies.json (`backend/controllers/lobbiesController.mjs`)

# Express PeerJS Server Events 
[(npm link)`import {ExpressPeerServer} from 'peer'`](https://www.npmjs.com/package/peer)
# Development notes:
## cross-origin resource sharing (cors)
### in `development` environment, `cors origin` is set to `*`
### in `production` environment, `cors origin` is set to `[...definedOrigins]`

###  running `npm run deploy` in either `/frontend` or `/` directory will do the following:
- **Do not run these commands**, these are not instructions.
- This is a description of what running `npm run deploy` does.
- *temporarily* add `base: '/milestown2/'` to vite.config.js
- run `npm run build`
- run `npm run gh-pages -d dist`
- remove `base: '/milestown2/'` from vite.config.js
- run `npm run build` (without base in vite.config.js)
- delete `backend/dist`
- copy `frontend/dist` to `backend/dist` (so the host will read commits from the build)

### Getting up and running:
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

## short term todo:
- Ensure when owner of lobby leaves, lobby is deleted or ownership transferred .

## long term todo:
- maybe transition from using clip paths to using svg

## done:
- Owner of lobby cannot see other players in lobby