import { useContext, useEffect, useState } from 'react'
import { Link, useNavigate } from "react-router-dom"

import { ClientContext } from '../ClientContext'


import DrawnMap from '../components/DrawnMap'
import ButtonCluster from '../components/ButtonCluster'
import ThemeButtons from '../components/ThemeButtons'


import '../assets/styles/game.css'

export default function Game() {
    
    const [[isPointer, isTouch], setIsPointerIsTouch] = useState([
        matchMedia('(pointer:fine)').matches,
        matchMedia('(pointer:coarse)').matches]) 

    const navigate = useNavigate()

    const {
        clientId,
        clientObject,
        currentLobby, setCurrentLobby,
        playerPairs, setPlayerPairs,

        playerIndex, setPlayerIndex,

        clientPeerConnectionList, setClientPeerConnectionList,

        receivedData, setReceivedData,

        aesthetics, setAesthetics,

        mapList, setMapList,

        sendDataToEach

    } = useContext(ClientContext)

    useEffect(() => {
        console.log('currentLobby', currentLobby)
    }, [currentLobby])

    useEffect(() => {
        const updatedPlayerList = currentLobby.playerList.map((playerEntry, index) => {
            return {
                ...playerEntry,
                color: playerEntry.color,
                shape: playerEntry.shape || aesthetics.shapes[0].clipPath,
                x: currentLobby.map.spawns[currentLobby.playerList.findIndex(playerOfFindIndex => playerOfFindIndex.playerId === playerEntry.playerId)][0],
                y: currentLobby.map.spawns[currentLobby.playerList.findIndex(playerOfFindIndex => playerOfFindIndex.playerId === playerEntry.playerId)][1],
                playerId: playerEntry.playerId
            }
        })
        setCurrentLobby({...currentLobby, playerList: updatedPlayerList})

        console.log('initial player data,', updatedPlayerList)
        console.log("isPointer", isPointer, "isTouch", isTouch)

    },[])


    function move(playerId, axis, value){
        console.log("moving,", axis, value)
        const newPlayerList = currentLobby.playerList.map((playerEntry, index) => {
            return (playerEntry.playerId === playerId) ? {...playerEntry, [axis]: (playerEntry[axis] + value)} : playerEntry
        })
        setCurrentLobby({...currentLobby, playerList: newPlayerList})
        sendDataToEach('move', {playerData: newPlayerList[playerIndex]})
    }
    const up = (playerId) => move(playerId, 'y', -0.5)
    const down = (playerId) => move(playerId, 'y', 0.5)
    const left = (playerId) => move(playerId, 'x', -0.5)
    const right = (playerId) => move(playerId, 'x', 0.5)
    
    const movementFunctions = {up, down, left, right}

    useEffect(() => {
        if(receivedData.type === 'move') {
            const newPlayerList = currentLobby.playerList.map((playerEntry, index) => {
                return (playerEntry.playerId === receivedData.from) ? {...playerEntry, ...receivedData.body.playerData} : playerEntry
            })
            setCurrentLobby({ ...currentLobby, playerList: newPlayerList} )
        }
    },[receivedData])

    return (
        <>
            <div className='testing'>pointer: {isPointer.toString()}, touch: {isTouch.toString()}</div>
            <ButtonCluster movementFunctions={movementFunctions}/>
            <ThemeButtons hidden={true}/>
            <DrawnMap
                preview={false}
                mapObject={currentLobby.map}
                aesthetics={aesthetics}
                characters={currentLobby.playerList}
            />
        </>
    )
}