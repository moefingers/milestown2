import { useEffect, useState, useContext } from 'react'
import { Link, useNavigate } from "react-router-dom"

import ThemeButtons from '../components/ThemeButtons'
import CountDown from '../components/CountDown'
import DrawnMap from '../components/DrawnMap'

import { ClientContext } from '../ClientContext'

import { getMaps, getAesthetics } from '../assets/js/customFetch'

import '../assets/styles/map-picker.css'

export default function MapPicker() {

    const navigate = useNavigate()

    const {
        clientId,
        clientObject,
        currentLobby, setCurrentLobby,
        playerPairs, setPlayerPairs,

        playerIndex, setPlayerIndex,

        clientPeerConnectionList, setClientPeerConnectionList,

        receivedData, setReceivedData

    } = useContext(ClientContext)


    const [countdown, setCountdown] = useState(-1)

    
    const [mapList, setMapList] = useState([])
    const [map, setMap] = useState(null)
    const [aesthetics, setAesthetics] = useState(null)

    const [currentlyExpanded, setCurrentlyExpanded] = useState("")
  
  
    useEffect(() => {
        setPlayerIndex(currentLobby.playerList.findIndex(player => player.playerId === clientId))
        console.log('playerIndex, ', currentLobby.playerList.findIndex(player => player.playerId === clientId))
        getInitialData()
    },[])

    async function getInitialData() {
        const mapsResponse = await getMaps()
        const aestheticsResponse = await getAesthetics()
        setMapList( mapsResponse )
        setAesthetics( aestheticsResponse )
        setMap(mapsResponse[0])
    }

    function expandList(event, list) {
        if (currentlyExpanded === list) {
            setCurrentlyExpanded("")
            return
        } else {
            setCurrentlyExpanded(list)
        }
    }
    function updatePlayer(event, playerId, property, value) { 
        console.log('updating player', playerId, property, value)
        const index = currentLobby.playerList.findIndex(player => player.playerId === playerId)
        console.log('index', index)
        let newPlayerList = currentLobby.playerList.map(player => player)
        newPlayerList[index][property] = value
        setCurrentLobby({...currentLobby, playerList: newPlayerList})
    }

    function sendData(type,body) {
        clientPeerConnectionList.forEach((clientPeerConnection) => {
            clientPeerConnection.connection.send({type: type,from: clientId, body: body})
        })
    }
    useEffect(() => {
        if (receivedData) {
            if (receivedData.type === 'selectionScreen' || receivedData.type === 'selectionScreen-redundancy') {

                // map data from selectionScreen type
                if(receivedData.body.mapIndex != undefined){
                    setMap(mapList[receivedData.body.mapIndex])
                }
                // color data from selectionScreen type
                if(receivedData.body.colorIndex != undefined && receivedData.body.colorIndex != 0){
                    updatePlayer(null, receivedData.body.for, 'color', aesthetics.colors[receivedData.body.colorIndex].hex)
                }
                // shape data from selectionScreen type
                if(receivedData.body.shapeIndex != undefined){
                    updatePlayer(null, receivedData.body.for, 'shape', aesthetics.shapes[receivedData.body.shapeIndex].clipPath)
                }
                // ready data from selectionScreen type
                if(receivedData.body.ready != undefined){
                    updatePlayer(null, receivedData.body.for, 'ready', receivedData.body.ready)
                }


                if(receivedData.type === 'selectionScreen') {
                    sendData('selectionScreen-redundancy', receivedData.body)
                }
            }
            if(receivedData.type === 'startCountdown') {
                setCountdown(receivedData.body.duration)
            }
            if(receivedData.type === 'startGame') {
                sendData('startGame-redundancy', receivedData.body)
            }
            if(receivedData.type === 'startGame-redundancy') {
                updatePlayer(null, receivedData.from, 'startedGame', true)
            }
            if(receivedData.type === 'startGameConfirmed') {
                navigate('../Game')
            }

        }
    }, [receivedData])

    useEffect(() => {
        console.log("currentLobby", currentLobby)

        if(!currentLobby.playerList[playerIndex].startedGame && currentLobby.playerList.every(player => player.ready)) {
            console.log('every player ready')
            if(currentLobby.playerList[playerIndex].owner) {
                console.log('this client is owner so startin count down')
                setCountdown(5)
                sendData('startCountdown', {duration: 5})
                setTimeout(() => {
                    sendData('startGame', {duration: 5})
                    updatePlayer(null, clientId, 'startedGame', true)
                }, 5000);
            }
        }
        if(currentLobby.playerList.every(player => player.startedGame)) {
            console.log('every player confirmed game start')
            sendData('startGameConfirmed')
            navigate('../Game')
        }
    }, [currentLobby])
    useEffect(() => {
        console.log(countdown)
    }, [countdown])
    useEffect(() => {
        console.log(map?.name)
    }, [map])

    function colorFilter(color){
        const otherPlayerConflict = currentLobby.playerList.find(player => player.color === color.hex && player.playerId !== clientId)
        return !(otherPlayerConflict || color.index == 0)
    }

    return (
        <>
            <Link to="..">go back</Link>
            <h1>MapPicker.jsx</h1>
            <ThemeButtons />
            {countdown > 0 && <CountDown initialCount={countdown} />}
            {map && <DrawnMap
                mapObject={map}
                aesthetics={aesthetics}
                characters={currentLobby.playerList.map((player, index) => { return {color: player.color || aesthetics.colors[0].hex, shape: player.shape || aesthetics.shapes[0].clipPath}})}
            />}
            <div id='color-selector' className={`color scroll-selector${currentlyExpanded === 'color-selector' ? ' expanded' : ''}`}>
                <h3 className='clickable' onClick={(event) => expandList(event, 'color-selector')}>{currentlyExpanded === 'color-selector' ? 'Close Colors' : 'Colors'}</h3>
                <ul>{aesthetics?.colors.map((color, index) => ({...color, index})).filter(colorFilter).map((color, index) =>   <li onClick={(event) => {sendData('selectionScreen', {colorIndex: color.index, colorName: color.name, for: clientId})}} key={color.index} className={`clickable${color.hex === currentLobby.playerList[playerIndex].color ? ' selected' : ''}`}>{color.name}</li>)}</ul>
            </div>
            <div id='shape-selector' className={`shape scroll-selector${currentlyExpanded === 'shape-selector' ? ' expanded' : ''}`}>
                <h3 className='clickable' onClick={(event) => expandList(event, 'shape-selector')}>{currentlyExpanded === 'shape-selector' ? 'Close Shapes' : 'Shapes'}</h3>
                <ul>{aesthetics?.shapes.map((shape, index) =>   <li onClick={(event) => {sendData('selectionScreen', {shapeIndex: index, shapeName: shape.name, for: clientId})}} key={index} className={`clickable${shape.clipPath === currentLobby.playerList[playerIndex].shape ? ' selected' : ''}`}>{shape.name}</li>)}</ul>
            </div>
            <div id='map-selector' className={`map scroll-selector${currentlyExpanded === 'map-selector' ? ' expanded' : ''}`}>
                <h3 className='clickable' onClick={(event) => expandList(event, 'map-selector')}>{currentlyExpanded === 'map-selector' ? 'Close Maps' : 'Maps'}</h3>
                <ul>{mapList?.map((eachMap, index) =>               <li onClick={(event) => {sendData('selectionScreen', {mapIndex: index, mapName: eachMap.name, for: clientId})}} key={index} className={`clickable${ map?.name == eachMap.name ? ' selected' : ''}`}>{eachMap.name}</li>)}</ul>
            </div>
            <div className="players-ready">
                <div>{currentLobby.playerList.filter((player) => player.ready === true).length}/{currentLobby.playerList.length} ready</div>
                {currentLobby.playerList[playerIndex].color 
                ? <div className='clickable' onClick={() => sendData('selectionScreen', {ready: !(currentLobby.playerList[playerIndex].ready) ? true : false, for: clientId})}>{(currentLobby.playerList[playerIndex].ready) ? 'cancel' : 'ready up'}</div>
                : <div>Pick color first</div>}
            </div>
        </>
    )
}

// goal is to have current map with current players,
// and browsed map that infinitely cycles through players and shapes on all points
