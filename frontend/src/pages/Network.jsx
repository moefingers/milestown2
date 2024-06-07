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

        clientPeerConnectionList, setClientPeerConnectionList,

        receivedData, setReceivedData

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
        const combinedName = `mesh${clientId}-${peerId}mesffffffffh`
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
                connection.send({
                    type: "meshList",
                    from: combinedName,
                    body: {
                        lobby: currentLobby
                    }
                })
                setClientPeerConnectionList(clientPeerConnectionList => [...clientPeerConnectionList, {pair: [clientId, peerId], client: client, connection: connection}])
            })

            connection.on('close', () => {
                console.log("connection close from", clientId, "to", peerId)
                setClientPeerConnectionList(clientPeerConnectionList => clientPeerConnectionList.filter(clientPeerConnection => JSON.stringify(clientPeerConnection.connection) !== JSON.stringify(connection)))
            })
        })

        client.on('connection', (connection) => {
            console.log("client connection", connection)
            // clientPeerConnectionList[peerId].connection = connection
            connection.on('data', (data) => {
                console.log(data.type, 'from', data.from, 'data: ', data)
                if(data.type == 'connectedMeshPaths'){
                    
                }
                connection.send({
                    type: "connectedMeshPaths",
                    from: combinedName,
                    body: {
                        lobby: currentLobby,
                        playerPairs: playerPairs
                    }
                })
            })
        })
    }

    useEffect(() => {
        if(clientPeerConnectionList.length == 0){return}
        console.log("clientPeerConnectionList", clientPeerConnectionList)
        let newPlayerPairs = playerPairs.map(playerPair => playerPair)
        // for each connection in the list
        clientPeerConnectionList.forEach((clientPeerConnection, index) => {
            console.log(clientPeerConnection.pair)
            // update each player pair (this will update line colors)
            newPlayerPairs.forEach((newPair, index) => {
                // if the connection includes both players in any order
                if(clientPeerConnection.pair.includes(newPair.pair[0]) 
                && clientPeerConnection.pair.includes(newPair.pair[1])){
                    console.log("connected", newPair)
                    newPair.connected = true
                }
            })
        })
        console.log(newPlayerPairs)
        setPlayerPairs(newPlayerPairs)

        clientPeerConnectionList.forEach((clientPeerConnection, index) => {
            clientPeerConnection.connection.send({
                type: "connectedMeshPaths",
                from: clientPeerConnection.client.id,
                body: {
                    lobby: currentLobby,
                    playerPairs: newPlayerPairs
                }
            })
        })
    }, [clientPeerConnectionList])

    useEffect(() => {
        console.log("receivedData,",receivedData)
        if(receivedData.type == 'connectedMeshPaths'){
            let newPlayerPairs = playerPairs.map(playerPair => {
                let receivedPair = receivedData.body.playerPairs.find(receivedPair => {return (receivedPair.pair.includes(playerPair.pair[0]) && receivedPair.pair.includes(playerPair.pair[1]))})
                if(receivedPair.connected && !playerPair.connected){
                    return {...playerPair, connected: true}
                } else {
                    return playerPair
                }
            })

            setPlayerPairs(newPlayerPairs)
        }
    }, [receivedData])

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