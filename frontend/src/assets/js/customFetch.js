import {env} from './determineEnvironment.mjs'

async function customFetch(method = 'GET', path = '/date', body = undefined) {
    const res = await fetch(env.backend + path, {
        method: method,
        headers: method == 'POST' ? {'Content-Type': 'application/json'} : {},
        body: JSON.stringify(body)
    })
    const data = await res.json()
    return data
}

const getAllOffers = () => customFetch('GET', '/offer')
const postOffer = (offer) => customFetch('POST', '/offer', offer)
const deleteAllOffers = () => customFetch('DELETE', '/offer')
const getMaps = () => customFetch('GET', '/maps')
const getDefaultMap = () => customFetch('GET', '/defaultmap')
const getAesthetics = () => customFetch('GET', '/aesthetics')
const getPeers = () => customFetch('GET', '/peerjs/peers')
const getLobbies = () => customFetch('GET', '/lobby')
const joinLobby = (lobbyId, playerId) => customFetch('POST', '/lobby/join', {lobbyId: lobbyId, playerId: playerId})
const leaveLobby = (lobbyId, playerId) => customFetch('POST', '/lobby/leave', {lobbyId: lobbyId, playerId: playerId})
const createLobby = (lobbyId, playerId) => customFetch('POST', '/lobby', {lobbyId: lobbyId, playerId: playerId})
const deleteLobby = (lobbyId) => customFetch('DELETE', '/lobby', {lobbyId: lobbyId})


export {customFetch, getAllOffers, postOffer, deleteAllOffers, getMaps, getAesthetics, getDefaultMap, getPeers, getLobbies, joinLobby, leaveLobby, createLobby, deleteLobby}