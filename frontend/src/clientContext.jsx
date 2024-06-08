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


    return (
        <ClientContext.Provider value={{ 
                clientObject, setClientObject, 
                clientId, setClientId, 
                currentLobby, setCurrentLobby, 
                connectionProcessing, setConnectionProcessing, 
                playerPairs, setPlayerPairs,
                clientPeerConnectionList, setClientPeerConnectionList,
                receivedData, setReceivedData, 
                playerIndex, setPlayerIndex
            }}>
            {children}
        </ClientContext.Provider>
    )
}