import {env} from './determineEnvironment.mjs'

async function customFetch(method = 'GET', path = '/date', body = undefined) {
    console.log(method, path, body || " && omg no body!")
    const res = await fetch(env.backend + path, {
        method: method,
        headers: ['POST', 'PUT', 'DELETE'].includes(method) ? {'Content-Type': 'application/json'} : {},
        body: JSON.stringify(body)
    })
    const data = await res.json()
    return data
}

const getMaps = () => customFetch('GET', '/maps')
const getDefaultMap = () => customFetch('GET', '/defaultmap')
const getAesthetics = () => customFetch('GET', '/aesthetics')
const getPeers = () => customFetch('GET', '/peerjs/peers')
const getLobbies = () => customFetch('GET', '/lobby')
const joinLobby = (lobbyId, playerId, playerToken) => customFetch('POST', '/lobby/join', {lobbyId: lobbyId, playerId: playerId, playerToken: playerToken})
const leaveLobby = (lobbyId, playerId, playerToken) => customFetch('POST', '/lobby/leave', {lobbyId: lobbyId, playerId: playerId, playerToken: playerToken})
const createLobby = (lobbyId, playerId, playerToken) => customFetch('POST', '/lobby', {lobbyId: lobbyId, playerId: playerId, playerToken: playerToken})
const deleteLobby = (lobbyId, playerId, playerToken) => customFetch('DELETE', '/lobby', {lobbyId: lobbyId, playerId: playerId, playerToken: playerToken})


export {customFetch, getMaps, getAesthetics, getDefaultMap, getPeers, getLobbies, joinLobby, leaveLobby, createLobby, deleteLobby}