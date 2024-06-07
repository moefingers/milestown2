import { Link } from "react-router-dom"
import { useContext, useEffect } from "react"

import NetworkVisualizer from "../components/NetworkVisualizer"

import ThemeButtons from "../components/ThemeButtons"

import { ClientContext } from "../clientContext"
export default function Network() {

    const {
        clientId,
        clientObject,
        currentLobby

    } = useContext(ClientContext)

    useEffect(() => {
        console.log("currentLobby", currentLobby)
    }, [])

    let testingList = []

    for(let i = 0; i < 5; i++) {
        testingList.push({
            playerId: `player${i}`,
            owner: false
        })
    }
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