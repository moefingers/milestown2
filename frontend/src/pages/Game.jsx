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

        sendDataToEach,
        mapElements, setMapElements

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
        const origX = Number(currentLobby.playerList[playerIndex].x)
        const origY = Number(currentLobby.playerList[playerIndex].y)
        const newX = axis == "x" ? Number((origX - -value).toFixed(1)) : origX
        const newY = axis == "y" ? Number((origY - -value).toFixed(1)) : origY
                            //  if x axis and right      then     right  else   left
        const coveredEdgeX = (   (axis == "x" && value == .5 ) ? origX : origX + value)
        //                     if y axis and  and down    then     down  else   up
        const coveredEdgeY = (   (axis == "y" && value == .5 ) ? origY : origY + value)
        console.log("coverededgecoords", axis == "x" ? coveredEdgeX : origX, axis == "y" ? coveredEdgeY : origY)
        const coveredElementId = `${axis == "x" ? "h" : "v"}-${axis == "x" ? coveredEdgeX.toString().replace(".", ",") : origX}-${axis == "y" ? coveredEdgeY.toString().replace(".", ",") : origY}` 
        console.log(coveredElementId)
        const coveredElement = mapElements.find(element => element.id === coveredElementId)
        console.log(coveredElement)

        if(axis == "y" && ((origX % 1) != 0)  ){  return  }
        if(axis == "x" && ((origY % 1) != 0)  ){  return  }
        if(newX < 0 || newY < 0){  return  }
        if(newX > currentLobby.map.map[0].length){  return  }
        if(newY > currentLobby.map.map.length){  return  }
        if(coveredElement == undefined){  return  }


        const newAxisValue = axis == "x" ? newX : newY
        console.log('current', origX, origY)
        console.log("moving,", axis, value)
        console.log('new', newX, newY)
        // console.log('mapElements', mapElements)


        coveredElement.style.backgroundColor = currentLobby.playerList.find(player => player.playerId === playerId).color
        coveredElement.setAttribute('owner', playerId)

        let capturedTiles = []
        let neutralizedTiles = []
        if(axis == "x"){
            const sharedX = Math.floor(axis == "x" ? coveredEdgeX : origX)
            const y1 = (axis == "y" ? coveredEdgeY : origY) - 1
            const y2 = (axis == "y" ? coveredEdgeY : origY)
            if(checkTileEdges(sharedX, y1)){
                capturedTiles.push([sharedX, y1])
                const tile = mapElements.find(element => element.id == `tile-${sharedX}-${y1}`)
                tile.style.backgroundColor = currentLobby.playerList.find(player => player.playerId === playerId).color + "88"
                tile.setAttribute('owner', playerId)
            } else if(checkTileEdges(sharedX, y1) == false){
                neutralizedTiles.push([sharedX, y1])
                const tile = mapElements.find(element => element.id == `tile-${sharedX}-${y1}`)
                tile.style.backgroundColor = aesthetics.colors[0].hex + 66
                tile.setAttribute('owner', null)
            }
            if(checkTileEdges(sharedX, y2)){
                capturedTiles.push([sharedX, y2])
                const tile = mapElements.find(element => element.id == `tile-${sharedX}-${y2}`)
                tile.style.backgroundColor = currentLobby.playerList.find(player => player.playerId === playerId).color + "88"
                tile.setAttribute('owner', playerId)
            } else if(checkTileEdges(sharedX, y2) == false){
                neutralizedTiles.push([sharedX, y2])
                const tile = mapElements.find(element => element.id == `tile-${sharedX}-${y2}`)
                tile.style.backgroundColor = aesthetics.colors[0].hex + 66
                tile.setAttribute('owner', null)
            }
        } else if (axis == "y"){
            const sharedY = Math.floor(axis == "y" ? coveredEdgeY : origY)
            const x1 = (axis == "x" ? coveredEdgeX : origX) - 1
            const x2 = (axis == "x" ? coveredEdgeX : origX)
            if(checkTileEdges(x1, sharedY)){
                capturedTiles.push([x1, sharedY])
                const tile = mapElements.find(element => element.id == `tile-${x1}-${sharedY}`)
                tile.style.backgroundColor = currentLobby.playerList.find(player => player.playerId === playerId).color + "88"
                tile.setAttribute('owner', playerId)
            }   else if(checkTileEdges(x1, sharedY) == false){
                neutralizedTiles.push([x1, sharedY])
                const tile = mapElements.find(element => element.id == `tile-${x1}-${sharedY}`)
                tile.style.backgroundColor = aesthetics.colors[0].hex + 66
                tile.setAttribute('owner', null)
            }
            if(checkTileEdges(x2, sharedY)){
                capturedTiles.push([x2, sharedY])
                const tile = mapElements.find(element => element.id == `tile-${x2}-${sharedY}`)
                tile.style.backgroundColor = currentLobby.playerList.find(player => player.playerId === playerId).color + "88"
                tile.setAttribute('owner', playerId)
            }   else if(checkTileEdges(x2, sharedY) == false){
                neutralizedTiles.push([x2, sharedY])
                const tile = mapElements.find(element => element.id == `tile-${x2}-${sharedY}`)
                tile.style.backgroundColor = aesthetics.colors[0].hex + 66
                tile.setAttribute('owner', null)
            }
        }
        function checkTileEdges(tileX, tileY){
            const tile = mapElements.find(element => element.id == `tile-${tileX}-${tileY}`)
            if(tile == undefined || tile.classList.contains('blank')){
                console.log('that tile doesnt exist, ', tileX, tileY)
                return undefined
            } else {
                console.log('tile,', tile)
            }
            const checkList = [
                ['v', tileX,        tileY],
                ['v', tileX,        tileY+ 0.5],
                ['h', tileX,        tileY],
                ['h', tileX + 0.5,  tileY],
                ['v', tileX + 1,    tileY],
                ['v', tileX + 1,    tileY + 0.5],
                ['h', tileX,        tileY + 1],
                ['h', tileX + 0.5,  tileY + 1],
            ]
            console.log(checkList)
            if(
                checkList.every(check => {
                    const edgeId = `${check[0]}-${check[1].toString().replace(".", ",")}-${check[2].toString().replace(".", ",")}`
                    console.log(edgeId)
                    const edgeElement = mapElements.find(element => element.id === edgeId)
                    console.log(edgeElement)
                    return edgeElement.getAttribute('owner') == playerId
                })
            ){
                console.log(tileX, tileY, "tile captured")
                return true
            } else {
                return false
            }
        }



        const newPlayerList = currentLobby.playerList.map((playerEntry, index) => {
            return (playerEntry.playerId === playerId) ? {...playerEntry, [axis]: newAxisValue} : playerEntry
        })
        setCurrentLobby({...currentLobby, playerList: newPlayerList})
        sendDataToEach('move', {playerData: newPlayerList[playerIndex], edgeCaptureId: coveredElementId, capturedTiles: capturedTiles, neutralizedTiles: neutralizedTiles})
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
            const edge = mapElements.find(element => element.id === receivedData.body.edgeCaptureId)
            edge.style.backgroundColor = currentLobby.playerList.find(player => player.playerId === receivedData.from).color
            edge.setAttribute('owner', receivedData.from)

            receivedData.body.capturedTiles.forEach((tile) => {
                const tileElement = mapElements.find(element => element.id === `tile-${tile[0]}-${tile[1]}`)
                tileElement.style.backgroundColor = currentLobby.playerList.find(player => player.playerId === receivedData.from).color + "88"
                tileElement.setAttribute('owner', receivedData.from)
            })

            receivedData.body.neutralizedTiles.forEach((tile) => {
                const tileElement = mapElements.find(element => element.id === `tile-${tile[0]}-${tile[1]}`)
                tileElement.style.backgroundColor = aesthetics.colors[0].hex + 66
                tileElement.setAttribute('owner', null)
            })
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