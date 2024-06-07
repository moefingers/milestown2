import { Link } from "react-router-dom"
import { useContext, useEffect, useState } from "react"
import {Peer} from "peerjs"

import NetworkVisualizer from "../components/NetworkVisualizer"

import ThemeButtons from "../components/ThemeButtons"

import { env } from "../assets/js/determineEnvironment.mjs"
import { ClientContext } from "../clientContext"

export default function Network() {

    const {
        clientId,
        clientObject,
        currentLobby,
        playerPairs, setPlayerPairs,

        clientPeerConnectionList, setClientPeerConnectionList

    } = useContext(ClientContext)

    useEffect(() => {
        setClientPeerConnectionList([])
        console.log("currentLobby", currentLobby)
        console.log("and that lobby's playerList", currentLobby.playerList)

        const peerList = currentLobby.playerList.map(player => player.playerId).filter(player => player !== clientId)
        console.log("peerList", peerList)

        console.log("clientPeerConnectionList", clientPeerConnectionList)
        const newConnections = peerList.forEach((peerId, index) => {
             console.log('trying', clientId, 'to', peerId)
             newClientAndConnectToPeer(clientId, peerId)
        })
        console.log("newConnections", newConnections)
    }, [])

    function newClientAndConnectToPeer(clientId, peerId) {
        let connection
        const combinedName = `mesh${clientId}-${peerId}mefsafsddffffffdffffffffffffh`
        console.log("newClientAndConnectToPeer", combinedName)
        let client = new Peer(combinedName, env.clientPeerSettings)
        client.on('error', (error) => {
            if(error.type == 'unavailable-id'){
                console.log("Id taken.. if this is in a developer environment it may be due to react running things twice or HMR update. Disable strict mode.")
            } else{
                console.log(error)
            }
        })
        client.on('close', () => {
            console.log("client closed")
        })
        client.on('open', () => {
            console.log("client open", clientId)
            connection = client.connect(peerId)

            connection.on('open', () => {
                console.log("connection open from", clientId, "to", peerId)
                // below => solves clientPeerConnectionList having old data
                setClientPeerConnectionList(clientPeerConnectionList => [...clientPeerConnectionList, {pair: [clientId, peerId], client: client, connection: connection}])
            })
        })

        client.on('connection', (connection) => {
            console.log("client connection", connection)
            // clientPeerConnectionList[peerId].connection = connection
            connection.on('data', (data) => {
                console.log("data", data)
            })
        })
    }

    useEffect(() => {
        console.log("clientPeerConnectionList", clientPeerConnectionList)
        let newPlayerPairs = playerPairs.map(playerPair => playerPair)
        clientPeerConnectionList.forEach((clientPeerConnection, index) => {
            console.log(clientPeerConnection.pair)
            newPlayerPairs.forEach((newPair, index) => {
                if(clientPeerConnection.pair.includes(newPair.pair[0]) 
                && clientPeerConnection.pair.includes(newPair.pair[1])){
                    console.log("connected", newPair)
                    newPair.connected = true

                }
            })
        })
        console.log(newPlayerPairs)
        setPlayerPairs(newPlayerPairs)
    }, [clientPeerConnectionList])

    useEffect(() => {
        console.log("playerPairs", playerPairs)
    }, [playerPairs])

    // let testingList = []
    // for(let i = 0; i < 5; i++) {
    //     testingList.push({
    //         playerId: `player${i}`,
    //         owner: false
    //     })
    // }
    return (
        <>
            <ThemeButtons />
            <Link to={".."}>go back</Link>
            <h1>Network</h1>
            <div className="center-wrapper">

                {/* <NetworkVisualizer clientId={clientId} playerList={currentLobby.playerList}/> */}
                <NetworkVisualizer clientId={clientId} playerList={currentLobby.playerList}/>
            </div>
        </>
    )
}