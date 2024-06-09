import { customFetch, getPeers } from "./customFetch"


const getLobbies = () => customFetch('GET', '/chatroom')
const joinLobby = (chatroomId, playerId, playerToken) => customFetch('POST', '/chatroom/join', {chatroomId: chatroomId, playerId: playerId, playerToken: playerToken})
const leaveLobby = (chatroomId, playerId, playerToken) => customFetch('POST', '/chatroom/leave', {chatroomId: chatroomId, playerId: playerId, playerToken: playerToken})
const createLobby = (chatroomId, playerId, playerToken) => customFetch('POST', '/chatroom', {chatroomId: chatroomId, playerId: playerId, playerToken: playerToken})
const deleteLobby = (chatroomId, playerId, playerToken) => customFetch('DELETE', '/chatroom', {chatroomId: chatroomId, playerId: playerId, playerToken: playerToken})


export const chatroomFetches  = { getPeers, getLobbies, joinLobby, createLobby, leaveLobby, deleteLobby }