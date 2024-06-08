import React, { createContext, useState } from 'react'

export const ClientContext = createContext();

export default function ClientContextProvider({ children }) {

    const [clientObject, setClientObject] = useState(null)
    const [clientId, setClientId] = useState(null)
    const [currentLobby, setCurrentLobby] = useState(null)
    const [connectionProcessing, setConnectionProcessing] = useState(false)

    const [playerPairs, setPlayerPairs] = useState([])

    const [clientPeerConnectionList, setClientPeerConnectionList] = useState([])

    const [receivedData, setReceivedData] = useState([])

    const [playerIndex, setPlayerIndex] = useState(-1)


    const [aesthetics, setAesthetics] = useState({colors: [], shapes: []})
    const [mapList, setMapList] = useState([])

    function sendDataToEach(type,body) {
        clientPeerConnectionList.forEach((clientPeerConnection) => {
            clientPeerConnection.connection.send({type: type,from: clientId, body: body})
        })
    }


    return (
        <ClientContext.Provider value={{ 
                clientObject, setClientObject, 
                clientId, setClientId, 
                currentLobby, setCurrentLobby, 
                connectionProcessing, setConnectionProcessing, 
                playerPairs, setPlayerPairs,
                clientPeerConnectionList, setClientPeerConnectionList,
                receivedData, setReceivedData, 
                playerIndex, setPlayerIndex,

                aesthetics, setAesthetics,
                mapList, setMapList,

                sendDataToEach
            }}>
            {children}
        </ClientContext.Provider>
    )
}