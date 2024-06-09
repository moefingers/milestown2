import { Link, useNavigate } from "react-router-dom"
import { useContext, useEffect, useState } from "react"
import {Peer} from "peerjs"

import NetworkVisualizer from "../components/NetworkVisualizer"

import ThemeButtons from "../components/ThemeButtons"
import CountDown from "../components/CountDown"

import { env } from "../assets/js/determineEnvironment.mjs"
import { ClientContext } from "../ClientContext"

export default function Network() {

    const navigate = useNavigate()

    const {
        clientId,
        clientObject,
        currentLobby,
        playerPairs, setPlayerPairs,

        clientPeerConnectionList, setClientPeerConnectionList,

        receivedData, setReceivedData,

        playerIndex, setPlayerIndex

    } = useContext(ClientContext)

    const [countdown, setCountdown] = useState(-1)

    useEffect(() => {
        setClientPeerConnectionList([])
        setPlayerIndex(currentLobby.playerList.findIndex(player => player.playerId === clientId))
        console.log('playerIndex, ', currentLobby.playerList.findIndex(player => player.playerId === clientId))
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

    function newClientAndConnectToPeer(clientId, peerId, playerNumber) {
        let connection
        const combinedName = `mesh${clientId}-${peerId}mesh`
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
                console.log("connection close from", clientId, "to", peerId) /////////////////////////////////////////////////////////clientPeerConnection => clientPeerConnection.connection != connection
                // setClientPeerConnectionList(clientPeerConnectionList => clientPeerConnectionList.filter(clientPeerConnection => JSON.stringify(clientPeerConnection.connection) !== JSON.stringify(connection)))
                setClientPeerConnectionList(clientPeerConnectionList => clientPeerConnectionList.filter(clientPeerConnection => (   Object.values(clientPeerConnection.connection) != Object.values(connection)    ) ))
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
                if(receivedPair && receivedPair?.connected && !playerPair?.connected){
                    return {...playerPair, connected: true}
                } else {
                    return playerPair
                }
            })
            setPlayerPairs(newPlayerPairs)
        }
        if(receivedData.type == 'startCountdown'){
            setCountdown(receivedData.body.duration)
        }
        if(receivedData.type == 'navigateToMapPicker'){
            navigate('../MapPicker')
        }
    }, [receivedData])

    useEffect(() => {
        console.log("playerPairs", playerPairs)
        if(playerPairs.every(playerPair => playerPair.connected)){
            console.log("all connected")
                if(currentLobby.playerList.find(player => (player.owner && player.playerId == clientId))){
                    console.log("owner")
                    setCountdown(3)
                    clientPeerConnectionList.forEach((clientPeerConnection, index) => {
                        clientPeerConnection.connection.send({
                            type: "startCountdown",
                            from: clientPeerConnection.client.id,
                            body: {
                                lobby: currentLobby,
                                playerPairs: playerPairs,
                                duration: 3
                            }
                        })
                        setTimeout(() => {
                            clientPeerConnection.connection.send({
                                type: "navigateToMapPicker",
                                from: clientPeerConnection.client.id,
                                body: {
                                    lobby: currentLobby,
                                    playerPairs: playerPairs
                                }
                            })
                        }, 3* 1000)
                        setTimeout(() => {
                            navigate('../MapPicker')
                        }, 3* 1000);
                    })
                }
        }
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
            {countdown > 0 && <CountDown initialCount={countdown}/>}
            <ThemeButtons />
            <div className="center-wrapper">

                {/* <NetworkVisualizer clientId={clientId} playerList={currentLobby.playerList}/> */}
                <NetworkVisualizer clientId={clientId} playerList={currentLobby.playerList}/>
            </div>
        </>
    )
}