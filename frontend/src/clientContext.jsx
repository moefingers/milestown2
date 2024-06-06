import React, { createContext, useState } from 'react'

export const ClientContext = createContext();

export default function ClientContextProvider({ children }) {

    const [clientObject, setClientObject] = useState(null)
    const [clientId, setClientId] = useState(null)
    const [currentLobby, setCurrentLobby] = useState(null)

    return (
        <ClientContext.Provider value={{ clientObject, setClientObject, clientId, setClientId, currentLobby, setCurrentLobby }}>
            {children}
        </ClientContext.Provider>
    )
}